# The Cookbook 🍳

A modern, mobile-first Progressive Web App (PWA) designed for creating, organizing, managing, and following culinary recipes in the kitchen. Built with a focus on seamless single-hand interaction, offline accessibility, and a clean culinary design system.

---

## Features

- **Mobile-First & Kitchen-Friendly UI**: Optimized for single-hand phone use, floating quick-jump action buttons, step checklists, and active cooking viewports.
- **Progressive Web App (PWA)**: Installable on iOS and Android with offline caching via Workbox and IndexedDB persistence.
- **Granular Recipe Filtering & Search**: Filter recipes dynamically by cuisine, dietary preferences (vegetarian, vegan, gluten-free, dairy-free), protein types, total cooking time, and difficulty.
- **Sectioned Ingredients & Instructions**: Supports complex recipes divided into logical sections (e.g., marinades, sauces, dough, main components) and chef tips.
- **Interactive Recipe Viewer**: Check off ingredients as you prep, track step-by-step cooking progress, and quickly jump between ingredients, instructions, and tips with persistent floating controls.
- **Role-Based Admin Management**: Secure admin workspace for authoring, editing, publishing, and archiving recipes.
- **Cloud Media Storage**: High-resolution recipe photography uploaded directly to Firebase Cloud Storage with client-side optimizations.
- **Favorites & Profiles**: Bookmarked recipes and personalized user accounts powered by Firebase Authentication.

---

## Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend Framework** | [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) (Strict mode) |
| **Styling & Design Tokens** | [Tailwind CSS](https://tailwindcss.com/) + CSS Custom Properties (`light-dark()`) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **PWA & Offline** | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) + [Workbox](https://developer.chrome.com/docs/workbox) |
| **Icons** | [@tabler/icons-react](https://tabler.io/icons) |
| **Backend & Database** | [Firebase](https://firebase.google.com/) (Cloud Firestore, Firebase Auth, Cloud Storage) |
| **Local Emulation** | Firebase Local Emulator Suite (Firestore, Auth, Storage, Emulator UI) |

---

## High-Level Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Client: React 19 + Vite                         │
│                                                                        │
│   ┌────────────────────┐   ┌───────────────────┐   ┌───────────────┐   │
│   │    Pages / Views   │   │  Global Contexts  │   │ Custom Hooks  │   │
│   │ (Home, Viewer, ...)│   │  (Auth, Toast)    │   │ (useRecipes)  │   │
│   └─────────┬──────────┘   └─────────┬─────────┘   └───────┬───────┘   │
│             │                        │                     │           │
│             ▼                        ▼                     ▼           │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │               Atomic Design Component Hierarchy                │   │
│   │    Organisms  ──►  Molecules  ──►  Atoms  ──►  Design Tokens   │   │
│   └────────────────────────────────┬───────────────────────────────┘   │
│                                    │                                   │
│                        Service Layer Abstraction                       │
│                     (recipes.ts, users.ts, auth.ts)                    │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                 ┌───────────────────┴───────────────────┐
                 ▼                                       ▼
    ┌─────────────────────────┐             ┌─────────────────────────┐
    │   Local Development     │             │    Production Cloud     │
    │  Firebase Local Suite   │             │   Google Firebase       │
    │ ├─ Auth (Port 9099)     │             │ ├─ Firebase Auth        │
    │ ├─ Firestore (Port 8080)│             │ ├─ Cloud Firestore      │
    │ ├─ Storage (Port 9199)  │             │ ├─ Cloud Storage        │
    │ └─ UI Hub (Port 4000)   │             │ └─ Firebase Hosting     │
    └─────────────────────────┘             └─────────────────────────┘
```

### 1. Presentation & Atomic Design
Components strictly follow atomic design principles to avoid oversized "god components" and ensure maximum modularity:
- **Atoms**: Base UI primitives (`Button`, `Input`, `Chip`, `Checkbox`, `IconButton`).
- **Molecules**: Compound UI items (`Searchbar`, `IngredientRow`, `MetricPill`, `FormField`, `RecipeDietaryBadges`).
- **Organisms**: Self-contained business blocks (`RecipeViewerIngredients`, `RecipeViewerInstructions`, `RecipeViewerTips`, `RecipeTile`, `Navbar`).
- **Layouts & Pages**: Responsive page containers and route views (`MainLayout`, `Home`, `RecipeViewer`, `RecipeEditor`, `RecipeManager`).

### 2. State & Data Layer
- **Decoupled Data Services**: Firebase SDK logic is isolated into `src/services/` (`recipes.ts`, `auth.ts`, `users.ts`). Presentation components never invoke Firestore queries directly.
- **Custom Hooks**: Data fetching, multi-facet filtering, and form state are encapsulated in hooks (`useRecipes`, `useFilteredRecipes`, `useRecipeForm`, `useSectionList`).
- **Offline First**: Firestore is configured with `persistentLocalCache` and multi-tab IndexedDB synchronization, enabling instant cached reads even when offline.

### 3. Security & Access Control
- **Custom Claims Authorization**: Write operations on recipes are guarded by signed Firebase Auth custom claims (`role == 'admin'`).
- **Security Rules**: Enforced at the database and storage level via `firestore.rules` and `storage.rules`.

---

## Folder Structure

```text
recipe-book/
├── public/                  # Static assets and PWA icons (192px, 512px, maskable, apple-touch)
├── scripts/                 # Developer CLI utilities
│   ├── dev.mjs              # Concurrent runner: Vite dev server + Firebase local emulators
│   ├── migrate-to-prod.mjs  # Migration script to deploy emulator data to production
│   └── set-admin.mjs        # Script to grant custom claims (admin role) locally or in prod
├── src/
│   ├── components/          # Atomic UI component system
│   │   ├── atoms/           # Base primitives (buttons, inputs, chips, icons)
│   │   ├── molecules/       # Compound elements (search, filters, section cards, pills)
│   │   ├── organisms/       # Complex sections (lists, viewer components, hero, forms)
│   │   └── layout/          # Page shells, persistent navbar, protected routes, modals
│   ├── contexts/            # Global React contexts (AuthContext, ToastContext)
│   ├── hooks/               # Custom hooks for recipes, forms, filters, and UI state
│   ├── lib/
│   │   ├── firebase.ts      # Firebase SDK client initialization & emulator connectors
│   │   └── formatAmount.ts  # Culinary unit and fraction formatting utility
│   ├── pages/               # Route components (Home, RecipeViewer, RecipeEditor, Account)
│   ├── services/            # API abstraction layer for Firestore, Auth, and Storage
│   ├── types/               # TypeScript models (Recipe, Ingredient, Step, UserProfile)
│   ├── App.tsx              # Router setup, routes, and layout shell
│   ├── index.css            # Semantic design tokens and Tailwind directives
│   └── main.tsx             # React DOM entry point
├── emulator-data/           # Exported local emulator test database (ignored in git)
├── .env.example             # Environment variable template
├── .firebaserc.example      # Firebase project alias template
├── firebase.json            # Emulator ports and hosting configuration
├── firestore.indexes.json   # Firestore query index definitions
├── firestore.rules          # Firestore database security rules
├── storage.rules            # Cloud Storage security rules
├── tailwind.config.js       # Tailwind configuration and design token mapping
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite bundler and PWA plugin configuration
```

---

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Java JRE/JDK**: Java 11 or higher (required to run Firebase Local Emulators)
- **Firebase CLI**: `npm install -g firebase-tools`

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/<your-username>/recipe-book.git
cd recipe-book
npm install
```

### 2. Environment Configuration
Copy the sample environment file to create `.env.local`:
```bash
cp .env.example .env.local
```
For local development, the default emulator flags in `.env.local` work out-of-the-box without needing real production Firebase keys:
```env
VITE_USE_FIREBASE_EMULATORS=true
```

### 3. Running Locally
Run both the Vite frontend server and Firebase Local Emulators concurrently:
```bash
npm start
```
- **Vite Web App**: [http://localhost:5173](http://localhost:5173)
- **Firebase Emulator UI**: [http://localhost:4000](http://localhost:4000)
  - Firestore Emulator: `localhost:8080`
  - Auth Emulator: `localhost:9099`
  - Storage Emulator: `localhost:9199`

Emulator data is automatically imported from and exported to `./emulator-data` upon clean shutdown (`Ctrl + C`).

---

## Available Scripts

- `npm start` (or `npm run dev:all`) — Start both Firebase emulators and the Vite development server concurrently.
- `npm run dev` — Start only the Vite frontend dev server.
- `npm run emulators` — Start only the Firebase local emulators with automatic import/export.
- `npm run emulators:export` — Manually export emulator database state to `./emulator-data`.
- `npm run set-admin -- <email> [role]` — Assign custom claims (e.g. `role: 'admin'`) to a user in the local Auth emulator.
- `npm run set-admin:prod -- <email> [role]` — Assign custom claims to a user in production Firebase Auth.
- `npm run build` — TypeScript type-check and Vite production build.
- `npm run preview` — Locally preview the production build bundle.

---

## License

This project is licensed under the MIT License.
