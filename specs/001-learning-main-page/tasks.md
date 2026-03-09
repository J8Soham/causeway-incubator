# Tasks: Learning Main Page

**Input**: Design documents from `/specs/001-learning-main-page/`  
**Prerequisites**: plan.md (✅), spec.md (✅), research.md (✅), data-model.md (✅), contracts/ (✅)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Generate all new entities and components via schematics

- [x] T001 Generate `course` entity via `ng g @tech4good/angular-schematics:entity course` in `src/app/core/store/`
- [x] T002 [P] Generate `role` entity via `ng g @tech4good/angular-schematics:entity role` in `src/app/core/store/`
- [x] T003 [P] Generate `subgoal` entity via `ng g @tech4good/angular-schematics:entity subgoal` in `src/app/core/store/`
- [x] T004 [P] Generate `subsubgoal` entity via `ng g @tech4good/angular-schematics:entity subsubgoal` in `src/app/core/store/`
- [x] T005 [P] Generate `student-progress` entity via `ng g @tech4good/angular-schematics:entity student-progress` in `src/app/core/store/` (PENDING Q2 — generate with working assumption)
- [x] T006 Update `src/app/core/store/app.model.ts` — add Course, Role, Subgoal, Subsubgoal, StudentProgress to `AnyEntity` union type

---

## Phase 2: Foundational (Entity Models & Stores)

**Purpose**: Define interfaces and configure stores for all curriculum entities

**⚠️ CRITICAL**: No UI work can begin until entity models are defined

- [x] T007 Define `Course` interface in `src/app/core/store/course/course.model.ts` with fields: `__id`, `title`, `subtitle`, `description`, `order`, timestamps, `_deleted`
- [x] T008 [P] Define `Role` interface in `src/app/core/store/role/role.model.ts` with fields: `__id`, `__courseId`, `name`, `icon`, `color`, `description`, `order`, timestamps, `_deleted`
- [x] T009 [P] Define `Subgoal` interface in `src/app/core/store/subgoal/subgoal.model.ts` with fields: `__id`, `__roleId`, `name`, `order`, timestamps, `_deleted`
- [x] T010 [P] Define `Subsubgoal` interface in `src/app/core/store/subsubgoal/subsubgoal.model.ts` with fields: `__id`, `__subgoalId`, `name`, `type`, `order`, timestamps, `_deleted`
- [x] T011 [P] Define `StudentProgress` interface in `src/app/core/store/student-progress/student-progress.model.ts` with fields: `__id`, `__userId`, `stepStatuses` map, timestamps, `_deleted` (PENDING Q2)
- [x] T012 Configure `CourseStore` in `src/app/core/store/course/course.store.ts` using `withEntitiesAndDBMethods<Course>('courses')`
- [x] T013 [P] Configure `RoleStore` in `src/app/core/store/role/role.store.ts` using `withEntitiesAndDBMethods<Role>('roles')`
- [x] T014 [P] Configure `SubgoalStore` in `src/app/core/store/subgoal/subgoal.store.ts` using `withEntitiesAndDBMethods<Subgoal>('subgoals')`
- [x] T015 [P] Configure `SubsubgoalStore` in `src/app/core/store/subsubgoal/subsubgoal.store.ts` using `withEntitiesAndDBMethods<Subsubgoal>('subsubgoals')`
- [x] T016 [P] Configure `StudentProgressStore` in `src/app/core/store/student-progress/student-progress.store.ts` using `withEntitiesAndDBMethods<StudentProgress>('studentProgress')` (PENDING Q2)

**Checkpoint**: ✅ All entity models and stores are ready.

---

## Phase 3: User Story 1 — View Learning Pathway Overview (Priority: P1) 🎯 MVP

**Goal**: Student sees page title, progress bar, Continue CTA, and legends on the home page.

**Independent Test**: Log in → navigate to `/home` → verify title, subtitle, progress bar (percentage), Continue card, progress legends.

### Implementation

- [x] T017 Generate `curriculum-grid` component via `ng g @tech4good/angular-schematics:component curriculum-grid` in `src/app/main/`
- [x] T018 [US1] Wire `HomeComponent` (`src/app/main/home/home.component.ts`) to inject `CourseStore`, `RoleStore`, `SubgoalStore`, `SubsubgoalStore`, `StudentProgressStore`. Add signals: `course`, `roles`, `subgoals`, `subsubgoals`, `progressMap`, `overallProgress`, `nextStep`, `isLoading`
- [x] T019 [US1] Update `HomeComponent.ngOnInit` — stream course data, then stream roles by `__courseId`, subgoals, subsubgoals, and student progress by `__userId`
- [x] T020 [US1] Implement `overallProgress` computed signal — count subsubgoals with `complete`/`similar_completed` status ÷ total subsubgoals × 100
- [x] T021 [US1] Implement `nextStep` computed signal — find first subsubgoal in curriculum order with `not_started` or `in_progress` status
- [x] T022 [US1] Build home page header in `src/app/main/home/home.component.html` — title, subtitle, description from `course` signal
- [x] T023 [US1] Add `mat-progress-bar` for overall progress with percentage label
- [x] T024 [US1] Add "Continue" CTA card with project name label and link to next step
- [x] T025 [US1] Add progress indicator legend (Not Started, Similar Step Completed, Complete, In Progress) and step type legend (Concept, Task, Review)
- [x] T026 [US1] Style the overview section in `src/app/main/home/home.component.scss` — match Figma layout with proper spacing, typography

**Checkpoint**: ✅ User Story 1 is functional.

---

## Phase 4: User Story 2 — Browse Curriculum by Roles and Subgoals (Priority: P1) 🎯 MVP

**Goal**: Student sees curriculum organized by roles → subgoals → step icon grids.

