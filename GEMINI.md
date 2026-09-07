# Recipe Book - Agent & Project Guide

## Overview
A web-based, mobile-first recipe book application for creating, managing, organizing, and browsing cooking recipes.

## Tech Stack
- **Frontend Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode enabled)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (Mobile-first utility classes)
- **Routing**: [React Router v7](https://reactrouter.com/)
- **Icons**: [@tabler/icons-react](https://tabler.io/icons)
- **Backend & Database**: [Firebase](https://firebase.google.com/)
  - **Firestore**: Document database for recipes, collections, and user profiles
  - **Authentication**: Firebase Auth (Email/Password, Google OAuth)
  - **Storage**: Firebase Cloud Storage for high-res recipe photos and meal prep photos
- **Local Development**: Firebase Local Emulator Suite (Firestore, Auth, Storage, Emulator UI)

---

## Agent Operational Directives
1. **User-Owned Files**:
   - **CRITICAL**: `.agents/TASKS.md` is reserved exclusively for the user's input and notes. The agent must NEVER modify, overwrite, or delete `.agents/TASKS.md`.
2. **Git Version Control & Commits**:
   - **CRITICAL**: The agent must NEVER make git commits (`git commit`), stage changes (`git add`), or perform any modifying git operations on its own. The user will handle all git operations for adding and committing.
   - **Read-Only Reference**: The agent may only use git as a read-only reference (e.g. `git status`, `git diff`, `git log`).
   - **Explicit Permission Required**: If the agent genuinely needs to make other changes in git, it MUST ask the user and receive explicit permission first before proceeding.
3. **Mobile-First Design Principle**:
   - The user interface must be designed mobile-first (screen sizes 360px–430px first, scaling gracefully to tablet/desktop).
   - Use generous touch targets (minimum 44x44px for buttons and interactive controls).
   - Cooking interactions (checking off ingredients, switching steps, setting timers) must be single-hand friendly.
4. **Local Emulation First**:
   - When developing locally, always work against the Firebase Local Emulator Suite.
   - Emulator ports:
     - **Firestore**: `8080`
     - **Auth**: `9099`
     - **Storage**: `9199`
     - **Emulator UI**: `4000`
5. **Atomic Design & Modularity (No "God Components")**:
   - **Strict Modularity**: Avoid large "god components". Deconstruct complex interfaces and forms into small, single-responsibility, reusable components. Keep component files focused and concise (aim for under 150 lines).
   - **Atomic Hierarchy**:
     - **Atoms**: Fundamental UI elements with no recipe business logic (buttons, inputs, badges, typography, icons, spinners).
     - **Molecules**: Simple groups of UI atoms functioning together as a unit (search bar with icon, ingredient item row, recipe metric pill with icon + label).
     - **Organisms**: Distinct, self-contained interface sections composed of molecules and atoms (recipe preview card, interactive step-by-step instruction checklist, filter drawer).
     - **Templates / Layout**: Page shells and responsive containers defining layout structure independent of specific content.
     - **Pages**: Top-level route components responsible for routing, orchestrating organisms, and connecting to global contexts or custom hooks.
   - **Separation of Concerns**: Extract data fetching, complex form states, and timers into custom hooks (`useRecipes`, `useTimer`, `useRecipeForm`) or dedicated service files. Keep presentation components clean and declarative.
6. **Design Tokens & Theme Consistency**:
   - **Never Use Generic Tailwind Colors**: Always use semantic design tokens configured in `tailwind.config.js` and `src/index.css` instead of raw Tailwind color utilities (e.g. avoid `bg-white`, `bg-stone-100`, `text-stone-900`, `text-amber-600`).
   - **Hex-Based CSS Variables**: Theme colors are defined as clean HEX codes in `src/index.css` under `:root` (light mode) and `@media (prefers-color-scheme: dark)` / `.dark` (dark mode), making color palette tweaks simple and human-readable.
   - **Opacity Modifiers**: The configuration supports Tailwind opacity syntax seamlessly via `color-mix` (e.g. `bg-primary/90`, `bg-secondary/40`, `focus:ring-ring/20`).
   - **Semantic Token Map**:
     - `background` & `foreground`: App canvas background and default high-contrast body text.
     - `surface`, `surface-hover`, `surface-foreground`: Cards, sheets, dialogs, and item list backgrounds.
     - `primary`, `primary-foreground`: Main culinary brand actions, call-to-actions, and highlights.
     - `secondary`, `secondary-foreground`: Secondary interactive elements, tag badges, and soft notices.
     - `tertiary`, `tertiary-foreground`: Subtle chips, category pills, and neutral counters.
     - `muted`, `muted-foreground`: Disabled states, placeholder text, captions, and secondary descriptions.
     - `accent`, `accent-foreground`: Active navigation items, special alerts, or star ratings.
     - `destructive`, `destructive-foreground`: Delete buttons, error alerts, and destructive actions.
     - `border`: Dividers, card borders, and list item separators.
     - `input`: Form input and selection borders/backgrounds.
     - `ring`: Focus outlines for keyboard accessibility and active inputs.

---

## Development Commands
- `npm start` (or `npm run dev:all`) — **Recommended**: Run both Firebase emulators and Vite frontend server concurrently in a single command (auto-saves and reloads emulator data from `./emulator-data`)
- `npm run dev` — Start only the Vite frontend development server (`http://localhost:5173`)
- `npm run emulators` — Start only the Firebase local emulators with automatic import/export from `./emulator-data`
- `npm run emulators:export` — Manually export test data from emulators to persist local testing states
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
│   ├── components/          # Reusable UI components organized by atomic level:
│   │   ├── atoms/           # Base inputs, buttons, badges, icons, typography
│   │   ├── molecules/       # SearchBar, IngredientRow, MetricPill, FormField
│   │   ├── organisms/       # RecipeCard, IngredientList, InstructionList, BottomNav
│   │   └── layout/          # PageShell, ModalLayout, ProtectedRoute
│   ├── contexts/            # React context providers (AuthContext, etc.)
│   ├── hooks/               # Custom reusable React hooks (useAuth, useRecipes, etc.)
│   ├── pages/               # Route views (Home, RecipeDetail, RecipeEditor, Login, Admin)
│   ├── services/            # Backend/Firestore data layer & API helpers
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
- **Instructions**: Represented as ordered steps `{ stepNumber: number, instruction: string, timerMinutes?: number, tip?: string }`.
- **Metadata**: Every recipe includes `prepTimeMinutes`, `cookTimeMinutes`, `servings`, `difficulty`, `tags`, and `authorId`.
- **Security**: Public recipes can be read by anyone; edit/delete permissions are strictly restricted to the `authorId`.

