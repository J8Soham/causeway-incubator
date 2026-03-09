# Open Questions: Learning Main Page

**Feature Branch**: `001-learning-main-page`  
**Created**: 2026-02-27  
**Status**: Awaiting Answers

---

## Q1: Step Types — Storage & Source of Truth

**Context**: The Figma designs show three step types: Concept Step, Task Step, and Review Step. Each renders with a distinct icon shape in the step grid.

**Question**: Is the step type (Concept / Task / Review) stored per step in the database as metadata, or is it derived from the step's name, position, or some other convention?

**Impact on implementation**:
- If stored in DB → the curriculum Firestore document needs a `type` field per sub-subgoal
- If derived → we need a clear rule (e.g., steps ending in "Quiz" are Review type)

**Current assumption**: Stored as metadata per step. Will proceed with this assumption and adjust if needed.

---

## Q2: Progress Storage — New Entity vs. Extended UserContext

**Context**: We need to track per-step completion status (Not Started, In Progress, Complete, Similar Step Completed) for each student.

**Question**: Should step completion be tracked as a new entity (e.g., `StudentProgress` with one document per user containing a map of step statuses), or should the existing `UserContext` model be extended with progress fields?

**Impact on implementation**:
- New entity → needs `ng g @tech4good/angular-schematics:entity` for a new store, new Firestore collection, full CRUD
- Extended `UserContext` → simpler, but `UserContext` may become bloated if progress data is large

**Current assumption**: New `StudentProgress` entity. Will proceed with this assumption and adjust if needed.

---

## Resolved Questions

### ~~Q3: Curriculum Source~~ ✅ RESOLVED

**Answer**: Curriculum data is stored in **Firestore** so it can be updated without redeploying. The static `structure.json` serves as the initial seed/reference but the runtime source of truth is Firestore.
