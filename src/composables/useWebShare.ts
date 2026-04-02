import { ref } from 'vue'

export function useWebShare(onNotify: (title: string, body: string) => void) {
  const shareSupported = ref(typeof navigator !== 'undefined' && 'share' in navigator)

  const shareApp = async () => {
    try {
      await navigator.share({
        title: 'VueApp - Ressources Internes',
        text: 'Decouvre ma super appli Vue avec les APIs natives du navigateur !',
        url: window.location.href,
      })
      onNotify('Partage', 'Application partagee avec succes !')
    } catch {
      onNotify('Partage', 'Partage annule ou non supporte.')
    }
  }

  return {
    shareSupported,
    shareApp,
  }
}
