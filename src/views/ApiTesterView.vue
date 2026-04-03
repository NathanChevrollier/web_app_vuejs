<script setup lang="ts">
import { computed, ref } from 'vue'

type ApiItem = {
  id: number
  title: string
  done: boolean
}

type ApiUser = {
  id: number
  pseudo: string
  role: 'admin' | 'user'
}

const items = ref<ApiItem[]>([])
const itemTitle = ref('')
const selectedItemId = ref<number | null>(null)
const itemsLoading = ref(false)
const itemsStatus = ref('')

const users = ref<ApiUser[]>([])
const userPseudo = ref('')
const userPassword = ref('')
const userRole = ref<ApiUser['role']>('user')
const usersLoading = ref(false)
const usersStatus = ref('')

const selectedItem = computed(
  () => items.value.find((item) => item.id === selectedItemId.value) ?? null,
)

const roleLabel = (role: ApiUser['role']) => (role === 'admin' ? 'admin' : 'utilisateur')

const setItemsStatus = (message: string) => {
  itemsStatus.value = message
}

const setUsersStatus = (message: string) => {
  usersStatus.value = message
}

const loadItems = async () => {
  itemsLoading.value = true

  try {
    const response = await fetch('/api/items')

    if (!response.ok) {
      throw new Error(`GET /api/items failed (${response.status})`)
    }

    items.value = (await response.json()) as ApiItem[]
    setItemsStatus(`Liste chargée (${items.value.length} élément(s))`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    setItemsStatus(message)
  } finally {
    itemsLoading.value = false
  }
}

const createItem = async () => {
  const cleanTitle = itemTitle.value.trim()

  if (!cleanTitle) {
    setItemsStatus('Le titre est obligatoire')
    return
  }

  itemsLoading.value = true

  try {
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: cleanTitle, done: false }),
    })

    if (!response.ok) {
      throw new Error(`POST /api/items failed (${response.status})`)
    }

    const newItem = (await response.json()) as ApiItem
    items.value.unshift(newItem)
    itemTitle.value = ''
    setItemsStatus(`Item créé (#${newItem.id})`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    setItemsStatus(message)
  } finally {
    itemsLoading.value = false
  }
}

const toggleDone = async (item: ApiItem) => {
  itemsLoading.value = true

  try {
    const response = await fetch(`/api/items/${item.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: item.title, done: !item.done }),
    })

    if (!response.ok) {
      throw new Error(`PUT /api/items/${item.id} failed (${response.status})`)
    }

    const updated = (await response.json()) as ApiItem
    const index = items.value.findIndex((entry) => entry.id === updated.id)

    if (index >= 0) {
      items.value[index] = updated
    }

    setItemsStatus(`Item #${updated.id} mis à jour`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    setItemsStatus(message)
  } finally {
    itemsLoading.value = false
  }
}

const removeItem = async (item: ApiItem) => {
  itemsLoading.value = true

  try {
    const response = await fetch(`/api/items/${item.id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`DELETE /api/items/${item.id} failed (${response.status})`)
    }

    items.value = items.value.filter((entry) => entry.id !== item.id)

    if (selectedItemId.value === item.id) {
      selectedItemId.value = null
    }

    setItemsStatus(`Item #${item.id} supprimé`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    setItemsStatus(message)
  } finally {
    itemsLoading.value = false
  }
}

const loadUsers = async () => {
  usersLoading.value = true

  try {
    const response = await fetch('/api/users')

    if (!response.ok) {
      throw new Error(`GET /api/users failed (${response.status})`)
    }

    users.value = (await response.json()) as ApiUser[]
    setUsersStatus(`Utilisateurs chargés (${users.value.length})`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    setUsersStatus(message)
  } finally {
    usersLoading.value = false
  }
}

const createUser = async () => {
  const cleanPseudo = userPseudo.value.trim()
  const cleanPassword = userPassword.value.trim()

  if (!cleanPseudo || !cleanPassword) {
    setUsersStatus('Pseudo et mot de passe obligatoires')
    return
  }

  usersLoading.value = true

  try {
    const response = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pseudo: cleanPseudo, mdp: cleanPassword, role: userRole.value }),
    })

    if (!response.ok) {
      throw new Error(`POST /api/users failed (${response.status})`)
    }

    const newUser = (await response.json()) as ApiUser
    users.value.unshift(newUser)
    userPseudo.value = ''
    userPassword.value = ''
    userRole.value = 'user'
    setUsersStatus(`Utilisateur créé (#${newUser.id})`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    setUsersStatus(message)
  } finally {
    usersLoading.value = false
  }
}

