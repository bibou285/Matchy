# MATCHY — Connecting People with Opportunities

> **"Less searching. More matching."**  
> *Les bonnes personnes, au bon endroit, au bon moment.*

---

## 📌 Executive Summary & Project Vision

### 💡 The Challenge We Are Solving (The Tunisian Context)
In Tunisia today, finding a reliable worker or securing a job opportunity is heavily fragmented. Everyday individuals and businesses frequently turn to social media—scrolling through scattered **Facebook groups**, posting *"Chkoun yaaref..."* ("Who knows a good..."), or replying to unverified posts to find an electrician, plumber, technician, or artisan.

This informal process creates critical challenges:
- **Zero Structure & Lost Information:** Important job requests and service offers quickly get buried under feeds and comments.
- **Lack of Proximity Matching:** People struggle to find professionals who are actually nearby and available right now.
- **No Trust & Quality Assurance:** Difficulty evaluating the reliability, skills, past work, and credibility of service providers.
- **Lost Opportunities for Skilled Workers:** Talented technicians and freelancers lack a dedicated, professional space to market their skills and connect with paying clients directly.

### 🎯 What is Matchy?
**Matchy** is a modern, mobile-first marketplace platform designed specifically to bridge this gap. By centralizing service requests and job opportunities, Matchy replaces chaotic social media searching with an intuitive, location-aware matching engine.

Whether a homeowner urgently needs an emergency electrical fix or a skilled carpenter is looking to expand their clientele, **Matchy matches them based on three essential pillars:**
1. 📍 **Location & Proximity:** Find nearby professionals or local gigs across Tunisian governorates and cities.
2. 🛠️ **Verified Skills & Categories:** Specific trades (plumbing, electricity, IT, mechanics, construction, household help, etc.).
3. ⏱️ **Real-Time Availability:** Distinguish between emergency immediate requests and scheduled assignments.

**Our Mission:** Make finding the right person or opportunity faster, easier, and accessible to everyone.

---

## 👥 Target Users & Personas

| User Role | Profile | Core Needs |
| :--- | :--- | :--- |
| **The Client / Seeker** *(Demand)* | Homeowners, tenants, small business owners, recruiters | Quick search, transparent ratings, nearby workers, fast response times, emergency support. |
| **The Provider / Artisan** *(Supply)* | Electricians, plumbers, mechanics, technicians, freelancers, job seekers | Direct access to clients, verified profile, portfolio showcase, job alerts, flexible schedule. |

---

## 🏗️ System Architecture & Tech Stack

```
┌────────────────────────────────────────────────────────┐
│                   MATCHY MOBILE APP                    │
│   React Native (v0.88) • Expo (v58) • Expo Router      │
│     TypeScript • Reanimated • Native Wind / CSS        │
└───────────────────────────▲────────────────────────────┘
                            │ REST / JSON
┌───────────────────────────▼────────────────────────────┐
│                  MATCHY BACKEND API                    │
│        Node.js • Express (v5) • TypeScript (tsx)       │
│    Helmet • Rate Limiting • Zod Validation • JWT       │
└───────────────────────────▲────────────────────────────┘
                            │ SQL Queries / ORM (Prisma / pg)
┌───────────────────────────▼────────────────────────────┐
│                  POSTGRESQL DATABASE                   │
│    Users & Profiles • Skills • Service Requests        │
│          Matches & Bids • Reviews • Messages           │
└────────────────────────────────────────────────────────┘
```

