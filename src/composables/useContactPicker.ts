import { ref } from 'vue'

type ContactPickerContact = { name?: string[]; tel?: string[]; email?: string[] }

type ContactPickerNavigator = Navigator & {
  contacts: {
    select(
      properties: Array<'name' | 'tel' | 'email'>,
      options: { multiple: boolean },
    ): Promise<ContactPickerContact[]>
  }
}

export function useContactPicker(onNotify: (title: string, body: string) => void) {
  const selectedContact = ref<ContactPickerContact | null>(null)
  const contactPickerSupported = ref(typeof navigator !== 'undefined' && 'contacts' in navigator)

  const pickContact = async () => {
    try {
      const [contact] = await (navigator as ContactPickerNavigator).contacts.select(
        ['name', 'tel', 'email'],
        {
          multiple: false,
        },
      )

      if (!contact) {
        onNotify('Contact Picker', 'Aucun contact selectionne.')
        return
      }

      selectedContact.value = contact
      const contactName = contact.name?.[0] || 'Inconnu'
      onNotify('Contact Picker', `Contact selectionne : ${contactName}`)
    } catch {
      onNotify('Contact Picker', 'Aucun contact selectionne ou erreur.')
    }
  }

  return {
    selectedContact,
    contactPickerSupported,
    pickContact,
  }
}
