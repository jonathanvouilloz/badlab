# BadLab - Guidelines de Développement

## 📋 Vue d'ensemble

Ce document définit les bonnes pratiques de développement pour **BadLab**, incluant la structure du projet, les conventions de code, et les patterns recommandés.

---

## 🏗️ Stack Technique

| Technologie | Version | Usage |
|-------------|---------|-------|
| **SvelteKit** | 2.x | Framework Svelte avec routing intégré |
| **Svelte** | 5.x | UI Framework (réactivité native) |
| **TypeScript** | 5.x | Type safety |
| **Tailwind CSS** | 3.x | Styling utility-first |
| **DaisyUI** | 4.x | Composants + theming sur Tailwind |
| **Svelte Stores** | Natif | State management (réactivité native) |
| **Felte** | 1.x | Gestion de formulaires (alternative : forms natifs Svelte) |
| **Zod** | 3.x | Validation de schémas |
| **Supabase** | 2.x | Backend (BDD + Auth + Realtime) |
| **lucide-svelte** | Latest | Icônes |

---

## 📁 Structure du Projet

### Architecture SvelteKit

```
badlab/
├── src/
│   ├── routes/                    # SvelteKit routing (file-based)
│   │   ├── +layout.svelte         # Layout racine
│   │   ├── +page.svelte           # Homepage
│   │   ├── +page.ts               # Load data (optionnel)
│   │   │
│   │   ├── auth/                  # Authentification
│   │   │   ├── login/
│   │   │   │   └── +page.svelte
│   │   │   ├── register/
│   │   │   │   └── +page.svelte
│   │   │   └── +layout.svelte
│   │   │
│   │   ├── dashboard/             # Dashboard organisateur
│   │   │   ├── +page.svelte
│   │   │   ├── +page.ts
│   │   │   └── +layout.svelte
│   │   │
│   │   ├── tournament/            # Pages tournoi
│   │   │   ├── [id]/
│   │   │   │   ├── +page.svelte   # Vue principale tournoi
│   │   │   │   ├── +page.ts
│   │   │   │   ├── display/       # Mode affichage mural
│   │   │   │   │   └── +page.svelte
│   │   │   │   └── edit/          # Édition tournoi
│   │   │   │       └── +page.svelte
│   │   │   └── create/
│   │   │       └── +page.svelte
│   │   │
│   │   ├── register/              # Inscription publique
│   │   │   └── [id]/
│   │   │       └── +page.svelte
│   │   │
│   │   └── api/                   # API Routes (+server.ts)
│   │       ├── tournaments/
│   │       │   ├── +server.ts
│   │       │   └── [id]/
│   │       │       └── +server.ts
│   │       ├── matches/
│   │       │   └── +server.ts
│   │       └── export/
│   │           ├── pdf/
│   │           │   └── +server.ts
│   │           └── csv/
│   │               └── +server.ts
│   │
│   ├── lib/                       # Librairies & utilitaires
│   │   ├── components/            # Composants Svelte
│   │   │   ├── ui/                # Composants UI (DaisyUI custom)
│   │   │   │   ├── Button.svelte
│   │   │   │   ├── Card.svelte
│   │   │   │   ├── Input.svelte
│   │   │   │   ├── Modal.svelte
│   │   │   │   └── ...
│   │   │   │
│   │   │   ├── layout/            # Layout components
│   │   │   │   ├── Header.svelte
│   │   │   │   ├── Sidebar.svelte
│   │   │   │   └── Footer.svelte
│   │   │   │
│   │   │   ├── tournament/        # Composants spécifiques tournoi
│   │   │   │   ├── TournamentCard.svelte
│   │   │   │   ├── TournamentForm.svelte
│   │   │   │   ├── Bracket.svelte
│   │   │   │   ├── PoolGrid.svelte
│   │   │   │   └── MatchCard.svelte
│   │   │   │
│   │   │   ├── forms/             # Composants de formulaires
│   │   │   │   ├── CreateTournamentForm.svelte
│   │   │   │   ├── AddParticipantForm.svelte
│   │   │   │   └── ScoreInputForm.svelte
│   │   │   │
│   │   │   └── shared/            # Composants réutilisables
│   │   │       ├── Badge.svelte
│   │   │       ├── StatusBadge.svelte
│   │   │       └── LoadingSkeleton.svelte
│   │   │
│   │   ├── supabase/              # Configuration Supabase
│   │   │   ├── client.ts          # Client côté client
│   │   │   ├── server.ts          # Client côté serveur
│   │   │   └── types.ts           # Types générés
│   │   │
│   │   ├── stores/                # Svelte stores
│   │   │   ├── tournament.ts      # Store tournoi (writable, derived)
│   │   │   ├── user.ts            # Store utilisateur
│   │   │   └── ui.ts              # Store UI (modals, toasts)
│   │   │
│   │   ├── utils/                 # Fonctions utilitaires
│   │   │   ├── cn.ts              # Tailwind class merger (twMerge)
│   │   │   ├── bracket.ts         # Logique bracket
│   │   │   ├── pools.ts           # Logique poules
│   │   │   └── validators.ts      # Validations custom
│   │   │
│   │   └── constants/             # Constantes
│   │       ├── tournament.ts
│   │       └── routes.ts
│   │
│   ├── types/                     # Types TypeScript
│   │   ├── tournament.ts
│   │   ├── match.ts
│   │   ├── participant.ts
│   │   └── database.ts            # Types Supabase générés
│   │
│   ├── app.html                   # HTML racine
│   ├── app.css                    # Styles globaux (Tailwind + DaisyUI)
│   └── hooks.server.ts            # Server hooks (auth, etc.)
│
├── static/                        # Assets statiques
│   ├── images/
│   └── fonts/
│
├── .env                           # Variables d'environnement
├── .eslintrc.cjs                  # Config ESLint
├── .prettierrc                    # Config Prettier
├── tailwind.config.js             # Config Tailwind + DaisyUI
├── tsconfig.json                  # Config TypeScript
├── svelte.config.js               # Config SvelteKit
├── vite.config.ts                 # Config Vite
└── package.json
```