const removeUser = async (user: ApiUser) => {
  usersLoading.value = true

  try {
    const response = await fetch(`/api/users/${user.id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error(`DELETE /api/users/${user.id} failed (${response.status})`)
    }

    users.value = users.value.filter((entry) => entry.id !== user.id)
    setUsersStatus(`Utilisateur #${user.id} supprimé`)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue'
    setUsersStatus(message)
  } finally {
    usersLoading.value = false
  }
}

void loadItems()
void loadUsers()
</script>

<template>
  <section class="max-w-5xl mx-auto space-y-6">
    <header>
      <h1 class="text-3xl font-bold tracking-tight">Testeur Mini API REST</h1>
      <p class="text-sm text-muted-foreground mt-2">
        Cette page appelle les routes Express via <code>/api</code> (proxy Vite en dev).
      </p>
    </header>

    <div class="grid gap-6 lg:grid-cols-2">
      <div class="rounded-lg border bg-white p-4 space-y-4 shadow-sm">
        <div>
          <h2 class="text-lg font-semibold">Items</h2>
          <p class="text-sm text-muted-foreground">CRUD simple sur la liste de tâches.</p>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <input
            v-model="itemTitle"
            type="text"
            placeholder="Nouveau titre"
            class="flex-1 h-10 rounded-md border px-3 text-sm"
          />
          <button
            type="button"
            class="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium"
            :disabled="itemsLoading"
            @click="createItem"
          >
            Créer
          </button>
          <button
            type="button"
            class="h-10 px-4 rounded-md border text-sm font-medium"
            :disabled="itemsLoading"
            @click="loadItems"
          >
            Recharger
          </button>
        </div>

        <p class="text-sm text-muted-foreground">{{ itemsStatus || 'Aucun message' }}</p>

        <ul class="space-y-2">
          <li
            v-for="item in items"
            :key="item.id"
            class="flex items-center justify-between rounded-md border p-3"
          >
            <button type="button" class="text-left flex-1" @click="selectedItemId = item.id">
              <span class="font-medium">#{{ item.id }} - {{ item.title }}</span>
              <span class="ml-2 text-xs" :class="item.done ? 'text-green-600' : 'text-amber-600'">
                {{ item.done ? 'done' : 'todo' }}
              </span>
            </button>

            <div class="flex items-center gap-2 ml-3">
              <button
                type="button"
                class="h-8 px-3 rounded-md border text-xs"
                :disabled="itemsLoading"
                @click="toggleDone(item)"
              >
                Toggle done
              </button>
              <button
                type="button"
                class="h-8 px-3 rounded-md border border-red-200 text-red-600 text-xs"
                :disabled="itemsLoading"
                @click="removeItem(item)"
              >
                Supprimer
              </button>
            </div>
          </li>
        </ul>

        <p v-if="items.length === 0" class="text-sm text-muted-foreground">Aucun item.</p>
      </div>

      <div class="rounded-lg border bg-white p-4 space-y-4 shadow-sm">
        <div>
          <h2 class="text-lg font-semibold">Users</h2>
          <p class="text-sm text-muted-foreground">Créer ou supprimer un utilisateur local.</p>
        </div>

        <div class="grid gap-3 sm:grid-cols-3">
          <input
            v-model="userPseudo"
            type="text"
            placeholder="Pseudo"
            class="h-10 rounded-md border px-3 text-sm"
          />
          <input
            v-model="userPassword"
            type="password"
            placeholder="Mot de passe"
            class="h-10 rounded-md border px-3 text-sm"
          />
          <select v-model="userRole" class="h-10 rounded-md border px-3 text-sm bg-white">
            <option value="user">Utilisateur</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div class="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            class="h-10 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium"
            :disabled="usersLoading"
            @click="createUser"
          >
            Créer user
          </button>
          <button
            type="button"
            class="h-10 px-4 rounded-md border text-sm font-medium"
            :disabled="usersLoading"
            @click="loadUsers"
          >
            Recharger
          </button>
        </div>

        <p class="text-sm text-muted-foreground">{{ usersStatus || 'Aucun message' }}</p>

        <ul class="space-y-2">
          <li
            v-for="user in users"
            :key="user.id"
            class="flex items-center justify-between rounded-md border p-3 gap-3"
          >
            <div>
              <p class="font-medium">#{{ user.id }} - {{ user.pseudo }}</p>
              <p class="text-xs text-muted-foreground">Rôle: {{ roleLabel(user.role) }}</p>
            </div>

            <button
              type="button"
              class="h-8 px-3 rounded-md border border-red-200 text-red-600 text-xs"
              :disabled="usersLoading"
              @click="removeUser(user)"
            >
              Supprimer
            </button>
          </li>
        </ul>

        <p v-if="users.length === 0" class="text-sm text-muted-foreground">Aucun utilisateur.</p>
      </div>
    </div>

    <div v-if="selectedItem" class="rounded-lg border bg-white p-4 shadow-sm">
      <h2 class="text-lg font-semibold mb-2">Détail sélectionné</h2>
      <pre class="text-xs bg-slate-100 rounded-md p-3 overflow-auto">{{ selectedItem }}</pre>
    </div>
  </section>
</template>
