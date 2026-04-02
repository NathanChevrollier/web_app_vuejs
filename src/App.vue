<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import { Toaster } from '@/components/ui/toast'
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <NavBar />

    <main class="max-w-7xl mx-auto py-8 px-4">
      <RouterView v-slot="{ Component }">
        <transition name="page" mode="out-in" appear>
          <component :is="Component" />
        </transition>
      </RouterView>
    </main>

    <Toaster />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