---

## 🎯 Conventions de Nommage

### Fichiers & Dossiers

| Type | Convention | Exemple |
|------|------------|---------|
| **Pages (App Router)** | `page.tsx` | `app/tournament/[id]/page.tsx` |
| **Layouts** | `layout.tsx` | `app/dashboard/layout.tsx` |
| **API Routes** | `route.ts` | `app/api/tournaments/route.ts` |
| **Composants React** | PascalCase | `TournamentCard.tsx` |
| **Hooks** | camelCase + `use` prefix | `useTournament.ts` |
| **Utilitaires** | camelCase | `bracket.ts`, `validators.ts` |
| **Types** | PascalCase | `Tournament.ts` |
| **Stores Zustand** | camelCase + `Store` suffix | `tournamentStore.ts` |

---

### Variables & Fonctions

```typescript
// ✅ Bon : camelCase pour variables et fonctions
const tournamentId = "abc123";
const isActive = true;

function getTournamentById(id: string) { }
function handleSubmit() { }

// ✅ Bon : PascalCase pour composants React
function TournamentCard({ tournament }: Props) { }

// ✅ Bon : SCREAMING_SNAKE_CASE pour constantes
const MAX_PARTICIPANTS = 100;
const API_BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

// ✅ Bon : Préfixes clairs pour booléens
const isLoading = true;
const hasError = false;
const canEdit = true;

// ❌ Mauvais : Noms vagues
const data = {};
const temp = "";
const x = 5;
```

---

### Types & Interfaces

```typescript
// ✅ Bon : Interface pour props de composants (suffix Props)
interface TournamentCardProps {
  tournament: Tournament;
  onEdit?: () => void;
}

// ✅ Bon : Type pour objets métier (PascalCase)
type Tournament = {
  id: string;
  name: string;
  status: TournamentStatus;
};

// ✅ Bon : Enum pour valeurs fixes (PascalCase)
enum TournamentStatus {
  Draft = "draft",
  InProgress = "in_progress",
  Finished = "finished",
}

// ✅ Alternative : Union de string literals
type TournamentFormat = "elimination" | "pools_elimination" | "round_robin";
```

---

## ⚛️ Bonnes Pratiques React & Next.js

### 1. Composants

#### Structure de Composant Recommandée

