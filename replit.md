# Workspace

## Overview

pnpm workspace monorepo using TypeScript. The main artifact is `artifacts/neet-tracker` — a React SPA for NEET 2027 exam tracking.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 22+ (`.nvmrc`)
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React 19, Vite 7, Tailwind CSS 4
- **Auth & Database**: Firebase (Auth + Firestore)
- **Deployment**: Vercel (via `vercel.json` at workspace root)

## Structure

```text
workspace/
├── artifacts/
│   ├── neet-tracker/        # Main React SPA (Firebase-powered)
│   │   ├── src/
│   │   │   ├── contexts/    # auth-context.tsx (Firebase Auth)
│   │   │   ├── hooks/       # use-store.tsx (Firestore data layer)
│   │   │   ├── lib/         # firebase.ts, syllabus.ts, utils.ts
│   │   │   └── pages/       # Home, Progress, Chapter, Profile, etc.
│   │   ├── vercel.json      # Fallback (when root dir = artifacts/neet-tracker)
│   │   └── vite.config.ts
│   ├── api-server/          # Express API (unused by neet-tracker, kept for reference)
│   └── mockup-sandbox/      # Design preview server
├── vercel.json              # Main Vercel config (workspace root)
├── .nvmrc                   # Node 22
├── pnpm-workspace.yaml
└── package.json
```

## NEET Tracker Architecture

The app is a fully client-side React SPA with Firebase backend:

- **Authentication**: Firebase Auth (email/password via `src/contexts/auth-context.tsx`)
- **Data storage**: Firestore (`users/{uid}` document stores all user data)
- **State**: `use-store.tsx` — React Context backed by Firestore instead of localStorage
- **Routing**: Wouter (SPA routing, all routes handled by `vercel.json` rewrites)

### Firebase Firestore Document Schema (`users/{uid}`)

```json
{
  "theme": "dark | light",
  "progress": "ProgressMap (nested object)",
  "todos": "Todo[]",
  "streak": "{ currentStreak, lastActiveDate }",
  "profile": "{ name, avatar }",
  "studyGroup": "StudyGroup | null",
  "testDate": "string | null",
  "studyTime": "{ date, seconds }",
  "targetScore": "string"
}
```

### Required Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Vercel Deployment

The `vercel.json` at workspace root handles everything:

- **Install**: `pnpm install` (workspace root)
- **Build**: `BASE_PATH=/ pnpm --filter @workspace/neet-tracker run build`
- **Output**: `artifacts/neet-tracker/dist/public`
- **Routing**: All routes rewrite to `index.html` (SPA)

User just connects GitHub repo to Vercel — no extra settings needed.

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. Run typechecks from root:

- `pnpm run typecheck` — full workspace typecheck using project references
- `pnpm run build` — typecheck + build all packages

## Dev Commands

- `pnpm --filter @workspace/neet-tracker run dev` — start NEET tracker dev server
- `pnpm --filter @workspace/neet-tracker run build` — production build
