import { ref } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'

export function useSystemNotifications() {
  const { toast } = useToast()

  const notifSupported = ref(typeof window !== 'undefined' && 'Notification' in window)
  const notifPermission = ref<NotificationPermission | 'unsupported'>(
    notifSupported.value ? Notification.permission : 'unsupported',
  )

  const sendSystemNotification = (title: string, body: string) => {
    if (!notifSupported.value || notifPermission.value !== 'granted') {
      return
    }

    try {
      new Notification(title, { body, icon: '/favicon.ico' })
    } catch {
      toast({
        title: 'Notification impossible',
        description: 'Le navigateur a bloque la notification systeme.',
        variant: 'destructive',
      })
    }
  }

  const requestNotif = async () => {
    if (!notifSupported.value) {
      toast({
        title: 'Non supporte',
        description: 'Les notifications systeme ne sont pas disponibles sur ce navigateur.',
        variant: 'destructive',
      })
      return
    }

    const permission = await Notification.requestPermission()
    notifPermission.value = permission

    if (permission === 'denied') {
      toast({
        title: 'Notifications bloquees',
        description: 'Autorise les notifications dans les parametres du navigateur pour ce site.',
        variant: 'destructive',
      })
      return
    }

    if (permission === 'granted') {
      sendSystemNotification('Notifications activees', 'Les notifications systeme sont activees !')
    }
  }

  return {
    notifSupported,
    notifPermission,
    sendSystemNotification,
    requestNotif,
  }
}
