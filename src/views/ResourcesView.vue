<script setup lang="ts">
import { ref } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast/use-toast'
import { MapPin, Bell, Database, Touchpad, AlertTriangle, Users, Share2 } from 'lucide-vue-next'

const { toast } = useToast()

// --- Notifications système ---
function sendSystemNotification(title: string, body: string) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body, icon: '/favicon.ico' })
  } else {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        new Notification(title, { body, icon: '/favicon.ico' })
      }
    })
  }
}

// --- Stockage Interne (LocalStorage) ---
const storageValue = ref(localStorage.getItem('user_preference') || '')
const saveToStorage = () => {
  localStorage.setItem('user_preference', storageValue.value)
  toast({ title: 'Succès', description: 'Valeur enregistrée dans LocalStorage' })
  sendSystemNotification('Stockage local', 'Valeur enregistrée dans LocalStorage !')
}

// --- Géolocalisation ---
const coords = ref<{ lat: number; lng: number } | null>(null)
const geoStatus = ref('Pas encore demandée')
const getLocation = () => {
  if (!navigator.geolocation) {
    geoStatus.value = 'Non supportée'
    sendSystemNotification('Géolocalisation', 'Non supportée sur cet appareil.')
    return
  }
  geoStatus.value = 'Recherche...'
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      coords.value = { lat: pos.coords.latitude, lng: pos.coords.longitude }
      geoStatus.value = 'Localisé'
      sendSystemNotification(
        'Géolocalisation',
        `Position : ${coords.value.lat.toFixed(4)}, ${coords.value.lng.toFixed(4)}`,
      )
    },
    () => {
      geoStatus.value = 'Erreur/Refusé'
      sendSystemNotification('Géolocalisation', 'Erreur ou refus de la localisation.')
    },
  )
}

// --- Notifications ---
const notifPermission = ref(Notification.permission)
const requestNotif = async () => {
  const permission = await Notification.requestPermission()
  notifPermission.value = permission
  if (permission === 'granted') {
    sendSystemNotification('Notifications activées', 'Les notifications système sont activées !')
  }
}

// --- Gestion Alertes (Système) ---
const alertCount = ref(3)
const incrementAlert = () => {
  alertCount.value++
  sendSystemNotification('Nouvelle alerte', `Tu as ${alertCount.value} alerte(s) !`)
}

// --- Pointer Events (Remplaçant Touch pour PC/Mobile) ---
const pointerInfo = ref({ x: 0, y: 0, status: 'Aucun contact' })
const handlePointerDown = (e: PointerEvent) => {
  pointerInfo.value = { x: Math.round(e.clientX), y: Math.round(e.clientY), status: 'Appuyé' }
  sendSystemNotification('Pointer', `Contact à (${pointerInfo.value.x}, ${pointerInfo.value.y})`)
}
const handlePointerMove = (e: PointerEvent) => {
  if (pointerInfo.value.status === 'Appuyé') {
    pointerInfo.value = { ...pointerInfo.value, x: Math.round(e.clientX), y: Math.round(e.clientY) }
  }
}
const handlePointerUp = () => {
  pointerInfo.value.status = 'Relâché'
  sendSystemNotification('Pointer', 'Contact relâché')
}

// --- Contact Picker API ---
const selectedContact = ref<{ name?: string[]; tel?: string[]; email?: string[] } | null>(null)
const contactPickerSupported = ref(typeof navigator !== 'undefined' && 'contacts' in navigator)
const pickContact = async () => {
  try {
    const [contact] = await (navigator as any).contacts.select(['name', 'tel', 'email'], {
      multiple: false,
    })
    selectedContact.value = contact
    const contactName = contact.name?.[0] || 'Inconnu'
    sendSystemNotification('Contact Picker', `Contact sélectionné : ${contactName}`)
  } catch (e) {
    sendSystemNotification('Contact Picker', 'Aucun contact sélectionné ou erreur.')
  }
}

// --- Share API ---
const shareSupported = ref(typeof navigator !== 'undefined' && 'share' in navigator)
const shareApp = async () => {
  try {
    await navigator.share({
      title: 'VueApp - Ressources Internes',
      text: 'Découvre ma super appli Vue avec les APIs natives du navigateur !',
      url: window.location.href,
    })
    sendSystemNotification('Partage', 'Application partagée avec succès !')
  } catch (e) {
    sendSystemNotification('Partage', 'Partage annulé ou non supporté.')
  }
}
</script>

