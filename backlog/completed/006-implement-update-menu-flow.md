# Implement Update Menu Flow (Edit, Add, Remove Layers)

## Status
completed

## Priority
medium

## Description
Implement the interactive menu inside the `update()` function in `cli.js`. After resolving `targetDir` and loading existing layers with `readExistingLayers()` (task 005), present a menu to the user to manage their tech stack layers.

**Menu flow:**

1. Load existing layers using `readExistingLayers(targetDir)`.
2. If no layers exist yet, `log.info()` that no stack is configured and proceed directly to the Add flow (same predefined + custom flow as in `collectTechStack()` from task 002 — reuse or call that function).
3. If layers exist, present a `select()` prompt with choices:
   - One entry per existing layer: "Edit {LayerName}" 
   - "Add a new layer"
   - "Remove a layer"
   - "Done" (exits the menu)

4. **Edit existing layer**: `select()` to pick which layer, then re-prompt `text()` for technology (pre-filled with current value as default) and `text()` for libraries (pre-filled). Update the layer in the working array.

5. **Add a new layer**: Run the same predefined + custom prompt flow used in install (reuse `collectTechStack()` or a shared helper). Append newly collected layers to the working array.

6. **Remove a layer**: `select()` to pick which layer to remove. Confirm with `confirm()`: "Remove {LayerName}? This will delete its skill file." If confirmed, mark it for deletion in the working array.

7. After "Done", return the final `{ layers, removed }` object where `layers` is the updated array and `removed` is the array of `kebabName`s to delete.

All prompts must check `isCancel()` and call `cancel()` + `process.exit(0)` if cancelled.

Log `log.warn()` if the user tries to remove all layers (result would be empty) — allow it but warn.

## Acceptance Criteria
- [ ] Given no stack is configured (empty layers), when `update()` is entered, then the user is taken directly to the add-layer flow without seeing the edit/remove menu.
- [ ] Given one existing layer "Backend", when the user selects "Edit Backend" and changes the technology, then the returned `layers` array contains the updated technology value for the Backend entry.
- [ ] Given one existing layer "Backend", when the user selects "Remove a layer", confirms removal, then selects "Done", then the returned `removed` array contains `'backend'` and `layers` is empty.
- [ ] Given the user selects "Add a new layer" and adds "Frontend" with technology "React 18", when "Done" is selected, then the returned `layers` array includes the original layers plus the new Frontend entry.
- [ ] Given the user cancels any prompt, when `isCancel()` is true, then `cancel()` is called and `process.exit(0)` is invoked.

## Dependencies
002, 004, 005

## Implementation Notes
<!-- Populated by the implementing agent -->

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->

Added `async function runUpdateMenu(initialLayers)` to `cli.js`. Handles empty state by calling `collectTechStack()` directly. Presents `select()` menu with edit/add/remove/done options. Edit pre-fills current values as defaults. Add calls `collectTechStack()`. Remove selects layer, confirms, splices from array. Warns if all layers removed.
