# BadLab - Spécifications Complètes

## 📋 Vue d'ensemble du projet

### Identité

**Nom :** BadLab  
**Tagline :** "Le labo des tournois de bad"  
**Positionnement :** Outil web gratuit, simple et badass pour gérer les tournois de badminton internes de clubs

### Objectif

Créer un outil web gratuit, moderne et flexible permettant aux clubs de badminton d'organiser et gérer des tournois internes de toutes tailles, du mini-tournoi de 8 joueurs pendant un cours jusqu'aux tournois de club de 100-150 participants.

### Ce que c'est / Ce que ce n'est pas

**✅ Ce que c'est :**
- Outil simple, gratuit, accessible sans barrières
- Focus sur les tournois internes de clubs
- Flexibilité maximale (formats, tailles, durées)
- Design trash/badass qui claque
- Expérience mobile-first

**❌ Ce que ce n'est PAS :**
- Pas un concurrent à Swiss Badminton / Tournament Software (tournois officiels)
- Pas un outil corporate avec 500 fonctionnalités
- Pas une solution payante avec tiers complexes
- Pas un truc archaïque années 2000

### Principe directeur

**"Flexibilité avant tout"** : L'outil doit s'adapter aux besoins du tournoi, pas l'inverse.

---

## 👥 Utilisateurs et Rôles

### Rôle 1 : Organisateur

**Profil :** Responsable du club, capitaine d'équipe, coach

**Besoins principaux :**
- Créer un tournoi rapidement (< 5 minutes pour un setup simple)
- Configurer le format selon le contexte (élimination, poules, mixte)
- Gérer les inscriptions (manuel ou auto)
- Générer le tableau de matchs
- Suivre l'avancement en temps réel
- Imprimer les documents nécessaires (tableau, feuilles de match)
- Consulter l'historique des tournois passés
- Dupliquer un tournoi existant pour gagner du temps

**Parcours type (mini-tournoi) :**
1. Se connecte
2. Clique "Nouveau tournoi"
3. Remplit les infos de base (nom, date, format)
4. Ajoute les joueurs (manuel ou inscription ouverte)
5. Génère le tableau
6. Lance le tournoi
7. Saisit les résultats
8. Affiche le classement final

**Temps de setup cible : < 3 minutes pour un tournoi simple**

---

### Rôle 2 : Joueur / Participant

**Profil :** Membres du club, invités

**Besoins principaux :**
- S'inscrire facilement (si inscription ouverte)
- Voir le planning/tableau de son tournoi
- Savoir quand et contre qui il joue
- Entrer les résultats de ses matchs
- Consulter le classement en temps réel
- Accéder au tournoi sans friction (pas de création de compte complexe)

**Parcours type :**
1. Reçoit le lien d'inscription
2. S'inscrit en 30 secondes
3. Reçoit confirmation par email
4. Jour J : ouvre le lien du tournoi
5. Consulte son planning/bracket
6. Joue ses matchs
7. Saisit les résultats depuis son téléphone
8. Consulte le classement final

---

### Rôle 3 : Spectateur (bonus)

**Profil :** Accompagnants, autres membres du club

**Besoins principaux :**
- Voir le tableau en temps réel
- Suivre l'avancement sans se connecter
- Affichage type "écran mural" pour projection

---

## 🎯 Fonctionnalités Détaillées

### 1. Gestion des Tournois

#### 1.1 Création de Tournoi

**Informations obligatoires :**
- Nom du tournoi
- Date de début
- Format du tournoi (voir section Formats)
- Type d'inscription (manuelle / ouverte)

**Informations optionnelles :**
- Date de fin (si tournoi sur plusieurs jours)
- Lieu
- Description
- Nombre de terrains disponibles
- Durée estimée par match (minutes)
- Heure de début
- Image de bannière (bonus)

**Workflow de création :**
```
Étape 1/4 : Infos de base
  → Nom, date, format, type inscription

Étape 2/4 : Participants
  → Ajout manuel OU génération lien inscription

Étape 3/4 : Configuration format
  → Paramètres spécifiques (nb poules, seeding, etc.)

Étape 4/4 : Récapitulatif
  → Validation et création
```

---

#### 1.2 Formats de Tournoi Supportés

**🎯 PRIORITÉ MVP : Poules + Élimination directe**

##### Format 1 : Élimination Directe (Single/Double Elimination)

**Configuration :**
- Simple élimination (1 défaite = éliminé)
- Double élimination (2 défaites pour être éliminé) - bonus V2
- Nombre de participants : 4 minimum, pas de maximum technique

