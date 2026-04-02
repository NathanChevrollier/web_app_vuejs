import { ref } from 'vue'

export function useGeolocation(onNotify: (title: string, body: string) => void) {
  const coords = ref<{ lat: number; lng: number } | null>(null)
  const geoStatus = ref('Pas encore demandee')

  const getLocation = () => {
    if (!navigator.geolocation) {
      geoStatus.value = 'Non supportee'
      onNotify('Geolocalisation', 'Non supportee sur cet appareil.')
      return
    }

    geoStatus.value = 'Recherche...'
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        coords.value = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        geoStatus.value = 'Localise'
        onNotify(
          'Geolocalisation',
          `Position : ${coords.value.lat.toFixed(4)}, ${coords.value.lng.toFixed(4)}`,
        )
      },
      () => {
        geoStatus.value = 'Erreur/Refuse'
        onNotify('Geolocalisation', 'Erreur ou refus de la localisation.')
      },
    )
  }

  return {
    coords,
    geoStatus,
    getLocation,
  }
}
