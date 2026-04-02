import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../App.vue'

describe('App', () => {
  it('mounts and renders the application', () => {
    const wrapper = mount(App)
    expect(wrapper.exists()).toBe(true)
  })

  it('contains a navbar component', () => {
    const wrapper = mount(App)
    expect(wrapper.text()).toContain('VueApp')
  })

  it('contains router view for page transitions', () => {
    const wrapper = mount(App)
    // Vérifie que le composant App contient un RouterView
    expect(wrapper.findComponent({ name: 'RouterView' }).exists()).toBe(true)
  })

  it('contains a Toaster component', () => {
    const wrapper = mount(App)
    // Vérifies que le Toaster est présent pour les notifications
    expect(wrapper.findComponent({ name: 'Toaster' }).exists()).toBe(true)
  })
})