```typescript
'use client'; // Si nécessaire (interactivité client-side)

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTournament } from '@/lib/hooks/useTournament';
import type { Tournament } from '@/types/tournament';

// 1. Définir l'interface des props
interface TournamentCardProps {
  tournament: Tournament;
  onEdit?: () => void;
  className?: string;
}

// 2. Composant principal
export function TournamentCard({ 
  tournament, 
  onEdit,
  className 
}: TournamentCardProps) {
  // 3. Hooks
  const [isHovered, setIsHovered] = useState(false);
  const { deleteTournament } = useTournament();
  
  // 4. Handlers
  const handleDelete = async () => {
    await deleteTournament(tournament.id);
  };
  
  // 5. Early returns (conditions)
  if (!tournament) {
    return <div>Tournoi introuvable</div>;
  }
  
  // 6. Render
  return (
    <div 
      className={cn("tournament-card", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3>{tournament.name}</h3>
      <Button onClick={onEdit}>Modifier</Button>
      <Button onClick={handleDelete} variant="destructive">
        Supprimer
      </Button>
    </div>
  );
}
```

---

#### Server Components vs Client Components

**🎯 Règle d'or :** Par défaut, tout est Server Component (Next.js 15). Ajouter `'use client'` UNIQUEMENT si nécessaire.

**Utiliser Server Components pour :**
- Fetching de données
- Accès direct à la BDD (Supabase server)
- SEO (meta tags)
- Tout ce qui n'a pas d'interactivité

```typescript
// ✅ Server Component (pas de 'use client')
import { createServerClient } from '@/lib/supabase/server';

export default async function TournamentPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const supabase = createServerClient();
  const { data: tournament } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', params.id)
    .single();
  
  return <TournamentView tournament={tournament} />;
}
```

**Utiliser Client Components pour :**
- Interactivité (onClick, onChange, etc.)
- Hooks React (useState, useEffect, etc.)
- Context API
- Browser APIs (localStorage, etc.)

```typescript
// ✅ Client Component
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function TournamentActions({ tournamentId }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const handleDelete = async () => {
    setIsDeleting(true);
    // ...
  };
  
  return (
    <Button onClick={handleDelete} disabled={isDeleting}>
      {isDeleting ? 'Suppression...' : 'Supprimer'}
    </Button>
  );
}
```

---

### 2. Gestion des Données

#### Fetching Côté Serveur (Recommandé)

```typescript
// ✅ Bon : Server Component avec async/await
export default async function TournamentsPage() {
  const supabase = createServerClient();
  const { data: tournaments } = await supabase
    .from('tournaments')
    .select('*')
    .order('created_at', { ascending: false });
  
  return <TournamentList tournaments={tournaments || []} />;
}
```

#### Fetching Côté Client (Si Nécessaire)

```typescript
// ✅ Bon : Client Component avec custom hook
'use client';

import { useTournaments } from '@/lib/hooks/useTournaments';

export function TournamentDashboard() {
  const { tournaments, isLoading, error } = useTournaments();
  
  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} />;
  
  return <TournamentList tournaments={tournaments} />;
}
```

---

### 3. Gestion des Erreurs

```typescript
// ✅ Bon : Error Boundary (app/error.tsx)
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="error-container">
      <h2>Erreur !</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Réessayer</button>
    </div>
  );
}

// ✅ Bon : Loading UI (app/loading.tsx)
export default function Loading() {
  return <LoadingSkeleton />;
}

// ✅ Bon : Try/Catch dans les actions
async function createTournament(data: TournamentData) {
  try {
    const { data: tournament, error } = await supabase
      .from('tournaments')
      .insert(data)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, tournament };
  } catch (error) {
    console.error('Error creating tournament:', error);
    return { success: false, error: 'Erreur lors de la création' };
  }
}
```

---

## 🎨 Bonnes Pratiques Tailwind CSS

### 1. Ordre des Classes

**Suivre cet ordre logique :**

```typescript
<div className="
  {/* 1. Layout & Display */}
  flex flex-col items-center justify-between
  
  {/* 2. Sizing */}
  w-full max-w-lg h-auto
  
  {/* 3. Spacing */}
  p-6 m-4 gap-4
  
  {/* 4. Background & Border */}
  bg-[#121212] border-2 border-white
  
  {/* 5. Typography */}
  text-lg font-bold text-white
  
  {/* 6. Effects */}
  shadow-[6px_6px_0px_#FFFFFF] opacity-90
  
  {/* 7. Transitions */}
  transition-all duration-200
  
  {/* 8. Responsive */}
  md:flex-row md:p-8
  
  {/* 9. States */}
  hover:bg-red focus:ring-2
">
```

