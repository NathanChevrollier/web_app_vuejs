<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Badge } from '@/components/ui/badge'
import { useAuthMode } from '@/composables/useAuthMode'

const auth = useAuthMode()
const loginOpen = ref(false)
const pseudo = ref('')
const mdp = ref('')
const loginError = ref('')
const loginLoading = ref(false)

const badgeVariant = computed(() => (auth.isAdmin.value ? 'destructive' : 'outline'))

const resetForm = () => {
  pseudo.value = ''
  mdp.value = ''
  loginError.value = ''
}

const toggleLoginPanel = () => {
  if (auth.isConnected.value) {
    auth.disconnect()
    loginOpen.value = false
    resetForm()
    return
  }

  loginOpen.value = !loginOpen.value
}

const submitLogin = async () => {
  loginLoading.value = true
  loginError.value = ''

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pseudo: pseudo.value, mdp: mdp.value }),
    })

    if (!response.ok) {
      throw new Error('Identifiants invalides')
    }

    const payload = (await response.json()) as { user: { pseudo: string; role: 'admin' | 'user' } }
    auth.connect(payload.user)
    loginOpen.value = false
    resetForm()
  } catch (error) {
    loginError.value = error instanceof Error ? error.message : 'Connexion impossible'
  } finally {
    loginLoading.value = false
  }
}
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container flex h-16 items-center justify-between mx-auto px-4">
      <div class="mr-4 flex items-center space-x-2">
        <RouterLink to="/" class="flex items-center space-x-2">
          <span class="inline-block font-bold text-xl tracking-tight text-primary">VueApp.</span>
        </RouterLink>
      </div>

      <nav class="flex items-center space-x-2">
        <NavigationMenu>
          <NavigationMenuList class="space-x-1">
            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <RouterLink
                  to="/"
                  :class="[
                    navigationMenuTriggerStyle(),
                    'px-4 py-2 transition-colors hover:text-primary',
                  ]"
                  active-class="bg-accent text-accent-foreground font-medium"
                >
                  Accueil
                </RouterLink>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <RouterLink
                  to="/form"
                  :class="[
                    navigationMenuTriggerStyle(),
                    'px-4 py-2 transition-colors hover:text-primary',
                  ]"
                  active-class="bg-accent text-accent-foreground font-medium"
                >
                  Formulaire
                </RouterLink>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <RouterLink
                  to="/posts"
                  :class="[
                    navigationMenuTriggerStyle(),
                    'px-4 py-2 transition-colors hover:text-primary',
                  ]"
                  active-class="bg-accent text-accent-foreground font-medium"
                >
                  Articles
                </RouterLink>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <RouterLink
                  to="/resources"
                  :class="[
                    navigationMenuTriggerStyle(),
                    'px-4 py-2 transition-colors hover:text-primary',
                  ]"
                  active-class="bg-accent text-accent-foreground font-medium"
                >
                  Ressources API
                </RouterLink>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <RouterLink
                  to="/api-test"
                  :class="[
                    navigationMenuTriggerStyle(),
                    'px-4 py-2 transition-colors hover:text-primary',
                  ]"
                  active-class="bg-accent text-accent-foreground font-medium"
                >
                  Test API REST
                </RouterLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      <div class="flex items-center gap-3 relative">
        <Badge :variant="badgeVariant" class="uppercase tracking-[0.18em]">
          {{ auth.roleLabel.value }}
        </Badge>

        <div class="relative">
          <button
            type="button"
            class="inline-flex h-10 items-center justify-center rounded-md border bg-white px-4 text-sm font-medium shadow-sm transition-colors hover:bg-slate-50"
            @click="toggleLoginPanel"
          >
            {{ auth.isConnected.value ? 'Déconnexion' : 'Connexion' }}
          </button>

          <div
            v-if="loginOpen && !auth.isConnected.value"
            class="absolute right-0 top-12 z-50 w-72 rounded-lg border bg-white p-4 shadow-lg"
          >
            <p class="text-sm font-semibold mb-3">Connexion simple</p>
            <div class="space-y-3">
              <input
                v-model="pseudo"
                type="text"
                placeholder="Pseudo"
                class="h-10 w-full rounded-md border px-3 text-sm"
              />
              <input
                v-model="mdp"
                type="password"
                placeholder="Mot de passe"
                class="h-10 w-full rounded-md border px-3 text-sm"
              />
              <p class="text-xs text-muted-foreground">
                Exemple: admin / admin123 ou demo / demo123
              </p>
              <p v-if="loginError" class="text-xs text-red-600">{{ loginError }}</p>
              <button
                type="button"
                class="h-10 w-full rounded-md bg-primary text-primary-foreground text-sm font-medium"
                :disabled="loginLoading"
                @click="submitLogin"
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>

        <a
          href="https://github.com"
          target="_blank"
          class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:block"
        >
          GitHub
        </a>
      </div>
    </div>
  </header>
</template>
