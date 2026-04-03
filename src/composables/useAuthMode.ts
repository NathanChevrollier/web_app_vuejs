import { computed, ref } from 'vue'

export type AuthRole = 'admin' | 'user'

export type AuthSession = {
  pseudo: string
  role: AuthRole
}

const storageKey = 'web_app_vuejs.auth-session'

function readStoredSession() {
  if (typeof window === 'undefined') {
    return null
  }

  const rawSession = window.localStorage.getItem(storageKey)

  if (!rawSession) {
    return null
  }

  try {
    const parsedSession = JSON.parse(rawSession) as Partial<AuthSession>

    if (
      typeof parsedSession.pseudo === 'string' &&
      (parsedSession.role === 'admin' || parsedSession.role === 'user')
    ) {
      return {
        pseudo: parsedSession.pseudo,
        role: parsedSession.role,
      }
    }
  } catch {
    return null
  }

  return null
}

const session = ref<AuthSession | null>(readStoredSession())

function persistSession(nextSession: AuthSession | null) {
  session.value = nextSession

  if (typeof window === 'undefined') {
    return
  }

  if (nextSession) {
    window.localStorage.setItem(storageKey, JSON.stringify(nextSession))
    return
  }

  window.localStorage.removeItem(storageKey)
}

export function useAuthMode() {
  const isAdmin = computed(() => session.value?.role === 'admin')
  const roleLabel = computed(() => (isAdmin.value ? 'admin' : 'utilisateur'))
  const isConnected = computed(() => session.value !== null)

  const connect = (nextSession: AuthSession) => {
    persistSession(nextSession)
  }

  const disconnect = () => {
    persistSession(null)
  }

  return {
    session,
    isAdmin,
    isConnected,
    roleLabel,
    connect,
    disconnect,
  }
}
