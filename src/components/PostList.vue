<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Post {
  id: number
  title: string
  body: string
}

const posts = ref<Post[]>([])
const loading = ref(true)
const error = ref('')

async function fetchPosts() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5')
    if (!response.ok) throw new Error('Erreur lors de la récupération des articles')
    posts.value = await response.json()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Une erreur est survenue'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchPosts()
})
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-bold mb-4 flex items-center gap-2">
      <span>📰</span> Derniers articles (API)
    </h1>
    <div v-if="loading" class="flex flex-col items-center justify-center py-10">
      <span class="animate-pulse text-muted-foreground">Chargement des articles...</span>
    </div>
    <div v-else-if="error" class="text-destructive font-semibold">{{ error }}</div>
    <div v-else class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card
        v-for="post in posts"
        :key="post.id"
        class="flex flex-col h-full hover:shadow-lg transition-shadow border"
      >
        <CardHeader>
          <CardTitle class="text-lg leading-tight line-clamp-2">{{ post.title }}</CardTitle>
        </CardHeader>
        <CardContent class="flex-grow pt-0 text-muted-foreground text-sm">
          {{ post.body.substring(0, 100) }}...
        </CardContent>
      </Card>
    </div>
  </div>
</template>