**Fonctionnalités :**
- Gestion automatique des byes (si nombre impair)
- Placement initial :
  - Aléatoire complet
  - Seeding manuel (l'organisateur place les têtes de série)
  - Seeding automatique (basé sur ELO Swiss Badminton si renseigné)
- Génération du bracket visuel
- Progression automatique des vainqueurs

**Cas d'usage :**
- Mini-tournois rapides (8-16 joueurs)
- Phase finale après poules
- Tournois courts (2-4h)

---

##### Format 2 : Poules + Élimination (Priorité MVP)

**Phase 1 : Poules (Round-Robin)**

**Configuration :**
- Nombre de poules : 2-8 poules
- Joueurs par poule : 3-10 (idéal 4-6)
- Mode de jeu dans les poules :
  - Round-robin complet (tout le monde joue contre tout le monde)
  - Round-robin partiel (X matchs minimum) - bonus V2

**Répartition des joueurs :**
- Serpent (seeding) : si ELO renseignés, répartir les niveaux équitablement
- Aléatoire : si pas de seeding
- Manuelle : l'organisateur place manuellement

**Classement des poules :**
- Ordre de priorité :
  1. Nombre de victoires
  2. Sets gagnés/perdus (différence)
  3. Points gagnés/perdus (différence)
  4. Confrontation directe (si égalité à 2)

**Affichage :**
- Tableau par poule avec classement temps réel
- Grille des résultats (matrice)

---

**Phase 2 : Élimination Directe**

**Configuration :**
- Nombre de qualifiés par poule : 1-4 (typique : top 2)
- Mode de qualification :
  - Les X premiers de chaque poule
  - Les X meilleurs deuxièmes (si poules inégales)
- Génération du bracket final selon classement poules

**Fonctionnalités :**
- Transition automatique poules → élimination
- Respect du classement pour éviter les confrontations prématurées
- Génération bracket avec qualifiés placés selon leur rang

**Cas d'usage :**
- Tournois de club moyens/gros (20-60 joueurs)
- Permet à tout le monde de jouer plusieurs matchs
- Plus équitable qu'une élimination directe pure

---

##### Format 3 : Poules seules (Round-Robin complet)

**Configuration :**
- Une seule grande poule OU plusieurs poules
- Tout le monde joue contre tout le monde dans sa poule
- Classement final basé sur les résultats

**Cas d'usage :**
- Petits tournois conviviaux (8-12 joueurs)
- Pas d'élimination, tout le monde joue beaucoup
- Classement final = classement de la poule

**Statut :** V2 (après MVP)

---

##### Format 4 : Système Schoch / Suisse

**Principe :**
- Système d'appariement dynamique
- Les joueurs de niveau similaire s'affrontent au fur et à mesure
- Nombre de rondes défini à l'avance (typique : 5-7 rondes)

**Configuration :**
- Nombre de rondes
- Critères d'appariement (victoires, ELO)
- Gestion des joueurs déjà affrontés (éviter les doubles)

**Statut :** V2+ (complexité technique élevée)

---

#### 1.3 Gestion des Participants

**Option A : Liste fermée (inscription manuelle)**

**Workflow :**
- L'organisateur ajoute les participants un par un
- Ou upload CSV (bonus)

**Champs par participant :**
- Nom (obligatoire)
- Prénom (obligatoire)
- Email (optionnel)
- Niveau ELO Swiss Badminton (optionnel, pour seeding)
- Catégorie (optionnel : A/B/C ou Junior/Senior)
- Club d'origine (optionnel)

**Actions possibles :**
- Ajouter
- Modifier
- Supprimer
- Réorganiser (drag & drop)

---

**Option B : Inscription ouverte**

**Workflow :**
1. L'organisateur génère un lien d'inscription
2. Partage le lien (WhatsApp, email, etc.)
3. Les joueurs s'inscrivent eux-mêmes
4. L'organisateur clôture les inscriptions

**Formulaire d'inscription joueur :**
- Nom * (obligatoire)
- Prénom * (obligatoire)
- Email * (obligatoire, pour notifications)
- Téléphone (optionnel)
- Niveau auto-déclaré (dropdown : Débutant / Intermédiaire / Avancé / Compétition)
- Commentaire (optionnel)

**Paramètres de l'inscription :**
- Date limite d'inscription
- Nombre max de participants (optionnel)
- Liste d'attente automatique si complet (bonus)
- Champs personnalisés (bonus V2)

**Notifications automatiques :**
- Confirmation d'inscription (email)
- Rappel J-1 (email) - bonus
- Lien vers le tournoi (email jour J)

---

#### 1.4 Gestion des Doubles

**Types de tournoi :**
- Simple (joueurs individuels)
- Double (équipes de 2)
- Mixte (homme + femme par équipe)

**Configuration doubles :**

**Si inscription manuelle :**
- L'organisateur crée les équipes manuellement
- Paires prédéfinies

**Si inscription ouverte :**
- Option 1 : Inscription par équipe (les joueurs s'inscrivent en paire)
- Option 2 : Inscription individuelle + appariement manuel par organisateur
- Option 3 : Appariement aléatoire (bonus : équilibré par niveau)

**Si mixte :**
- Validation automatique homme/femme par équipe
- Ou champ "Genre" dans le formulaire d'inscription

**Affichage :**
- Nom des équipes : "Joueur1 / Joueur2"
- OU nom d'équipe personnalisé (bonus)

---

### 2. Génération du Tableau

#### 2.1 Seeding (Placement des joueurs)

**Option 1 : Aléatoire complet**
- Placement au hasard
- Pas de prise en compte du niveau
- Bouton "Régénérer" pour re-shuffle

**Option 2 : Seeding manuel**
- L'organisateur place les têtes de série (top 4, 8, 16...)
- Les autres joueurs placés aléatoirement
- Interface drag & drop

**Option 3 : Seeding automatique (basé sur ELO)**
- Si ELO Swiss Badminton renseigné
- Placement automatique selon classement
- Têtes de série réparties dans le bracket (éviter confrontations précoces)

**Pour les poules :**
- Répartition équilibrée des niveaux (serpent)
- Éviter de mettre 2 joueurs du même club dans la même poule (si info disponible)
- Respect du seeding pour répartir les têtes de série

---

#### 2.2 Gestion des Byes

**Contexte :** Si nombre de joueurs ≠ puissance de 2 (ex: 7, 10, 13 joueurs)

**Règles :**
- Calcul automatique du nombre de byes nécessaires
- Placement équitable :
  - Les têtes de série reçoivent les byes en priorité
  - OU répartition aléatoire si pas de seeding
- Affichage clair dans le bracket (case "BYE")

**Exemples :**
- 7 joueurs → 1 bye → bracket de 8
- 10 joueurs → 6 byes → bracket de 16

---

#### 2.3 Prévisualisation et Validation

**Avant de lancer le tournoi :**
- Affichage du tableau généré (bracket ou poules)
- Vérification visuelle par l'organisateur
- Actions possibles :
  - Valider et lancer
  - Régénérer (si aléatoire)
  - Ajuster manuellement (swap de joueurs)
  - Retour en arrière (modifier paramètres)

---

### 3. Pendant le Tournoi

#### 3.1 Saisie des Résultats

**Qui peut saisir ?**

L'organisateur définit au moment de la création :
- **Option 1 :** Organisateur uniquement (contrôle total)
- **Option 2 :** Joueurs peuvent saisir leurs propres résultats (confiance)
- **Option 3 :** Hybride (joueurs saisissent, organisateur valide) - bonus V2

**Formulaire de saisie :**

**Système de sets (badminton) :**
- Best of 3 sets (typique)
- Score par set : 21 points (30 max si prolongation)
- Validation automatique des règles :
  - Maximum 30 points
  - Écart de 2 points pour gagner (si 20-20 → 22-20 ou 21-23)
  - 3 sets max

**Exemple de saisie :**
```
Set 1 : [21] - [15]
Set 2 : [19] - [21]
Set 3 : [21] - [18]

→ Vainqueur : Joueur 1 (2 sets à 1)
```

**Cas particuliers :**
- Abandon (WO = walkover) : bouton dédié
- Disqualification (DQ) : bouton dédié
- Commentaire optionnel (ex: "blessure joueur 2")

**Workflow de validation (si mode hybride) :**
1. Joueur saisit le résultat
2. Notification à l'organisateur
3. Organisateur valide ou corrige
4. Tableau mis à jour

**En cas de conflit :**
- Si 2 joueurs saisissent des résultats différents
- Notification à l'organisateur
- L'organisateur tranche

---

#### 3.2 Affichage en Temps Réel

**Tableau principal (Bracket / Poules) :**
- Mise à jour automatique dès saisie résultat (WebSocket via Supabase Realtime)
- Pas de refresh manuel nécessaire
- Feedback visuel (highlight du match en cours)

**Pour élimination directe :**
- Bracket visuel avec connexions
- Vainqueurs progressent automatiquement
- Cases vides pour matchs à venir
- Scores affichés

**Pour poules :**
- Grille des matchs (matrice)
- Classement temps réel (tri automatique)
- Stats par joueur (victoires, sets, points)

---

**Planning des matchs :**

**Vue chronologique :**
- Liste des matchs à venir
- Match en cours en évidence
- Matches terminés (historique)

**Informations affichées :**
- Numéro du match
- Joueurs / Équipes
- Terrain (si nb terrains renseigné)
- Heure estimée (si horaires configurés)
- Statut (à jouer / en cours / terminé)

**Estimation horaire (bonus) :**
- Calcul basé sur :
  - Heure de début du tournoi
  - Durée moyenne par match (paramètre)
  - Nombre de terrains
  - Matches déjà joués

---

**Classement en Direct :**

**Affichage :**
- Podium (top 3) en évidence
- Classement complet
- Stats individuelles :
  - Matches joués / gagnés / perdus
  - Sets gagnés / perdus
  - Points marqués / encaissés
  - Ratio (optionnel)

**Mise à jour :**
- Automatique après chaque match
- Tri selon les critères définis (victoires > sets > points)

---

#### 3.3 Affichage Public / Projection

**Mode "Écran Mural" :**

**Objectif :** Projeter le tableau sur un écran dans la salle

**Fonctionnalités :**
- Interface full-screen
- Affichage du bracket complet OU grille de poule
- Prochain match en évidence (highlight)
- Mise à jour auto (refresh toutes les 10 secondes)
- Pas de contrôles (lecture seule)
- Design optimisé pour la distance (grosses typos)

**Accès :**
- URL dédiée : `/tournament/[id]/display`
- QR code pour accès rapide
- Pas de login requis

---

### 4. Impression & Export

#### 4.1 Documents Imprimables

**1. Tableau du tournoi (PDF)**

**Contenu :**
- Bracket complet (si élimination)
- Grilles de poules (si poules)
- Design clair et lisible
- Format A4 ou A3 (selon taille)
- Cases vides pour noter scores à la main (backup)

**Génération :**
- Bouton "Imprimer le tableau"
- PDF généré côté serveur
- Téléchargement automatique

---

**2. Feuilles de match (PDF)**

**Objectif :** Une feuille par match pour arbitrage manuel

**Contenu :**
- Numéro du match
- Nom des joueurs / équipes
- Grille pour noter les scores
  ```
  Set 1 : [ ] - [ ]
  Set 2 : [ ] - [ ]
  Set 3 : [ ] - [ ]
  ```
- Case signature arbitre (optionnel)
- QR code pour saisie rapide du résultat (bonus V2)

**Génération :**
- Toutes les feuilles en un PDF
- OU feuille par feuille
- Téléchargement / impression directe

---

**3. Ordre de jeu (PDF)**

**Contenu :**
- Liste complète des matchs
- Ordre chronologique
- Répartition par terrain
- Horaires estimés (si configurés)

**Format :**
```
Terrain 1          Terrain 2
---------          ---------
10:00 - Match #1   10:00 - Match #2
10:20 - Match #3   10:20 - Match #4
...
```

---

#### 4.2 Export des Données

**Format CSV (résultats complets) :**

**Colonnes :**
- Numéro match
- Date/heure
- Joueur/Équipe 1
- Joueur/Équipe 2
- Score Set 1
- Score Set 2
- Score Set 3
- Vainqueur
- Terrain

**Usage :** Import dans Excel, stats externes, archivage

---

**Format PDF (classement final) :**

**Contenu :**
- Podium (top 3)
- Classement complet
- Statistiques globales
- Logo du club (si renseigné)
- Date du tournoi

**Usage :** Communication, affichage, archivage

---

**Format JSON (bonus V2) :**

**Contenu :** Toutes les données du tournoi structurées

**Usage :** Intégration avec d'autres systèmes, backup

---

### 5. Après le Tournoi

#### 5.1 Classement Final

**Génération automatique :**
- Dès le dernier match terminé
- Tri selon les critères définis

**Affichage :**
- Podium visuel (top 3 en évidence)
- Classement complet
- Stats détaillées :
  - Nombre de matchs joués
  - Victoires / Défaites
  - Sets gagnés / perdus
  - Points marqués / encaissés
  - Ratio de victoires

**Partage :**
- Export PDF
- Lien direct vers le classement
- Envoi par email (optionnel, bonus V2)

---

#### 5.2 Archivage et Historique

**Pour l'organisateur :**

**Dashboard "Mes tournois" :**
- Liste de tous les tournois créés
- Statut : Brouillon / En cours / Terminé
- Tri : Date / Nom / Statut
- Recherche

**Accès au tournoi archivé :**
- Mode lecture seule
- Consultation des résultats
- Consultation des participants
- Téléchargement des exports

**Duplication de tournoi :**
- Bouton "Dupliquer ce tournoi"
- Reprend tous les paramètres (format, config, etc.)
- Ne reprend PAS les participants (sauf option)
- Gain de temps pour tournois récurrents

---

**Pour les joueurs (bonus V2) :**

**Historique personnel :**
- Liste des tournois auxquels il a participé
- Stats cumulées :
  - Nombre de tournois
  - Taux de victoires
  - Évolution (graphique)
- Accès aux détails de chaque tournoi

---

## 🚶 Parcours Utilisateurs Détaillés

### Parcours 1 : Mini-tournoi rapide (8 joueurs, 1h30)

**Contexte :** Entraînement du club, le coach veut faire un petit tournoi fun

**Avant le tournoi (5 minutes) :**

1. **Coach se connecte sur BadLab**
   - Email + password (déjà créé un compte avant)

2. **Crée le tournoi**
   - Clique "Nouveau tournoi"
   - Remplit :
     - Nom : "Tournoi du mardi soir"
     - Date : Aujourd'hui
     - Format : Élimination directe
     - Inscription : Liste fermée

3. **Ajoute les participants**
   - Saisit manuellement 8 noms (membres présents)
   - Pas besoin d'email ou niveau (juste pour le fun)

4. **Génère le tableau**
   - Clique "Générer le tableau"
   - Placement aléatoire
   - Visualise le bracket
   - Valide

5. **Lance le tournoi**
   - Affiche le bracket sur son téléphone/tablette
   - Ou projette sur un écran (mode affichage mural)

---

**Pendant le tournoi (1h30) :**

6. **Les matchs se jouent**
   - Les joueurs voient le bracket (pas de login requis)
   - Ils savent contre qui ils jouent

7. **Saisie des résultats**
   - Le coach saisit les scores après chaque match
   - Formulaire rapide : Score Set 1, Set 2, (Set 3)
   - Tableau mis à jour en temps réel

8. **Progression automatique**
   - Les vainqueurs avancent dans le bracket
   - Matches suivants générés automatiquement

---

**Fin du tournoi (5 minutes) :**

9. **Classement final**
   - Affiché automatiquement
   - Podium visible
   - Pas besoin d'export (juste pour le fun)

10. **Archivage automatique**
    - Le tournoi passe en statut "Terminé"
    - Reste accessible dans l'historique du coach

**Temps total de setup : < 3 minutes**  
**Expérience joueur : Zéro friction, juste jouer**

---

### Parcours 2 : Tournoi de club (40 joueurs, journée entière)

**Contexte :** Open du club annuel, tournoi sérieux avec inscription ouverte

**2 semaines avant le tournoi :**

1. **L'organisateur crée le tournoi**
   - Nom : "Open du Club 2024"
   - Date : 15/03/2024
   - Format : Poules (4 poules de 10) + Élimination (top 2 par poule)
   - Inscription : Ouverte
   - Date limite : 10/03/2024
   - Max participants : 40

2. **Configure les paramètres**
   - Nombre de terrains : 4
   - Durée par match : 20 minutes
   - Heure de début : 9h00

3. **Génère le lien d'inscription**
   - URL : `badlab.ch/register/abc123`
   - Partage le lien :
     - WhatsApp groupe du club
     - Email aux membres
     - Post sur réseaux sociaux

---

**Les joueurs s'inscrivent (J-14 à J-5) :**

4. **Un joueur clique sur le lien**
   - Formulaire simple :
     - Nom : John Doe
     - Prénom : John
     - Email : john@example.com
     - Niveau : Intermédiaire
   - Clique "S'inscrire"

5. **Confirmation**
   - Message : "Inscription confirmée !"
   - Email automatique :
     - Confirmation d'inscription
     - Lien vers le tournoi
     - Rappel de la date

6. **Liste des inscrits**
   - Le joueur peut voir qui est inscrit (lien public)
   - L'organisateur suit les inscriptions en temps réel

---

**J-5 : Clôture des inscriptions :**

7. **L'organisateur clôture**
   - 38 inscrits (2 places non prises)
   - Clique "Clôturer les inscriptions"
   - Plus d'inscriptions possibles

8. **Génération des poules**
   - Clique "Générer les poules"
   - Seeding basé sur niveau déclaré (optionnel)
   - Répartition équilibrée : 4 poules de 9-10 joueurs
   - Prévisualise les poules
   - Ajuste si besoin (swap manuel)
   - Valide

---

**Jour J - Matin (9h00) :**

9. **Préparation sur place**
   - L'organisateur arrive
   - Imprime les documents :
     - Tableau des poules (A3) → affiché au mur
     - Feuilles de match → pour arbitres
     - Ordre de jeu → planning terrains
   - Projette le tableau sur écran (mode affichage mural)

10. **Briefing joueurs**
    - "Le lien du tournoi est sur WhatsApp"
    - "Vous pouvez voir vos poules et saisir vos scores"
    - "Vérifiez l'ordre de jeu pour savoir quand vous jouez"

---

**Pendant les poules (9h00 - 13h00) :**

11. **Les matches se jouent**
    - Les joueurs consultent le planning sur leur téléphone
    - Ils savent quand et sur quel terrain ils jouent

12. **Saisie des résultats**
    - Option A : Les joueurs saisissent eux-mêmes depuis leur téléphone
    - Option B : Un arbitre/organisateur saisit après chaque match
    - Formulaire rapide : Score par set

13. **Suivi en temps réel**
    - Le classement des poules se met à jour automatiquement
    - L'écran mural affiche les résultats
    - Les joueurs voient leur position dans la poule

14. **Notifications**
    - "Votre prochain match : Terrain 2 dans 15 minutes"

---

**13h00 : Fin de la phase de poules :**

15. **Classement des poules finalisé**
    - Calcul automatique
    - Top 2 de chaque poule qualifiés (8 joueurs)

16. **Génération du tableau final**
    - Bracket d'élimination directe avec les 8 qualifiés
    - Placement selon classement poules :
      - 1er poule A vs 2e poule D
      - 1er poule B vs 2e poule C
      - etc.
    - Affichage du nouveau bracket

---

**13h30 - 16h00 : Phase finale :**

17. **Matches d'élimination**
    - Quarts de finale
    - Demi-finales
    - Finale + Petite finale
    - Saisie des résultats comme en poules

18. **Suivi en direct**
    - Le bracket se remplit au fur et à mesure
    - Écran mural affiche les vainqueurs

---

**16h00 : Fin du tournoi :**

19. **Podium**
    - 1er, 2e, 3e affichés automatiquement
    - Remise des prix

20. **Classement final**
    - Export PDF généré
    - Envoyé par email à tous les participants (optionnel)
    - Partagé sur les réseaux sociaux

21. **Archivage**
    - Le tournoi passe en "Terminé"
    - Accessible dans l'historique
    - Stats sauvegardées

---

**1 semaine plus tard :**

22. **L'organisateur consulte l'historique**
    - Voit les stats du tournoi
    - Télécharge le classement final (PDF)
    - Duplique le tournoi pour l'année prochaine (gain de temps)

---

### Parcours 3 : Joueur participant à un tournoi

**Avant le tournoi :**

1. **Reçoit le lien d'inscription**
   - WhatsApp : "Inscris-toi au tournoi : [lien]"

2. **Clique sur le lien**
   - Formulaire simple : Nom, Prénom, Email, Niveau
   - Clique "S'inscrire"

3. **Confirmation**
   - Message : "C'est bon, t'es inscrit !"
   - Email avec lien du tournoi

4. **Consulte la liste**
   - Clique sur le lien du tournoi
   - Voit qui est inscrit
   - Peut voir son niveau déclaré

---

**Jour J :**

5. **Arrive sur place**
   - Ouvre le lien du tournoi sur son téléphone
   - Se connecte (si demandé, sinon accès direct)

6. **Consulte son planning**
   - Voit sa poule : "Poule B"
   - Voit ses adversaires
   - Voit l'ordre de jeu : "Match #8 - Terrain 3 - ~10h30"

7. **Notification**
   - "Votre match dans 10 minutes - Terrain 3"

8. **Joue son match**
   - Contre l'adversaire indiqué
   - Sur le terrain indiqué

9. **Saisit le résultat**
   - Depuis son téléphone
   - Formulaire : Score par set
   - Valide

10. **Consulte le classement**
    - Voit sa position dans la poule
    - Voit les prochains matches

11. **Répète pour tous les matches de poule**

---

**Phase finale (si qualifié) :**

12. **Notification de qualification**
    - "Bravo, tu es qualifié pour les phases finales !"
    - "Ton prochain match : Quart de finale contre John Doe"

13. **Consulte le bracket**
    - Voit le tableau d'élimination
    - Voit son parcours potentiel

14. **Joue ses matches**
    - Saisit les résultats
    - Suit sa progression

---

**Fin du tournoi :**

15. **Consulte le classement final**
    - Voit sa position
    - Voit ses stats (matches, sets, points)

16. **Reçoit le classement par email (optionnel)**
    - PDF avec tous les résultats

17. **Plus tard : consulte l'historique**
    - Si compte créé, voit ses stats cumulées
    - Voit tous les tournois auxquels il a participé

---

## 💻 Stack Technique

### Frontend

**Framework :** SvelteKit 2.x

**Pourquoi SvelteKit :**
- Performance native exceptionnelle (compilation, pas de virtual DOM)
- Rendu hybride (SSR + CSR + SSG)
- Système de routing file-based intégré (`+page.svelte`, `+layout.svelte`)
- Server endpoints (`+server.ts`) pour API simple
- Excellente intégration avec Vercel/Netlify
- Réactivité native sans boilerplate
- TypeScript first-class

**UI & Styling :**
- Tailwind CSS (utility-first, rapide)
- DaisyUI (composants Tailwind avec theming)
- lucide-svelte (icônes modernes)
- Svelte transitions natives (animations fluides)

**État global :**
- Svelte Stores natifs (writable, readable, derived)
- Context API Svelte pour états partagés

**Formulaires :**
- Felte (formulaires Svelte avec validation)
- Zod (validation schema TypeScript)

**Temps réel :**
- Supabase Realtime (WebSocket)
- Mise à jour auto des tableaux/classements

---

### Backend & Database

**Backend-as-a-Service :** Supabase

**Pourquoi Supabase :**
- PostgreSQL (robuste, relationnel)
- Auth intégrée (email, OAuth)
- Realtime subscriptions (WebSocket)
- API auto-générée (REST + GraphQL)
- Storage pour fichiers (bonus)
- Tier gratuit généreux :
  - 500 MB base de données
  - 2 GB stockage
  - 50k MAU (monthly active users)
- Dashboard intégré
- Row Level Security (RLS) pour sécurité

**Authentification :**
- Email + Password (Supabase Auth)
- Magic Link (email sans password) - recommandé pour joueurs
- Google OAuth (bonus, facilite inscription)

---

### Hébergement & Déploiement

**Frontend :** Vercel

**Pourquoi Vercel :**
- Intégration native Next.js
- Déploiement automatique (Git push)
- Edge Network (performance mondiale)
- Analytics intégré
- Tier gratuit :
  - 100 GB bande passante/mois
  - Déploiements illimités
  - SSL automatique
- Custom domain gratuit

**Backend/DB :** Supabase

**Domaine :**
- Priorité : `badlab.ch`
- Fallback : `badlab.io` ou `badlab.app`

---

### Génération PDF

**Librairie :** react-pdf ou jsPDF

**Usage :**
- Tableaux de tournoi
- Feuilles de match
- Classements finaux
- Génération côté serveur (API Route)

---

### Outils de développement

**IDE :** VS Code
**Linting :** ESLint + Prettier
**TypeScript :** Strict mode
**Git :** GitHub
**CI/CD :** GitHub Actions (optionnel)

---

## 🗄️ Modèle de Données (Schéma BDD)

### Table : users

**Rôle :** Stocke les utilisateurs (organisateurs + joueurs)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**Notes :**
- `id` est géré par Supabase Auth (pas besoin de créer manuellement)
- `email` unique pour éviter doublons
- `name` optionnel (peut être rempli à l'inscription)
- `avatar_url` bonus pour photo de profil

---

### Table : tournaments

**Rôle :** Stocke les tournois créés

```sql
CREATE TABLE tournaments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organizer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  
  -- Infos de base
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  banner_url TEXT,
  
  -- Dates
  start_date DATE NOT NULL,
  end_date DATE,
  start_time TIME,
  
  -- Configuration
  format TEXT NOT NULL, -- 'elimination', 'pools_elimination', 'round_robin', 'swiss'
  tournament_type TEXT NOT NULL, -- 'single', 'double', 'mixed'
  inscription_type TEXT NOT NULL, -- 'closed', 'open'
  inscription_deadline TIMESTAMP,
  max_participants INTEGER,
  
  -- Config technique
  nb_courts INTEGER,
  match_duration INTEGER, -- minutes
  
  -- Statut
  status TEXT DEFAULT 'draft', -- 'draft', 'registration_open', 'in_progress', 'finished'
  
  -- Settings spécifiques au format (JSON)
  settings JSONB DEFAULT '{}',
  -- Exemple pour pools_elimination:
  -- {
  --   "nb_pools": 4,
  --   "players_per_pool": 10,
  --   "qualified_per_pool": 2,
  --   "seeding_method": "auto" | "manual" | "random"
  -- }
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_tournaments_organizer ON tournaments(organizer_id);
CREATE INDEX idx_tournaments_status ON tournaments(status);
CREATE INDEX idx_tournaments_start_date ON tournaments(start_date);
```

---

### Table : participants

**Rôle :** Stocke les participants d'un tournoi (joueurs individuels)

```sql
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL, -- NULL si joueur non inscrit (manuel)
  
  -- Infos joueur
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  club TEXT,
  
  -- Niveau
  elo_rating INTEGER,
  level TEXT, -- 'beginner', 'intermediate', 'advanced', 'competition'
  
  -- Seeding
  seed INTEGER, -- position dans le classement (1 = tête de série #1)
  
  -- Poule (si format poules)
  pool_id UUID, -- NULL si pas encore assigné
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index
CREATE INDEX idx_participants_tournament ON participants(tournament_id);
CREATE INDEX idx_participants_user ON participants(user_id);
CREATE INDEX idx_participants_pool ON participants(pool_id);
```

---

### Table : teams

**Rôle :** Stocke les équipes (pour doubles/mixtes)

```sql
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  
  -- Joueurs
  player1_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  player2_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  
  -- Info équipe
  team_name TEXT, -- Optionnel, sinon "Player1 / Player2"
  
  -- Seeding
  seed INTEGER,
  
  -- Poule (si format poules)
  pool_id UUID,
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  -- Contrainte : pas de doublons
  UNIQUE(tournament_id, player1_id, player2_id)
);

-- Index
CREATE INDEX idx_teams_tournament ON teams(tournament_id);
CREATE INDEX idx_teams_pool ON teams(pool_id);
```

---

### Table : pools

**Rôle :** Stocke les poules (si format avec poules)

```sql
CREATE TABLE pools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  
  pool_name TEXT NOT NULL, -- "Poule A", "Poule B"...
  pool_number INTEGER NOT NULL, -- 1, 2, 3...
  
  created_at TIMESTAMP DEFAULT NOW(),
  
  UNIQUE(tournament_id, pool_number)
);

-- Index
CREATE INDEX idx_pools_tournament ON pools(tournament_id);
```

---

### Table : matches

**Rôle :** Stocke tous les matchs du tournoi

```sql
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  
  -- Position dans le tournoi
  round INTEGER NOT NULL, -- 1 = premier tour, 2 = 1/4, 3 = 1/2, 4 = finale
  match_number INTEGER NOT NULL, -- numéro unique dans le round
  phase TEXT, -- 'pool', 'elimination', 'final'
  
  -- Poule (si match de poule)
  pool_id UUID REFERENCES pools(pool_id),
  
  -- Planning
  court INTEGER, -- terrain (1, 2, 3...)
  scheduled_time TIMESTAMP,
  
  -- Participants (soit participants, soit teams)
  participant1_id UUID REFERENCES participants(id),
  participant2_id UUID REFERENCES participants(id),
  team1_id UUID REFERENCES teams(id),
  team2_id UUID REFERENCES teams(id),
  
  -- Résultats
  score_participant1 JSONB, -- [21, 19, 21] = sets gagnés
  score_participant2 JSONB, -- [15, 21, 18]
  winner_id UUID, -- ID du vainqueur (participant ou team)
  
  -- Statut
  status TEXT DEFAULT 'pending', -- 'pending', 'in_progress', 'finished', 'walkover', 'disqualified'
  
  -- Métadonnées
  entered_by UUID REFERENCES users(id), -- qui a saisi le résultat
  validated BOOLEAN DEFAULT false, -- si validation organisateur requise
  comment TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Contrainte : au moins un participant/team de chaque côté
  CHECK (
    (participant1_id IS NOT NULL AND participant2_id IS NOT NULL) OR
    (team1_id IS NOT NULL AND team2_id IS NOT NULL)
  )
);

-- Index
CREATE INDEX idx_matches_tournament ON matches(tournament_id);
CREATE INDEX idx_matches_pool ON matches(pool_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_round ON matches(tournament_id, round);
```

---

### Table : pool_standings

**Rôle :** Stocke le classement des poules (mis à jour après chaque match)

```sql
CREATE TABLE pool_standings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pool_id UUID REFERENCES pools(id) ON DELETE CASCADE,
  
  -- Participant (soit participant, soit team)
  participant_id UUID REFERENCES participants(id),
  team_id UUID REFERENCES teams(id),
  
  -- Stats
  matches_played INTEGER DEFAULT 0,
  matches_won INTEGER DEFAULT 0,
  matches_lost INTEGER DEFAULT 0,
  sets_won INTEGER DEFAULT 0,
  sets_lost INTEGER DEFAULT 0,
  points_scored INTEGER DEFAULT 0,
  points_conceded INTEGER DEFAULT 0,
  
  -- Classement
  position INTEGER,
  
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Contrainte : un seul participant OU team
  CHECK (
    (participant_id IS NOT NULL AND team_id IS NULL) OR
    (participant_id IS NULL AND team_id IS NOT NULL)
  ),
  
  UNIQUE(pool_id, participant_id),
  UNIQUE(pool_id, team_id)
);

-- Index
CREATE INDEX idx_pool_standings_pool ON pool_standings(pool_id);
CREATE INDEX idx_pool_standings_participant ON pool_standings(participant_id);
CREATE INDEX idx_pool_standings_team ON pool_standings(team_id);
```

---

### Table : notifications (bonus V2)

**Rôle :** Stocke les notifications à envoyer aux joueurs

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
  
  type TEXT NOT NULL, -- 'match_ready', 'result_entered', 'tournament_start', etc.
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  
  read BOOLEAN DEFAULT false,
  sent_at TIMESTAMP DEFAULT NOW(),
  
  -- Data supplémentaire (JSON)
  data JSONB DEFAULT '{}'
);

-- Index
CREATE INDEX idx_notifications_user ON notifications(user_id, read);
CREATE INDEX idx_notifications_tournament ON notifications(tournament_id);
```

---

## 🚀 Phases de Développement

### Phase 0 : Setup Initial (Semaine 1)

**Objectif :** Mettre en place l'infrastructure de base

**Tâches :**

**1. Initialisation du projet**
- [ ] Créer repo GitHub : `badlab`
- [ ] Initialiser Next.js 15 avec App Router
  ```bash
  npx create-next-app@latest badlab --typescript --tailwind --app
  ```
- [ ] Setup Tailwind CSS + configuration custom
- [ ] Installer Shadcn/ui
  ```bash
  npx shadcn-ui@latest init
  ```
- [ ] Installer dépendances de base :
  - Zustand (state management)
  - React Hook Form + Zod (formulaires)
  - Lucide Icons (icônes)

**2. Configuration Supabase**
- [ ] Créer projet Supabase : "BadLab Production"
- [ ] Configurer les tables (exécuter les scripts SQL ci-dessus)
- [ ] Activer Supabase Auth (email + magic link)
- [ ] Configurer Row Level Security (RLS)
- [ ] Récupérer les clés API (anon key + service role key)

**3. Configuration Vercel**
- [ ] Créer projet Vercel lié au repo GitHub
- [ ] Configurer les variables d'environnement :
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (pour API Routes)
- [ ] Activer déploiement automatique (git push → deploy)

**4. Design System**
- [ ] Créer le styleguide (voir STYLEGUIDE.md)
- [ ] Définir les couleurs :
  - Noir : `#000000`
  - Rouge badass : `#FF0000` ou `#E63946`
  - Jaune criard : `#FFD60A`
  - Vert néon : `#39FF14`
  - Gris foncé : `#1A1A1A`
- [ ] Configurer Tailwind avec les couleurs custom
- [ ] Créer les composants de base Shadcn :
  - Button
  - Input
  - Card
  - Dialog
  - Toast
  - Select
  - Checkbox

**5. Structure du projet**
```
/app
  /auth
    /login
    /register
  /dashboard
  /tournament/[id]
  /register/[id]
  /api
    /tournaments
    /matches
/components
  /ui (shadcn)
  /tournament
  /layout
/lib
  /supabase
  /utils
  /hooks
  /store (zustand)
/types
/styles
```

**Livrable :** Projet initialisé, design system défini, infrastructure prête

---

### Phase 1 : MVP Core - Tournoi Simple (Semaines 2-4)

**Objectif :** Créer un tournoi d'élimination directe de A à Z

**Fonctionnalités essentielles :**

**Semaine 2 : Auth + Dashboard**

- [ ] Page de connexion (`/auth/login`)
  - Email + password
  - Magic link (email sans password)
- [ ] Page d'inscription (`/auth/register`)
- [ ] Dashboard organisateur (`/dashboard`)
  - Liste des tournois (vide au début)
  - Bouton "Créer un tournoi" (CTA principal)
  - Sidebar navigation
- [ ] Layout global (header, nav, footer)

**Semaine 3 : Création de tournoi + Participants**

- [ ] Formulaire création tournoi (multi-steps)
  - Étape 1 : Infos de base (nom, date, format = élimination)
  - Étape 2 : Type inscription (manuel uniquement pour MVP)
  - Étape 3 : Ajout participants (liste manuelle)
  - Étape 4 : Récapitulatif et validation
- [ ] Ajout manuel de participants
  - Formulaire : Nom, Prénom
  - Liste dynamique (ajouter/supprimer)
  - Minimum 4 participants
- [ ] Sauvegarde du tournoi (statut "draft")

**Semaine 4 : Génération tableau + Affichage**

- [ ] Génération du bracket (élimination directe)
  - Algorithme de placement (aléatoire)
  - Gestion des byes automatique
  - Calcul des rounds (log2)
- [ ] Composant Bracket visuel
  - Affichage en arbre
  - Connexions visuelles
  - Responsive (scroll horizontal mobile)
- [ ] Page du tournoi (`/tournament/[id]`)
  - Vue organisateur (éditable)
  - Vue publique (lecture seule)
- [ ] Bouton "Lancer le tournoi" (statut → "in_progress")

**Livrable :** Création d'un tournoi simple + affichage du bracket

---

### Phase 2 : Saisie Résultats + Temps Réel (Semaines 5-6)

**Objectif :** Permettre de saisir les résultats et voir le tableau se mettre à jour

**Semaine 5 : Saisie résultats**

- [ ] Formulaire de saisie de résultat
  - Modal/Dialog
  - Score par set (21 points max, validation règles badminton)
  - Bouton "Abandon" (WO)
  - Validation automatique
- [ ] Logique de progression
  - Vainqueur avance dans le bracket
  - Génération du match suivant
  - Mise à jour de la BDD
- [ ] Permissions
  - Organisateur : peut saisir tous les résultats
  - Joueurs : pas encore (V2)

**Semaine 6 : Temps réel + Classement**

- [ ] Supabase Realtime
  - Subscription sur la table `matches`
  - Mise à jour auto du bracket (WebSocket)
- [ ] Classement final
  - Calcul automatique dès dernier match terminé
  - Podium (top 3)
  - Affichage visuel (médailles, confettis)
- [ ] Statut tournoi
  - Passer de "in_progress" à "finished"
  - Archivage automatique

**Livrable :** Tournoi complet jouable de A à Z en temps réel

---

### Phase 3 : Format Poules + Élimination (Semaines 7-9)

**Objectif :** Ajouter le format "Poules + Élimination" (priorité demandée)

**Semaine 7 : Configuration poules**

- [ ] Ajouter "pools_elimination" dans les formats
- [ ] Formulaire configuration :
  - Nombre de poules (2-8)
  - Joueurs par poule (auto ou manuel)
  - Nombre de qualifiés par poule (1-4)
- [ ] Algorithme de répartition
  - Serpent (si seeding)
  - Aléatoire
  - Manuel (drag & drop)
- [ ] Génération des poules (table `pools` + assignation participants)

**Semaine 8 : Phase de poules**

- [ ] Génération des matchs de poules (round-robin)
- [ ] Composant Grille de poule
  - Matrice des matchs
  - Classement temps réel
  - Stats (victoires, sets, points)
- [ ] Saisie résultats matchs de poule
- [ ] Calcul classement poule
  - Tri : victoires > sets > points > confrontation directe

**Semaine 9 : Transition poules → élimination**

- [ ] Détection fin de phase poules
  - Tous les matchs de poules terminés
- [ ] Extraction des qualifiés
  - Top N par poule selon config
- [ ] Génération bracket élimination
  - Placement selon classement poules
  - Éviter confrontations prématurées (1er vs 2e différentes poules)
- [ ] Affichage des 2 phases
  - Onglets "Poules" / "Phase finale"
  - Navigation fluide

**Livrable :** Format "Poules + Élimination" complet et fonctionnel

---

### Phase 4 : Inscription Ouverte + Vue Joueur (Semaines 10-12)

**Objectif :** Permettre aux joueurs de s'inscrire eux-mêmes et de suivre le tournoi

**Semaine 10 : Système d'inscription**

- [ ] Génération de lien d'inscription
  - URL unique : `/register/[tournamentId]`
  - QR code (bonus)
- [ ] Page d'inscription publique
  - Formulaire : Nom, Prénom, Email, Niveau
  - Validation (limite participants, deadline)
  - Confirmation visuelle
- [ ] Email de confirmation
  - Template email
  - Lien vers le tournoi
  - Rappel date/lieu
- [ ] Dashboard organisateur
  - Liste des inscrits temps réel
  - Bouton "Clôturer les inscriptions"

**Semaine 11 : Vue joueur**

- [ ] Page tournoi vue joueur (`/tournament/[id]`)
  - Sans login (accès public)
  - Affichage bracket/poules (lecture seule)
  - Highlight des matches du joueur (si connecté)
- [ ] Planning personnel
  - "Vos prochains matchs"
  - "Vos matches terminés"
- [ ] Auth joueur (optionnelle)
  - Magic link (pas de password)
  - Historique tournois (si connecté)

**Semaine 12 : Saisie résultats par joueurs**

- [ ] Activer saisie résultats par joueurs (config tournoi)
- [ ] Permissions
  - Joueur peut saisir le résultat de SON match
  - Notification à l'adversaire
- [ ] Système de validation (bonus)
  - Joueur 1 saisit → "En attente validation"
  - Joueur 2 valide OU organisateur tranche

**Livrable :** Parcours joueur complet (inscription → jeu → résultats)

---

### Phase 5 : Impression & Export (Semaine 13)

**Objectif :** Permettre d'imprimer et d'exporter les données du tournoi

**Tâches :**

- [ ] Librairie PDF (react-pdf ou jsPDF)
- [ ] Génération PDF tableau
  - Bracket visuel
  - Grilles de poules
  - Format A4/A3
- [ ] Génération feuilles de match
  - Template PDF
  - Une feuille par match
  - QR code (bonus)
- [ ] Génération ordre de jeu
  - Planning par terrain
  - Horaires estimés
- [ ] Export CSV résultats
  - Tous les matchs
  - Classements finaux
- [ ] Boutons d'export dans l'UI
  - Dashboard organisateur
  - Page tournoi

**Livrable :** Outils d'impression et export complets

---

### Phase 6 : Mode Affichage Mural (Semaine 14)

**Objectif :** Créer une vue optimisée pour projection sur écran

**Tâches :**

- [ ] Route dédiée : `/tournament/[id]/display`
- [ ] Interface full-screen
  - Bracket agrandi
  - Grilles de poules agrandies
  - Prochain match en évidence
- [ ] Mise à jour auto
  - Refresh toutes les 10 secondes
  - WebSocket temps réel
- [ ] Design optimisé
  - Typo très grande
  - Contraste élevé
  - Pas de contrôles (lecture seule)
- [ ] QR code d'accès
  - Généré sur page tournoi
  - Scan → accès direct mode affichage

**Livrable :** Mode affichage mural fonctionnel

---

### Phase 7 : Historique & Duplication (Semaine 15)

**Objectif :** Permettre de consulter l'historique et dupliquer des tournois

**Tâches :**

- [ ] Dashboard "Mes tournois"
  - Onglets : En cours / Terminés / Brouillons
  - Tri par date
  - Recherche
- [ ] Page tournoi archivé
  - Lecture seule
  - Affichage des résultats finaux
  - Stats globales
- [ ] Duplication de tournoi
  - Bouton "Dupliquer"
  - Reprend tous les paramètres
  - NE reprend PAS les participants (option)
  - Nouveau tournoi en statut "draft"
- [ ] Stats joueur (bonus)
  - Historique personnel
  - Tournois participés
  - Taux de victoires
  - Graphiques (bonus)

**Livrable :** Gestion complète de l'historique

---

### Phase 8 : Gestion des Doubles (Semaine 16)

**Objectif :** Supporter les tournois de doubles

**Tâches :**

- [ ] Type de tournoi : Simple / Double / Mixte
- [ ] Création d'équipes
  - Formulaire : Joueur 1 + Joueur 2
  - OU Appariement automatique
- [ ] Inscription ouverte (doubles)
  - Option : inscription par équipe
  - Option : inscription solo + appariement
- [ ] Affichage doubles
  - "Joueur1 / Joueur2"
  - OU nom d'équipe custom
- [ ] Logique identique (bracket, poules, etc.)
  - Utilise `teams` au lieu de `participants`

**Livrable :** Support complet des doubles

---

### Phase 9 : Polish & Optimisations (Semaines 17-18)

**Objectif :** Améliorer l'UX, corriger les bugs, optimiser

**Semaine 17 : UX/UI**

- [ ] Animations fluides (Framer Motion)
- [ ] Micro-interactions (hover, focus, active)
- [ ] Loading states (skeleton loaders)
- [ ] Messages d'erreur clairs
- [ ] Toasts de confirmation
- [ ] Optimisation mobile (touch gestures)

**Semaine 18 : Tests & Corrections**

- [ ] Tests avec un club pilote (beta test)
- [ ] Collecte de feedback
- [ ] Corrections bugs identifiés
- [ ] Optimisation performance :
  - Lazy loading
  - Code splitting
  - Image optimization
- [ ] SEO basique :
  - Meta tags
  - Sitemap
  - robots.txt

**Livrable :** App production-ready, testée et optimisée

---

### Phase 10+ : Nice-to-Have (Post-MVP)

**Fonctionnalités futures :**

**Format Schoch/Suisse**
- Système d'appariement dynamique
- Algorithme complexe (prio basse)

**Notifications push**
- Web Push API
- Notifications en temps réel ("Votre match dans 5 min")

**Multi-langue**
- i18n (français, allemand, anglais)
- Switch de langue

**Intégration ELO Swiss Badminton**
- API Swiss Badminton (si disponible)
- Import automatique des ELO

**Statistiques avancées**
- Graphiques (charts.js ou recharts)
- Évolution des joueurs
- Analytics tournois

**Mode hors-ligne (PWA)**
- Service Worker
- Fonctionnement sans connexion
- Synchronisation auto

**Import CSV participants**
- Upload CSV
- Mapping colonnes
- Validation et import

**QR codes sur feuilles de match**
- Scan QR → formulaire saisie résultat pré-rempli
- Gain de temps saisie

**Système de validation avancé**
- Workflow approbation (joueur 1 → joueur 2 → orga)
- Gestion des conflits

**Customisation tournoi**
- Logo du club
- Couleurs personnalisées
- Bannière custom

---

## 📊 Métriques de Succès

### Objectifs 3 mois post-lancement

| Métrique | Cible |
|----------|-------|
| Clubs utilisateurs | 10+ |
| Tournois créés | 50+ |
| Joueurs inscrits (total) | 500+ |
| Taux de complétion tournoi | > 80% |
| NPS (Net Promoter Score) | > 50 |

### KPIs à tracker

**Acquisition :**
- Nouveaux comptes créés / semaine
- Source de trafic (bouche-à-oreille, réseaux, etc.)

**Engagement :**
- Nombre de tournois créés / semaine
- Nombre de participants / tournoi (moyenne)
- Taux de tournois terminés (vs. abandonnés)

**Rétention :**
- Organisateurs récurrents (2+ tournois)
- Délai entre 2 tournois (même organisateur)

**Performance technique :**
- Temps de chargement page
- Taux d'erreur API
- Uptime (> 99%)

---

## ✅ Critères de Validation MVP

**Le MVP sera considéré comme prêt quand :**

- [ ] Un organisateur peut créer un tournoi d'élimination directe en < 5 minutes
- [ ] Un organisateur peut créer un tournoi "Poules + Élimination" fonctionnel
- [ ] Les joueurs peuvent s'inscrire via un lien (inscription ouverte)
- [ ] Les résultats peuvent être saisis et le tableau se met à jour en temps réel
- [ ] Le classement final est généré automatiquement
- [ ] L'affichage mural fonctionne (projection sur écran)
- [ ] Les PDFs peuvent être générés (tableau, feuilles de match)
- [ ] L'historique des tournois est accessible
- [ ] L'app est responsive (mobile + desktop)
- [ ] L'app est déployée sur Vercel avec domaine badlab.ch
- [ ] Un club pilote a testé et validé l'UX

---

## 🚨 Risques et Mitigations

### Risque 1 : Complexité des formats de tournoi

**Problème :** Les formats (surtout poules + élimination) peuvent devenir complexes

**Mitigation :**
- Commencer par élimination simple (MVP)
- Ajouter les formats progressivement
- Tester chaque format avec un club pilote
- Limiter les options (éviter la paralysie du choix)

---

### Risque 2 : Performance en temps réel

**Problème :** Trop de connexions WebSocket simultanées peuvent ralentir

**Mitigation :**
- Supabase Realtime optimisé pour ça (scale automatique)
- Limiter les subscriptions (uniquement tournoi en cours)
- Fallback : polling toutes les 5 secondes si WebSocket fail

---

### Risque 3 : Adoption par les clubs

**Problème :** Les clubs ont leurs habitudes (Excel, papier)

**Mitigation :**
- Onboarding très simple (pas de barrière)
- Démonstration en live (vidéo)
- Offrir de l'aide pour le premier tournoi (support direct)
- Gratuit = pas de friction financière

---

### Risque 4 : Bugs pendant un tournoi live

**Problème :** Un bug critique pendant un tournoi = désastre

**Mitigation :**
- Tests exhaustifs avant lancement
- Beta test avec 2-3 clubs pilotes
- Système de rollback (Vercel = déploiements versionnés)
- Support réactif (WhatsApp/email direct pendant beta)

---

## 📞 Support & Feedback

### Beta Test

**Phase beta :** Semaines 17-18

**Clubs pilotes :** 2-3 clubs volontaires

**Process :**
1. Organiser un tournoi test avec le club
2. Observer l'utilisation en live
3. Collecter feedback immédiat
4. Itérer rapidement (hot fixes)

**Incentive :** Accès anticipé + mention dans les crédits

---

### Support post-lancement

**Canaux :**
- Email : support@badlab.ch
- WhatsApp : Numéro dédié (temporaire, beta)
- FAQ / Documentation en ligne

**Engagement :**
- Réponse < 24h
- Fix bugs critiques < 48h

---

## 🎯 Récapitulatif des Priorités

### Must-have (MVP)

1. ✅ Création tournoi élimination directe
2. ✅ Création tournoi poules + élimination
3. ✅ Inscription ouverte (lien partageable)
4. ✅ Saisie résultats temps réel
5. ✅ Affichage mural
6. ✅ Export PDF (tableau + feuilles)
7. ✅ Responsive mobile

### Should-have (Post-MVP proche)

8. Gestion des doubles
9. Historique + duplication tournois
10. Stats avancées
11. Notifications email

### Nice-to-have (V2+)

12. Format Schoch/Suisse
13. Intégration ELO Swiss Badminton
14. Multi-langue
15. PWA (mode hors-ligne)
16. QR codes saisie rapide

---

## 🏁 Prochaines Étapes

**Immédiat :**
1. ✅ Valider ce document de spec
2. ✅ Créer le styleguide (STYLEGUIDE.md)
3. ✅ Créer les guidelines de dev (DEV-GUIDELINES.md)
4. Acheter le domaine badlab.ch
5. Initialiser le projet (Phase 0)

**Semaine 1 :**
- Setup complet (Vercel, Supabase, Next.js)
- Design system en place
- Premiers composants

**Go ! 🚀**
