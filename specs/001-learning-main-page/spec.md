# Feature Specification: Learning Main Page

**Feature Branch**: `001-learning-main-page`  
**Created**: 2026-02-27  
**Status**: Draft  
**Input**: User description: "Build the main learning page with curriculum roles, progress tracking, step grids, role coach sidebar, and table of contents for a web development learning platform"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Learning Pathway Overview (Priority: P1)

A student logs in and lands on the home page. They see a title ("Learn Web Development" with subtitle "Using NgRx, Firebase, and Angular"), a brief description of the learning pathway, and an overall progress bar showing their completion percentage. Below the progress bar, they see a legend explaining the different progress indicators (Not Started, Similar Step Completed, Complete, In Progress) and step types (Concept Step, Task Step, Review Step).

**Why this priority**: This is the foundational page layout — without it, no other feature can exist. Students need to see where they are in the curriculum at a glance.

**Independent Test**: Can be fully tested by logging in as a student and verifying the page renders with the correct title, description, progress bar, and legends.

**Acceptance Scenarios**:

1. **Given** a logged-in student with some completed steps, **When** they navigate to `/home`, **Then** they see the page title, subtitle, description, overall progress bar (with correct percentage), and the progress indicator & step type legends.
2. **Given** a new student with no progress, **When** they navigate to `/home`, **Then** the progress bar shows 0% and all step indicators default to "Not Started."
3. **Given** a student, **When** the page loads, **Then** they see a "Continue" call-to-action card (with a preview thumbnail and label like "The Compass project") linking to their next uncompleted step.

---

### User Story 2 - Browse Curriculum by Roles and Subgoals (Priority: P1)

Below the overview section, the student sees the curriculum organized by **roles** (Preliminaries, Components, Containers, Applications, etc.). Each role has a distinct icon and color. Under each role, there are **subgoal** sections (e.g., under Components: Elements, Layout, Data, Events). Each subgoal displays a horizontal grid of step icons — one icon per sub-subgoal (learning step). Each step icon is color-coded by its progress status (Not Started, In Progress, Complete, Similar Step Completed) and shaped by its type (Concept, Task, Review).

**Why this priority**: The step grid is the core curriculum navigation — it's how students see and access all learning content.

**Independent Test**: Can be tested by verifying that the curriculum tree from `structure.json` renders as role → subgoal → step-icon rows with correct labels and icons.

**Acceptance Scenarios**:

1. **Given** a logged-in student, **When** they view the home page, **Then** they see role sections matching the curriculum tree (Preliminaries, Components, Containers, Applications), each with an icon and colored heading.
2. **Given** a role section, **When** the student looks at a subgoal row (e.g., "Elements" under Components), **Then** they see a row label and a horizontal sequence of step icons — one per sub-subgoal.
3. **Given** step icons in a subgoal row, **When** a student hovers over a step icon, **Then** they see a tooltip with the step's sub-subgoal name.
4. **Given** a student with mixed progress, **When** they view the grid, **Then** completed steps show as filled squares, in-progress steps show a distinct marker, and not-started steps are outlined/empty.

---

### User Story 3 - Table of Contents Sidebar (Priority: P2)

On the right side of the main page, the student sees a fixed sidebar titled "Web Development Micro-Roles — Components, Containers, and Beyond." This sidebar acts as a table of contents listing each role (Components, Containers, Applications) with its subgoals as bullet items. Each role has its associated icon and color. The sidebar provides a quick overview of the entire curriculum without scrolling.

**Why this priority**: Provides orientation and at-a-glance curriculum navigation, but the main grid (P1) already enables browsing. This enhances but is not strictly required for MVP.

**Independent Test**: Can be tested by verifying the sidebar renders with all roles and subgoals from `structure.json`, matching the Figma design.

**Acceptance Scenarios**:

1. **Given** a logged-in student on the home page, **When** they look at the right side, **Then** they see a sidebar listing all curriculum roles with their subgoals.
2. **Given** the sidebar, **When** a student clicks on a role heading or subgoal, **Then** the main content area scrolls to the corresponding section.
3. **Given** a narrow viewport (mobile), **When** the student views the page, **Then** the sidebar collapses or becomes hidden (accessible via a toggle).

---

### User Story 4 - Role Coach Popup (Priority: P3)

At the bottom-right corner of the screen, there is a floating button labeled with the currently selected role coach (e.g., "Components Coach" with an avatar). Clicking it opens a popup dialog titled "Role Coach." The popup contains a dropdown selector allowing the student to switch between coaches (Components, Containers, Applications). The popup also displays a description of the selected role's subgoals and learning focus.

**Why this priority**: The role coach is an enhancement that helps students understand role context, but the curriculum content is already visible in the main grid and sidebar.

**Independent Test**: Can be tested by clicking the floating button, verifying the popup opens, switching between roles via the dropdown, and confirming the displayed content matches each role.