**Independent Test**: View home page → verify role sections with subgoal rows and step icons → hover icons for tooltips.

### Implementation

- [x] T027 Generate `role-section` component via `ng g @tech4good/angular-schematics:component role-section` in `src/app/main/`
- [x] T028 [P] Generate `step-icon` component via `ng g @tech4good/angular-schematics:component step-icon` in `src/app/main/`
- [x] T029 [US2] Implement `StepIconComponent` (`src/app/main/step-icon/`) — inputs: `step` (Subsubgoal), `status` (string). Render icon shape by `step.type`, fill color by `status`. Add `mat-tooltip` with `step.name`. Emit `clicked` event
- [x] T030 [US2] Implement `RoleSectionComponent` (`src/app/main/role-section/`) — inputs: `role` (Role), `subgoals` filtered for this role, `subsubgoals`, `progressMap`. Render role heading (icon + colored name), then for each subgoal render label + horizontal row of `app-step-icon` components
- [x] T031 [US2] Implement `CurriculumGridComponent` (`src/app/main/curriculum-grid/`) — inputs: `roles`, `subgoals`, `subsubgoals`, `progressMap`. Render an `app-role-section` for each role
- [x] T032 [US2] Integrate `app-curriculum-grid` into `HomeComponent` template — pass roles, subgoals, subsubgoals, progressMap as inputs
- [x] T033 [US2] Style role sections and step icon grid in component SCSS files — icons colored by status, horizontal wrap for long rows, spacing per Figma

**Checkpoint**: ✅ User Story 2 is functional.

---

## Phase 5: User Story 3 — Table of Contents Sidebar (Priority: P2)

**Goal**: Fixed sidebar on the right listing all roles and subgoals with click-to-scroll.

**Independent Test**: View home page on desktop → verify sidebar renders → click a role heading → page scrolls to that section.

### Implementation

- [x] T034 Generate `sidebar-toc` component via `ng g @tech4good/angular-schematics:component sidebar-toc` in `src/app/main/`
- [x] T035 [US3] Implement `SidebarTocComponent` (`src/app/main/sidebar-toc/`) — inputs: `roles` (Role[]). Render role names (with icons/colors) and subgoal names as nested lists. Emit `roleClicked` and `subgoalClicked` events
- [x] T036 [US3] Add `id` attributes to role sections in `CurriculumGridComponent` for scroll-to targeting
- [x] T037 [US3] Integrate `app-sidebar-toc` into `HomeComponent` — position as sticky right sidebar. Handle scroll events from sidebar (use `ViewportScroller` or `Element.scrollIntoView`)
- [x] T038 [US3] Style sidebar — `position: sticky`, hide on mobile (<768px), responsive layout with CSS grid/flexbox
- [ ] T039 [US3] Add mobile toggle for sidebar visibility (hidden by default on small viewports, toggleable via button)

**Checkpoint**: Sidebar navigation works on desktop, hidden on mobile.

---

## Phase 6: User Story 4 — Role Coach Popup (Priority: P3)

**Goal**: Floating button that opens a popup with role selector and role description.

**Independent Test**: Click floating button → popup opens → switch roles via dropdown → verify descriptions update → close popup.

### Implementation

- [x] T040 Generate `role-coach` component via `ng g @tech4good/angular-schematics:component role-coach` in `src/app/main/`
- [x] T041 [US4] Implement `RoleCoachComponent` (`src/app/main/role-coach/`) — inputs: `roles` (Role[]), `initialRole` (string). Local state: `isOpen`, `selectedRole`. Render `mat-fab` at bottom-right, popup panel with `mat-select` dropdown and role description
- [x] T042 [US4] Integrate `app-role-coach` into `HomeComponent` — pass `roles` and initial role
- [x] T043 [US4] Style role coach — floating button position, popup overlay, dropdown, close behavior (click outside or X button)

**Checkpoint**: ✅ Role coach popup is functional.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, edge cases, and responsive refinements

- [x] T044 [P] Add loading skeleton/spinner while curriculum data streams in
- [x] T045 [P] Add error state with retry button when Firestore data fails to load
- [x] T046 Handle edge case: student has progress but curriculum structure has changed (new subsubgoals = not_started, removed subsubgoals ignored)
- [x] T047 [P] Handle edge case: student with no StudentProgress record (default to 0%, all not_started)
- [ ] T048 Responsive testing — verify layout at 320px, 768px, 1024px, 1920px viewports
- [ ] T049 Run `npm run lint` and fix any linting errors
- [ ] T050 Run `npm test` and ensure all existing + new tests pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: ✅ Complete
- **Phase 2 (Foundational)**: ✅ Complete
- **Phase 3 (US1)** + **Phase 4 (US2)**: ✅ Complete
- **Phase 5 (US3)**: ✅ Complete (except mobile toggle T039)
- **Phase 6 (US4)**: ✅ Complete
- **Phase 7 (Polish)**: Partially complete (T044–T047 done, T048–T050 pending)

### Parallel Opportunities

- T001–T005: ✅ All entity generation complete
- T007–T011: ✅ All model definitions complete
- T012–T016: ✅ All store configurations complete
- T027/T028: ✅ Component generation complete
- Phase 3 and Phase 4: ✅ Complete
- Phase 6: ✅ Complete

---

## Notes

- All components generated via `ng g @tech4good/angular-schematics:component` in `src/app/main/`
- All entities generated via `ng g @tech4good/angular-schematics:entity` in `src/app/core/store/`
- Tasks marked PENDING depend on open-questions.md (Q1: step types, Q2: progress storage) — proceed with working assumptions
- Commit after each phase or logical group
- **Build status**: ✅ Compiles successfully with 2 minor budget warnings (non-blocking)
