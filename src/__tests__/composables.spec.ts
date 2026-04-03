import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { useAlertCounter } from '../composables/useAlertCounter'
import { useContactPicker } from '../composables/useContactPicker'
import { useGeolocation } from '../composables/useGeolocation'
import { usePointerTracker } from '../composables/usePointerTracker'
import { useStorageItems } from '../composables/useStorageItems'
import { useSystemNotifications } from '../composables/useSystemNotifications'
import { useWebShare } from '../composables/useWebShare'

const toastSpy = vi.fn()

vi.mock('@/components/ui/toast/use-toast', () => ({
  useToast: () => ({ toast: toastSpy }),
}))

const notificationCtorSpy = vi.fn()

class MockNotification {
  static permission: NotificationPermission = 'default'
  static requestPermission = vi.fn<() => Promise<NotificationPermission>>()

  constructor(title: string, options?: NotificationOptions) {
    notificationCtorSpy({ title, options })
  }
}

describe('Composables API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()

    MockNotification.permission = 'default'
    MockNotification.requestPermission.mockResolvedValue('granted')

    Object.defineProperty(globalThis, 'Notification', {
      value: MockNotification,
      configurable: true,
      writable: true,
    })

    Object.defineProperty(navigator, 'geolocation', {
      value: undefined,
      configurable: true,
    })

    Object.defineProperty(navigator, 'contacts', {
      value: undefined,
      configurable: true,
      writable: true,
    })

    Object.defineProperty(navigator, 'share', {
      value: undefined,
      configurable: true,
      writable: true,
    })
  })

  it('handles system notification permission and send', async () => {
    const api = useSystemNotifications()

    await api.requestNotif()

    expect(api.notifPermission.value).toBe('granted')
    expect(notificationCtorSpy).toHaveBeenCalledWith({
      title: 'Notifications activees',
      options: { body: 'Les notifications systeme sont activees !', icon: '/favicon.ico' },
    })
  })

  it('adds and removes storage items', () => {
    const notify = vi.fn()
    let storage!: import('../composables/useStorageItems').UseStorageItemsReturn

    mount(
      defineComponent({
        setup() {
          storage = useStorageItems(notify)
          return () => null
        },
      }),
    )

    storage.storageValue.value = 'Test item'
    storage.addToStorage()

    expect(storage.storageItems.value!.length).toBe(1)
    expect((storage.storageItems.value ?? [])[0]!.value).toBe('Test item')

    const id = (storage.storageItems.value ?? [])[0]!.id
    storage.removeFromStorage(id)

    expect(storage.storageItems.value!.length).toBe(0)
    expect(notify).toHaveBeenCalled()
  })

  it('returns geolocation coordinates on success', () => {
    const notify = vi.fn()
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: (success: (pos: GeolocationPosition) => void) => {
          success({
            coords: {
              latitude: 48.8566,
              longitude: 2.3522,
            },
          } as GeolocationPosition)
        },
      },
      configurable: true,
    })

    const geo = useGeolocation(notify)
    geo.getLocation()

    expect(geo.geoStatus.value).toBe('Localise')
    expect(geo.coords.value).toEqual({ lat: 48.8566, lng: 2.3522 })
  })

  it('increments and resets alert counter', () => {
    const notify = vi.fn()
    const alerts = useAlertCounter(notify)

    alerts.incrementAlert()
    expect(alerts.alertCount.value).toBe(4)

    alerts.resetAlert()
    expect(alerts.alertCount.value).toBe(0)
  })

  it('tracks pointer position and status', () => {
    const notify = vi.fn()
    const pointer = usePointerTracker(notify)

    pointer.handlePointerDown({ clientX: 10.4, clientY: 20.6 } as PointerEvent)
    expect(pointer.pointerInfo.value).toEqual({ x: 10, y: 21, status: 'Appuyé' })

    pointer.handlePointerMove({ clientX: 11.9, clientY: 21.1 } as PointerEvent)
    expect(pointer.pointerInfo.value.x).toBe(12)

    pointer.handlePointerUp()
    expect(pointer.pointerInfo.value.status).toBe('Relâché')
  })

  it('picks contact when API is available', async () => {
    const notify = vi.fn()
    const select = vi.fn().mockResolvedValue([{ name: ['Alice'], tel: ['0600000000'] }])

    Object.defineProperty(navigator, 'contacts', {
      value: { select },
      configurable: true,
      writable: true,
    })

    const contacts = useContactPicker(notify)
    await contacts.pickContact()

    expect(contacts.selectedContact.value?.name?.[0]).toBe('Alice')
    expect(select).toHaveBeenCalled()
  })

  it('shares app when share API is available', async () => {
    const notify = vi.fn()
    const share = vi.fn().mockResolvedValue(undefined)

    Object.defineProperty(navigator, 'share', {
      value: share,
      configurable: true,
      writable: true,
    })

    const webShare = useWebShare(notify)
    await webShare.shareApp()

    expect(share).toHaveBeenCalled()
    expect(notify).toHaveBeenCalledWith('Partage', 'Application partagee avec succes !')
  })
})
