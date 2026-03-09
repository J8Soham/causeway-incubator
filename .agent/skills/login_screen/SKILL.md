---
name: Login Screen
description: How to build and modify the login and landing pages for Causeway (first-time user experience)
---

# Login Screen Skill

This skill covers building and modifying the login page and landing page in the Causeway Angular application. These are the first screens a logged-out user sees.

## Architecture Overview

The login flow spans two pages and is governed by the `AuthGuard`:

```
Landing (/)  →  Login (/login)  →  AuthGuard  →  Consent → Early Access → Home
```

### Key Files

| File | Purpose |
|------|---------|
| `src/app/first-time/login/login.component.ts` | Login page logic — email input, validation, auth calls |
| `src/app/first-time/login/login.component.html` | Login page template — card with heading, email field, guest link, continue button |
| `src/app/first-time/login/login.component.scss` | Login page styles — centered card layout |
| `src/app/first-time/landing/landing.component.ts` | Landing page logic — brand page with GET STARTED navigation |
| `src/app/first-time/landing/landing.component.html` | Landing page template — brand, tagline, hexagon decorations, CTA |
| `src/app/first-time/landing/landing.component.scss` | Landing page styles — hexagon CSS, responsive layout |
| `src/app/core/auth/auth.guard.ts` | Route guard — manages the auth flow (login → consent → early-access → home) |
| `src/app/core/store/auth/auth.store.ts` | Auth state — NgRx Signal Store with `login()`, `logout()`, `loadAuth()` methods |
| `src/app/core/firebase/firebase.service.ts` | Firebase auth — `signInWithPopup()`, `signOut()` implementations |
| `src/app/core/firebase/database.service.ts` | Auth interface — `login()`, `logout()`, `afUser()` method signatures |
| `src/app/app.routes.ts` | Route definitions — `/login`, `/landing`, `/home`, etc. |

### Auth Guard Flow (src/app/core/auth/auth.guard.ts)

The guard checks in order:
1. **Not logged in?** → Allow only `/`, `/landing`, `/login`. Redirect all else to `/`.
2. **Logged in + on landing/login?** → Redirect to `/home`.
3. **Non-admin on /admin?** → Redirect to `/home`.
4. **Not consented?** → Redirect to `/consent`.
5. **On waitlist?** → Redirect to `/early-access`.
6. **Otherwise** → Allow navigation.

## Login Page Pattern

### Template Structure

The login page uses a centered card layout with these elements:

```html
<div class="login-page">
  <div class="login-card">
    <h1 class="login-title">Learn step-by-step</h1>
    <p class="login-subtitle">Login or create your Causeway account</p>

    <mat-form-field class="email-field" appearance="outline">
      <mat-label>Email</mat-label>
      <input matInput type="email" [(ngModel)]="email" (keyup.enter)="onContinue()" required />
    </mat-form-field>

    <a class="guest-link" (click)="onContinueAsGuest()">Continue as Guest</a>

    <button mat-flat-button class="continue-btn"
            [disabled]="!isEmailValid()"
            (click)="onContinue()">
      Continue
    </button>
  </div>
</div>
```

### Required Angular Material Imports

```typescript
imports: [
  FormsModule,          // for [(ngModel)]
  MatFormFieldModule,   // for <mat-form-field>
  MatInputModule,       // for matInput directive
  MatButtonModule,      // for mat-flat-button
]
```

### Email Validation

Use a simple method (not a `computed` — because `email` is a plain string bound via `ngModel`, not a signal):

```typescript
email = '';

isEmailValid(): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(this.email);
}
```

### Auth Methods

Currently uses Google OAuth via `AuthStore`:

```typescript
onContinue() {
  if (this.isEmailValid()) {
    this.authStore.login('google.com');
  }
}

onContinueAsGuest() {
  this.authStore.login('google.com');
}
```

To switch to email-link (passwordless) auth, extend `DatabaseService` with:
- `sendEmailLink(email, actionCodeSettings)` → Firebase `sendSignInLinkToEmail()`
- `signInWithEmailLink(email, link)` → Firebase `signInWithEmailLink()`
- `signInAnonymously()` → Firebase `signInAnonymously()`

### Style Pattern

- Full-viewport centered layout: `.login-page` uses `min-height: 100vh`, flexbox center
- Card is left-aligned text, max-width `340px`
- Continue button disabled state: `background: #e0e0e0`, enabled: `background: #333`
- Guest link: `color: #4285f4`, underline on hover
- Responsive at 480px breakpoint

## Landing Page Pattern

### Template Structure

```html
<div class="landing-page">
  <!-- Hexagon decoration clusters -->
  <div class="hex-cluster hex-cluster-left">
    <div class="hexagon hex-1"></div>
    <!-- ... more hexagons -->
  </div>
  <div class="hex-cluster hex-cluster-right">
    <div class="hexagon hex-6"></div>
    <!-- ... more hexagons -->
  </div>

  <!-- Main content -->
  <div class="landing-content">
    <h1 class="brand-name">Causeway</h1>
    <p class="tagline">
      Learn web development in Angular<br />
      by building a project step-by-step.
    </p>
    <button mat-flat-button class="get-started-btn" (click)="onGetStarted()">
      GET STARTED
    </button>
  </div>
</div>
```

### Navigation

Inject `Router` and navigate to `/login` on CTA click:

```typescript
private readonly router = inject(Router);

onGetStarted() {
  this.router.navigate(['/login']);
}
```

### CSS Hexagons

Hexagons use `clip-path: polygon()`:

```scss
.hexagon {
  position: absolute;
  width: 80px;
  height: 92px;
  clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
}
```

- Bottom-left cluster: soft purple `rgba(180, 170, 220, 0.15–0.25)`
- Top-right cluster: multi-colored (purple, pink/red, yellow) with varying opacity
- For a circle shape instead of hexagon: use `border-radius: 50%` and `clip-path: none`
- Hidden on mobile (`@media max-width: 768px`)

### Style Pattern

- Brand name: `color: #7c6bc4` (Causeway purple), `font-size: 56px`, `font-weight: 400`
- GET STARTED button: `background: #e53935` (red), uppercase, `letter-spacing: 1.2px`
- Content aligned left with `padding-left: 10%`
- Responsive: centered text on mobile, hexagons hidden

## Component Conventions

Both components follow these project conventions:

1. **Standalone**: `standalone: true` in component decorator
2. **OnPush**: `changeDetection: ChangeDetectionStrategy.OnPush`
3. **Section comments**: Code organized with `// --- SECTION ---` comment blocks
4. **AuthStore injection**: `authStore = inject(AuthStore)` for auth state
5. **Unique IDs**: All interactive elements have `id` attributes for testing (e.g., `login-email-input`, `login-continue-btn`)
6. **`:host` block**: Set `display: block; width: 100%; height: 100%` for full-page components

## Common Modifications

### Adding a new auth provider button

1. Add the button to `login.component.html` below the Continue button
2. Add a method in `login.component.ts` calling `this.authStore.login('<provider-id>')`

### Changing the landing page branding

1. Update `.brand-name` color in landing SCSS (currently `#7c6bc4`)
2. Update `.get-started-btn` background color (currently `#e53935`)
3. Update tagline text in landing HTML

### Adding form fields to login

1. Add the field with `mat-form-field` + `matInput` in the template
2. Add the property and validation in the TypeScript
3. Import any required Angular Material modules in the `imports` array
