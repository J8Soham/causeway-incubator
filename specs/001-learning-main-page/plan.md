# Implementation Plan: Learning Main Page

**Branch**: `001-learning-main-page` | **Date**: 2026-02-27 | **Spec**: [spec.md](spec.md)  
**Input**: Feature specification from `specs/001-learning-main-page/spec.md`

## Summary

Build the main learning page for CausewayIncubator — a web development learning platform. The page displays a curriculum organized by roles (Components, Containers, Applications) with subgoals and step grids, an overall progress bar, a "Continue" CTA, a sidebar table of contents, and a floating role coach popup. Curriculum data is sourced from Firestore; student progress is tracked per-user.

## Technical Context

**Language/Version**: TypeScript ~5.4.x  
**Primary Dependencies**: Angular ^18.x, Angular Material ^18.x, NgRx Signal Store ^18.x, RxJS ~7.8.x, @angular/fire ^18.x  
**Storage**: Firebase Firestore (courses, roles, subgoals, subsubgoals, studentProgress collections)  
**Testing**: Jest ^29.x with @testing-library/angular  
**Target Platform**: Web (responsive 320px–1920px)  
**Project Type**: Web application (Angular SPA)  
**Performance Goals**: TTI <3s on 4G, interactions <100ms  
**Constraints**: OnPush change detection, lazy-loaded routes  
**Scale/Scope**: ~60 subsubgoals across ~6 roles, single-user progress view

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Code Quality & Standards | ✅ PASS | ESLint, `app` prefix, standalone components, schematics |
| I. Scaffolding | ✅ PASS | Will use `ng g @tech4good/angular-schematics:component` for new components in `main/`, `ng g @tech4good/angular-schematics:entity` for new entities in `core/store/` |
| II. Testing Standards | ✅ PASS | Jest specs alongside each new component/store |
| III. UX Consistency | ✅ PASS | Angular Material, responsive, ARIA labels, loading states |
| IV. Performance | ✅ PASS | OnPush, Signal Store reactivity, lazy curriculum load |
| V. Simplicity | ✅ PASS | No unnecessary abstractions, flat structure |

## Project Structure

### Documentation (this feature)

```text
specs/001-learning-main-page/
├── spec.md              # Feature specification
├── research.md          # Phase 0 research decisions
├── data-model.md        # Entity definitions
├── plan.md              # This file
├── open-questions.md    # Pending design questions
├── quickstart.md        # Local dev instructions
├── contracts/           # Component interface contracts
│   └── components.md    # UI component contracts
└── checklists/
    └── requirements.md  # Spec quality checklist
```

### Source Code (repository root)

```text
src/app/
├── core/store/
│   ├── course/                      # NEW entity (via schematics)
│   │   ├── course.model.ts
│   │   ├── course.store.ts
│   │   └── course.model.spec.ts
│   ├── role/                        # NEW entity (via schematics)
│   │   ├── role.model.ts
│   │   ├── role.store.ts
│   │   └── role.model.spec.ts
│   ├── subgoal/                     # NEW entity (via schematics)
│   │   ├── subgoal.model.ts
│   │   ├── subgoal.store.ts
│   │   └── subgoal.model.spec.ts
│   ├── subsubgoal/                  # NEW entity (via schematics)
│   │   ├── subsubgoal.model.ts
│   │   ├── subsubgoal.store.ts
│   │   └── subsubgoal.model.spec.ts
│   ├── student-progress/            # NEW entity (via schematics) — PENDING Q2
│   │   ├── student-progress.model.ts
│   │   ├── student-progress.store.ts
│   │   └── student-progress.model.spec.ts
│   └── app.model.ts                 # Update AnyEntity union type
│
├── main/home/
│   ├── home.component.ts            # MODIFY — wire up stores, computed signals
│   ├── home.component.html          # MODIFY — full page layout
│   ├── home.component.scss          # MODIFY — page styles
│   └── home.component.spec.ts       # MODIFY — tests
│
├── main/
│   ├── curriculum-grid/             # NEW component (via schematics)
│   │   ├── curriculum-grid.component.ts
│   │   ├── curriculum-grid.component.html
│   │   ├── curriculum-grid.component.scss
│   │   └── curriculum-grid.component.spec.ts
│   ├── role-section/                # NEW component (via schematics)
│   │   ├── role-section.component.ts
│   │   ├── role-section.component.html
│   │   ├── role-section.component.scss
│   │   └── role-section.component.spec.ts
│   ├── step-icon/                   # NEW component (via schematics)
│   │   ├── step-icon.component.ts
│   │   ├── step-icon.component.html
│   │   ├── step-icon.component.scss
│   │   └── step-icon.component.spec.ts
│   ├── sidebar-toc/                 # NEW component (via schematics)
│   │   ├── sidebar-toc.component.ts
│   │   ├── sidebar-toc.component.html
│   │   ├── sidebar-toc.component.scss
│   │   └── sidebar-toc.component.spec.ts
│   └── role-coach/                  # NEW component (via schematics)
│       ├── role-coach.component.ts
│       ├── role-coach.component.html
│       ├── role-coach.component.scss
│       └── role-coach.component.spec.ts
```

**Structure Decision**: All new components go under `src/app/main/` per constitution (scaffolding rule). All new entities go under `src/app/core/store/`. HomeComponent acts as the container, streaming data from CourseStore, RoleStore, SubgoalStore, SubsubgoalStore, and StudentProgressStore. Each curriculum level is a separate Firestore collection linked via foreign keys.

## Complexity Tracking

> No constitution violations. All patterns follow existing codebase conventions.
