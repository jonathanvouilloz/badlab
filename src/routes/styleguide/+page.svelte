<script lang="ts">
  import { Button, Input, Card, Badge, Modal, ConfirmModal } from '$lib/components/ui';
  import { toasts } from '$lib/stores/toast';
  import {
    Plus,
    Trophy,
    Users,
    Calendar,
    Check,
    AlertTriangle,
    Info,
    X,
    ChevronRight,
    Home,
    MapPin,
    Play,
    Settings,
    Edit3,
    Trash2
  } from 'lucide-svelte';

  // ==========================================
  // DATA: Couleurs
  // ==========================================
  const backgroundColors = [
    { name: 'bg-primary', cssVar: '--color-bg-primary', value: '#FFFFFF', description: 'Fond principal (blanc)' },
    { name: 'bg-secondary', cssVar: '--color-bg-secondary', value: '#F9FAFB', description: 'Fond secondaire' },
    { name: 'bg-tertiary', cssVar: '--color-bg-tertiary', value: '#F3F4F6', description: 'Fond tertiaire' }
  ];

  const textColors = [
    { name: 'text-primary', cssVar: '--color-text-primary', value: '#111827', description: 'Texte principal' },
    { name: 'text-secondary', cssVar: '--color-text-secondary', value: '#6B7280', description: 'Texte secondaire' },
    { name: 'text-muted', cssVar: '--color-text-muted', value: '#9CA3AF', description: 'Texte muted' }
  ];

  const accentColors = [
    { name: 'accent', cssVar: '--color-accent', value: '#3730A3', description: 'Accent principal (indigo)' },
    { name: 'accent-hover', cssVar: '--color-accent-hover', value: '#312E81', description: 'Accent hover' },
    { name: 'accent-light', cssVar: '--color-accent-light', value: '#E0E7FF', description: 'Accent clair' }
  ];

  const statusColors = [
    { name: 'success', cssVar: '--color-success', value: '#059669', description: 'Succes' },
    { name: 'warning', cssVar: '--color-warning', value: '#F59E0B', description: 'Warning' },
    { name: 'danger', cssVar: '--color-danger', value: '#DC2626', description: 'Danger / Erreur' },
    { name: 'info', cssVar: '--color-info', value: '#3B82F6', description: 'Info' }
  ];

  const borderColors = [
    { name: 'border', cssVar: '--color-border', value: '#E5E7EB', description: 'Bordure standard' },
    { name: 'border-strong', cssVar: '--color-border-strong', value: '#D1D5DB', description: 'Bordure accentuee' },
    { name: 'border-accent', cssVar: '--color-border-accent', value: '#3730A3', description: 'Bordure accent' }
  ];

  // ==========================================
  // DATA: Typographie
  // ==========================================
  const typographyScale = [
    { name: 'Heading 1', class: 'heading-1', weight: '', usage: 'Titres de page (32px, semibold, -0.02em)' },
    { name: 'Heading 2', class: 'heading-2', weight: '', usage: 'Titres de section (24px, semibold, -0.01em)' },
    { name: 'Heading 3', class: 'heading-3', weight: '', usage: 'Titres de cartes (18px, semibold)' },
    { name: 'Body', class: 'text-body', weight: '', usage: 'Texte principal (16px, regular, lh 1.5)' },
    { name: 'Small', class: 'text-small', weight: '', usage: 'Metadonnees (14px, regular)' },
    { name: 'Caption', class: 'text-caption', weight: '', usage: 'Labels uppercase (12px, medium, 0.05em)' },
    { name: 'Button', class: 'text-button', weight: '', usage: 'Texte boutons (14px, medium)' },
    { name: 'Label', class: 'text-label', weight: '', usage: 'Labels formulaires (14px, medium)' },
    { name: 'Numbers', class: 'text-numbers', weight: '', usage: 'Nombres et scores (semibold, tabular-nums)' }
  ];

  // ==========================================
  // DATA: Espacements
  // ==========================================
  const spacingScale = [
    { name: '1', value: '0.25rem', px: '4px' },
    { name: '2', value: '0.5rem', px: '8px' },
    { name: '3', value: '0.75rem', px: '12px' },
    { name: '4', value: '1rem', px: '16px' },
    { name: '6', value: '1.5rem', px: '24px' },
    { name: '8', value: '2rem', px: '32px' },
    { name: '12', value: '3rem', px: '48px' },
    { name: '16', value: '4rem', px: '64px' }
  ];

  // ==========================================
  // DATA: Navigation
  // ==========================================
  const sections = [
    {
      id: 'theme',
      label: 'Theme',
      subsections: [
        { id: 'colors', label: 'Couleurs' },
        { id: 'typography', label: 'Typographie' },
        { id: 'spacing', label: 'Espacements' }
      ]
    },
    {
      id: 'components',
      label: 'Composants',
      subsections: [
        { id: 'buttons', label: 'Boutons' },
        { id: 'forms', label: 'Formulaires' },
        { id: 'cards', label: 'Cartes' },
        { id: 'badges', label: 'Badges & Tags' },
        { id: 'feedback', label: 'Feedback' },
        { id: 'data', label: 'Donnees' },
        { id: 'navigation', label: 'Navigation' }
      ]
    },
    {
      id: 'patterns',
      label: 'Patterns',
      subsections: [
        { id: 'hover', label: 'Hover' },
        { id: 'focus', label: 'Focus' },
        { id: 'transitions', label: 'Transitions' },
        { id: 'responsive', label: 'Responsive' }
      ]
    }
  ];

  // ==========================================
  // STATE: Demos interactives
  // ==========================================
  let showModal = $state(false);
  let showConfirmModal = $state(false);
  let inputValue = $state('');
  let inputErrorValue = $state('email-invalide');
  let selectedTab = $state(0);

  // ==========================================
  // FUNCTIONS: Toast demos
  // ==========================================
  function showSuccessToast() {
    toasts.success('Action reussie !');
  }
  function showErrorToast() {
    toasts.error('Une erreur est survenue');
  }
  function showWarningToast() {
    toasts.warning('Attention !');
  }
  function showInfoToast() {
    toasts.info('Information importante');
  }
