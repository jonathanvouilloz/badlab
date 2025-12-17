# BadLab - Style Guide

## Vue d'ensemble

### Concept Design

**BadLab** - Application de gestion de tournois de badminton.

**Direction artistique :**
- Minimaliste et professionnel
- Sobre avec une touche de couleur indigo pour les actions critiques
- Fonctionnel avant tout (UX > style)
- Typographie claire et lisible
- Interface accessible a tous les ages (25-60 ans)

**Mood :**
- Professionnel et serieux
- Efficace et direct
- Moderne sans etre excentrique
- Fiable (c'est pour gerer des tournois)

**Inspiration :**
- Linear, Vercel, Stripe (interfaces modernes et propres)
- Dashboards SaaS B2B

---

## Palette de Couleurs

### Variables CSS

```css
:root {
  /* Backgrounds */
  --color-bg-primary: #FFFFFF;     /* Fond principal (blanc pur) */
  --color-bg-secondary: #F9FAFB;   /* Fond secondaire (gris ultra-leger) */
  --color-bg-tertiary: #F3F4F6;    /* Fond tertiaire (zones desactivees) */

  /* Texte */
  --color-text-primary: #111827;   /* Texte principal (gris tres fonce) */
  --color-text-secondary: #6B7280; /* Texte secondaire (gris moyen) */
  --color-text-muted: #9CA3AF;     /* Texte muted (gris clair) */

  /* Accent - Indigo (actions critiques uniquement) */
  --color-accent: #3730A3;         /* Indigo fonce */
  --color-accent-hover: #312E81;   /* Indigo plus fonce au hover */
  --color-accent-light: #E0E7FF;   /* Indigo tres clair (backgrounds) */

  /* Statuts */
  --color-success: #059669;        /* Succes (vert emeraude) */
  --color-warning: #F59E0B;        /* Warning (orange/ambre) */
  --color-danger: #DC2626;         /* Danger/Erreur (rouge) */
  --color-info: #3B82F6;           /* Info (bleu) */

  /* Bordures */
  --color-border: #E5E7EB;         /* Bordure standard */
  --color-border-strong: #D1D5DB;  /* Bordure accentuee */
  --color-border-accent: #3730A3;  /* Bordure accent (indigo) */
}
```

### Utilisation des Couleurs

| Couleur | Hex | Usage |
|---------|-----|-------|
| **Blanc** | #FFFFFF | Background principal |
| **Gris ultra-leger** | #F9FAFB | Background secondaire, sections alternees |
| **Gris leger** | #F3F4F6 | Zones desactivees, skeletons |
| **Gris tres fonce** | #111827 | Texte principal, titres |
| **Gris moyen** | #6B7280 | Texte secondaire, descriptions |
| **Gris clair** | #9CA3AF | Texte muted, placeholders |
| **Indigo** | #3730A3 | CTA principal, actions critiques, focus |
| **Vert emeraude** | #059669 | Succes, termine |
| **Orange/Ambre** | #F59E0B | Warnings (usage rare) |
| **Rouge** | #DC2626 | Erreurs, suppression |
| **Bleu** | #3B82F6 | Info, liens, En cours |

---

## Typographie

### Police : Inter

**Font :** Inter (Google Fonts)
**Poids disponibles :** 400 (regular), 500 (medium), 600 (semibold)

```css
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

### Echelle Typographique

| Element | Taille | Poids | Letter-spacing | Line-height |
|---------|--------|-------|----------------|-------------|
| **H1** | 32px (2rem) | 600 | -0.02em | 1.2 |
| **H2** | 24px (1.5rem) | 600 | -0.01em | 1.3 |
| **H3** | 18px (1.125rem) | 600 | normal | 1.4 |
| **Body** | 16px (1rem) | 400 | normal | 1.5 |
| **Small** | 14px (0.875rem) | 400 | normal | 1.5 |
| **Caption** | 12px (0.75rem) | 500 | 0.05em | 1.4 |
| **Buttons** | 14px (0.875rem) | 500 | normal | 1 |
| **Labels** | 14px (0.875rem) | 500 | normal | 1 |
| **Numbers/Scores** | 16-20px | 600 | normal | 1 |

### Classes CSS utilitaires

```css
.heading-1 { font-weight: 600; font-size: 2rem; letter-spacing: -0.02em; }
.heading-2 { font-weight: 600; font-size: 1.5rem; letter-spacing: -0.01em; }
.heading-3 { font-weight: 600; font-size: 1.125rem; }
.text-body { font-weight: 400; font-size: 1rem; line-height: 1.5; }
.text-small { font-weight: 400; font-size: 0.875rem; }
.text-caption { font-weight: 500; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
.text-button { font-weight: 500; font-size: 0.875rem; }
.text-label { font-weight: 500; font-size: 0.875rem; }
.text-numbers { font-weight: 600; font-variant-numeric: tabular-nums; }
```

### Exemples

```html
<!-- Titre de page -->
<h1 class="heading-1 text-text-primary">Mes Tournois</h1>

<!-- Titre de section -->
<h2 class="heading-2 text-text-primary">Tournois en cours</h2>

<!-- Titre de carte -->
<h3 class="heading-3 text-text-primary">Open du Club 2024</h3>

<!-- Texte body -->
<p class="text-body text-text-secondary">Description du tournoi...</p>

<!-- Label -->
<label class="text-label text-text-primary">Nom du tournoi</label>

<!-- Caption -->
<span class="text-caption text-text-muted">40 JOUEURS</span>

<!-- Score -->
<span class="text-numbers text-xl text-accent">21</span>
```

---

## Composants de Base

### 1. Boutons

#### Bouton Principal (CTA)

```html
<button class="
  inline-flex items-center justify-center gap-2
  bg-accent hover:bg-accent-hover
  text-white text-button
  px-6 py-3 rounded-lg
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
  disabled:opacity-50 disabled:cursor-not-allowed
">
  Creer un tournoi
</button>
```

#### Bouton Secondaire

```html
<button class="
  inline-flex items-center justify-center gap-2
  bg-white hover:bg-bg-secondary
  text-text-primary text-button
  px-6 py-3 border border-border rounded-lg
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
">
  Annuler
</button>
```

#### Bouton Ghost

```html
<button class="
  inline-flex items-center justify-center gap-2
  bg-transparent hover:bg-bg-secondary
  text-text-primary text-button
  px-4 py-2 rounded-lg
  transition-colors duration-200
">
  Voir plus
</button>
```

#### Bouton Danger

```html
<button class="
  inline-flex items-center justify-center gap-2
  bg-danger hover:bg-danger/90
  text-white text-button
  px-6 py-3 rounded-lg
  transition-colors duration-200
  focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2
">
  Supprimer
</button>
```

---

### 2. Cartes

#### Carte Standard

```html
<div class="
  bg-white border border-border rounded-xl p-6
  hover:border-accent hover:shadow-md
  transition-all duration-200
">
  Contenu
</div>
```

#### Carte Tournoi

```html
<div class="bg-white border border-border rounded-xl p-6 hover:border-accent hover:shadow-md transition-all duration-200">
  <div class="flex items-start justify-between mb-4">
    <div class="flex-1">
      <h3 class="heading-3 text-text-primary mb-1">Open du Club 2024</h3>
      <p class="text-small text-text-secondary">15 mars 2024 - 40 participants</p>
    </div>
    <!-- Badge statut -->
    <span class="inline-flex items-center gap-1.5 bg-bg-tertiary text-text-secondary border border-border text-xs font-semibold px-2 py-1 rounded-md">
      En cours
    </span>
  </div>

  <div class="flex gap-2">
    <button class="flex-1 bg-accent hover:bg-accent-hover text-white text-button px-4 py-2 rounded-lg">
      Voir le tournoi
    </button>
    <button class="bg-white hover:bg-bg-secondary text-text-primary text-button px-4 py-2 border border-border rounded-lg">
      Modifier
    </button>
  </div>
</div>
```

#### Carte Match

```html
<div class="bg-white border-l-4 border-l-accent border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
  <div class="flex items-center justify-between mb-3">
    <span class="text-caption text-text-muted">MATCH #12</span>
    <span class="text-small text-text-muted">Terrain 2 - ~14h30</span>
  </div>

  <div class="space-y-2 mb-4">
    <div class="flex items-center justify-between">
      <span class="font-semibold text-text-primary">John Doe</span>
      <span class="text-numbers text-xl text-accent">21</span>
    </div>
    <div class="h-px bg-border"></div>
    <div class="flex items-center justify-between">
      <span class="font-semibold text-text-secondary">Jane Smith</span>
      <span class="text-numbers text-xl text-text-muted">15</span>
    </div>
  </div>

  <button class="w-full bg-accent/10 hover:bg-accent hover:text-white text-accent text-button px-4 py-2 rounded-lg transition-colors duration-200">
    Entrer le score
  </button>
</div>
```

---

### 3. Badges & Tags

#### Badge Statut (En cours)

```html
<span class="inline-flex items-center gap-1.5 bg-info/10 text-info border border-info/20 text-xs font-semibold px-2 py-1 rounded-md">
  <span class="size-1.5 bg-info rounded-full animate-pulse"></span>
  En cours
</span>
```

#### Badge Statut (Termine)

```html
<span class="inline-flex items-center gap-1.5 bg-success/10 text-success border border-success/20 text-xs font-semibold px-2 py-1 rounded-md">
  <svg class="size-3">...</svg>
  Termine
</span>
```

#### Badge Nombre

```html
<span class="inline-flex items-center justify-center bg-accent text-white text-xs font-bold size-6 rounded-full">
  40
</span>
```

#### Tag

```html
<span class="inline-block bg-bg-tertiary text-text-secondary text-xs font-medium px-2 py-1 rounded-md">
  Elimination
</span>
```

---

### 4. Inputs & Formulaires

#### Input Standard

```html
<div class="space-y-1.5">
  <label for="name" class="text-label text-text-primary">
    Nom du tournoi
  </label>
  <input
    id="name"
    type="text"
    placeholder="Open du Club 2024"
    class="
      w-full bg-white text-text-primary placeholder:text-text-muted
      border border-border rounded-lg px-4 py-2.5 text-body
      focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
      disabled:bg-bg-tertiary disabled:cursor-not-allowed
      transition-colors duration-200
    "
  />
  <p class="text-xs text-text-muted">Choisissez un nom clair et descriptif</p>
</div>
```

#### Select

```html
<div class="space-y-1.5">
  <label for="format" class="text-label text-text-primary">Format du tournoi</label>
  <select
    id="format"
    class="
      w-full bg-white text-text-primary
      border border-border rounded-lg px-4 py-2.5 text-body
      focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent
      cursor-pointer transition-colors duration-200
    "
  >
    <option>Elimination directe</option>
    <option>Poules + Elimination</option>
    <option>Round-Robin</option>
  </select>
</div>
```

#### Checkbox

```html
<label class="flex items-start gap-3 cursor-pointer group">
  <input type="checkbox" class="checkbox checkbox-accent mt-0.5" />
  <div>
    <span class="text-label text-text-primary group-hover:text-accent transition-colors">
      Inscription ouverte
    </span>
    <p class="text-xs text-text-muted">Les joueurs peuvent s'inscrire eux-memes</p>
  </div>
</label>
```

#### Radio Group

```html
<div class="space-y-3">
  <p class="text-label text-text-primary">Type d'inscription</p>

  <label class="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:border-accent hover:bg-accent/5 has-[:checked]:border-accent has-[:checked]:bg-accent/5 transition-all duration-200">
    <input type="radio" name="type" class="radio radio-accent mt-0.5" />
    <div>
      <span class="font-semibold text-text-primary">Liste fermee</span>
      <p class="text-small text-text-secondary">Vous ajoutez les participants manuellement</p>
    </div>
  </label>

  <label class="flex items-start gap-3 p-4 border border-border rounded-lg cursor-pointer hover:border-accent hover:bg-accent/5 has-[:checked]:border-accent has-[:checked]:bg-accent/5 transition-all duration-200">
    <input type="radio" name="type" class="radio radio-accent mt-0.5" />
    <div>
      <span class="font-semibold text-text-primary">Inscription ouverte</span>
      <p class="text-small text-text-secondary">Les joueurs s'inscrivent via un lien</p>
    </div>
  </label>
</div>
```

---

### 5. Tables

```html
<div class="overflow-x-auto">
  <table class="table table-zebra w-full">
    <thead>
      <tr class="border-b-2 border-border">
        <th class="text-caption text-text-secondary">POULE A</th>
        <th class="text-center text-caption text-text-secondary">V</th>
        <th class="text-center text-caption text-text-secondary">D</th>
        <th class="text-center text-caption text-text-secondary">SETS</th>
        <th class="text-center text-caption text-text-secondary">PTS</th>
      </tr>
    </thead>
    <tbody>
      <tr class="hover">
        <td class="font-semibold text-text-primary">John Doe</td>
        <td class="text-center text-numbers text-success">3</td>
        <td class="text-center text-numbers text-danger">1</td>
        <td class="text-center text-text-secondary">6-3</td>
        <td class="text-center text-numbers text-accent">42</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Spacing & Layout

### Systeme d'Espacement

| Taille | Valeur | Usage |
|--------|--------|-------|
| 1 | 4px | Micro-spacing |
| 2 | 8px | Spacing serre |
| 3 | 12px | Spacing serre |
| 4 | 16px | Spacing standard |
| 6 | 24px | Spacing large |
| 8 | 32px | Spacing tres large |
| 12 | 48px | Sections |
| 16 | 64px | Grandes sections |

### Regles d'Espacement

| Element | Padding | Gap |
|---------|---------|-----|
| Cartes | p-6 | - |
| Boutons (default) | px-6 py-3 | gap-2 |
| Boutons (sm) | px-4 py-2 | gap-2 |
| Inputs | px-4 py-2.5 | - |
| Badges | px-2 py-1 | gap-1.5 |
| Flex/Grid | - | gap-4 / gap-6 |

---

## Responsive Design

### Breakpoints

```css
sm: 640px   /* Petits tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large Desktop */
2xl: 1536px /* Extra Large */
```

### Patterns Communs

```html
<!-- Stack mobile, row desktop -->
<div class="flex flex-col md:flex-row gap-4">

<!-- Grid responsive -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

<!-- Cacher sur mobile -->
<nav class="hidden md:block">

<!-- Cacher sur desktop -->
<button class="md:hidden">
```

---

## Accessibilite

### Contraste

Tous les textes respectent WCAG AA :
- Texte principal (#111827) sur blanc : AAA
- Texte secondaire (#6B7280) sur blanc : AA
- Texte blanc sur indigo (#3730A3) : AA

### Focus Visible

```html
<button class="focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2">

<input class="focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent">
```

---

## Animations & Transitions

### Principes

- Rapides : 150-300ms max
- Subtiles : Pas d'animations distrayantes
- Utiles : Feedback, pas decoration
- Performantes : transform et opacity uniquement

### Transitions Standards

```html
<!-- Hover couleur -->
<button class="transition-colors duration-200">

<!-- Hover tout -->
<div class="transition-all duration-200">

<!-- Hover ombre -->
<div class="transition-shadow duration-200">
```

---

## Iconographie

### Librairie : Lucide Icons

```bash
npm install lucide-svelte
```

### Icones Recommandees

| Usage | Icone |
|-------|-------|
| Tournoi | Trophy |
| Joueurs | Users |
| Match | Play |
| Termine | CheckCircle |
| Calendrier | Calendar |
| Lieu | MapPin |
| Settings | Settings |
| Fermer | X |
| Menu | Menu |
| Plus | Plus |
| Modifier | Edit3 |
| Supprimer | Trash2 |

---

## Bordures & Ombres

### Border Radius

- Petits elements (badges) : rounded-md (6px)
- Elements standards (boutons, inputs) : rounded-lg (8px)
- Grandes cartes : rounded-xl (12px)
- Elements ronds : rounded-full

### Ombres

- Niveau 0 : Pas d'ombre
- Niveau 1 (cartes) : shadow-sm
- Niveau 2 (hover) : shadow-md
- Niveau 3 (modals) : shadow-lg
- Niveau 4 (popovers) : shadow-2xl

---

## Checklist Design

Avant de valider un composant/page :

- [ ] Palette de couleurs respectee (blanc + indigo accent)
- [ ] Typographie Inter avec bons poids
- [ ] Bordures arrondies (rounded-lg)
- [ ] Ombres subtiles
- [ ] Contraste WCAG AA minimum
- [ ] Focus visible sur elements interactifs
- [ ] Transitions fluides (200ms)
- [ ] Responsive mobile/desktop teste
- [ ] ARIA labels sur icones seules

---

**BadLab - Design sobre, professionnel et fonctionnel.**
