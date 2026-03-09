<!--
  Sync Impact Report
  Version change: 1.0.0 → 1.1.0 (added scaffolding conventions)
  Modified principles:
    - I. Code Quality & Standards (added scaffolding rule for @tech4good/angular-schematics)
  Added sections: 
    - VI. Architecture & Data Flow (Presentation vs Container pattern, State & Persistence)
  Removed sections: none
  Templates requiring updates:
    - plan-template.md ✅ (Constitution Check section already references constitution gates)
    - spec-template.md ✅ (no constitutional conflicts; user-story-first structure aligns)
    - tasks-template.md ✅ (test-first methodology and parallel markers align)
    - checklist-template.md ✅ (generic; no conflicts)
  Follow-up TODOs: none
-->

# CausewayIncubator Constitution

## Core Principles

### I. Code Quality & Standards

All source code MUST adhere to the following non-negotiable rules:

- **Style**: Follow [Google's JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html). ESLint (with `@angular-eslint`, `@typescript-eslint`, and `eslint-config-google`) MUST pass with zero errors before any code is merged.
- **TypeScript strictness**: Prefer explicit types on public APIs. Avoid `any` except in files explicitly exempted by the ESLint config (specs, store services, effects, selectors, actions).
- **Component conventions**: Angular components MUST use the `app` prefix, `kebab-case` selectors, and standalone component architecture. Directives MUST use `camelCase` attribute selectors with the `app` prefix.
- **Single Responsibility**: Each file, class, and function MUST have a single, well-defined purpose. Components handle view logic; services handle business logic; stores handle state. Do NOT define extra functions or classes outside of the main exported class (e.g. outside `export class ComponentName`) within a file.
- **Public API documentation**: All public methods and service interfaces MUST include JSDoc or inline documentation explaining intent, parameters, and return values.
- **Scaffolding**: New components MUST be generated using `ng g @tech4good/angular-schematics:component` and placed under `src/app/main/`. New entities (datastores) MUST be generated using `ng g @tech4good/angular-schematics:entity` and placed under `src/app/core/store/`. Do NOT manually create component or entity folder structures — always use the schematics.

### II. Testing Standards

Testing discipline MUST be maintained to ensure correctness and prevent regressions:

- **Framework**: Jest with `jest-preset-angular` is the required test runner. All test files MUST use the `.spec.ts` extension and live alongside the code they test.
- **Coverage expectations**: Every new feature or bug fix SHOULD include at least one corresponding unit test. Critical services and store logic MUST have unit tests.
- **Testing Library**: Use `@testing-library/angular` for component tests to encourage testing user-facing behavior rather than implementation details.
- **Test isolation**: Tests MUST NOT depend on external services (Firebase, network). Mock all external dependencies using Jest mocks or testing doubles.
- **Run before merge**: `npm test` MUST pass with zero failures before any PR is merged to `develop`.

### III. User Experience Consistency

The user interface MUST deliver a cohesive, accessible, and predictable experience:

- **Design system**: Use Angular Material components as the primary UI toolkit. Custom components MUST follow Material Design guidelines for typography, spacing, color, and elevation.
- **Responsive design**: All views MUST be functional on viewport widths from 320px (mobile) to 1920px (desktop). Use Angular CDK `BreakpointObserver` or CSS media queries — never assume a fixed viewport.
- **Accessibility**: All interactive elements MUST have appropriate ARIA labels, keyboard navigation support, and sufficient color contrast (WCAG 2.1 AA minimum).
- **Loading states**: Every asynchronous operation visible to the user MUST display a loading indicator. Empty states and error states MUST be explicitly designed — no blank screens.
- **Consistent navigation**: Route transitions MUST maintain predictable URL structure and browser back-button behavior. Use Angular Router's lazy loading for feature modules.

### IV. Performance Requirements

The application MUST meet the following performance targets:

- **Initial load**: Time to Interactive (TTI) MUST be under 3 seconds on a 4G connection. Use lazy-loaded routes and tree-shakeable imports to minimize the initial bundle.
- **Runtime rendering**: UI interactions (clicks, input, navigation) MUST respond within 100ms. Avoid unnecessary change detection cycles — prefer `OnPush` change detection strategy and NgRx Signal Store's fine-grained reactivity.
- **Bundle size**: Monitor production bundle size. Any single lazy-loaded chunk SHOULD remain under 200KB gzipped. New dependencies MUST be justified by their value-to-size ratio.
- **Firebase efficiency**: Minimize Firestore reads and writes. Use batched operations, local caching, and optimistic updates where appropriate. Subscription-based listeners MUST be properly unsubscribed on component destroy.
- **Memory management**: RxJS subscriptions MUST be managed via `takeUntilDestroyed()`, `async` pipe, or explicit unsubscription. No observable leaks.

### V. Simplicity & Maintainability

Complexity MUST be justified — start simple, evolve only when proven necessary:

- **YAGNI**: Do not build features, abstractions, or infrastructure until there is a concrete, immediate need. Speculative generalization is prohibited.
- **Flat structure**: Prefer a flat folder structure within feature areas. Nest only when a component has tightly coupled children (e.g., a complex form with sub-components).
- **Minimal dependencies**: Every new `npm` dependency MUST be reviewed for necessity, maintenance status, bundle impact, and license compatibility. Prefer Angular/RxJS built-in solutions over third-party libraries.
- **Readable over clever**: Code MUST be understandable by a new contributor within reasonable effort. Prefer explicit patterns over implicit magic.

### VI. Architecture & Data Flow

The project follows a component-based workflow for all features and learning modules:

- **Presentation vs. Container Pattern**:
  - **Display Components**: "Dumb" presentational components MUST handle only UI-specific logic. They use `@Input()` for receiving data and MUST use `ChangeDetectionStrategy.OnPush`.
  - **Container Components**: "Smart" parent components inject stores (e.g., `AuthStore`, `DATABASE_SERVICE`), orchestrate state logic, and provide data to display components exclusively via signals.
- **State & Persistence**:
  - Access user state via the `AuthStore` (e.g., `authStore.user()`).
  - Use the `DATABASE_SERVICE` (Firestore wrapper) to persist changes. Always verify that an active user is present before attempting a database write.
  - Updates to user data MUST strictly match the defined `User` model interface/schema.
  - For complex tasks, isolate state into dedicated feature-specific stores.
- **Reactivity & Effects**:
  - Use Angular Signals for derivations (`computed`).
  - Use `effect()` very sparingly. Heavy reliance on `effect()` often indicates a flawed, imperative data-flow design. Favor declarative computed signals instead.

## Technology Constraints

The CausewayIncubator platform is built on the following mandated stack:

| Layer | Technology | Version Constraint |
|-------|-----------|-------------------|
| Framework | Angular | ^18.x |
| UI Library | Angular Material + CDK | ^18.x |
| State Management | NgRx Signal Store | ^18.x |
| Reactive Extensions | RxJS | ~7.8.x |
| Language | TypeScript | ~5.4.x |
| Styling | Sass (SCSS) | Latest |
| Backend | Firebase (Firestore, Auth, Hosting) | via `@angular/fire` ^18.x |
| Environment Config | dotenv / `ngx-env` | Latest |
| Testing | Jest + Testing Library | jest ^29.x |
| Linting | ESLint + Angular-ESLint + Google config | Defined in `.eslintrc.json` |
| Scaffolding | `@tech4good/angular-schematics` (`:component`, `:entity`) | ^18.x |

Changes to the mandated stack MUST be proposed as a constitutional amendment (see Governance below).

## Development Workflow

All contributions MUST follow this process:

1. **Branch from `develop`**: Create a feature branch named `<type>/<issue#>-<short-description>` (e.g., `feat/12-learn-page`, `fix/45-payment-timeout`). The issue number MUST reference an existing GitHub issue. Each branch MUST be scoped to exactly one issue.
2. **Lint**: Run `npm run lint` — zero errors required.
3. **Test**: Run `npm test` — zero failures required.
4. **Build**: Run `npm run build` — must compile without errors.
5. **PR to `develop`**: Submit a pull request with a Conventional Commit-style title. PRs MUST include a description of _what_ and _why_.
6. **Code review**: At least one maintainer approval is required before merge.
7. **No direct pushes**: The `develop` and `main` branches are protected. All changes go through PRs.

## Governance

- This constitution is the highest-priority reference for all development decisions in the CausewayIncubator project.
- **Amendments** require: (1) a written proposal documenting the change, rationale, and migration plan; (2) approval from at least one project maintainer; (3) an updated constitution version.
- **Versioning**: The constitution follows semantic versioning — MAJOR for principle removals or incompatible redefinitions, MINOR for new principles or significant expansions, PATCH for clarifications and typo fixes.
- **Compliance**: All PRs and code reviews MUST verify adherence to these principles. Deviations MUST be justified in the PR description and tracked in `Complexity Tracking` tables within implementation plans.

**Version**: 1.2.0 | **Ratified**: 2026-02-27 | **Last Amended**: 2026-03-09
