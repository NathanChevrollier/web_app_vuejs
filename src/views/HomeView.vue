<template>
  <section class="flex flex-col items-center justify-center min-h-[60vh] py-12">
    <div class="w-full max-w-2xl text-center mb-10">
      <h1 class="text-5xl font-extrabold tracking-tight mb-4">
        Bienvenue sur <span class="text-primary">VueApp</span>
      </h1>
      <p class="text-lg text-muted-foreground mb-6">
        Une application moderne Vue 3 propulsée par
        <span class="font-semibold">shadcn/vue</span>.<br />
        Découvrez les meilleures pratiques UI/UX, l'intégration d'APIs natives et des composants
        réutilisables.
      </p>
      <router-link to="/form">
        <button class="btn-primary text-lg">Tester le formulaire</button>
      </router-link>
    </div>
    <div class="grid gap-8 md:grid-cols-2 xl:grid-cols-4 w-full max-w-6xl">
      <div class="card-section">
        <h3 class="section-title flex items-center gap-2">
          <span>📝</span> Formulaire Multi-étapes
        </h3>
        <p class="section-desc">
          Un formulaire progressif avec validation et feedback utilisateur.
        </p>
        <router-link to="/form" class="text-primary hover:underline font-medium"
          >Accéder →</router-link
        >
      </div>
      <div class="card-section">
        <h3 class="section-title flex items-center gap-2"><span>📦</span> Appels API REST</h3>
        <p class="section-desc">Récupération de données asynchrones et affichage dynamique.</p>
        <router-link to="/posts" class="text-primary hover:underline font-medium"
          >Voir les articles →</router-link
        >
      </div>
      <div class="card-section">
        <h3 class="section-title flex items-center gap-2">
          <span>⚡</span> Ressources & APIs Internes
        </h3>
        <p class="section-desc">Stockage, notifications, géolocalisation, touch events et plus !</p>
        <router-link to="/resources" class="text-primary hover:underline font-medium"
          >Explorer →</router-link
        >
      </div>

      <div class="card-section">
        <h3 class="section-title flex items-center gap-2"><span>🧪</span> Mini API REST Express</h3>
        <p class="section-desc">Crée, modifie et supprime des items pour tester les endpoints.</p>
        <router-link to="/api-test" class="text-primary hover:underline font-medium"
          >Tester l'API →</router-link
        >
      </div>
    </div>
  </section>
</template>
