import { onMounted, ref } from 'vue'

export interface StorageItem {
  id: string
  value: string
  timestamp: number
}

const STORAGE_KEY = 'appStoredItems'

export type UseStorageItemsReturn = {
  storageValue: ReturnType<typeof ref<string>>
  storageItems: ReturnType<typeof ref<StorageItem[]>>
  addToStorage: () => void
  removeFromStorage: (id: string) => void
  clearAllStorage: () => void
}

export function useStorageItems(
  onNotify: (title: string, body: string) => void,
): UseStorageItemsReturn {
  const storageValue = ref('')
  const storageItems = ref<StorageItem[]>([])

  const loadStorageItems = () => {
    const raw = localStorage.getItem(STORAGE_KEY)
    storageItems.value = raw ? JSON.parse(raw) : []
  }

  const saveStorageItems = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageItems.value))
  }

  const addToStorage = () => {
    if (!storageValue.value.trim()) return

    const newItem: StorageItem = {
      id: Date.now().toString(),
      value: storageValue.value,
      timestamp: Date.now(),
    }

    storageItems.value.unshift(newItem)
    saveStorageItems()
    onNotify('Stockage local', `Element ajoute : "${storageValue.value}"`)
    storageValue.value = ''
  }

  const removeFromStorage = (id: string) => {
    storageItems.value = storageItems.value.filter((item) => item.id !== id)
    saveStorageItems()
    onNotify('Stockage local', 'Element supprime')
  }

  const clearAllStorage = () => {
    localStorage.removeItem(STORAGE_KEY)
    storageItems.value = []
    onNotify('Stockage local', 'Tous les elements ont ete supprimes')
  }

  onMounted(() => {
    loadStorageItems()
  })

  return {
    storageValue,
    storageItems,
    addToStorage,
    removeFromStorage,
    clearAllStorage,
  }
}
