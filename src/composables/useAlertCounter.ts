import { ref } from 'vue'

export function useAlertCounter(onNotify: (title: string, body: string) => void) {
  const alertCount = ref(3)

  const incrementAlert = () => {
    alertCount.value++
    onNotify('Nouvelle alerte', `Tu as ${alertCount.value} alerte(s) !`)
  }

  const resetAlert = () => {
    alertCount.value = 0
  }

  return {
    alertCount,
    incrementAlert,
    resetAlert,
  }
}
