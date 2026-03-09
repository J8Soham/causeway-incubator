# Data Model: Learning Main Page

**Feature Branch**: `001-learning-main-page`  
**Date**: 2026-02-27 (updated)  
**Source**: spec.md, research.md, user clarification

## Firestore Collections Overview

```
courses/{courseId}
roles/{roleId}              → references courseId
subgoals/{subgoalId}        → references roleId
subsubgoals/{subsubgoalId}  → references subgoalId
studentProgress/{progressId} → references userId (PENDING Q2)
users/{userId}              → existing
userContexts/{contextId}    → existing
```

## Entities

### Course (Firestore: `courses/{courseId}`)

Top-level entity representing a learning pathway.

| Field | Type | Description |
|-------|------|-------------|
| `__id` | string | Document ID |
| `title` | string | e.g., "Web Dev Skill-building" |
| `subtitle` | string | e.g., "Using NgRx, Firebase, and Angular" |
| `description` | string | Introductory paragraph about the learning pathway |
| `order` | number | Display order if multiple courses exist |
| `_createdAt` | Timestamp | Creation timestamp |
| `_updatedAt` | Timestamp | Last updated timestamp |
| `_deleted` | boolean | Soft delete flag |

### Role (Firestore: `roles/{roleId}`)

A top-level learning role linked to a course.

| Field | Type | Description |
|-------|------|-------------|
| `__id` | string | Document ID |
| `__courseId` | string | Foreign key → `courses/{courseId}` |
| `name` | string | e.g., "Components", "Containers", "Applications" |
| `icon` | string | Material icon name or emoji identifier |
| `color` | string | Hex color code for the role's visual theme |
| `description` | string | Brief explanation of the role's learning focus |
| `order` | number | Display order within the course |
| `_createdAt` | Timestamp | Creation timestamp |
| `_updatedAt` | Timestamp | Last updated timestamp |
| `_deleted` | boolean | Soft delete flag |

### Subgoal (Firestore: `subgoals/{subgoalId}`)

A group of related learning steps within a role.

| Field | Type | Description |
|-------|------|-------------|
| `__id` | string | Document ID |
| `__roleId` | string | Foreign key → `roles/{roleId}` |
| `name` | string | e.g., "Elements", "Layout", "Data", "Events" |
| `order` | number | Display order within the role |
| `_createdAt` | Timestamp | Creation timestamp |
| `_updatedAt` | Timestamp | Last updated timestamp |
| `_deleted` | boolean | Soft delete flag |

### Subsubgoal (Firestore: `subsubgoals/{subsubgoalId}`)

A single learning step within a subgoal.

| Field | Type | Description |
|-------|------|-------------|
| `__id` | string | Document ID |
| `__subgoalId` | string | Foreign key → `subgoals/{subgoalId}` |
| `name` | string | e.g., "Declare Components", "Angular Material" |
| `type` | string | PENDING (Q1): One of `concept`, `task`, `review` |
| `order` | number | Display order within the subgoal |
| `_createdAt` | Timestamp | Creation timestamp |
| `_updatedAt` | Timestamp | Last updated timestamp |
| `_deleted` | boolean | Soft delete flag |

### StudentProgress (Firestore: `studentProgress/{progressId}`)

PENDING (Q2) — working assumption. Tracks per-user step completion.

| Field | Type | Description |
|-------|------|-------------|
| `__id` | string | Document ID |
| `__userId` | string | Foreign key → `users/{userId}` |
| `stepStatuses` | Map<string, string> | Map of `subsubgoalId → status` where status is one of: `not_started`, `in_progress`, `complete`, `similar_completed` |
| `_createdAt` | Timestamp | Creation timestamp |
| `_updatedAt` | Timestamp | Last updated timestamp |
| `_deleted` | boolean | Soft delete flag |

### User (existing — no changes)

### UserContext (existing — no changes)

## Relationships

```
Course (1) ──── (*) Role         (via Role.__courseId)
  Role (1) ──── (*) Subgoal      (via Subgoal.__roleId)
    Subgoal (1) ──── (*) Subsubgoal  (via Subsubgoal.__subgoalId)

User (1) ──── (1) StudentProgress  (via StudentProgress.__userId)
  │
  └──── (1) UserContext

StudentProgress.stepStatuses keys ──── Subsubgoal.__id
```

## Query Patterns

| Query | Collection | Filter | Used By |
|-------|-----------|--------|---------|
| Get course | `courses` | `__id == courseId` | HomeComponent |
| Get roles for course | `roles` | `__courseId == courseId`, order by `order` | HomeComponent |
| Get subgoals for role | `subgoals` | `__roleId == roleId`, order by `order` | RoleSectionComponent |
| Get subsubgoals for subgoal | `subsubgoals` | `__subgoalId == subgoalId`, order by `order` | RoleSectionComponent |
| Get progress for user | `studentProgress` | `__userId == userId` | HomeComponent |

## Computed Values

| Computed | Formula | Description |
|----------|---------|-------------|
| Overall progress % | `completedSteps / totalSubsubgoals × 100` | Counts subsubgoals with status `complete` or `similar_completed` |
| Next step | First subsubgoal in order with status `not_started` or `in_progress` | Drives the "Continue" CTA card |

## State Transitions (Step Status)

```
not_started → in_progress → complete
                          → similar_completed
```
