# Causeway Workflow Plan

This plan outlines the component-based workflow for developing learning modules in Causeway, based on the patterns established in `causeway2`.

## 1. Development Workflow
To add a new learning module (container) or practice task:

1. **Scaffold with Schematics**
   Use the tech4good schematics to generate standard standalone components:
   ```bash
   npx ng generate @tech4good/angular-schematics:component shared/[component-name]
   ```

2. **Presentation vs. Container Pattern**
   - **Display Component**: A "dumb" presentational component (e.g., `GreetingDisplayComponent`).
     - Uses `@Input()` for data.
     - Handles only UI-specific logic (animations, styling).
     - Defined with `ChangeDetectionStrategy.OnPush`.
   - **Container Component**: A "smart" parent component (e.g., `GreetingComponent`).
     - Injects and interacts with the `AuthStore` and `DATABASE_SERVICE`.
     - Orchestrates state logic and provides data to display components via signals.

3. **Data State Management**
   - Use the `AuthStore` to access user information (`this.authStore.user()`).
   - Use `DATABASE_SERVICE` (Firestore wrapper) to persist changes.
   - For complex tasks, use a dedicated feature store (e.g., `TaskStore`).

## 2. Firebase Connectivity
Ensure values are successfully uploaded to the database:

1. **Configuration Sync**
   The `environment.ts` must point to a valid Firebase project with Identity Toolkit and Firestore enabled.
   Current Project: `causeway-test-dev` (Must be configured for Google Auth).

2. **Persistence Logic**
   In your container's event handler:
   ```typescript
   async saveData(newData: string) {
     const user = this.currentUser();
     if (user && newData !== user.field) {
       await this.db.updateEntity('users', user.__id, { field: newData });
     }
   }
   ```

## 3. Maintenance Checklist
* [ ] **Routing**: Add the task views to `app.routes.ts` (`intro`, `figma`, `implementation`).
* [ ] **Store Integration**: Always verify the active user is present before attempting a database write.
* [ ] **Schema Compliance**: Updates to user data should match the `User` model interface.
