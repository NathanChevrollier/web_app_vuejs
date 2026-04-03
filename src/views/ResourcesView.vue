<script setup lang="ts">
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast/use-toast'
import { MapPin, Bell, Database, Touchpad, AlertTriangle, Users, Share2 } from 'lucide-vue-next'
import { useSystemNotifications } from '@/composables/useSystemNotifications'
import { useStorageItems } from '@/composables/useStorageItems'
import { useGeolocation } from '@/composables/useGeolocation'
import { useAlertCounter } from '@/composables/useAlertCounter'
import { usePointerTracker } from '@/composables/usePointerTracker'
import { useContactPicker } from '@/composables/useContactPicker'
import { useWebShare } from '@/composables/useWebShare'

const { toast } = useToast()
const { notifPermission, sendSystemNotification, requestNotif } = useSystemNotifications()

const {
  storageValue,
  storageItems,
  addToStorage: addToStorageRaw,
  removeFromStorage,
  clearAllStorage,
} = useStorageItems(sendSystemNotification)

const addToStorage = () => {
  const value = storageValue.value!.trim()
  if (!value) return

  addToStorageRaw()
  toast({ title: 'Ajouté', description: 'Élément sauvegardé dans LocalStorage' })
}

const { coords, geoStatus, getLocation } = useGeolocation(sendSystemNotification)
const { alertCount, incrementAlert, resetAlert } = useAlertCounter(sendSystemNotification)
const { pointerInfo, handlePointerDown, handlePointerMove, handlePointerUp } =
  usePointerTracker(sendSystemNotification)
const { selectedContact, contactPickerSupported, pickContact } =
  useContactPicker(sendSystemNotification)
const { shareSupported, shareApp } = useWebShare(sendSystemNotification)
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
            <CardTitle>Ajouter au Stockage Local</CardTitle>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <input
            v-model="storageValue"
            class="w-full flex h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Texte à stocker..."
            @keyup.enter="addToStorage"
          />
          <Button @click="addToStorage" class="w-full">➕ Ajouter</Button>
        </CardContent>
      </Card>

      <!-- Section Éléments Stockés Localement -->
      <Card>
        <CardHeader class="flex flex-row items-center space-x-4">
          <div class="p-2 bg-emerald-100 rounded-lg">
            <Database class="w-5 h-5 text-emerald-600" />
          </div>
          <div class="flex items-center gap-2 mb-2">
            <CardTitle>Éléments Stockés</CardTitle>
          </div>
        </CardHeader>
        <CardContent class="space-y-4">
          <div
            v-if="storageItems && storageItems.length"
            class="space-y-2 max-h-72 overflow-y-auto"
          >
            <div
              v-for="item in storageItems"
              :key="item.id"
              class="flex items-start justify-between gap-2 p-3 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 transition-colors"
            >
              <div class="flex-1 min-w-0">
                <p class="font-medium text-sm text-emerald-900 break-words">{{ item.value }}</p>
                <p class="text-xs text-emerald-600 mt-1">
                  {{ new Date(item.timestamp).toLocaleString('fr-FR') }}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                @click="removeFromStorage(item.id)"
                class="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                ✕
              </Button>
            </div>
          </div>
          <div v-else class="text-sm text-muted-foreground text-center py-8">
            📦 Aucun élément stocké. Ajoute-en via le champ ci-contre !
          </div>
          <Button
            v-if="storageItems && storageItems.length"
            @click="clearAllStorage"
            variant="destructive"
            class="w-full"
          >
            🗑️ Vider tout
          </Button>
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
          <Button size="sm" variant="ghost" @click="resetAlert">Reset</Button>
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
            <Badge
              :variant="
                notifPermission === 'granted'
                  ? 'default'
                  : notifPermission === 'denied'
                    ? 'destructive'
                    : 'secondary'
              "
            >
              {{ notifPermission }}
            </Badge>
          </div>
          <Button
            size="sm"
            @click="requestNotif"
            :disabled="notifPermission === 'granted' || notifPermission === 'unsupported'"
          >
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
