# AGENTS.md

## Editing Rules

- Make **minimal changes only**.
- Do **not modify anything unrelated** to the requested functionality.
- Only change the exact parts of the code necessary to implement the requested feature or fix.

## Comment Handling

- **Ignore all commented-out code** when analyzing the codebase.
- **Do not remove any commented-out code** under any circumstances.

## Code Changes

- When providing or making changes, **add comments explaining the modifications**.
- Keep all existing code structure, formatting, and logic intact unless a change is strictly required.
- **Provide full updated files when a change is needed, whenever possible.**
- If full files cannot be provided, clearly show:
  - **what code is being replaced**
  - **what the replacement code is**

## Clarification Requirement

- If any instruction or requirement is unclear:
  - **Ask questions before making changes**.
  - **Do not make assumptions**.

## General Principle

- Prioritize precision and minimal impact over refactoring or improvements.

## Project Context

- This is a Shopify embedded app with Shopify extensions.
- The settings UI is in `app/routes/app.settings.tsx`.
- The cart/checkout validation Function is in `extensions/zone-phone-gate/src/cart_validations_generate_run.ts`.
- The app uses the Shopify Function for checkout enforcement so it can support non-Plus stores.

## Shopify Rules

- Shopify Functions may run on non-Plus stores only when distributed through eligible public apps; verify plan/app-type constraints before relying on
them.

## Data Rules

- Do not save invalid or unrecognized country entries.

## Verification

- Do not run verification checks automatically after each change.
- Only run tests, typecheck, lint, builds, or other verification commands when explicitly requested.
- Before production or deployment, ask before running the full relevant verification flow.
- If verification is skipped, mention that it was skipped by preference.