---

### 2. Utilisation de `cn()` (Class Name Merger)

**Installer :**
```typescript
// lib/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Utiliser :**
```typescript
import { cn } from '@/lib/utils/cn';

// ✅ Bon : Merge classes avec conditions
<div className={cn(
  "base-class p-4",
  isActive && "bg-red",
  className // Props externe
)}>
```

---

### 3. Classes Réutilisables

**❌ Mauvais : Répéter les mêmes classes partout**
```typescript
<button className="bg-red text-white px-8 py-4 border-2 border-white font-bold uppercase">
<button className="bg-red text-white px-8 py-4 border-2 border-white font-bold uppercase">
<button className="bg-red text-white px-8 py-4 border-2 border-white font-bold uppercase">
```

**✅ Bon : Créer un composant réutilisable**
```typescript
// components/ui/button.tsx
export function Button({ children, variant = 'primary', ...props }: Props) {
  return (
    <button
      className={cn(
        "px-8 py-4 border-2 font-bold uppercase transition-all",
        variant === 'primary' && "bg-red text-white border-white",
        variant === 'secondary' && "bg-transparent text-white border-white"
      )}
      {...props}
    >
      {children}
    </button>
  );
}
```

---

### 4. Responsive Design

```typescript
// ✅ Bon : Mobile-first
<div className="
  flex flex-col        {/* Mobile: colonne */}
  md:flex-row          {/* Desktop: ligne */}
  gap-4 md:gap-8       {/* Espacement adaptatif */}
">

// ✅ Bon : Cacher sur mobile/desktop
<nav className="hidden md:flex">     {/* Visible desktop only */}
<button className="md:hidden">       {/* Visible mobile only */}
```

---

### 5. Variables CSS Custom

**Définir dans `globals.css` :**
```css
@layer base {
  :root {
    --red: #E63946;
    --red-dark: #B8262F;
    --neon-green: #39FF14;
    --yellow: #FFD60A;
  }
}
```

**Utiliser dans Tailwind :**
```typescript
<div className="bg-[var(--red)] border-[var(--neon-green)]">
```

**OU configurer Tailwind :**
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        red: '#E63946',
        'red-dark': '#B8262F',
        'neon-green': '#39FF14',
        yellow: '#FFD60A',
      },
    },
  },
};

// Utiliser
<div className="bg-red border-neon-green">
```

---

## 🗄️ State Management avec Zustand

### 1. Créer un Store

```typescript
// lib/store/tournamentStore.ts
import { create } from 'zustand';
import type { Tournament } from '@/types/tournament';

interface TournamentState {
  // State
  tournaments: Tournament[];
  selectedTournament: Tournament | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setTournaments: (tournaments: Tournament[]) => void;
  selectTournament: (id: string) => void;
  addTournament: (tournament: Tournament) => void;
  updateTournament: (id: string, updates: Partial<Tournament>) => void;
  deleteTournament: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTournamentStore = create<TournamentState>((set, get) => ({
  // Initial state
  tournaments: [],
  selectedTournament: null,
  isLoading: false,
  error: null,
  
  // Actions
  setTournaments: (tournaments) => set({ tournaments }),
  
  selectTournament: (id) => {
    const tournament = get().tournaments.find(t => t.id === id);
    set({ selectedTournament: tournament || null });
  },
  
  addTournament: (tournament) => set((state) => ({
    tournaments: [...state.tournaments, tournament],
  })),
  
  updateTournament: (id, updates) => set((state) => ({
    tournaments: state.tournaments.map(t =>
      t.id === id ? { ...t, ...updates } : t
    ),
  })),
  
  deleteTournament: (id) => set((state) => ({
    tournaments: state.tournaments.filter(t => t.id !== id),
  })),
  
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
```

---

### 2. Utiliser un Store