</script>

<svelte:head>
  <title>Styleguide - BadLab</title>
  <meta name="description" content="Documentation des composants UI de BadLab" />
</svelte:head>

<div class="max-w-7xl mx-auto px-4 py-8">
  <div class="flex gap-8">
    <!-- ==========================================
         SIDEBAR NAVIGATION
         ========================================== -->
    <aside class="hidden lg:block w-64 shrink-0">
      <nav class="sticky top-24 space-y-6">
        {#each sections as section}
          <div>
            <a
              href="#{section.id}"
              class="font-semibold text-text-primary hover:text-accent transition-colors"
            >
              {section.label}
            </a>
            <ul class="mt-2 ml-4 space-y-1">
              {#each section.subsections as sub}
                <li>
                  <a
                    href="#{sub.id}"
                    class="text-sm text-text-secondary hover:text-accent transition-colors"
                  >
                    {sub.label}
                  </a>
                </li>
              {/each}
            </ul>
          </div>
        {/each}
      </nav>
    </aside>

    <!-- ==========================================
         MAIN CONTENT
         ========================================== -->
    <main class="flex-1 min-w-0 space-y-16">
      <!-- ==========================================
           PAGE HEADER
           ========================================== -->
      <header>
        <h1 class="heading-1 text-text-primary mb-4">
          BadLab Styleguide
        </h1>
        <p class="text-body text-text-secondary max-w-2xl">
          Documentation des composants, couleurs et patterns utilises dans BadLab.
          Reference basee sur le design system defini dans STYLEGUIDE.md
        </p>
      </header>

      <!-- ==========================================
           THEME SECTION
           ========================================== -->
      <section id="theme" class="scroll-mt-20">
        <h2 class="heading-2 text-text-primary mb-8 pb-4 border-b border-border">
          Theme
        </h2>

        <!-- COULEURS -->
        <div id="colors" class="scroll-mt-20 mb-12">
          <h3 class="heading-3 text-text-primary mb-6">Couleurs</h3>

          <!-- Backgrounds -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Backgrounds</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {#each backgroundColors as color}
                <div class="space-y-2">
                  <div
                    class="h-20 w-full rounded-lg border border-border shadow-sm"
                    style:background-color={color.value}
                  ></div>
                  <div>
                    <p class="text-sm font-medium text-text-primary">{color.name}</p>
                    <p class="text-xs text-text-muted font-mono">{color.cssVar}</p>
                    <p class="text-xs text-text-secondary">{color.value}</p>
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <!-- Text Colors -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Texte</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {#each textColors as color}
                <div class="space-y-2">
                  <div
                    class="h-20 w-full rounded-lg border border-border shadow-sm"
                    style:background-color={color.value}
                  ></div>
                  <div>
                    <p class="text-sm font-medium text-text-primary">{color.name}</p>
                    <p class="text-xs text-text-muted font-mono">{color.cssVar}</p>
                    <p class="text-xs text-text-secondary">{color.value}</p>
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <!-- Accent Colors -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Accent (Indigo)</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {#each accentColors as color}
                <div class="space-y-2">
                  <div
                    class="h-20 w-full rounded-lg border border-border shadow-sm"
                    style:background-color={color.value}
                  ></div>
                  <div>
                    <p class="text-sm font-medium text-text-primary">{color.name}</p>
                    <p class="text-xs text-text-muted font-mono">{color.cssVar}</p>
                    <p class="text-xs text-text-secondary">{color.value}</p>
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <!-- Status Colors -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Statuts</h4>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {#each statusColors as color}
                <div class="space-y-2">
                  <div
                    class="h-20 w-full rounded-lg border border-border shadow-sm"
                    style:background-color={color.value}
                  ></div>
                  <div>
                    <p class="text-sm font-medium text-text-primary">{color.name}</p>
                    <p class="text-xs text-text-muted font-mono">{color.cssVar}</p>
                    <p class="text-xs text-text-secondary">{color.value}</p>
                  </div>
                </div>
              {/each}
            </div>
          </div>

          <!-- Border Colors -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Bordures</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {#each borderColors as color}
                <div class="space-y-2">
                  <div
                    class="h-20 w-full rounded-lg border-4 shadow-sm bg-white"
                    style:border-color={color.value}
                  ></div>
                  <div>
                    <p class="text-sm font-medium text-text-primary">{color.name}</p>
                    <p class="text-xs text-text-muted font-mono">{color.cssVar}</p>
                    <p class="text-xs text-text-secondary">{color.value}</p>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>

        <!-- TYPOGRAPHIE -->
        <div id="typography" class="scroll-mt-20 mb-12">
          <h3 class="heading-3 text-text-primary mb-6">Typographie</h3>

          <!-- Font Family -->
          <div class="mb-8 p-6 bg-bg-secondary rounded-xl">
            <h4 class="text-lg font-semibold text-text-primary mb-2">Font: Inter</h4>
            <p class="text-text-secondary mb-4">
              Police principale - Moderne, lisible, professionnelle
            </p>
            <div class="flex flex-wrap gap-4">
              <span class="font-normal">Regular (400)</span>
              <span class="font-medium">Medium (500)</span>
              <span class="font-semibold">Semibold (600)</span>
            </div>
          </div>

          <!-- Scale -->
          <div class="space-y-6">
            {#each typographyScale as item}
              <div class="p-4 border border-border rounded-lg">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                  <span class="text-sm font-medium text-accent">{item.name}</span>
                  <code class="text-xs bg-bg-tertiary px-2 py-1 rounded text-text-secondary">
                    .{item.class}
                  </code>
                </div>
                <p class="{item.class} text-text-primary">
                  {item.name === 'Numbers' ? '1,234,567.89' : 'Exemple de texte'}
                </p>
                <p class="text-xs text-text-muted mt-2">{item.usage}</p>
              </div>
            {/each}
          </div>
        </div>

        <!-- ESPACEMENTS -->
        <div id="spacing" class="scroll-mt-20">
          <h3 class="heading-3 text-text-primary mb-6">Espacements</h3>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {#each spacingScale as space}
              <div class="text-center">
                <div class="h-24 flex items-end justify-center mb-2">
                  <div
                    class="bg-accent rounded"
                    style:width={space.value}
                    style:height={space.value}
                  ></div>
                </div>
                <p class="text-sm font-semibold text-text-primary">space-{space.name}</p>
                <p class="text-xs text-text-muted">{space.value} / {space.px}</p>
              </div>
            {/each}
          </div>
        </div>
      </section>

      <!-- ==========================================
           COMPONENTS SECTION
           ========================================== -->
      <section id="components" class="scroll-mt-20">
        <h2 class="heading-2 text-text-primary mb-8 pb-4 border-b border-border">
          Composants
        </h2>

        <!-- BOUTONS -->
        <div id="buttons" class="scroll-mt-20 mb-12">
          <h3 class="heading-3 text-text-primary mb-6">Boutons</h3>

          <!-- Variants -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Variants</h4>
            <div class="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </div>

          <!-- Sizes -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Tailles</h4>
            <div class="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </div>

          <!-- With Icons -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Avec icones</h4>
            <div class="flex flex-wrap gap-4">
              <Button><Plus class="size-5" /> Nouveau</Button>
              <Button variant="secondary"><Trophy class="size-5" /> Tournoi</Button>
              <Button variant="ghost"><Settings class="size-5" /> Parametres</Button>
              <Button variant="danger"><Trash2 class="size-5" /> Supprimer</Button>
            </div>
          </div>

          <!-- States -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Etats</h4>
            <div class="flex flex-wrap gap-4">
              <Button>Normal</Button>
              <Button disabled>Disabled</Button>
            </div>
          </div>
        </div>

        <!-- FORMULAIRES -->
        <div id="forms" class="scroll-mt-20 mb-12">
          <h3 class="heading-3 text-text-primary mb-6">Formulaires</h3>

          <!-- Input -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Input</h4>
            <div class="grid md:grid-cols-2 gap-6">
              <Input
                label="Nom du tournoi"
                placeholder="Open du Club 2024"
                hint="Choisissez un nom clair et descriptif"
                bind:value={inputValue}
              />
              <Input
                label="Email"
                type="email"
                error="Email invalide"
                bind:value={inputErrorValue}
              />
              <Input
                label="Champ requis"
                placeholder="Ce champ est obligatoire"
                required
              />
              <Input
                label="Champ desactive"
                disabled
                value="Non modifiable"
              />
            </div>
          </div>

          <!-- Textarea -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Textarea</h4>
            <div class="max-w-lg">
              <div class="space-y-1.5">
                <label for="demo-textarea" class="block text-sm font-medium text-text-primary">Description</label>
                <textarea
                  id="demo-textarea"
                  class="textarea textarea-bordered w-full bg-white text-text-primary placeholder:text-text-muted focus:border-accent focus:ring-2 focus:ring-accent focus:outline-none transition-colors duration-200"
                  rows="4"
                  placeholder="Decrivez votre tournoi..."
                ></textarea>
                <p class="text-xs text-text-muted">Maximum 500 caracteres</p>
              </div>
            </div>
          </div>

          <!-- Select -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Select</h4>
            <div class="max-w-lg">
              <div class="space-y-1.5">
                <label for="demo-select" class="block text-sm font-medium text-text-primary">Format du tournoi</label>
                <select id="demo-select" class="select select-bordered w-full bg-white text-text-primary focus:border-accent focus:ring-2 focus:ring-accent focus:outline-none transition-colors duration-200">
                  <option>Elimination directe</option>
                  <option>Poules + Elimination</option>
                  <option>Round-Robin</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Checkbox -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Checkbox</h4>
            <div class="space-y-3 max-w-lg">
              <label class="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" class="checkbox checkbox-accent mt-0.5" checked />
                <div>
                  <span class="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">Inscription ouverte</span>
                  <p class="text-xs text-text-muted">Les joueurs peuvent s'inscrire eux-memes</p>
                </div>
              </label>
              <label class="flex items-start gap-3 cursor-pointer group">
                <input type="checkbox" class="checkbox checkbox-accent mt-0.5" />
                <div>
                  <span class="text-sm font-medium text-text-primary group-hover:text-accent transition-colors">Notifications email</span>
                  <p class="text-xs text-text-muted">Recevoir des alertes par email</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Radio Group -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Radio Group</h4>
            <div class="space-y-3 max-w-lg" role="radiogroup" aria-labelledby="radio-group-label">
              <p id="radio-group-label" class="block text-sm font-medium text-text-primary mb-2">Type d'inscription</p>
              <label class="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:border-accent hover:bg-accent/5 has-[:checked]:border-accent has-[:checked]:bg-accent/5 transition-all duration-200">
                <input type="radio" name="inscription-type" class="radio radio-accent mt-0.5" checked />
                <div>
                  <span class="font-semibold text-text-primary">Liste fermee</span>
                  <p class="text-sm text-text-secondary">Vous ajoutez les participants manuellement</p>
                </div>
              </label>
              <label class="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:border-accent hover:bg-accent/5 has-[:checked]:border-accent has-[:checked]:bg-accent/5 transition-all duration-200">
                <input type="radio" name="inscription-type" class="radio radio-accent mt-0.5" />
                <div>
                  <span class="font-semibold text-text-primary">Inscription ouverte</span>
                  <p class="text-sm text-text-secondary">Les joueurs s'inscrivent via un lien</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- CARTES -->
        <div id="cards" class="scroll-mt-20 mb-12">
          <h3 class="heading-3 text-text-primary mb-6">Cartes</h3>

          <!-- Carte Standard -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Carte Standard</h4>
            <div class="max-w-md">
              <Card>
                <h3 class="text-xl font-semibold text-text-primary mb-2">Titre de la carte</h3>
                <p class="text-text-secondary">
                  Contenu de la carte avec du texte descriptif. La carte a un effet hover avec bordure accent.
                </p>
              </Card>
            </div>
          </div>

          <!-- Carte Tournoi -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Carte Tournoi</h4>
            <div class="max-w-md">
              <Card>
                <div class="flex items-start justify-between mb-4">
                  <div class="flex-1">
                    <h3 class="text-xl font-semibold text-text-primary mb-1">
                      Open du Club 2024
                    </h3>
                    <p class="text-sm text-text-secondary">
                      15 mars 2024 - 40 participants
                    </p>
                  </div>
                  <Badge variant="neutral">En cours</Badge>
                </div>
                <div class="flex items-center gap-4 text-sm text-text-secondary mb-4">
                  <span class="inline-flex items-center gap-1">
                    <Play class="size-4" />
                    Elimination directe
                  </span>
                  <span class="inline-flex items-center gap-1">
                    <MapPin class="size-4" />
                    4 terrains
                  </span>
                </div>
                <div class="flex gap-2">
                  <Button class="flex-1">Voir le tournoi</Button>
                  <Button variant="secondary">Modifier</Button>
                </div>
              </Card>
            </div>
          </div>

          <!-- Carte Match -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Carte Match</h4>
            <div class="max-w-sm">
              <div class="bg-white border-l-4 border-l-accent border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div class="flex items-center justify-between mb-3">
                  <span class="text-xs font-semibold text-text-muted uppercase">Match #12</span>
                  <span class="text-xs font-medium text-text-muted">Terrain 2 - ~14h30</span>
                </div>
                <div class="space-y-2 mb-4">
                  <div class="flex items-center justify-between">
                    <span class="font-semibold text-text-primary">John Doe</span>
                    <span class="text-2xl font-bold text-accent">21</span>
                  </div>
                  <div class="h-px bg-border"></div>
                  <div class="flex items-center justify-between">
                    <span class="font-semibold text-text-secondary">Jane Smith</span>
                    <span class="text-2xl font-bold text-text-muted">15</span>
                  </div>
                </div>
                <button class="w-full bg-accent/10 hover:bg-accent hover:text-white text-accent font-semibold px-4 py-2 rounded-lg text-sm transition-colors duration-200">
                  Entrer le score
                </button>
              </div>
            </div>
          </div>

          <!-- Carte avec Header/Footer -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Carte avec Header & Footer</h4>
            <div class="max-w-md">
              <Card>
                {#snippet header()}
                  <div class="flex items-center justify-between">
                    <h3 class="text-lg font-semibold text-text-primary">Configuration</h3>
                    <Settings class="size-5 text-text-muted" />
                  </div>
                {/snippet}
                <p class="text-text-secondary">
                  Contenu principal de la carte avec header et footer.
                </p>
                {#snippet footer()}
                  <div class="flex justify-end gap-2">
                    <Button variant="ghost" size="sm">Annuler</Button>
                    <Button size="sm">Sauvegarder</Button>
                  </div>
                {/snippet}
              </Card>
            </div>
          </div>
        </div>

        <!-- BADGES & TAGS -->
        <div id="badges" class="scroll-mt-20 mb-12">
          <h3 class="heading-3 text-text-primary mb-6">Badges & Tags</h3>

          <!-- Status Badges -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Badges de statut</h4>
            <div class="flex flex-wrap gap-3">
              <Badge variant="success"><Check class="size-3" /> Termine</Badge>
              <Badge variant="info" pulse>En cours</Badge>
              <Badge variant="danger">Erreur</Badge>
              <Badge variant="neutral">Brouillon</Badge>
            </div>
          </div>

          <!-- Number Badge -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Badge numerique</h4>
            <div class="flex items-center gap-4">
              <span class="inline-flex items-center justify-center size-6 text-xs font-bold text-white bg-accent rounded-full">
                40
              </span>
              <span class="inline-flex items-center justify-center size-8 text-sm font-bold text-white bg-danger rounded-full">
                5
              </span>
              <span class="inline-flex items-center justify-center size-10 text-base font-bold text-white bg-info rounded-full">
                99+
              </span>
            </div>
          </div>

          <!-- Tags -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Tags</h4>
            <div class="flex flex-wrap gap-2">
              <span class="inline-block bg-bg-tertiary text-text-secondary text-xs font-medium px-2 py-1 rounded-md">
                Elimination
              </span>
              <span class="inline-block bg-bg-tertiary text-text-secondary text-xs font-medium px-2 py-1 rounded-md">
                Simple
              </span>
              <span class="inline-block bg-bg-tertiary text-text-secondary text-xs font-medium px-2 py-1 rounded-md">
                Mixte
              </span>
              <span class="inline-block bg-bg-tertiary text-text-secondary text-xs font-medium px-2 py-1 rounded-md">
                Double
              </span>
            </div>
          </div>
        </div>

        <!-- FEEDBACK -->
        <div id="feedback" class="scroll-mt-20 mb-12">
          <h3 class="heading-3 text-text-primary mb-6">Feedback</h3>

          <!-- Modals -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Modal</h4>
            <div class="flex flex-wrap gap-4">
              <Button onclick={() => showModal = true}>Ouvrir Modal</Button>
              <Button variant="danger" onclick={() => showConfirmModal = true}>Ouvrir Confirmation</Button>
            </div>
          </div>

          <!-- Toasts -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Toasts</h4>
            <div class="flex flex-wrap gap-4">
              <Button onclick={showSuccessToast}>
                <Check class="size-4" /> Success
              </Button>
              <Button variant="danger" onclick={showErrorToast}>
                <X class="size-4" /> Error
              </Button>
              <Button variant="secondary" onclick={showWarningToast}>
                <AlertTriangle class="size-4" /> Warning
              </Button>
              <Button variant="ghost" onclick={showInfoToast}>
                <Info class="size-4" /> Info
              </Button>
            </div>
          </div>

          <!-- Loading -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Loading</h4>
            <div class="flex items-center gap-6">
              <div class="text-center">
                <span class="loading loading-spinner loading-sm text-accent"></span>
                <p class="text-xs text-text-muted mt-2">Small</p>
              </div>
              <div class="text-center">
                <span class="loading loading-spinner loading-md text-accent"></span>
                <p class="text-xs text-text-muted mt-2">Medium</p>
              </div>
              <div class="text-center">
                <span class="loading loading-spinner loading-lg text-accent"></span>
                <p class="text-xs text-text-muted mt-2">Large</p>
              </div>
            </div>
          </div>

          <!-- Skeleton -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Skeleton</h4>
            <div class="max-w-md">
              <Card hover={false}>
                <div class="animate-pulse">
                  <div class="flex items-start justify-between mb-4">
                    <div class="flex-1">
                      <div class="h-6 bg-bg-tertiary rounded w-3/4 mb-2"></div>
                      <div class="h-4 bg-bg-tertiary rounded w-1/2"></div>
                    </div>
                    <div class="h-6 bg-bg-tertiary rounded-full w-20"></div>
                  </div>
                  <div class="flex gap-4 mb-4">
                    <div class="h-4 bg-bg-tertiary rounded w-24"></div>
                    <div class="h-4 bg-bg-tertiary rounded w-24"></div>
                  </div>
                  <div class="flex gap-2">
                    <div class="h-10 bg-bg-tertiary rounded-lg flex-1"></div>
                    <div class="h-10 bg-bg-tertiary rounded-lg w-24"></div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          <!-- Empty State -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Empty State</h4>
            <div class="flex flex-col items-center justify-center py-12 px-4 text-center bg-bg-secondary rounded-xl">
              <div class="size-16 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                <Trophy class="size-8 text-text-muted" />
              </div>
              <h3 class="text-xl font-semibold text-text-primary mb-2">Aucun tournoi</h3>
              <p class="text-text-secondary mb-6 max-w-sm">
                Creez votre premier tournoi pour commencer
              </p>
              <Button>
                <Plus class="size-5" />
                Creer un tournoi
              </Button>
            </div>
          </div>
        </div>

        <!-- DONNEES -->
        <div id="data" class="scroll-mt-20 mb-12">
          <h3 class="heading-3 text-text-primary mb-6">Donnees</h3>

          <!-- Table -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Table (Grille de poule)</h4>
            <div class="overflow-x-auto">
              <table class="table table-zebra w-full">
                <thead>
                  <tr class="border-b-2 border-border">
                    <th class="text-xs font-semibold text-text-secondary uppercase tracking-wider">Poule A</th>
                    <th class="text-center text-xs font-semibold text-text-secondary uppercase">V</th>
                    <th class="text-center text-xs font-semibold text-text-secondary uppercase">D</th>
                    <th class="text-center text-xs font-semibold text-text-secondary uppercase">Sets</th>
                    <th class="text-center text-xs font-semibold text-text-secondary uppercase">Pts</th>
                  </tr>
                </thead>
                <tbody class="text-text-primary">
                  <tr class="hover">
                    <td class="font-semibold">John Doe</td>
                    <td class="text-center font-bold text-success">3</td>
                    <td class="text-center font-bold text-danger">1</td>
                    <td class="text-center text-text-secondary">6-3</td>
                    <td class="text-center font-bold text-accent">42</td>
                  </tr>
                  <tr class="hover">
                    <td class="font-semibold">Jane Smith</td>
                    <td class="text-center font-bold text-success">2</td>
                    <td class="text-center font-bold text-danger">2</td>
                    <td class="text-center text-text-secondary">5-4</td>
                    <td class="text-center font-bold text-accent">38</td>
                  </tr>
                  <tr class="hover">
                    <td class="font-semibold">Bob Wilson</td>
                    <td class="text-center font-bold text-success">2</td>
                    <td class="text-center font-bold text-danger">2</td>
                    <td class="text-center text-text-secondary">4-5</td>
                    <td class="text-center font-bold text-accent">35</td>
                  </tr>
                  <tr class="hover">
                    <td class="font-semibold">Alice Brown</td>
                    <td class="text-center font-bold text-success">1</td>
                    <td class="text-center font-bold text-danger">3</td>
                    <td class="text-center text-text-secondary">3-6</td>
                    <td class="text-center font-bold text-accent">28</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Stats -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Stats</h4>
            <div class="stats stats-vertical lg:stats-horizontal shadow w-full">
              <div class="stat">
                <div class="stat-figure text-accent">
                  <Trophy class="size-8" />
                </div>
                <div class="stat-title text-text-secondary">Tournois</div>
                <div class="stat-value text-accent">12</div>
                <div class="stat-desc text-text-muted">3 en cours</div>
              </div>
              <div class="stat">
                <div class="stat-figure text-info">
                  <Users class="size-8" />
                </div>
                <div class="stat-title text-text-secondary">Participants</div>
                <div class="stat-value text-info">248</div>
                <div class="stat-desc text-text-muted">+15% ce mois</div>
              </div>
              <div class="stat">
                <div class="stat-figure text-warning">
                  <Calendar class="size-8" />
                </div>
                <div class="stat-title text-text-secondary">Matchs joues</div>
                <div class="stat-value text-warning">1,024</div>
                <div class="stat-desc text-text-muted">Depuis le debut</div>
              </div>
            </div>
          </div>
        </div>

        <!-- NAVIGATION -->
        <div id="navigation" class="scroll-mt-20 mb-12">
          <h3 class="heading-3 text-text-primary mb-6">Navigation</h3>

          <!-- Breadcrumbs -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Breadcrumbs</h4>
            <div class="breadcrumbs text-sm">
              <ul>
                <li><a href="#" class="text-text-secondary hover:text-accent"><Home class="size-4" /></a></li>
                <li><a href="#" class="text-text-secondary hover:text-accent">Tournois</a></li>
                <li><a href="#" class="text-text-secondary hover:text-accent">Open du Club 2024</a></li>
                <li class="text-text-primary font-medium">Bracket</li>
              </ul>
            </div>
          </div>

          <!-- Tabs -->
          <div class="mb-8">
            <h4 class="text-lg font-semibold text-text-primary mb-4">Tabs</h4>
            <div role="tablist" class="tabs tabs-bordered">
              <button
                role="tab"
                class="tab {selectedTab === 0 ? 'tab-active text-accent border-accent' : 'text-text-secondary'}"
                onclick={() => selectedTab = 0}
              >
                Participants
              </button>
              <button
                role="tab"
                class="tab {selectedTab === 1 ? 'tab-active text-accent border-accent' : 'text-text-secondary'}"
                onclick={() => selectedTab = 1}
              >
                Matchs
              </button>
              <button
                role="tab"
                class="tab {selectedTab === 2 ? 'tab-active text-accent border-accent' : 'text-text-secondary'}"
                onclick={() => selectedTab = 2}
              >
                Resultats
              </button>
            </div>
            <div class="p-4 border border-border border-t-0 rounded-b-lg">
              {#if selectedTab === 0}
                <p class="text-text-secondary">Contenu de l'onglet Participants</p>
              {:else if selectedTab === 1}
                <p class="text-text-secondary">Contenu de l'onglet Matchs</p>
              {:else}
                <p class="text-text-secondary">Contenu de l'onglet Resultats</p>
              {/if}
            </div>
          </div>
        </div>
      </section>

      <!-- ==========================================
           PATTERNS SECTION
           ========================================== -->
      <section id="patterns" class="scroll-mt-20">
        <h2 class="heading-2 text-text-primary mb-8 pb-4 border-b border-border">
          Patterns
        </h2>

        <!-- HOVER -->
        <div id="hover" class="scroll-mt-20 mb-12">
          <h3 class="heading-3 text-text-primary mb-6">Hover Effects</h3>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <p class="text-sm text-text-secondary mb-3">Carte avec hover (bordure + ombre)</p>
              <Card>
                <p class="text-text-primary">Survolez cette carte</p>
              </Card>
            </div>
            <div>
              <p class="text-sm text-text-secondary mb-3">Bouton avec hover</p>
              <Button>Survolez ce bouton</Button>
            </div>
          </div>
        </div>

        <!-- FOCUS -->
        <div id="focus" class="scroll-mt-20 mb-12">
          <h3 class="heading-3 text-text-primary mb-6">Focus States</h3>
          <p class="text-text-secondary mb-4">
            Utilisez Tab pour naviguer et voir les etats de focus
          </p>
          <div class="flex flex-wrap gap-4">
            <Button>Bouton focusable</Button>
            <Input placeholder="Input focusable" />
          </div>
          <div class="mt-4 p-4 bg-bg-secondary rounded-lg">
            <code class="text-sm text-text-secondary">
              focus:ring-2 focus:ring-accent focus:ring-offset-2
            </code>
          </div>
        </div>

        <!-- TRANSITIONS -->
        <div id="transitions" class="scroll-mt-20 mb-12">
          <h3 class="heading-3 text-text-primary mb-6">Transitions</h3>
          <div class="space-y-4">
            <div class="p-4 bg-bg-secondary rounded-lg">
              <p class="text-sm font-medium text-text-primary mb-2">Duree standard</p>
              <code class="text-sm text-text-secondary">transition-colors duration-200</code>
            </div>
            <div class="p-4 bg-bg-secondary rounded-lg">
              <p class="text-sm font-medium text-text-primary mb-2">Transition complete</p>
              <code class="text-sm text-text-secondary">transition-all duration-200</code>
            </div>
            <div class="p-4 bg-bg-secondary rounded-lg">
              <p class="text-sm font-medium text-text-primary mb-2">Ombre seule</p>
              <code class="text-sm text-text-secondary">transition-shadow duration-200</code>
            </div>
          </div>
        </div>

        <!-- RESPONSIVE -->
        <div id="responsive" class="scroll-mt-20 mb-12">
          <h3 class="heading-3 text-text-primary mb-6">Responsive Breakpoints</h3>
          <div class="overflow-x-auto">
            <table class="table w-full">
              <thead>
                <tr class="border-b-2 border-border">
                  <th class="text-text-secondary">Breakpoint</th>
                  <th class="text-text-secondary">Min Width</th>
                  <th class="text-text-secondary">CSS</th>
                </tr>
              </thead>
              <tbody class="text-text-primary">
                <tr>
                  <td class="font-mono font-semibold">sm</td>
                  <td>640px</td>
                  <td class="font-mono text-sm">@media (min-width: 640px)</td>
                </tr>
                <tr>
                  <td class="font-mono font-semibold">md</td>
                  <td>768px</td>
                  <td class="font-mono text-sm">@media (min-width: 768px)</td>
                </tr>
                <tr>
                  <td class="font-mono font-semibold">lg</td>
                  <td>1024px</td>
                  <td class="font-mono text-sm">@media (min-width: 1024px)</td>
                </tr>
                <tr>
                  <td class="font-mono font-semibold">xl</td>
                  <td>1280px</td>
                  <td class="font-mono text-sm">@media (min-width: 1280px)</td>
                </tr>
                <tr>
                  <td class="font-mono font-semibold">2xl</td>
                  <td>1536px</td>
                  <td class="font-mono text-sm">@media (min-width: 1536px)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Current Breakpoint Indicator -->
          <div class="mt-6 p-4 bg-accent/10 border border-accent rounded-lg">
            <p class="text-sm font-medium text-accent mb-2">Breakpoint actuel:</p>
            <p class="text-2xl font-bold text-accent">
              <span class="sm:hidden">Mobile (&lt;640px)</span>
              <span class="hidden sm:inline md:hidden">sm (640px+)</span>
              <span class="hidden md:inline lg:hidden">md (768px+)</span>
              <span class="hidden lg:inline xl:hidden">lg (1024px+)</span>
              <span class="hidden xl:inline 2xl:hidden">xl (1280px+)</span>
              <span class="hidden 2xl:inline">2xl (1536px+)</span>
            </p>
          </div>
        </div>
      </section>
    </main>
  </div>
</div>

<!-- ==========================================
     MODALS
     ========================================== -->
<Modal bind:open={showModal} title="Exemple de Modal">
  <p class="text-text-secondary mb-4">
    Ceci est un exemple de modal. Elle peut contenir n'importe quel contenu.
  </p>
  <Input label="Exemple de champ" placeholder="Tapez quelque chose..." />
  {#snippet footer()}
    <Button variant="ghost" onclick={() => showModal = false}>Annuler</Button>
    <Button onclick={() => { showModal = false; toasts.success('Action confirmee!'); }}>
      Confirmer
    </Button>
  {/snippet}
</Modal>

<ConfirmModal
  bind:open={showConfirmModal}
  title="Confirmer la suppression"
  message="Etes-vous sur de vouloir supprimer cet element ? Cette action est irreversible."
  variant="danger"
  confirmText="Supprimer"
  onconfirm={() => { showConfirmModal = false; toasts.success('Element supprime!'); }}
/>
