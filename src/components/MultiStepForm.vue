<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const step = ref(1)
const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  city: '',
})

const history = ref<Array<typeof formData.value>>([])

function loadHistory() {
  const raw = localStorage.getItem('formHistory')
  history.value = raw ? JSON.parse(raw) : []
}

function saveHistory() {
  localStorage.setItem('formHistory', JSON.stringify(history.value))
}

function clearHistory() {
  localStorage.removeItem('formHistory')
  history.value = []
}

onMounted(() => {
  loadHistory()
})

function nextStep() {
  if (step.value < 3) step.value++
}

function prevStep() {
  if (step.value > 1) step.value--
}

function resetForm() {
  // Réinitialise le formulaire et revient à l'étape 1
  formData.value = {
    firstName: '',
    lastName: '',
    email: '',
    city: '',
  }
  step.value = 1
}

function submitForm() {
  // Ajoute la soumission à l'historique local
  history.value.unshift({ ...formData.value })
  saveHistory()
  alert('Formulaire envoyé : ' + JSON.stringify(formData.value))
  // Reset et retour au début
  resetForm()
}
</script>

<template>
  <div class="flex flex-col items-center">
    <Card class="w-full max-w-lg">
      <CardHeader class="mb-4">
        <CardTitle class="text-2xl font-bold">Inscription</CardTitle>
        <CardDescription>Complétez les étapes pour créer votre compte.</CardDescription>
      </CardHeader>
      <Separator class="mb-4" />

      <CardContent>
        <!-- Étape 1 : Identité -->
        <div v-if="step === 1" class="space-y-6">
          <div class="flex flex-col md:flex-row gap-4">
            <div class="flex-1 space-y-2">
              <Label for="firstName">Prénom</Label>
              <Input id="firstName" v-model="formData.firstName" placeholder="Jean" />
            </div>
            <div class="flex-1 space-y-2">
              <Label for="lastName">Nom</Label>
              <Input id="lastName" v-model="formData.lastName" placeholder="Dupont" />
            </div>
          </div>
        </div>

        <!-- Étape 2 : Contact -->
        <div v-else-if="step === 2" class="space-y-6">
          <div class="space-y-2">
            <Label for="email">Email</Label>
            <Input
              id="email"
              type="email"
              v-model="formData.email"
              placeholder="jean.dupont@example.com"
            />
          </div>
        </div>

        <!-- Étape 3 : Localisation & Récap -->
        <div v-else-if="step === 3" class="space-y-6">
          <div class="space-y-2">
            <Label for="city">Ville</Label>
            <Input id="city" v-model="formData.city" placeholder="Paris" />
          </div>
          <div class="mt-6 p-4 bg-muted rounded-md text-sm space-y-1 border">
            <p class="font-semibold mb-2">Récapitulatif :</p>
            <ul class="list-disc pl-5">
              <li>Nom: {{ formData.firstName }} {{ formData.lastName }}</li>
              <li>Email: {{ formData.email }}</li>
              <li>Ville: {{ formData.city }}</li>
            </ul>
          </div>
        </div>
      </CardContent>

      <CardFooter
        class="flex flex-col md:flex-row gap-2 md:gap-4 justify-between items-center mt-4"
      >
        <Button variant="outline" :disabled="step === 1" @click="prevStep" class="w-full md:w-auto"
          >Précédent</Button
        >
        <Button v-if="step < 3" @click="nextStep" class="w-full md:w-auto">Suivant</Button>
        <Button v-else @click="submitForm" class="w-full md:w-auto">Confirmer</Button>
      </CardFooter>
    </Card>
    <!-- Historique des soumissions -->
    <div v-if="history.length" class="w-full max-w-lg mt-8">
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-semibold text-lg">Historique des formulaires</h3>
        <Button variant="destructive" size="sm" @click="clearHistory">Vider l'historique</Button>
      </div>
      <ul class="space-y-2">
        <li v-for="(item, idx) in history" :key="idx" class="p-3 rounded border bg-muted">
          <div class="font-medium">{{ item.firstName }} {{ item.lastName }}</div>
          <div class="text-sm text-muted-foreground">{{ item.email }} — {{ item.city }}</div>
        </li>
      </ul>
    </div>
  </div>
</template>
