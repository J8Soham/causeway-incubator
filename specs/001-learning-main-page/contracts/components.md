# Component Contracts: Learning Main Page

**Feature Branch**: `001-learning-main-page`  
**Date**: 2026-02-27

## HomeComponent (Container — MODIFY)

**Selector**: `app-home`  
**Role**: Container component. Streams curriculum and progress data, computes derived state, passes data to child components.

**Inputs**: None (reads from stores directly)  
**Outputs**: None  
**Stores injected**: `AuthStore`, `CourseStore`, `RoleStore`, `SubgoalStore`, `SubsubgoalStore`, `StudentProgressStore`

**Signals**:
| Signal | Type | Description |
|--------|------|-------------|
| `currentUser` | `Signal<User>` | Already exists |
| `course` | `Signal<Course>` | Loaded from CourseStore |
| `roles` | `Signal<Role[]>` | Streamed from RoleStore, filtered by courseId |
| `subgoals` | `Signal<Subgoal[]>` | Streamed from SubgoalStore |
| `subsubgoals` | `Signal<Subsubgoal[]>` | Streamed from SubsubgoalStore |
| `progressMap` | `Signal<Map<string, string>>` | Student's step statuses |
| `overallProgress` | `Signal<number>` | Computed: percentage 0–100 |
| `nextStep` | `Signal<{ roleName, subgoalName, subsubgoal }>` | Computed: first uncompleted step |
| `isLoading` | `WritableSignal<boolean>` | Loading state |

---

## CurriculumGridComponent (Presentational — NEW)

**Selector**: `app-curriculum-grid`  
**Role**: Renders the full curriculum tree as role sections with subgoal rows.

| Input | Type | Description |
|-------|------|-------------|
| `roles` | `Role[]` | Array of curriculum roles to render |
| `progressMap` | `Map<string, string>` | Step ID → status map |

| Output | Type | Description |
|--------|------|-------------|
| `stepClicked` | `EventEmitter<string>` | Emits step ID when a step icon is clicked |

---

## RoleSectionComponent (Presentational — NEW)

**Selector**: `app-role-section`  
**Role**: Renders a single role heading with its subgoal rows.

| Input | Type | Description |
|-------|------|-------------|
| `role` | `Role` | The role to render |
| `progressMap` | `Map<string, string>` | Step ID → status map |

| Output | Type | Description |
|--------|------|-------------|
| `stepClicked` | `EventEmitter<string>` | Bubbles up from StepIconComponent |

---

## StepIconComponent (Presentational — NEW)

**Selector**: `app-step-icon`  
**Role**: Renders a single step as an icon with tooltip. Visual appearance depends on step type and progress status.

| Input | Type | Description |
|-------|------|-------------|
| `step` | `Step` | Step data (name, id, type) |
| `status` | `string` | One of: `not_started`, `in_progress`, `complete`, `similar_completed` |

| Output | Type | Description |
|--------|------|-------------|
| `clicked` | `EventEmitter<string>` | Emits step ID on click |

**Behavior**:
- Icon shape determined by `step.type` (concept, task, review)
- Fill color determined by `status`
- `mat-tooltip` shows `step.name` on hover

---

## SidebarTocComponent (Presentational — NEW)

**Selector**: `app-sidebar-toc`  
**Role**: Renders the table of contents sidebar with role and subgoal links.

| Input | Type | Description |
|-------|------|-------------|
| `roles` | `Role[]` | Array of curriculum roles |

| Output | Type | Description |
|--------|------|-------------|
| `roleClicked` | `EventEmitter<string>` | Emits role name for scroll-to navigation |
| `subgoalClicked` | `EventEmitter<{ role, subgoal }>` | Emits for subgoal-level scroll |

---

## RoleCoachComponent (Presentational — NEW)

**Selector**: `app-role-coach`  
**Role**: Floating button + popup dialog for role coaching context.

| Input | Type | Description |
|-------|------|-------------|
| `roles` | `Role[]` | Available roles for the dropdown |
| `initialRole` | `string` | Initially selected role name |

**Local State**: `isOpen: boolean`, `selectedRole: string`

**Behavior**:
- Renders a floating `mat-fab` button at bottom-right
- On click → opens overlay panel with dropdown and description
- Role selector is a `mat-select` dropdown
- Close on X button or click outside
