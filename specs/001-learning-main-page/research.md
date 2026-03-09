# Research: Learning Main Page

**Feature Branch**: `001-learning-main-page`  
**Date**: 2026-02-27

## R1: Firestore Curriculum Storage

**Decision**: Store curriculum data across **four separate Firestore collections**: `courses`, `roles`, `subgoals`, and `subsubgoals`. Each collection's documents reference their parent via a foreign key (`__courseId`, `__roleId`, `__subgoalId`).

**Rationale**: Per user specification — each level of the curriculum hierarchy is a first-class collection. This enables independent CRUD on roles, subgoals, and steps without touching the parent document. Aligns with the existing entity pattern in the codebase (`withEntitiesAndDBMethods`).

**Alternatives considered**:
- Single embedded document: Simpler reads but doesn't allow independent entity management. Rejected per user clarification.
- Static JSON import: Rejected — curriculum must be updatable without redeployment.

## R2: Progress Tracking Pattern

**Decision** (PENDING — see open-questions.md Q2): Assume a `StudentProgress` entity stored in Firestore at `studentProgress/{userId}`. Contains a map of `stepId → status` where status is one of `not_started | in_progress | complete | similar_completed`.

**Rationale**: Keeps progress data separate from `UserContext` which has a different lifecycle (onboarding). A single document per user with a status map is efficient for read-heavy access (one read to get all progress).

**Alternatives considered**:
- Extend `UserContext`: Simpler but couples onboarding context with learning progress. `UserContext` is created once during onboarding and rarely updated.
- Subcollection per step: Too many documents for read-heavy page. Would require loading 50+ documents per page view.

## R3: Step Type Metadata

**Decision** (PENDING — see open-questions.md Q1): Assume step type (Concept, Task, Review) is stored as a `type` field per sub-subgoal entry in the curriculum document.

**Rationale**: Storing type alongside the curriculum data keeps it co-located and avoids any derivation logic that could break if step names change.

**Alternatives considered**:
- Derive from naming convention: Fragile — would break when naming patterns change.
- Separate metadata collection: Over-engineering for a simple field.

## R4: Component Architecture

**Decision**: Use Angular Material components with the existing `OnPush` change detection + NgRx Signal Store pattern. The home component becomes a container that streams curriculum and progress data.

**Rationale**: Aligns with existing codebase patterns (`HomeComponent` already uses signals and `AuthStore`). Angular Material provides `mat-tooltip`, `mat-icon`, `mat-progress-bar`, `mat-menu` (for role coach).

**Alternatives considered**:
- Custom UI only: Would miss Material Design consistency and accessibility features already used in the project.

## R5: Sidebar Implementation

**Decision**: Use CSS `position: sticky` for the sidebar on desktop, and conditionally hide it on mobile (<768px) with a slide-out drawer (Angular CDK `BreakpointObserver`).

**Rationale**: Sticky positioning keeps the sidebar visible while scrolling. Mobile breakpoint hides it to preserve content space — consistent with the Figma design.

**Alternatives considered**:
- Always-visible sidebar: Not practical on mobile viewports.
- `mat-sidenav`: Heavier than needed for a simple sticky TOC.
