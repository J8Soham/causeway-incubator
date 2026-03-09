# Tasks: Login Page

**Input**: Design documents from `/specs/002-login-page/`  
**Prerequisites**: plan.md (✅), spec.md (✅), research.md (✅)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Extend Firebase auth service with email link and anonymous login methods

- [ ] T001 Add `sendEmailLink(email: string, actionCodeSettings: ActionCodeSettings): Promise<void>` method to `DatabaseService` interface in `src/app/core/firebase/database.service.ts`
- [ ] T002 [P] Add `signInWithEmailLink(email: string, emailLink: string): Promise<UserCredential>` method to `DatabaseService` interface in `src/app/core/firebase/database.service.ts`
- [ ] T003 [P] Add `signInAnonymously(): Promise<UserCredential>` method to `DatabaseService` interface in `src/app/core/firebase/database.service.ts`

---

## Phase 2: Foundational (Firebase Service Implementation)

**Purpose**: Implement new auth methods in FirebaseService and MockService

**⚠️ CRITICAL**: No UI work can begin until auth methods are implemented

- [ ] T004 Implement `sendEmailLink()` in `FirebaseService` (`src/app/core/firebase/firebase.service.ts`) using Firebase `sendSignInLinkToEmail()`
- [ ] T005 [P] Implement `signInWithEmailLink()` in `FirebaseService` (`src/app/core/firebase/firebase.service.ts`) using Firebase `signInWithEmailLink()`
- [ ] T006 [P] Implement `signInAnonymously()` in `FirebaseService` (`src/app/core/firebase/firebase.service.ts`) using Firebase `signInAnonymously()`
- [ ] T007 [P] Add mock implementations for all 3 new methods in `FirebaseMockService` (`src/app/core/firebase/firebase.mock.service.ts`)

**Checkpoint**: All Firebase auth methods ready for use by the AuthStore and components.

---

## Phase 3: User Story 1 — Email Login / Sign-Up (Priority: P1) 🎯 MVP

**Goal**: Users can enter their email, receive a sign-in link, and authenticate via email link. The login page matches the reference design.

**Independent Test**: Navigate to `/login` as logged-out user → see branded login card → enter email → click Continue → email link sent → open link → user authenticated → routed through auth guard.

### Implementation

- [ ] T008 [US1] Add `loginWithEmail(email: string)` method to `AuthStore` (`src/app/core/store/auth/auth.store.ts`) — calls `db.sendEmailLink()` with `actionCodeSettings` configured to redirect back to the app, stores email in `localStorage` for later verification
- [ ] T009 [US1] Add `completeEmailLogin()` method to `AuthStore` (`src/app/core/store/auth/auth.store.ts`) — checks `isSignInWithEmailLink(window.location.href)`, retrieves stored email from `localStorage`, calls `db.signInWithEmailLink()`, creates/updates user record in Firestore
- [ ] T010 [US1] Redesign `LoginComponent` template (`src/app/first-time/login/login.component.html`) — centered card with "Learn step-by-step" heading, subtitle, email input (mat-form-field), "Continue as Guest" link, "Continue" button (mat-raised-button)
- [ ] T011 [US1] Update `LoginComponent` TypeScript (`src/app/first-time/login/login.component.ts`) — add `email` signal, `emailValid` computed, `isSubmitting` signal, `emailSent` signal. Wire `onContinue()` to call `authStore.loginWithEmail()`. Check for email link on init via `authStore.completeEmailLogin()`
- [ ] T012 [US1] Style `LoginComponent` (`src/app/first-time/login/login.component.scss`) — centered card layout matching reference: white card, clean typography, proper spacing, disabled state for Continue button
- [ ] T013 [US1] Add success state to `LoginComponent` template — after email is sent, show "Check your email" message with the entered email address and a "Resend" option
- [ ] T014 [US1] Update `LoginComponent` spec (`src/app/first-time/login/login.component.spec.ts`) — test that component renders heading, email input, Continue button (disabled by default), and Continue as Guest link

**Checkpoint**: At this point, email login flow should be fully functional.

---

## Phase 4: User Story 2 — Continue as Guest (Priority: P1)

**Goal**: Users can browse as guest via anonymous Firebase auth.

**Independent Test**: Navigate to `/login` → click "Continue as Guest" → user signed in anonymously → routed into app.

### Implementation

