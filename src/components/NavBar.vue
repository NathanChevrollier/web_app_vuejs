<script setup lang="ts">
import { RouterLink } from 'vue-router'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
  >
    <div class="container flex h-16 items-center justify-between mx-auto px-4">
      <div class="mr-4 flex items-center space-x-2">
        <RouterLink to="/" class="flex items-center space-x-2">
          <span class="inline-block font-bold text-xl tracking-tight text-primary">VueApp.</span>
        </RouterLink>
      </div>

      <nav class="flex items-center space-x-2">
        <NavigationMenu>
          <NavigationMenuList class="space-x-1">
            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <RouterLink
                  to="/"
                  :class="[
                    navigationMenuTriggerStyle(),
                    'px-4 py-2 transition-colors hover:text-primary',
                  ]"
                  active-class="bg-accent text-accent-foreground font-medium"
                >
                  Accueil
                </RouterLink>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <RouterLink
                  to="/form"
                  :class="[
                    navigationMenuTriggerStyle(),
                    'px-4 py-2 transition-colors hover:text-primary',
                  ]"
                  active-class="bg-accent text-accent-foreground font-medium"
                >
                  Formulaire
                </RouterLink>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <RouterLink
                  to="/posts"
                  :class="[
                    navigationMenuTriggerStyle(),
                    'px-4 py-2 transition-colors hover:text-primary',
                  ]"
                  active-class="bg-accent text-accent-foreground font-medium"
                >
                  Articles
                </RouterLink>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink as-child>
                <RouterLink
                  to="/resources"
                  :class="[
                    navigationMenuTriggerStyle(),
                    'px-4 py-2 transition-colors hover:text-primary',
                  ]"
                  active-class="bg-accent text-accent-foreground font-medium"
                >
                  Ressources API
                </RouterLink>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </nav>

      <div class="flex items-center space-x-4">
        <a
          href="https://github.com"
          target="_blank"
          class="text-sm font-medium text-muted-foreground hover:text-primary transition-colors hidden sm:block"
        >
          GitHub
        </a>
      </div>
    </div>
  </header>
</template>
