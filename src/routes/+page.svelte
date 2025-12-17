<script lang="ts">
  import { Button, Card, Badge } from '$lib/components/ui';
  import { Trophy, Users, Calendar, Zap, ArrowRight, Play } from 'lucide-svelte';
</script>

<!-- Hero Section -->
<section class="py-16 md:py-24 px-4">
  <div class="max-w-7xl mx-auto text-center">
    <Badge variant="info" class="mb-6">
      100% Gratuit
    </Badge>

    <h1 class="heading-1 text-4xl md:text-5xl lg:text-6xl mb-6">
      Le labo des tournois<br />
      <span class="text-accent">de bad</span>
    </h1>

    <p class="text-body text-lg md:text-xl text-text-secondary max-w-2xl mx-auto mb-8">
      Outil web gratuit, simple et moderne pour gerer vos tournois de badminton internes.
      Du mini-tournoi de 8 joueurs aux grandes competitions de club.
    </p>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <a href="/tournament/create">
        <Button size="lg">
          <Play class="size-5" />
          Creer un tournoi
        </Button>
      </a>
      <a href="/dashboard">
        <Button variant="secondary" size="lg">
          Voir mes tournois
          <ArrowRight class="size-5" />
        </Button>
      </a>
    </div>
  </div>
</section>

<!-- Features Section -->
<section class="py-16 bg-bg-secondary">
  <div class="max-w-7xl mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="heading-2 text-3xl md:text-4xl mb-4">
        Tout ce dont vous avez besoin
      </h2>
      <p class="text-body text-text-secondary max-w-xl mx-auto">
        BadLab s'adapte a tous vos besoins, du tournoi rapide pendant l'entrainement
        aux competitions de club avec 100+ participants.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Feature 1 -->
      <Card hover={false} class="text-center">
        <div class="size-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Zap class="size-6 text-accent" />
        </div>
        <h3 class="heading-3 mb-2">Setup en 3 minutes</h3>
        <p class="text-small text-text-secondary">
          Creez votre tournoi rapidement avec notre assistant de configuration intuitif.
        </p>
      </Card>

      <!-- Feature 2 -->
      <Card hover={false} class="text-center">
        <div class="size-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Trophy class="size-6 text-accent" />
        </div>
        <h3 class="heading-3 mb-2">Formats flexibles</h3>
        <p class="text-small text-text-secondary">
          Elimination directe, poules + elimination, round-robin... Vous choisissez.
        </p>
      </Card>

      <!-- Feature 3 -->
      <Card hover={false} class="text-center">
        <div class="size-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Users class="size-6 text-accent" />
        </div>
        <h3 class="heading-3 mb-2">Inscription facile</h3>
        <p class="text-small text-text-secondary">
          Partagez un lien et les joueurs s'inscrivent eux-memes. Zero friction.
        </p>
      </Card>

      <!-- Feature 4 -->
      <Card hover={false} class="text-center">
        <div class="size-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
          <Calendar class="size-6 text-accent" />
        </div>
        <h3 class="heading-3 mb-2">Temps reel</h3>
        <p class="text-small text-text-secondary">
          Resultats en direct, tableaux mis a jour automatiquement, mode affichage mural.
        </p>
      </Card>
    </div>
  </div>
</section>

<!-- CTA Section -->
<section class="py-16 md:py-24 px-4">
  <div class="max-w-3xl mx-auto text-center">
    <div class="size-16 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-6">
      <Trophy class="size-8 text-white" />
    </div>

    <h2 class="heading-2 text-3xl md:text-4xl mb-4">
      Pret a organiser votre tournoi ?
    </h2>

    <p class="text-body text-text-secondary mb-8">
      Rejoignez les clubs qui utilisent BadLab pour gerer leurs tournois internes.
      C'est gratuit, sans engagement, et ca prend moins de 3 minutes.
    </p>

    <a href="/tournament/create">
      <Button size="lg">
        <Play class="size-5" />
        Commencer maintenant
      </Button>
    </a>
  </div>
</section>