**Acceptance Scenarios**:

1. **Given** a logged-in student on the home page, **When** they see the bottom-right corner, **Then** they see a floating button showing the current role coach name and emoji.
2. **Given** the floating button, **When** the student clicks it, **Then** a popup opens with a title "Role Coach," a close button, a dropdown to select a role, and a description of the selected role's learning focus.
3. **Given** the role coach popup is open, **When** the student selects a different role from the dropdown, **Then** the description updates to show the selected role's subgoals and focus areas.
4. **Given** the role coach popup is open, **When** the student clicks the close button or clicks outside, **Then** the popup dismisses.

---

### Edge Cases

- What happens when the curriculum data fails to load from Firestore or is empty? Display a user-friendly error message with a retry option.
- What happens when a student has progress data but the curriculum structure has changed (steps added/removed)? The system gracefully handles mismatches — new steps show as "Not Started" and removed steps are ignored in progress calculations.
- How does the system handle a student with no `UserContext` record? Default to 0% progress and display all steps as "Not Started."
- What happens when there are many subgoals with many steps in a row? The step grid wraps to the next line or becomes horizontally scrollable within the subgoal row.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the learning pathway title, subtitle, and description at the top of the home page.
- **FR-002**: System MUST display an overall progress bar with a percentage showing the student's completion across all curriculum steps.
- **FR-003**: System MUST display a "Continue" call-to-action card that links to the student's next uncompleted step, with a project name label and preview thumbnail.
- **FR-004**: System MUST display a legend for progress indicators (Not Started, Similar Step Completed, Complete, In Progress) and step types (Concept Step, Task Step, Review Step).
- **FR-005**: System MUST render the curriculum organized by roles (from Firestore curriculum collection), each with its icon, color, and label.
- **FR-006**: System MUST render subgoals under each role, each showing a label and a horizontal grid of step icons (one per sub-subgoal).
- **FR-007**: Each step icon MUST be visually coded by its progress status (color fill) and step type (icon shape).
- **FR-008**: System MUST display a sidebar table of contents listing all roles and their subgoals.
- **FR-009**: The sidebar MUST support click-to-scroll navigation to the corresponding role/subgoal section.
- **FR-010**: System MUST display a floating "Role Coach" button at the bottom-right of the screen.
- **FR-011**: Clicking the role coach button MUST open a popup with a role selector dropdown and role description content.
- **FR-012**: The role coach popup MUST allow switching between roles (Components, Containers, Applications) and update the displayed content accordingly.
- **FR-013**: Step icons MUST show a tooltip on hover revealing the step's name.
- **FR-014**: The page MUST be responsive, functioning on viewports from 320px to 1920px.

### Key Entities

- **CurriculumRole**: Represents a top-level learning role (e.g., Components, Containers, Applications). Has a name, icon, color, and a collection of subgoals. Stored in Firestore (seeded from `structure.json`).
- **Subgoal**: Represents a group of related learning steps within a role (e.g., "Elements" under Components). Has a name and a collection of sub-subgoal steps.
- **Step (Sub-subgoal)**: Represents a single learning activity (e.g., "Declare Components"). Has a name, type (Concept, Task, Review), and progress status (Not Started, In Progress, Complete, Similar Step Completed).
- **StudentProgress**: Tracks a student's completion status for each step. Linked to the student's `User` record.
- **User**: The authenticated student (existing entity). Has name, email, photo, and access state.
- **UserContext**: The student's background and desired learning value (existing entity).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Students can identify their overall learning progress within 3 seconds of the page loading.
- **SC-002**: Students can locate any specific learning step within 10 seconds by scanning the role → subgoal → step grid hierarchy.
- **SC-003**: The page renders the full curriculum grid for all roles and subgoals within 2 seconds on a 4G connection.
- **SC-004**: 90% of students can correctly identify their next recommended step via the "Continue" card on their first visit.
- **SC-005**: The table of contents sidebar enables navigating to any role section in a single click.
- **SC-006**: The role coach popup successfully displays context for all available roles when switching via the dropdown.

## Assumptions

- The curriculum structure is stored in **Firestore** so it can be updated without redeploying. `structure.json` serves as the initial seed.
- Step progress data is stored per-user and persisted in Firestore.
- **PENDING (see [open-questions.md](open-questions.md) Q1)**: The step type (Concept, Task, Review) is assumed to be stored as metadata per step. Will adjust if derived instead.
- **PENDING (see [open-questions.md](open-questions.md) Q2)**: Step completion is assumed to be tracked via a new `StudentProgress` entity. Will adjust if `UserContext` is extended instead.
- The "Continue" card always points to the first uncompleted step in priority order (Preliminaries → Components → Containers → Applications).
- The role coach content (descriptions, learning focus) is part of the curriculum configuration in Firestore.