### Mobile App (`/mobile`)
- **Framework:** [Expo SDK 58](https://expo.dev) + [React Native 0.88](https://reactnative.dev) + React 19
- **Routing:** [Expo Router](https://docs.expo.dev/router/introduction/) (File-based navigation)
- **Language:** TypeScript
- **Styling & UI:** Custom Theme (Matchy Deep Purple `#640FCD`, Soft Lilac `#F8F5FF`), Safe Area Context, Reanimated

### Backend API (`/backend`)
- **Runtime:** [Node.js](https://nodejs.org) + [TypeScript](https://www.typescriptlang.org/)
- **Framework:** [Express.js 5](https://expressjs.com/)
- **Security:** Helmet, CORS Whitelisting, Express Rate Limit, Input Sanitization
- **Development Tooling:** `tsx` for high-speed hot-reloading

---

## 🛡️ Hackathon Security Audit & Safeguards

To ensure a competition-grade submission with strict security measures, the following safeguards are implemented:

| Category | Security Measure | Implementation |
| :--- | :--- | :--- |
| **Headers & Traffic** | HTTP Security Headers | `helmet` configured with Content-Security-Policy & HSTS |
| **Brute Force Protection** | Rate Limiting | `express-rate-limit` (100 req/15min general, 10 req/15min auth) |
| **Input Validation** | Strict Schema Validation | Payload sanitization, email regex check, password complexity |
| **Data Protection** | Password Hashing & JWT | Salted bcrypt hashing, short-lived JWT tokens, no credentials in logs |
| **CORS Policy** | Origin Whitelisting | Restricted cross-origin access between mobile/web and backend |
| **Mobile Client Storage** | Secure Storage | Non-sensitive tokens only, safe password inputs (`secureTextEntry`) |

---

## 📱 Mobile Interfaces Walkthrough (Hackathon Demo Flow)

```
                                  ┌──────────────────────────┐
                                  │      0. Splash Screen    │
                                  │   (Matchy Animated Logo) │
                                  └────────────┬─────────────┘
                                               │
                                               ▼
                                  ┌──────────────────────────┐
                                  │   1. Login Gateway       │
                                  │  - Rôle: Admin vs User   │
                                  │  - Pack: Seeker/Provider/│
                                  │          Hybride         │
                                  │  - Accès Protégé         │
                                  └────────────┬─────────────┘
                                               │ (Après authentification réussie)
                                               ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   MATCHY TAB BAR                                       │
├────────────────────────────┬─────────────────────────────┬─────────────────────────────┤
│      2. Home Feed (/)      │    3. Explore (/explore)    │    4. Gestion & Packs       │
│  - Logo Matchy en header   │  - Logo Matchy en header    │  - Logo Matchy en header    │
│  - Badge Pack Utilisateur  │  - Annuaire des Artisans    │  - Statut & Privilèges Pack │
│  - Urgent SOS Dépannage    │  - Filtre "Dispo maintenant"│  - Switch Seeker/Provider/  │
│  - Filtres Métiers & Région│  - Vérification 🪪 CIN      │          Hybride            │
│  - Modal "+ Publier"       │  - Appel & Contact direct   │  - Gestion Communauté/Admin │
└────────────────────────────┴─────────────────────────────┴─────────────────────────────┘
```

### Screen 1: Passerelle d'Authentification Sécurisée (`/app/(auth)/login.tsx`)
- **Logo officiel Matchy** & slogan d'accueil en ouverture.
- **Accès Gardé :** L'application bloque l'accès à la page d'accueil tant que l'utilisateur ne s'est pas authentifié.
- **Sélecteur de Rôle :**
  - `👤 Utilisateur (User)`
  - `🛡️ Administrateur (Admin)`
- **Sélecteur de Pack Initial :** Choix direct entre **Pack Seeker**, **Pack Provider**, ou **Pack Hybride**.

### Screen 2: Accueil Matchy Déverrouillé (`/app/index.tsx`)
- **Logo Matchy dans le header** avec badge de pack actif (ex: `⚡ Hybride`) et bouton de déconnexion.
- **Double Bouton d'Action : Deux types de publication distincts :**
  - 🙋‍♂️ **"Chercher un service" (Demandeur / Seeker) :**
    - Spécificités : Titre du besoin, métier recherché, gouvernorat & délégation, niveau d'urgence (*🚨 Urgent < 30min*, *📅 Aujourd'hui*, *⏳ Flexible*), budget proposé (DT), contraintes d'accès (étage, outillage requis).
  - 🛠️ **"Offrir un service" (Prestataire / Artisan / Provider) :**
    - Spécificités : Titre de la prestation, métier & spécialité, zone & rayon de déplacement (*ex: Sousse et 30 km*), tarification horaire ou forfaitaire (*25 DT / h*), disponibilité réelle (*🟢 Immédiate 24/7* vs *📅 Sur RDV*), années d'expérience & garanties offertes (*Garantie 6 mois*).
- **Sélecteur d'Onglets de Flux :**
  - `📋 Besoins Clients` : Permet aux artisans de consulter les pannes et chantiers demandés par les clients et d'y postuler.
  - `🛠️ Offres des Pros` : Permet aux clients de consulter les prestations proposées par les artisans disponibles et de les réserver directement.
- **Bannière SOS Express :** Dépannage urgent en moins de 30 min (Plomberie, Électricité, Serrurerie).
- **Filtre Régions Tunisie :** Sousse, Tunis, Sfax, Monastir, Nabeul, etc.

### Screen 3: Annuaire des Artisans & Pros (`/app/explore.tsx`)
- **Logo Matchy dans le header** avec statut de connexion.
- **Recherche & Filtres :** Par métier et gouvernorat.
- **Filtre "Disponibles maintenant 🟢" :** Affiche uniquement les artisans libres sur le champ.
- **Fiches Artisans :** Notes (*⭐ 4.9/5*), badges (*🪪 CIN Vérifié*, *🏆 Certifié*), tarif horaire et modal de contact.

### Screen 4: Gestion des Utilisateurs & Packs (`/app/packs.tsx`)
- **Logo Matchy dans le header** avec identité de l'utilisateur connecté.
- **Détail du Pack Actif :** Visualisation des privilèges et fonctionnalités débloquées.
- **Bascule de Pack en 1 clic :**
  - 🙋‍♂️ **Pack Seeker :** Pour les demandeurs de services particuliers/entreprises.
  - 🛠️ **Pack Provider :** Pour les artisans avec vitrine annuaire et alertes chantiers.
  - ⚡ **Pack Hybride :** Le pack tout-en-un pour publier des besoins et accepter des missions rémunérées.
- **Répertoire & Gestion des Utilisateurs :**
  - Filtrage des membres selon le pack (Tous, Providers, Seekers, Hybrides).
  - Statut de vérification d'identité (CIN Vérifié vs En attente).
  - Mode **Admin** étendu : validation/révocation des CIN et attribution des packs.

---

## 🔌 Spécification Complète des Endpoints API (Tests Postman)

L'API backend de Matchy dispose d'une collection complète de routes REST prêtes à être testées via **Postman**. Une collection au format officiel est disponible directement dans le fichier [`backend/Matchy_API_Postman_Collection.json`](file:///c:/Users/hibab/Documents/Matchy/backend/Matchy_API_Postman_Collection.json) ou via `GET /api/postman-collection`.

### 1. Système & Santé
* **`GET /api/health`** — État du serveur, statut de sécurité et uptime.
* **`GET /api/postman-collection`** — Export JSON de la collection Postman officielle pour import direct.

### 2. Authentification & Profil Utilisateur
* **`POST /api/auth/register`** — Inscription avec rôle (`user` / `admin`) et pack (`seeker` / `provider` / `hybrid`).
  ```json
  {
    "name": "Tarek Mansouri",
    "email": "tarek.menuisier@matchy.tn",
    "password": "password123",
    "role": "user",
    "pack": "provider",
    "phone": "+216 29 881 742",
    "governorate": "Sfax"
  }
  ```
* **`POST /api/auth/login`** — Connexion avec email et mot de passe, retourne le token JWT et le profil.
* **`GET /api/auth/me`** — Récupère le profil de la session active en cours.
* **`PUT /api/auth/profile`** — Met à jour le téléphone, gouvernorat ou nom de l'utilisateur.

### 3. Système de Packs (Seeker, Provider, Hybride)
* **`GET /api/packs`** — Liste détaillée des 3 packs avec leurs privilèges et tarifs en Tunisie.
* **`POST /api/packs/switch`** — Basculer de pack instantanément :
  ```json
  { "pack": "hybrid" }
  ```

### 4. Flux Double des Opportunités (Demandes & Offres)
* **`GET /api/opportunities`** — Liste complète avec filtres :
  * `?type=demand` (Besoins clients uniquement)
  * `?type=offer` (Offres de pros uniquement)
  * `?governorate=Sousse` (Filtrage géographique)
  * `?category=electricite` (Filtrage par métier)
  * `?urgency=urgent` (Filtrage urgence SOS)
  * `?search=chauffe-eau` (Recherche textuelle)
* **`GET /api/opportunities/:id`** — Détail d'une opportunité spécifique (ex: `/api/opportunities/opp-1`).
* **`POST /api/opportunities` (Type 1 : Besoin Client - Seeker)** :
  ```json
  {
    "type": "demand",
    "title": "Panne chauffe-eau électrique urgent",
    "category": "electricite",
    "governorate": "Sousse",
    "delegation": "Sahloul",
    "budget": 60,
    "urgency": "urgent",
    "description": "L'eau ne chauffe plus. Disjoncteur vérifié.",
    "accessConstraint": "Pièce neuve déjà sur place."
  }
  ```
* **`POST /api/opportunities` (Type 2 : Offre de Prestation - Provider)** :
  ```json
  {
    "type": "offer",
    "title": "Artisan Plombier : Débouchage & Pose Sanitaire",
    "category": "plomberie",
    "governorate": "Tunis",
    "coverageArea": "Grand Tunis et rayon 25 km",
    "priceValue": "35 DT / intervention",
    "availability": "immediate",
    "experience": "8 ans d'expérience",
    "guarantee": "Garantie 6 mois pièces & main d'œuvre",
    "description": "Outillage moderne, caméra d'inspection thermique."
  }
  ```
* **`DELETE /api/opportunities/:id`** — Supprime une opportunité par son ID.

### 5. Devis & Propositions Chiffrées
* **`POST /api/opportunities/:id/proposals`** — Un artisan soumet un devis chiffré à un besoin client :
  ```json
  {
    "priceQuote": 50,
    "estimatedDuration": "45 minutes",
    "availabilityDate": "Immédiate (en 20 min)",
    "message": "Bonjour, je suis disponible à Sahloul pour intervenir tout de suite."
  }
  ```
* **`GET /api/opportunities/:id/proposals`** — Récupère la liste des propositions reçues pour une demande.

### 6. Annuaire des Artisans Vérifiés & Métiers
* **`GET /api/providers`** — Liste des artisans avec filtres (`?governorate=Sousse&availableNow=true`).
* **`GET /api/providers/:id`** — Fiche complète de l'artisan (note, avis, téléphone, badge CIN).
* **`GET /api/categories`** — 8 catégories professionnelles en Tunisie avec icônes et compteurs.

### 7. Administration & Statistiques (Mode Admin)
* **`GET /api/admin/users`** — Liste globale de tous les utilisateurs inscrits et leurs packs.
* **`PATCH /api/admin/users/:id/cin`** — Valide ou révoque le badge officiel 🪪 CIN Vérifié.
* **`PATCH /api/admin/users/:id/pack`** — Modifie le pack d'un utilisateur (`{ "pack": "hybrid" }`).
* **`GET /api/admin/stats`** — Métriques en direct : répartition des packs, nombre de demandes et offres.

---

### 📥 Comment Importer la Collection dans Postman en 30 secondes
1. Ouvrez l'application **Postman**.
2. Cliquez sur **Import** (en haut à gauche).
3. Glissez-déposez le fichier [`backend/Matchy_API_Postman_Collection.json`](file:///c:/Users/hibab/Documents/Matchy/backend/Matchy_API_Postman_Collection.json) ou entrez l'URL `http://localhost:3000/api/postman-collection`.
4. Tous les 20 dossiers de requêtes avec corps JSON pré-remplis et paramètres apparaîtront prêts à être exécutés !

---

## 🗺️ Project Sections & Build Roadmap

Here is the structured breakdown of the modules we are building step-by-step:

### 1. 🔐 Authentication & Onboarding
- [x] Initial Matchy branded login screen (`mobile/src/app/(auth)/login.tsx`)
- [ ] User registration with role selection (**Client** or **Provider / Artisan**)
- [ ] Phone number verification (SMS OTP / WhatsApp) and email authentication
- [ ] Profile setup:
  - **Client profile:** Name, city/delegation, contact preferences.
  - **Provider profile:** Trade/profession, bio, years of experience, portfolio photos, hourly/task rate, coverage area.

### 2. 🎨 Design System & Core Navigation
- [x] Matchy color palette (`#640FCD` primary, `#251638` text, `#F8F5FF` background)
- [x] High-resolution brand assets integration (`assets/images/MATCHY_logo_principal_transparent (1).png`)
- [ ] Bottom tab bar navigation:
  - 🏠 **Home:** Feed of recent needs, popular categories, and quick emergency CTA.
  - 🔍 **Explore / Search:** Filter by skill, location radius, price, and availability.
  - 📋 **My Requests / My Gigs:** Track active, completed, and pending jobs.
  - 💬 **Messages:** Direct communication between clients and providers.
  - 👤 **Profile:** Account management, settings, reviews, and switch modes.

### 3. 🛠️ Service Requests & Job Opportunities
- [ ] **Request Creation Flow (Client):**
  - Category & sub-category picker (e.g., Plomberie > Fuite d'eau)
  - Description, photos/videos, and voice note upload
  - Urgency level (🚨 Urgent / Aujourd'hui / Cette semaine / Flexible)
  - Location picker (automatic GPS or manual selection: Sousse, Tunis, Sfax, etc.)
  - Budget estimate or "Demander un devis"
- [ ] **Opportunity Feed & Bidding (Provider):**
  - Real-time list of client requests matching provider's skills and region
  - Apply / Send a quote or propose availability
  - Accept / Decline match mechanics

### 4. 🧭 Location & Matching Engine
- [ ] Hierarchical Tunisian geographical structure (Governorate > Delegation > Postal code)
- [ ] Geo-radius calculation (Haversine distance or PostGIS) for proximity sorting
- [ ] Provider availability toggle ("Disponible maintenant" for immediate emergency interventions)

### 5. 💬 In-App Communication & Real-time Messaging
- [ ] 1-to-1 chat between client and matched provider
- [ ] Safe contact options (Direct call shortcut, WhatsApp integration, or masked calling)
- [ ] Sharing location pin and quote summaries inside the chat

### 6. ⭐ Trust, Verification & Reputation
- [ ] Two-way rating system (1 to 5 stars + written feedback)
- [ ] Provider verification badges:
  - 🪪 Identity verification (CIN check)
  - 🎓 Certified diploma / Artisan card
  - 🏆 Top Rated Provider badge
- [ ] Flagging, dispute handling, and moderation system

### 7. 🇹🇳 Tunisian Localization & Offline Resilience
- [ ] Multilingual support:
  - **Français** (Standard professional interface)
  - **Derja tunisienne** (Natural local phrases: *Chkoun yaaref*, *Khedma*, *Bricolage*, etc.)
  - **العربية** (Modern Standard Arabic)
  - **English**
- [ ] Low-bandwidth optimization for mobile networks (3G/4G stability)

---

## 📁 Repository Structure

```text
Matchy/
├── README.md                      # Project manifesto, architecture & walkthrough
├── backend/                       # Node.js + Express + TypeScript API
│   ├── package.json
│   ├── tsconfig.json              # TypeScript compilation config
│   └── src/
│       ├── server.ts              # Entry point with Helmet, CORS & Rate Limiter
│       ├── controllers/           # Auth, opportunities, and provider controllers
│       ├── routes/                # Modular API route definitions
│       └── data/                  # Mocked demo data (Tunisian categories & providers)
└── mobile/                        # React Native + Expo mobile application
    ├── app.json                   # Expo configuration
    ├── package.json
    ├── tsconfig.json
    ├── assets/
    │   └── images/                # Matchy logos, icons, illustrations
    └── src/
        ├── app/                   # Expo Router screens
        │   ├── _layout.tsx        # Root navigation layout
        │   ├── index.tsx          # Home Feed & Emergency Matching
        │   ├── explore.tsx        # Explore trades & verified providers
        │   └── (auth)/            # Authentication stack
        │       └── login.tsx      # Branded Matchy login
        ├── components/            # Reusable UI components (Buttons, Inputs, Cards)
        └── constants/             # Design tokens (Colors, Typography, Spacing)
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or v20+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app installed on your physical iOS/Android phone, or an Android/iOS emulator

---

### 1. Running the Backend API

```bash
# Navigate to the backend directory
cd backend

# Install dependencies (if not already installed)
npm install

# Start development server with hot-reload
npm run dev
```
The server will start at `http://localhost:3000`.  
Verify health status: `http://localhost:3000/api/health` -> `{"status":"success","message":"Matchy API is working!"}`

---

### 2. Running the Mobile App

```bash
# Navigate to the mobile directory
cd mobile

# Install dependencies (if not already installed)
npm install

# Start the Expo development server
npm start
```

- Press `a` in the terminal to launch Android Emulator.
- Press `i` to launch iOS Simulator (on macOS).
- Press `w` to open in a web browser.
- Or scan the QR code with **Expo Go** on your physical Android/iPhone.

---

## 🏆 Hackathon 2-Hour Evaluation & Demo Guide

If you are presenting or testing this prototype in front of a jury:

1. **Step 1: Launch the Backend**
   ```bash
   cd backend
   npm run dev
   ```
   *Showcases:* Security headers, in-memory rate limiting, and RESTful responses for `/api/health`, `/api/opportunities`, and `/api/providers`.

2. **Step 2: Launch the Mobile App**
   ```bash
   cd mobile
   npm start
   ```
   Open on Android, iOS, or press `w` for the Web view.

3. **Step 3: Interactive Demo Flow**
   - **Login Screen:** Sélectionnez le rôle (**Utilisateur** ou **Administrateur**), choisissez votre Pack initial (**Seeker**, **Provider** ou **Hybride**), puis connectez-vous.
   - **Double Publication (Besoins vs Offres) :**
     - Tap **"🙋‍♂️ Chercher un service"** : Remplissez une demande client avec niveau d'urgence (*🚨 Urgent < 30min*), budget (*ex: 50 DT*) et contraintes d'accès. Elle apparaît immédiatement dans l'onglet *📋 Besoins Clients*.
     - Tap **"🛠️ Offrir un service"** : Proposez vos compétences de pro avec votre tarif (*ex: 25 DT / h*), zone de déplacement et garantie. Elle apparaît immédiatement dans l'onglet *🛠️ Offres des Pros*.
   - **Bascule des Flux :** Alertez les jurys sur le switch entre *📋 Besoins Clients* (pour les artisans qui cherchent du travail) et *🛠️ Offres des Pros* (pour les clients qui cherchent un artisan).
   - **Emergency Banner :** Tap **"⚡ Demander une intervention SOS immédiate"** pour tester le dispatch d'urgence.
   - **Onglet "⚡ Mon Pack & Profil" :** Montrez la bascule en 1 clic entre le Pack Seeker, le Pack Provider et le Pack Hybride, ainsi que la gestion des membres de la communauté (avec validation CIN en mode Admin).
   - **Onglet "🔍 Artisans" :** Annuaire complet avec filtres géolocalisés et boutons d'appel direct.

---

*Matchy — Less searching. More matching.*
