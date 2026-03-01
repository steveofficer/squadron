# Add Tech Stack Layer Collection Prompts to Install Flow

## Status
completed

## Priority
high

## Description
Extend the install flow in `cli.js` `main()` to collect tech stack configuration from the user after the target directory is confirmed and before files are copied.

**Prompt sequence to add (using `@clack/prompts`):**

**Predefined layers** — iterate over: Frontend, Backend, Database, Mobile, Infrastructure. For each:
1. `confirm()`: "Does your project have a **{Layer}** layer?" → if no, skip to next layer.
2. `text()`: "What technology does your **{Layer}** use?" (required, no default).
3. `text()`: "Any key libraries for **{Layer}**? (optional, comma-separated)" (optional, empty string if skipped).

**Custom layers** — after predefined layers, loop:
1. `confirm()`: "Do you want to add a custom layer?" → if no, break loop.
2. `text()`: "Custom layer name?" (required).
3. `text()`: "What technology does your **{name}** use?" (required).
4. `text()`: "Any key libraries for **{name}**? (optional, comma-separated)" (optional).
5. Repeat.

After each prompt call, check `isCancel()` and call `cancel('Installation cancelled.')` + `process.exit(0)` if cancelled.

The function must return an array of layer objects: `[{ name: 'Backend', kebabName: 'backend', technology: '.NET 8', libraries: 'EF Core, MediatR' }, ...]`.

Implement this as an `async function collectTechStack()` that can be called from `main()`. It must not perform any file writes — only user interaction and data collection. The function should return an empty array `[]` if the user skips all layers.

## Acceptance Criteria
- [ ] Given the user confirms "Backend" and enters "Node.js" with no libraries, when `collectTechStack()` returns, then the result array contains exactly one entry with `name: 'Backend'`, `kebabName: 'backend'`, `technology: 'Node.js'`, and `libraries: ''`.
- [ ] Given the user declines all predefined layers and declines the custom layer prompt, when `collectTechStack()` returns, then the result is an empty array `[]`.
- [ ] Given the user adds a custom layer named "My Custom Layer" with technology "Kafka", when `collectTechStack()` returns, then the entry has `kebabName: 'my-custom-layer'`.
- [ ] Given the user cancels at any prompt (isCancel returns true), when checked, then `cancel()` is called and `process.exit(0)` is invoked immediately.
- [ ] Given the user confirms multiple predefined layers, when `collectTechStack()` returns, then all confirmed layers appear in the result array in the order they were collected.

## Dependencies
None

## Implementation Notes
<!-- Populated by the implementing agent -->

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->

Added `async function collectTechStack()` to `cli.js`. Iterates over predefined layers (Frontend, Backend, Database, Mobile, Infrastructure), prompts for each, then loops for custom layers. Returns array of `{ name, kebabName, technology, libraries }` objects. All prompts check `isCancel()`.
