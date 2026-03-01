# Add `squadron update` Subcommand Scaffolding

## Status
completed

## Priority
high

## Description
Add CLI argument parsing to `cli.js` so that `npx squadron update` dispatches to a new `update()` function, while `npx squadron` (with no arguments) continues to dispatch to `main()` (the install flow).

**Changes required:**

1. At the bottom of `cli.js`, replace the direct `main()` call with a dispatcher:
   ```js
   const subcommand = process.argv[2];
   if (subcommand === 'update') {
     update().catch((err) => { console.error(pc.red('Error:'), err.message); process.exit(1); });
   } else {
     main().catch((err) => { console.error(pc.red('Error:'), err.message); process.exit(1); });
   }
   ```

2. Add a stub `async function update()` that:
   - Calls `intro(pc.bgCyan(pc.black(' squadron update ')))`.
   - Runs the target directory detection (reuse `detectTargetDir()` and the same `text()` prompt logic already in `main()` to resolve `targetDir`). Extract this shared logic into a helper `async function resolveTargetDir()` that both `main()` and `update()` call so there is no duplication.
   - Calls `outro()` with a placeholder message for now (full implementation in task 006).

The install flow (`main()`) must not change in behaviour — it must continue to work identically after the refactor.

## Acceptance Criteria
- [ ] Given `node cli.js` is run with no arguments, when executed, then the install flow runs as before (calls `main()`).
- [ ] Given `node cli.js update` is run, when executed, then `intro` is called with label `' squadron update '` and the command does not error.
- [ ] Given `node cli.js update` is run in a git repo directory, when executed, then `resolveTargetDir()` detects and resolves the target dir using the same logic as the install flow.
- [ ] Given `resolveTargetDir()` is extracted, when called from `main()`, then install behaviour is identical to before (no regression).

## Dependencies
None

## Implementation Notes
<!-- Populated by the implementing agent -->

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->

Extracted `async function resolveTargetDir()` from `main()`. Added `async function update()` stub. Replaced `main()` call at bottom with dispatcher checking `process.argv[2]`.