```typescript
'use client';

import { useTournamentStore } from '@/lib/store/tournamentStore';

export function TournamentList() {
  // ✅ Bon : Sélectionner seulement ce qui est nécessaire
  const tournaments = useTournamentStore((state) => state.tournaments);
  const isLoading = useTournamentStore((state) => state.isLoading);
  const addTournament = useTournamentStore((state) => state.addTournament);
  
  // ❌ Mauvais : Tout récupérer (re-render à chaque changement)
  // const state = useTournamentStore();
  
  if (isLoading) return <LoadingSkeleton />;
  
  return (
    <div>
      {tournaments.map(tournament => (
        <TournamentCard key={tournament.id} tournament={tournament} />
      ))}
    </div>
  );
}
```

---

### 3. Stores Recommandés

| Store | Responsabilité |
|-------|----------------|
| `tournamentStore` | Gestion des tournois (liste, sélection, CRUD) |
| `matchStore` | Gestion des matches (résultats, status) |
| `userStore` | Infos utilisateur, préférences |
| `uiStore` | UI state (modals, toasts, sidebar) |

---

## 📝 Formulaires avec React Hook Form + Zod

### 1. Définir un Schéma Zod

```typescript
// lib/utils/validators.ts
import { z } from 'zod';

export const tournamentSchema = z.object({
  name: z.string().min(3, 'Le nom doit contenir au moins 3 caractères'),
  description: z.string().optional(),
  startDate: z.date({
    required_error: 'La date de début est obligatoire',
  }),
  format: z.enum(['elimination', 'pools_elimination', 'round_robin']),
  maxParticipants: z.number().min(4).max(200).optional(),
});

export type TournamentFormData = z.infer<typeof tournamentSchema>;
```

---

### 2. Créer un Formulaire

```typescript
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tournamentSchema, type TournamentFormData } from '@/lib/utils/validators';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function CreateTournamentForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TournamentFormData>({
    resolver: zodResolver(tournamentSchema),
  });
  
  const onSubmit = async (data: TournamentFormData) => {
    try {
      // Call API ou Supabase
      const response = await fetch('/api/tournaments', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Erreur');
      
      // Success
      console.log('Tournoi créé !');
    } catch (error) {
      console.error(error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-bold mb-2">
          Nom du tournoi
        </label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Open du Club 2024"
        />
        {errors.name && (
          <p className="text-red text-sm mt-1">{errors.name.message}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="format" className="block text-sm font-bold mb-2">
          Format
        </label>
        <select id="format" {...register('format')} className="...">
          <option value="elimination">Élimination directe</option>
          <option value="pools_elimination">Poules + Élimination</option>
          <option value="round_robin">Round-Robin</option>
        </select>
        {errors.format && (
          <p className="text-red text-sm mt-1">{errors.format.message}</p>
        )}
      </div>
      
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Création...' : 'Créer le tournoi'}
      </Button>
    </form>
  );
}
```

---

## 🔌 Supabase Best Practices

### 1. Configuration Clients

**Client côté serveur (Server Components, API Routes) :**
```typescript
// lib/supabase/server.ts
import { createServerClient as createClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createServerClient() {
  const cookieStore = cookies();
  
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}
```

**Client côté client (Client Components) :**
```typescript
// lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

---

### 2. Patterns de Requêtes

```typescript
// ✅ Bon : Typage des résultats
const { data: tournaments, error } = await supabase
  .from('tournaments')
  .select('*')
  .eq('organizer_id', userId);

if (error) {
  console.error('Error fetching tournaments:', error);
  return [];
}

return tournaments;

// ✅ Bon : Select avec relations
const { data: tournament } = await supabase
  .from('tournaments')
  .select(`
    *,
    participants (*),
    matches (*)
  `)
  .eq('id', tournamentId)
  .single();

// ✅ Bon : Insert avec retour
const { data: newTournament, error } = await supabase
  .from('tournaments')
  .insert({
    name: 'Open 2024',
    organizer_id: userId,
    format: 'elimination',
  })
  .select()
  .single();

// ✅ Bon : Update
const { error } = await supabase
  .from('tournaments')
  .update({ status: 'in_progress' })
  .eq('id', tournamentId);

// ✅ Bon : Delete
const { error } = await supabase
  .from('tournaments')
  .delete()
  .eq('id', tournamentId);
```

---

### 3. Realtime Subscriptions

```typescript
'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Match } from '@/types/match';

