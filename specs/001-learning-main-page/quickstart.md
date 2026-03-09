# Quickstart: Learning Main Page

**Feature Branch**: `001-learning-main-page`

## Prerequisites

- Node.js (version per `.nvmrc`)
- Angular CLI: `npm install -g @angular/cli`
- Firebase project configured (`.env` with credentials)

## Setup

```bash
# Clone and checkout branch
git clone git@github.com:tech4good-lab/causeway-incubator.git
cd causeway-incubator
git checkout 001-learning-main-page

# Install dependencies
npm install

# Ensure environment file exists
# .env should have NG_APP_FIREBASE_* variables set
```

## Run Locally

```bash
# Serve the app
ng serve

# Open in browser
open http://localhost:4200/home
```

## Seed Curriculum Data to Firestore

After implementing the curriculum entity, the `structure.json` data needs to be seeded to Firestore. This can be done via:

1. A one-time admin script, or
2. The admin panel at `/admin`

The curriculum document will be created in the `curriculum` collection with the full role → subgoal → step hierarchy.

## Test

```bash
# Run all tests
npm test

# Run tests for specific component
npm test -- --silent=false src/app/main/home/home.component.spec.ts

# Run lint
npm run lint
```

## Verify

1. Login via Google OAuth
2. Navigate to `/home`
3. Verify: page title, progress bar (0% for new users), curriculum grid with role sections
4. Verify: sidebar TOC on the right (desktop viewport)
5. Verify: role coach floating button → popup with dropdown
6. Verify: step icons show tooltips on hover
7. Verify: responsive layout (resize browser to mobile width)
