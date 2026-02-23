# Coding Standards

This is currently partially aspirational as we do not have our CI and prettier setup to enforce these yet. But in general, we'd like to follow the Angular coding standards described below.

## Code Style

The **[Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)** serves as the foundation for Causeway's coding style, with additional guidelines specific to TypeScript. The team uses `prettier` to automatically format code, and automatic formatting is enforced by CI.

## Code Practices

### Write Useful Comments

Comments that explain what a block of code does are helpful; they can provide clarity faster than following through the code itself. 

However, comments that explain **why** a block of code exists, or why it does something a certain way, are invaluable. The "why" is often difficult, or sometimes impossible, to discern without consulting the original author. When collaborators are in different locations, this can significantly impact productivity.

For example, this is a not-very-useful comment:
```typescript
// Set default tabindex.
if (!attributes['tabindex']) {
  element.setAttribute('tabindex', '-1');
}
```

While this is much more useful:
```typescript
// Unless the user specifies otherwise, the calendar should not be a tab stop.
// This prevents ngAria from overzealously adding a tabindex to anything with an ng-model.
if (!attributes['tabindex']) {
  element.setAttribute('tabindex', '-1');
}
```

In TypeScript code, use JsDoc-style comments for descriptions (on classes, members, etc.) and `//` style comments for everything else (explanations, background info, etc.).

### API Design

#### Boolean Arguments

Generally avoid adding boolean arguments to a method in cases where that argument means "do something extra." In these cases, prefer breaking the behavior up into different functions.

```typescript
// AVOID
function getTargetElement(createIfNotFound = false) {
  // ...
}
```

```typescript
// PREFER
function getExistingTargetElement() {
  // ...
}

function createTargetElement() {
  // ...
}
```

This guideline can be relaxed for performance reasons in core framework code.

#### Optional Arguments

Use optional function arguments only when they make sense for the API or are required for performance. Do not use optional arguments merely for implementation convenience.

### TypeScript

#### Typing

Avoid using `any` wherever possible. If you find yourself using `any`, consider whether a generic or `unknown` type might be more appropriate.

#### Getters and Setters

Getters and setters can introduce openings for side effects, add complexity for code readers, and generate additional code when targeting older browsers.

* Only use getters and setters for `@Input` properties or when otherwise required for API compatibility.
* Avoid long or complex getters and setters. If the logic of an accessor would take more than three lines, introduce a new method to contain the logic.
* A getter should immediately precede its corresponding setter.
* Decorators such as `@Input` should be applied to the getter and not the setter.
* Always use a `readonly` property instead of a getter (with no setter) when possible.

  ```typescript
  /** YES */
  readonly active: boolean;

  /** NO */
  get active(): boolean {
    // Using a getter solely to make the property read-only.
    return this._active;
  }
  ```

#### Iteration

Prefer using `for` or `for of` over `Array.prototype.forEach`. The `forEach` API can make debugging harder and may increase overhead due to unnecessary function invocations (though modern browsers typically optimize this well).

#### JsDoc Comments

All public APIs must have user-facing comments. These are extracted for API documentation and shown in IDEs.

Private and internal APIs should have JsDoc when they are not obvious. Ultimately, it is up to the code reviewer to determine what is "obvious," but the rule of thumb is that *most* classes, properties, and methods should have a JsDoc description.

Properties should have a concise description of what the property means:
```typescript
/** The label position relative to the checkbox. Defaults to 'after'. */
@Input() labelPosition: 'before' | 'after' = 'after';
```

Method blocks should describe what the function does and provide a description for each parameter and the return value:
```typescript
/**
 * Opens a modal dialog containing the given component.
 * @param component Type of the component to load into the dialog.
 * @param config Dialog configuration options.
 * @returns Reference to the newly-opened dialog.
 */
open<T>(component: ComponentType<T>, config?: MatDialogConfig): MatDialogRef<T> { ... }
```

Boolean properties and return values should use "Whether..." as opposed to "True if...":
```typescript
/** Whether the button is disabled. */
disabled: boolean = false;
```

#### Try-Catch

Only use `try-catch` blocks when dealing with genuinely unexpected errors. Don't use `try` to avoid checking for expected error conditions, such as null dereference or out-of-bound array access.

Each `try-catch` block **must** include a comment explaining the specific error being caught and why it cannot be prevented.

#### Variable Declarations

Prefer `const` wherever possible, using `let` only when a value must change. Avoid using `var` unless absolutely necessary.

#### `readonly`

Use `readonly` members whenever possible to prevent unintended mutations.

### Naming Conventions

#### General

* Prefer writing out words instead of using abbreviations.
* Prefer *exact* names over short names (within reason). For example, `labelPosition` is better than `align` because the former more precisely communicates what the property represents.
* Use `is` and `has` prefixes for boolean properties/methods, except for `@Input()` properties.
* Name identifiers based on their responsibility. Names should reflect what the code *does*, not how it is used:

  ```typescript
  /** NO: */
  class DefaultRouteReuseStrategy { }
  
  /** YES: */
  class NonStoringRouteReuseStrategy { }
  ```

#### Observables

Do not suffix observables with `$`.

#### Classes

* Use PascalCase (UpperCamelCase) for class names.
* Avoid suffixing class names with `Impl`.

#### Interfaces

* Do not prefix interfaces with `I`.
* Avoid suffixing interfaces with `Interface`.

#### Functions and Methods

Use camelCase (lowerCamelCase) for function and method names.

The name of a function should capture the action performed *by* that method rather than describing when the method will be called. For example:

```typescript
/** AVOID: does not describe what the function does. */
handleClick() {
  // ...
}

/** PREFER: describes the action performed by the function. */
activateRipple() {
  // ...
}
```

#### Constants and Injection Tokens

Use UPPER_SNAKE_CASE for constants and injection tokens.

#### Test Classes and Examples

Provide test classes and examples with meaningful, descriptive names:

```typescript
/** PREFER: describes the scenario under test. */
class FormGroupWithCheckboxAndRadios { /* ... */ }
class InputWithNgModel { /* ... */ }

/** AVOID: does not fully describe the scenario under test. */
class Comp { /* ... */ }
class InputComp { /* ... */ }
```

### RxJS

When importing the `of` function to create an `Observable` from a value, alias the imported function as `observableOf`:

```typescript
import {of as observableOf} from 'rxjs';
```

### Testing

#### Test Names

Use descriptive names for Jasmine tests. Ideally, test names should read as a sentence, often in the form "it should...".

```typescript
/** PREFER: describes the scenario under test. */
describe('Router', () => {
  describe('with the default route reuse strategy', () => {
    it('should not reuse routes upon location change', () => {
      // ...
    });
  });
});

/** AVOID: does not fully describe the scenario under test. */
describe('Router', () => {
  describe('default strategy', () => {
    it('should work', () => {
      // ...
    });
  });
});
```
