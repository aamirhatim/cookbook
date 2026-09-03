# Recipe Book - Agent & Project Guide

## Overview
A web-based, mobile-first recipe book application for creating, managing, organizing, and browsing cooking recipes.

## Tech Stack
- **Frontend Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode enabled)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Mobile-first utility classes)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [lucide-react](https://lucide.dev/)
- **Backend & Database**: [Firebase](https://firebase.google.com/)
  - **Firestore**: Document database for recipes, collections, and user profiles
  - **Authentication**: Firebase Auth (Email/Password, Google OAuth)
  - **Storage**: Firebase Cloud Storage for high-res recipe photos and meal prep photos
- **Local Development**: Firebase Local Emulator Suite (Firestore, Auth, Storage, Emulator UI)

---

## Agent Operational Directives
1. **User-Owned Files**:
   - **CRITICAL**: `.agents/TASKS.md` is reserved exclusively for the user's input and notes. The agent must NEVER modify, overwrite, or delete `.agents/TASKS.md`.
2. **Mobile-First Design Principle**:
   - The user interface must be designed mobile-first (screen sizes 360px–430px first, scaling gracefully to tablet/desktop).
   - Use generous touch targets (minimum 44x44px for buttons and interactive controls).
   - Cooking interactions (checking off ingredients, switching steps, setting timers) must be single-hand friendly.
3. **Local Emulation First**:
   - When developing locally, always work against the Firebase Local Emulator Suite.
   - Emulator ports:
     - **Firestore**: `8080`
     - **Auth**: `9099`
     - **Storage**: `9199`
     - **Emulator UI**: `4000`

---

## Development Commands
- `npm run dev` — Start the Vite frontend development server (`http://localhost:5173`)
- `npm run emulators` — Start the Firebase local emulators with Java 25 configured
- `npm run emulators:export` — Export test data from emulators to persist local testing states
- `npm run build` — TypeScript type-check and Vite production build
- `npm run preview` — Locally preview the production build

---

## Project Structure
```text
recipe-book/
├── .agents/
│   ├── TASKS.md             # [USER ONLY] User task list and notes. Do not touch.
│   └── rules/               # Agent rules and domain guidelines
├── src/
│   ├── components/          # Reusable UI components (RecipeCard, IngredientList, etc.)
│   ├── pages/               # Route views (Home, RecipeDetail, RecipeEditor, Auth)
│   ├── lib/
│   │   └── firebase.ts      # Firebase SDK client & local emulator connectors
│   ├── types/               # TypeScript data definitions (Recipe, Ingredient, Step)
│   ├── App.tsx              # Main routing and navigation layout
│   ├── main.tsx             # React DOM entrypoint
│   └── index.css            # Tailwind directives and base styling
├── firebase.json            # Firebase emulators & service rules mapping
├── firestore.rules          # Firestore database security rules
├── storage.rules            # Firebase Storage security rules
├── firestore.indexes.json   # Firestore query index definitions
├── .firebaserc              # Active Firebase project alias (recipe-book-f7e7f)
├── .env.example             # Public environment variables template
├── .env.local               # Local environment variables with emulator flags
├── vite.config.ts           # Vite bundler configuration
└── package.json             # Project dependencies and run scripts
```

---

## Domain Conventions: Recipes
- **Ingredients**: Represented as structured objects `{ name: string, amount: number, unit: string, notes?: string }`.
- **Instructions**: Represented as ordered steps `{ stepNumber: number, instruction: string, timerMinutes?: number }`.
- **Metadata**: Every recipe includes `prepTimeMinutes`, `cookTimeMinutes`, `servings`, `difficulty`, `tags`, and `authorId`.
- **Security**: Public recipes can be read by anyone; edit/delete permissions are strictly restricted to the `authorId`.