export function useRealtimeMatches(tournamentId: string) {
  const [matches, setMatches] = useState<Match[]>([]);
  const supabase = createClient();
  
  useEffect(() => {
    // Fetch initial
    const fetchMatches = async () => {
      const { data } = await supabase
        .from('matches')
        .select('*')
        .eq('tournament_id', tournamentId);
      
      if (data) setMatches(data);
    };
    
    fetchMatches();
    
    // Subscribe to changes
    const channel = supabase
      .channel(`matches:${tournamentId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches',
          filter: `tournament_id=eq.${tournamentId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMatches((prev) => [...prev, payload.new as Match]);
          } else if (payload.eventType === 'UPDATE') {
            setMatches((prev) =>
              prev.map((m) => (m.id === payload.new.id ? payload.new as Match : m))
            );
          } else if (payload.eventType === 'DELETE') {
            setMatches((prev) => prev.filter((m) => m.id !== payload.old.id));
          }
        }
      )
      .subscribe();
    
    // Cleanup
    return () => {
      supabase.removeChannel(channel);
    };
  }, [tournamentId]);
  
  return matches;
}
```

---

### 4. Authentification

```typescript
// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// Magic Link (recommandé pour joueurs)
const { error } = await supabase.auth.signInWithOtp({
  email: 'user@example.com',
  options: {
    emailRedirectTo: 'https://badlab.ch/auth/callback',
  },
});

// Get user
const { data: { user } } = await supabase.auth.getUser();

// Sign out
const { error } = await supabase.auth.signOut();
```

---

## 🧪 TypeScript Best Practices

### 1. Typage Strict

```typescript
// ✅ Bon : Toujours typer les props
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({ children, onClick, variant = 'primary', disabled }: ButtonProps) {
  // ...
}

// ✅ Bon : Typer les retours de fonction
async function getTournament(id: string): Promise<Tournament | null> {
  const { data } = await supabase
    .from('tournaments')
    .select('*')
    .eq('id', id)
    .single();
  
  return data;
}

// ❌ Mauvais : any
function doSomething(data: any) { } // ❌

// ✅ Bon : unknown (si type vraiment inconnu)
function parseJson(json: string): unknown {
  return JSON.parse(json);
}
```

---

### 2. Utility Types

```typescript
// Partial (tous les champs optionnels)
type UpdateTournament = Partial<Tournament>;

// Pick (sélectionner certains champs)
type TournamentPreview = Pick<Tournament, 'id' | 'name' | 'status'>;

// Omit (exclure certains champs)
type CreateTournament = Omit<Tournament, 'id' | 'created_at'>;

// Record
type TournamentStatusMap = Record<string, TournamentStatus>;

// NonNullable
type User = { name: string; email: string | null };
type ValidEmail = NonNullable<User['email']>; // string
```

---

### 3. Générer les Types Supabase

```bash
# Installer le CLI Supabase
npm install -D supabase

# Générer les types
npx supabase gen types typescript --project-id [PROJECT_ID] > types/database.ts
```

**Utiliser :**
```typescript
import type { Database } from '@/types/database';

type Tournament = Database['public']['Tables']['tournaments']['Row'];
type InsertTournament = Database['public']['Tables']['tournaments']['Insert'];
type UpdateTournament = Database['public']['Tables']['tournaments']['Update'];
```

---

## 🎨 Composants Shadcn/ui

### 1. Installation

```bash
# Initialiser Shadcn
npx shadcn-ui@latest init

