# Implement Stack Config Reader for Update Command

## Status
completed

## Priority
medium

## Description
Add a utility function to `cli.js` that reads the existing `project-stacks/SKILL.md` from a target project and returns the currently configured stack layers so the `update()` function can display the current state.

**Function to add:** `readExistingLayers(targetDir)`

- Path: `{targetDir}/.github/skills/project-stacks/SKILL.md`
- If the file does not exist, return an empty array `[]` (graceful — no stack configured yet).
- Parse the markdown body to extract layer entries. The format written by `writeProjectStacksIndex()` (task 001) lists layers as:
  ```
  - LayerName: `.github/skills/{kebabName}-stack/SKILL.md`
  ```
  Use a regex or line-by-line parse to extract each `kebabName` from the file path.
- For each discovered `kebabName`, attempt to read `{targetDir}/.github/skills/{kebabName}-stack/SKILL.md`. If the file exists, parse it to extract `technology` and `libraries` (from `## Technology` and `## Key Libraries` sections). If the file is missing (index references a missing layer file), include the layer with `technology: ''` and `libraries: ''` (graceful handling).
- The human-readable `name` can be derived from `kebabName` by capitalising each word and replacing hyphens with spaces (e.g. `my-custom-layer` → `My Custom Layer`).
- Return the same array shape as `collectTechStack()`: `[{ name, kebabName, technology, libraries }]`.

This is a pure synchronous function — no prompts, no logging.

## Acceptance Criteria
- [ ] Given `project-stacks/SKILL.md` does not exist at the target dir, when `readExistingLayers()` is called, then it returns `[]` without throwing.
- [ ] Given a valid `project-stacks/SKILL.md` listing two layers (backend, frontend), and both layer skill files exist with technology and library values, when `readExistingLayers()` is called, then it returns an array of two objects with correct `kebabName`, `technology`, and `libraries` values.
- [ ] Given the index lists a layer but its `{kebabName}-stack/SKILL.md` file is missing, when `readExistingLayers()` is called, then the layer is still included in the result with `technology: ''` and `libraries: ''` rather than throwing an error.
- [ ] Given a layer skill file with no `## Key Libraries` section, when `readExistingLayers()` is called, then `libraries` is returned as `''` for that layer.

## Dependencies
001

## Implementation Notes
<!-- Populated by the implementing agent -->

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->

Added `function readExistingLayers(targetDir)` to `cli.js`. Returns `[]` if index file missing. Parses project-stacks SKILL.md with regex to extract layer names and kebab names. Reads each layer file for technology and libraries values. Handles missing layer files gracefully.