<template>
  <div class="space-y-8 pb-10">
    <div class="space-y-2 text-center">
      <h1 class="text-3xl font-bold tracking-tight mb-2 flex items-center justify-center gap-2">
        <span>⚡</span> Ressources & APIs Internes
      </h1>
      <p class="text-muted-foreground max-w-2xl mx-auto">
        Apprenez à utiliser les capacités natives du navigateur avec Vue 3 et shadcn/vue. Chaque
        section ci-dessous est interactive et responsive.
      </p>
    </div>

    <div class="grid gap-8 md:grid-cols-2">
      <!-- Section Stockage -->
      <Card>
        <CardHeader class="flex flex-row items-center space-x-4">
          <div class="p-2 bg-blue-100 rounded-lg"><Database class="w-5 h-5 text-blue-600" /></div>
          <div class="flex items-center gap-2 mb-2">
            <CardTitle>LocalStorage</CardTitle>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <input
            v-model="storageValue"
            class="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Texte à stocker..."
          />
          <Button @click="saveToStorage" class="w-full">Enregistrer</Button>
        </CardContent>
      </Card>

      <!-- Section Alertes / Badges -->
      <Card>
        <CardHeader class="flex flex-row items-center space-x-4">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <AlertTriangle class="w-5 h-5 text-yellow-600" />
          </div>
          <div class="flex items-center gap-2 mb-2">
            <CardTitle>Gestion des Alertes</CardTitle>
          </div>
        </CardHeader>
        <CardContent class="flex items-center justify-between">
          <div class="relative inline-flex">
            <Button variant="outline">Messagerie</Button>
            <Badge
              v-if="alertCount > 0"
              variant="destructive"
              class="absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs"
            >
              {{ alertCount }}
            </Badge>
          </div>
          <Button size="sm" @click="incrementAlert">+1 Alerte</Button>
          <Button size="sm" variant="ghost" @click="alertCount = 0">Reset</Button>
        </CardContent>
      </Card>

      <!-- Section Géolocalisation -->
      <Card>
        <CardHeader class="flex flex-row items-center space-x-4">
          <div class="p-2 bg-green-100 rounded-lg"><MapPin class="w-5 h-5 text-green-600" /></div>
          <div class="flex items-center gap-2 mb-2">
            <MapPin class="w-5 h-5 text-green-600" />
            <CardTitle>Géolocalisation</CardTitle>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-if="coords" class="text-sm font-mono p-3 bg-muted rounded-md space-y-1">
            <p>Lat: {{ coords.lat.toFixed(4) }}°</p>
            <p>Lng: {{ coords.lng.toFixed(4) }}°</p>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">Statut: {{ geoStatus }}</span>
            <Button size="sm" @click="getLocation">Démarrer</Button>
          </div>
        </CardContent>
      </Card>

      <!-- Section Notifications -->
      <Card>
        <CardHeader class="flex flex-row items-center space-x-4">
          <div class="p-2 bg-purple-100 rounded-lg"><Bell class="w-5 h-5 text-purple-600" /></div>
          <div class="flex items-center gap-2 mb-2">
            <Bell class="w-5 h-5 text-purple-600" />
            <CardTitle>Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <Badge :variant="notifPermission === 'granted' ? 'default' : 'secondary'">
              {{ notifPermission }}
            </Badge>
          </div>
          <Button size="sm" @click="requestNotif" :disabled="notifPermission === 'granted'">
            Activer
          </Button>
        </CardContent>
      </Card>

      <!-- Section Touch / Pointer Events -->
      <Card class="md:col-span-2">
        <CardHeader class="flex flex-row items-center space-x-4">
          <div class="p-2 bg-red-100 rounded-lg"><Touchpad class="w-5 h-5 text-red-600" /></div>
          <div class="flex items-center gap-2 mb-2">
            <Touchpad class="w-5 h-5 text-red-600" />
            <CardTitle>Événements Tactiles & Pointeurs</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div
            class="h-40 w-full border-2 border-dashed rounded-xl flex items-center justify-center relative overflow-hidden select-none touch-none bg-slate-50 cursor-crosshair"
            @pointerdown="handlePointerDown"
            @pointermove="handlePointerMove"
            @pointerup="handlePointerUp"
            @pointerleave="handlePointerUp"
          >
            <div class="text-center">
              <p class="text-lg font-bold">{{ pointerInfo.status }}</p>
              <p class="text-sm text-muted-foreground">
                Positions: X:{{ pointerInfo.x }} Y:{{ pointerInfo.y }}
              </p>
            </div>
            <!-- Visuel point -->
            <div
              v-if="pointerInfo.status === 'Appuyé'"
              class="absolute w-8 h-8 bg-red-500/30 rounded-full border-2 border-red-500 pointer-events-none transition-transform duration-75"
              :style="{
                left: pointerInfo.x - 16 + 'px',
                top: pointerInfo.y - 16 + 'px',
                transform: 'translate(0,0)',
              }"
            ></div>
          </div>
          <p class="text-xs text-center mt-2 text-muted-foreground italic">
            Testez en cliquant ou en touchant la zone ci-dessus.
          </p>
        </CardContent>
      </Card>

      <!-- Section Contact Picker -->
      <Card>
        <CardHeader class="flex flex-row items-center space-x-4">
          <div class="p-2 bg-indigo-100 rounded-lg"><Users class="w-5 h-5 text-indigo-600" /></div>
          <div class="flex items-center gap-2 mb-2">
            <CardTitle>Contact Picker</CardTitle>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div v-if="selectedContact" class="text-sm p-3 bg-muted rounded-md space-y-1">
            <p><strong>Nom :</strong> {{ selectedContact.name?.[0] || '-' }}</p>
            <p><strong>Tél :</strong> {{ selectedContact.tel?.[0] || '-' }}</p>
            <p><strong>Email :</strong> {{ selectedContact.email?.[0] || '-' }}</p>
          </div>
          <div v-else class="text-sm text-muted-foreground p-3">Aucun contact sélectionné</div>
          <Button @click="pickContact" :disabled="!contactPickerSupported" class="w-full">
            {{ contactPickerSupported ? 'Sélectionner un contact' : 'Non supporté' }}
          </Button>
        </CardContent>
      </Card>

      <!-- Section Share API -->
      <Card>
        <CardHeader class="flex flex-row items-center space-x-4">
          <div class="p-2 bg-pink-100 rounded-lg"><Share2 class="w-5 h-5 text-pink-600" /></div>
          <div class="flex items-center gap-2 mb-2">
            <CardTitle>Partager l'appli</CardTitle>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <p class="text-sm text-muted-foreground">
            Partage cette application via les canaux disponibles sur ton système.
          </p>
          <Button @click="shareApp" :disabled="!shareSupported" class="w-full">
            {{ shareSupported ? '📤 Partager' : 'Non supporté' }}
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>
</template>
