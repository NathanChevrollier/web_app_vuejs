import { ref } from 'vue'

export function usePointerTracker(onNotify: (title: string, body: string) => void) {
  const pointerInfo = ref({ x: 0, y: 0, status: 'Aucun contact' })

  const handlePointerDown = (e: PointerEvent) => {
    pointerInfo.value = { x: Math.round(e.clientX), y: Math.round(e.clientY), status: 'Appuyé' }
    onNotify('Pointer', `Contact a (${pointerInfo.value.x}, ${pointerInfo.value.y})`)
  }

  const handlePointerMove = (e: PointerEvent) => {
    if (pointerInfo.value.status === 'Appuyé') {
      pointerInfo.value = {
        ...pointerInfo.value,
        x: Math.round(e.clientX),
        y: Math.round(e.clientY),
      }
    }
  }

  const handlePointerUp = () => {
    pointerInfo.value.status = 'Relâché'
    onNotify('Pointer', 'Contact relache')
  }

  return {
    pointerInfo,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  }
}
