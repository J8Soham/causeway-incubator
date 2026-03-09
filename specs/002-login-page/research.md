# Research: Login Page

## Decision 1: Authentication Method

**Decision**: Use Firebase Email Link (passwordless) authentication as the primary login method, alongside Firebase Anonymous auth for guest access.

**Rationale**: The reference design shows an email input with a "Continue" button — this aligns with passwordless email link flow (no password field). Firebase supports `sendSignInLinkToEmail` + `isSignInWithEmailLink` + `signInWithEmailLink` natively via `@angular/fire`.

**Alternatives considered**:
- **Google OAuth popup (current)**: Doesn't match the reference design which shows an email-first flow. Can be kept as a secondary option in future.
- **Email + password**: More complex, requires password management UI. The reference design doesn't show a password field.
- **Magic link only**: Selected — simplest email auth flow, matches reference design.

## Decision 2: Guest Access

**Decision**: Use Firebase Anonymous Authentication (`signInAnonymously`) for the "Continue as Guest" flow.

**Rationale**: Firebase anonymous auth creates a temporary UID that can later be linked to a full account. This is the standard Firebase approach for guest access.

**Alternatives considered**:
- **No auth, local-only**: Would require special handling throughout the app for unauthenticated state. Firebase anonymous auth keeps the auth flow consistent.
- **Cookie-based session**: Over-engineered for this use case.

## Decision 3: Landing Page Design

**Decision**: Redesign the landing page with Causeway branding, hexagon decorations (CSS/SVG), and a "GET STARTED" CTA that routes to `/login`.

**Rationale**: Reference screenshot shows a polished landing with decorative hexagons, purple branding, and a red CTA button. CSS hexagons avoid external asset dependencies.

**Alternatives considered**:
- **Image-based hexagons**: Larger bundle, harder to animate. CSS/SVG preferred.
- **Combined landing + login page**: Reference shows them as separate pages.

## Decision 4: Database Service Extension

**Decision**: Add `sendEmailLink`, `signInWithEmailLink`, and `signInAnonymously` methods to the `DatabaseService` interface and `FirebaseService` implementation.

**Rationale**: The existing `DatabaseService` interface only has `login(providerId, scope?)` for OAuth popup. Email link auth and anonymous auth require different Firebase APIs.

**Alternatives considered**:
- **Extend existing `login()` method**: Would become overloaded and confusing. Separate methods are clearer.
