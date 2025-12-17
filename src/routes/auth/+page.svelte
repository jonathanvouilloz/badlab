<script lang="ts">
  import { Button } from '$lib/components/ui';
  import { SocialButton } from '$lib/components/auth';
  import { Trophy, Mail, UserPlus, ArrowLeft } from 'lucide-svelte';
</script>

<div class="min-h-[calc(100vh-200px)] flex">
  <!-- Left side - Decorative gradient (hidden on mobile) -->
  <div class="hidden md:flex md:w-1/2 bg-gradient-to-br from-accent to-accent/70 relative overflow-hidden">
    <!-- Decorative shapes -->
    <div class="absolute top-20 left-10 size-32 rounded-full bg-white/10"></div>
    <div class="absolute top-40 right-20 size-20 rounded-full bg-white/5"></div>
    <div class="absolute bottom-32 left-1/4 size-40 rounded-full bg-white/10"></div>
    <div class="absolute bottom-20 right-10 size-24 rounded-full bg-white/5"></div>
    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-64 rounded-full bg-white/5"></div>

    <!-- Decorative lines -->
    <div class="absolute top-1/4 left-0 w-full h-px bg-white/10"></div>
    <div class="absolute top-3/4 left-0 w-full h-px bg-white/10"></div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col justify-center items-center w-full px-12 text-white">
      <div class="flex items-center gap-3 mb-6">
        <div class="size-14 rounded-xl bg-white/20 flex items-center justify-center">
          <Trophy class="size-8" />
        </div>
        <span class="text-3xl font-bold">BadLab</span>
      </div>

      <p class="text-xl text-white/90 text-center max-w-sm">
        Gerez vos tournois de badminton simplement et efficacement
      </p>

      <div class="mt-12 grid grid-cols-2 gap-6 text-center">
        <div>
          <div class="text-3xl font-bold">100%</div>
          <div class="text-white/70 text-sm">Gratuit</div>
        </div>
        <div>
          <div class="text-3xl font-bold">3 min</div>
          <div class="text-white/70 text-sm">Setup</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Right side - Auth options -->
  <div class="w-full md:w-1/2 flex items-center justify-center px-6 py-12 bg-bg-secondary md:bg-bg-primary">
    <div class="w-full max-w-md">
      <!-- Mobile logo (shown only on mobile) -->
      <div class="flex md:hidden items-center justify-center gap-2 mb-8">
        <div class="size-10 rounded-lg bg-accent flex items-center justify-center">
          <Trophy class="size-5 text-white" />
        </div>
        <span class="text-xl font-bold text-text-primary">BadLab</span>
      </div>

      <div class="text-center mb-8">
        <h1 class="heading-1 text-text-primary mb-2">
          Bienvenue sur BadLab
        </h1>
        <p class="text-body text-text-secondary">
          Connectez-vous pour gerer vos tournois de badminton
        </p>
      </div>

      <div class="space-y-4">
        <!-- Google Sign In -->
        <SocialButton provider="google" disabled={true} />

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-border"></div>
          </div>
          <div class="relative flex justify-center">
            <span class="text-small px-4 bg-bg-secondary md:bg-bg-primary text-text-muted">ou</span>
          </div>
        </div>

        <!-- Email options -->
        <a href="/auth/login" class="block">
          <Button variant="primary" class="w-full justify-center">
            <Mail class="size-5" />
            Se connecter avec email
          </Button>
        </a>

        <a href="/auth/register" class="block">
          <Button variant="secondary" class="w-full justify-center">
            <UserPlus class="size-5" />
            Creer un compte
          </Button>
        </a>
      </div>

      <!-- Back to home -->
      <div class="mt-8 text-center">
        <a
          href="/"
          class="inline-flex items-center gap-2 text-small text-text-secondary hover:text-text-primary transition-colors duration-200"
        >
          <ArrowLeft class="size-4" />
          Retour a l'accueil
        </a>
      </div>
    </div>
  </div>
</div>
