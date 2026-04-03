import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'
import router from '../router'

async function mountApp() {
  await router.push('/')
  await router.isReady()

  return mount(App, {
    global: {
      plugins: [router],
    },
  })
}

describe('App', () => {
  it('mounts and renders the application', async () => {
    const wrapper = await mountApp()
    expect(wrapper.exists()).toBe(true)
  })

  it('contains a navbar component', async () => {
    const wrapper = await mountApp()
    expect(wrapper.text()).toContain('VueApp')
  })

  it('contains router view for page transitions', async () => {
    const wrapper = await mountApp()
    // Vérifie que le composant App contient un RouterView
    expect(wrapper.findComponent({ name: 'RouterView' }).exists()).toBe(true)
  })

  it('contains a Toaster component', async () => {
    const wrapper = await mountApp()
    // Vérifies que le Toaster est présent pour les notifications
    expect(wrapper.findComponent({ name: 'Toaster' }).exists()).toBe(true)
  })
})
