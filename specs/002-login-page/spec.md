# Feature Specification: Login Page

**Feature Branch**: `002-login-page`  
**Created**: 2026-03-02  
**Status**: Draft  
**Input**: User description: "Create a polished login page for new and returning logged-out users, matching the reference design with email input, 'Continue as Guest' option, and branded 'Learn step-by-step' header"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Email Login / Sign-Up (Priority: P1)

A new or returning logged-out user navigates to the site and sees a clean login page. The page displays the "Learn step-by-step" heading with subtitle "Login or create your Causeway account." Below is an email input field (required) and a "Continue" button. When the user enters their email and clicks Continue, the system checks if the email is associated with an existing account. If yes, the user is prompted for their password (or sent a magic link). If no, a new account creation flow begins. After successful authentication, the user is routed through the existing auth guard flow (consent → early-access → home).

**Why this priority**: This is the primary entry point for all users — without it, no one can access the application. The current login page is a bare-bones Google OAuth button that doesn't match the design.

**Independent Test**: Can be fully tested by navigating to `/login` as a logged-out user and verifying the page renders with the correct layout, email input, and Continue button.

**Acceptance Scenarios**:

1. **Given** a logged-out user, **When** they navigate to `/login` or `/`, **Then** they see a centered login card with the "Learn step-by-step" heading, subtitle, email input field, "Continue as Guest" link, and a disabled "Continue" button.
2. **Given** the login page, **When** the user enters a valid email, **Then** the "Continue" button becomes enabled.
3. **Given** a valid email entered, **When** the user clicks "Continue", **Then** the system initiates Firebase email authentication (passwordless sign-in via email link).
4. **Given** a new user who completes authentication, **When** they are redirected back, **Then** they proceed through the existing consent → early-access → home flow via the auth guard.
5. **Given** a returning user who completes authentication, **When** they are redirected back, **Then** they are routed to `/home` (bypassing consent/early-access if already completed).

---

### User Story 2 - Continue as Guest (Priority: P1)

Below the email input, there is a "Continue as Guest" link. Clicking it allows the user to browse the application in a limited or read-only capacity without creating an account. This uses Firebase anonymous authentication so the user still has a session but is not fully registered.

**Why this priority**: The reference design prominently features this option, and it reduces friction for users who want to explore before committing.

**Independent Test**: Can be tested by clicking the "Continue as Guest" link and verifying the user is signed in anonymously and routed appropriately.

**Acceptance Scenarios**:

1. **Given** the login page, **When** the user clicks "Continue as Guest", **Then** the system creates a Firebase anonymous session and routes the user into the application.
2. **Given** a guest user browsing the app, **When** they decide to sign up, **Then** they can link their anonymous account to a full email account (account upgrade).

---

### User Story 3 - Landing Page with GET STARTED CTA (Priority: P2)

The landing page (`/landing` or `/`) displays the Causeway brand with the tagline "Learn web development in Angular by building a project step-by-step" and a prominent red "GET STARTED" button. The page also features decorative hexagon shapes as shown in the reference design. Clicking "GET STARTED" navigates to the `/login` page.

**Why this priority**: The landing page is the first impression for new visitors. It needs to be visually compelling before they encounter the login form.

**Independent Test**: Can be tested by navigating to `/` as a logged-out user and verifying the landing page renders with the brand, tagline, hexagon decorations, and GET STARTED button that navigates to `/login`.

**Acceptance Scenarios**:

1. **Given** a logged-out user, **When** they navigate to `/`, **Then** they see the Causeway landing page with the brand name in purple, tagline, and a red "GET STARTED" button.
2. **Given** the landing page, **When** the user clicks "GET STARTED", **Then** they are navigated to `/login`.
3. **Given** a logged-in user, **When** they navigate to `/`, **Then** they are redirected to `/home` (unchanged from current auth guard behavior).
4. **Given** the landing page, **When** viewed on different viewports, **Then** the layout and hexagon decorations adjust responsively.

---

### Edge Cases

- What happens when the email input is invalid (missing @, no domain)? The "Continue" button remains disabled and inline validation is shown.
- What happens when Firebase email authentication fails (network error, rate limit)? A user-friendly error message is displayed with a retry option.
- What happens when a guest user's anonymous session expires? They are redirected back to the login page.
- What happens when a user tries to access a protected route while logged out? The auth guard redirects them to `/landing` (existing behavior, no change needed).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a login page at `/login` with the "Learn step-by-step" heading, "Login or create your Causeway account" subtitle, email input field, "Continue as Guest" link, and "Continue" button.
- **FR-002**: The "Continue" button MUST be disabled when the email field is empty and enabled when a valid email is entered.
- **FR-003**: The "Continue" button MUST initiate Firebase email link (passwordless) authentication when clicked.
- **FR-004**: The "Continue as Guest" link MUST create a Firebase anonymous session and route the user into the app.
- **FR-005**: The landing page at `/` MUST display the Causeway brand, tagline, decorative hexagon shapes, and a "GET STARTED" button that navigates to `/login`.
- **FR-006**: The login page and landing page MUST be responsive, functioning on viewports from 320px to 1920px.
- **FR-007**: After successful authentication (email or guest), the user MUST be routed through the existing auth guard flow.
- **FR-008**: The login page MUST match the reference design aesthetic (centered card, clean typography, minimal layout).

### Key Entities

- **User**: The authenticated user (existing entity). No changes needed.
- **AuthStore**: The authentication state management store (existing). Needs new methods for email link auth and anonymous auth.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: The login page loads and renders completely within 2 seconds on a 4G connection.
- **SC-002**: Users can complete the email authentication flow (enter email → receive link → authenticate) within 60 seconds.
- **SC-003**: The "Continue as Guest" flow completes within 3 seconds (anonymous auth + routing).
- **SC-004**: The landing page with GET STARTED button matches the reference design with hexagon decorations and brand styling.
- **SC-005**: The login page passes WCAG 2.1 AA accessibility requirements (proper labels, keyboard navigation, contrast).

## Assumptions

- Firebase email link (passwordless) authentication is the primary login method, replacing Google OAuth popup.
- Firebase anonymous authentication is available and configured in the Firebase project.
- The existing auth guard logic (consent → early-access → home) does not need modification for email-authenticated users.
- The hexagon decorations on the landing page are CSS-only or SVG, not loaded from external images.
- The "Continue as Guest" flow creates a minimal user record in Firestore with `accessState: CONSENT`.