# Ajouter des composants
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
npx shadcn-ui@latest add toast
```

---

### 2. Customisation

**Les composants Shadcn sont dans `components/ui/` et ENTIÈREMENT customisables.**

**Exemple : Customiser Button pour BadLab :**

```typescript
// components/ui/button.tsx (généré par Shadcn)
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center font-bold uppercase transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        // ✅ Customiser pour BadLab
        default: "bg-red text-white border-2 border-white shadow-[4px_4px_0px_#FFFFFF] hover:shadow-[2px_2px_0px_#FFFFFF] hover:translate-x-[2px] hover:translate-y-[2px]",
        secondary: "bg-transparent text-white border-2 border-white hover:bg-white hover:text-black",
        ghost: "hover:bg-white/10",
      },
      size: {
        default: "px-8 py-4",
        sm: "px-6 py-3 text-sm",
        lg: "px-12 py-5 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

**Utiliser :**
```typescript
import { Button } from '@/components/ui/button';

<Button variant="default">Créer un tournoi</Button>
<Button variant="secondary">Annuler</Button>
<Button size="sm">Petit bouton</Button>
```

---

## 🔄 Git Workflow

### 1. Structure des Commits

**Format :** `type(scope): description`

**Types :**
- `feat` : Nouvelle fonctionnalité
- `fix` : Correction de bug
- `refactor` : Refactoring (pas de changement fonctionnel)
- `style` : Formatage, typo (pas de changement de code)
- `docs` : Documentation
- `test` : Tests
- `chore` : Maintenance (deps, config)

**Exemples :**
```bash
git commit -m "feat(tournament): add bracket generation"
git commit -m "fix(match): score validation not working"
git commit -m "refactor(ui): extract TournamentCard component"
git commit -m "style(button): fix spacing on mobile"
git commit -m "docs(readme): update installation steps"
```

---

### 2. Branches

```
main              # Production
develop           # Développement
feature/xxx       # Nouvelles fonctionnalités
fix/xxx           # Corrections de bugs
refactor/xxx      # Refactoring
```

**Workflow :**
```bash
# Créer une branche feature
git checkout -b feature/bracket-generation

# Développer...

# Commit
git add .
git commit -m "feat(bracket): implement bracket generation algorithm"

# Push
git push origin feature/bracket-generation

# Créer Pull Request sur GitHub
# Merge dans develop après review
```

---

## 📊 Performance & Optimisation

### 1. Images

```typescript
// ✅ Bon : Utiliser next/image
import Image from 'next/image';

<Image
  src="/tournament-banner.jpg"
  alt="Tournoi BadLab"
  width={800}
  height={400}
  priority // Si above the fold
/>

// ❌ Mauvais : <img> classique
<img src="/tournament-banner.jpg" alt="Tournoi" />
```

---

### 2. Lazy Loading

```typescript
// ✅ Bon : Lazy load composants lourds
import dynamic from 'next/dynamic';

const Bracket = dynamic(() => import('@/components/tournament/Bracket'), {
  loading: () => <LoadingSkeleton />,
  ssr: false, // Si besoin client-side only
});
```

---

### 3. Memoization

```typescript
import { memo, useMemo } from 'react';

// ✅ Bon : Memo pour composants qui re-render souvent
export const TournamentCard = memo(function TournamentCard({ tournament }: Props) {
  return <div>{tournament.name}</div>;
});

// ✅ Bon : useMemo pour calculs lourds
function BracketView({ matches }: Props) {
  const bracket = useMemo(() => {
    return generateBracket(matches); // Calcul lourd
  }, [matches]);
  
  return <Bracket data={bracket} />;
}
```

---

## ✅ Checklist Avant Commit

- [ ] Code compile sans erreur TypeScript
- [ ] ESLint passe (pas d'erreurs)
- [ ] Prettier formaté
- [ ] Imports organisés (remove unused)
- [ ] Console.log() retirés (sauf logging intentionnel)
- [ ] Types ajoutés (pas de `any`)
- [ ] Responsive testé (mobile + desktop)
- [ ] Accessibilité vérifiée (focus, ARIA labels)
- [ ] Commit message clair et descriptif

---

## 🚀 Commandes Utiles

```bash
# Développement
npm run dev              # Démarrer le serveur local

# Build
npm run build            # Build production
npm run start            # Lancer le build

# Linting
npm run lint             # ESLint check
npm run lint:fix         # ESLint fix

# TypeScript
npm run type-check       # Vérifier les types

# Supabase
npx supabase start       # Démarrer Supabase local
npx supabase gen types   # Générer types

# Git
git status               # État du repo
git add .                # Stage tous les fichiers
git commit -m "..."      # Commit
git push                 # Push vers remote
```

---

## 📚 Ressources

### Documentation Officielle
- [Next.js 15 Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Shadcn/ui](https://ui.shadcn.com)
- [Zustand](https://zustand-demo.pmnd.rs)
- [Supabase](https://supabase.com/docs)
- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev)

### Outils
- [TypeScript Playground](https://www.typescriptlang.org/play)
- [Tailwind Playground](https://play.tailwindcss.com)

---

**BadLab - Code propre, performant, et badass. 🏸🔥**