- [ ] T015 [US2] Add `loginAnonymously()` method to `AuthStore` (`src/app/core/store/auth/auth.store.ts`) — calls `db.signInAnonymously()`, creates minimal user record in Firestore with `accessState: CONSENT`, `consented: false`
- [ ] T016 [US2] Wire "Continue as Guest" link in `LoginComponent` template to call `authStore.loginAnonymously()`
- [ ] T017 [US2] Handle anonymous-to-email account linking — when a guest user later enters an email, link the anonymous account to the email credential using Firebase `linkWithCredential()`

**Checkpoint**: At this point, both email login and guest access should work independently.

---

## Phase 5: User Story 3 — Landing Page with GET STARTED CTA (Priority: P2)

**Goal**: Polished landing page with Causeway branding, hexagon decorations, and GET STARTED button.

**Independent Test**: Navigate to `/` as logged-out user → see Causeway brand, tagline, hexagon decorations → click GET STARTED → navigate to `/login`.

### Implementation

- [ ] T018 [US3] Redesign `LandingComponent` template (`src/app/first-time/landing/landing.component.html`) — "Causeway" brand heading in purple, tagline "Learn web development in Angular by building a project step-by-step", red "GET STARTED" mat-raised-button
- [ ] T019 [US3] Update `LandingComponent` TypeScript (`src/app/first-time/landing/landing.component.ts`) — inject `Router`, add `onGetStarted()` method that navigates to `/login`
- [ ] T020 [US3] Create hexagon decorations in `LandingComponent` SCSS (`src/app/first-time/landing/landing.component.scss`) — CSS hexagon shapes with subtle opacity, positioned as in reference (bottom-left cluster, top-right cluster with colored shapes)
- [ ] T021 [US3] Style overall landing layout — full-viewport centered content, responsive breakpoints at 320px, 768px, 1024px, 1920px
- [ ] T022 [US3] Update `LandingComponent` spec (`src/app/first-time/landing/landing.component.spec.ts`) — test that brand heading, tagline, and GET STARTED button render

**Checkpoint**: Landing page matches reference design.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, responsive testing, and cleanup

- [ ] T023 [P] Add loading spinner/indicator to Continue button while email is being sent
- [ ] T024 [P] Add error handling for failed email send (network error, invalid email) — display mat-snackbar or inline error message
- [ ] T025 [P] Add error handling for failed anonymous login — display error message with retry
- [ ] T026 Responsive testing — verify both login and landing pages at 320px, 768px, 1024px, 1920px viewports
- [ ] T027 Run `npm run lint` and fix any linting errors
- [ ] T028 Run `npm test` and ensure all existing + new tests pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — can start immediately
- **Phase 2 (Foundational)**: Depends on Phase 1 (interface updates) — BLOCKS all UI work
- **Phase 3 (US1)**: Depends on Phase 2 (Firebase auth methods)
- **Phase 4 (US2)**: Depends on Phase 2 — can run in parallel with Phase 3
- **Phase 5 (US3)**: No dependency on auth methods — can start after Phase 1 or in parallel with Phase 3/4
- **Phase 6 (Polish)**: Depends on all user stories being complete

### Within Each User Story

- Auth store methods before component UI
- Component TypeScript before template/styles
- Core implementation before error handling

### Parallel Opportunities

- T001–T003: All interface changes in one file — sequential
- T004–T007: All implementation files — T004/T005/T006 are in same file (sequential), T007 parallel
- Phase 3 and Phase 4: Can proceed in parallel (different methods, same files — merge carefully)
- Phase 5: Fully independent of Phases 3/4 — can run in parallel

---

## Implementation Strategy

### MVP First (User Stories 1 + 2)

1. Complete Phase 1: Interface setup
2. Complete Phase 2: Firebase implementations
3. Complete Phase 3: Email login (MVP entry point)
4. Complete Phase 4: Guest access
5. **STOP and VALIDATE**: Both auth flows work end-to-end
6. Deploy/demo

### Then Enhancement

7. Complete Phase 5: Polished landing page
8. Complete Phase 6: Polish and responsive testing

---

## Notes

- The existing `login()` method in AuthStore (Google OAuth) is preserved for backward compatibility but not exposed in the new UI
- The auth guard logic does not need modification — email-authenticated and anonymous users flow through the same consent → early-access → home pipeline
- `actionCodeSettings.url` must be configured to redirect back to the app's `/login` route for email link verification
- Email stored in `localStorage` under key `emailForSignIn` per Firebase recommendation
