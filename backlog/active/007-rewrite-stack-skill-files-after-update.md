# Rewrite Stack Skill Files After Update

## Status
pending

## Priority
medium

## Description
Complete the `update()` function in `cli.js` by persisting the changes returned by the update menu flow (task 006) using the skill file utilities (task 001).

**After the update menu returns `{ layers, removed }`:**

1. Use a spinner: `s.start('Updating tech stack configuration...')`.
2. For each `kebabName` in `removed`, delete the file `{targetDir}/.github/skills/{kebabName}-stack/SKILL.md` using `fs.rmSync()`. Also attempt to remove the now-empty directory `{targetDir}/.github/skills/{kebabName}-stack/` using `fs.rmdirSync()` (ignore errors if the directory has unexpected content).
3. For each layer in `layers`, call `writeLayerSkillFile()` to write (create or overwrite) the layer skill file.
4. If `layers.length > 0`, call `writeProjectStacksIndex()` to regenerate the master index with all current layers.
5. If `layers.length === 0`, delete `{targetDir}/.github/skills/project-stacks/SKILL.md` and remove the `project-stacks/` directory (ignore errors).
6. Stop the spinner: `s.stop('Tech stack updated!')`.
7. Log `log.success()` for each written layer and `log.warn()` for each removed layer. If no layers remain, `log.info()` the hint: `"No tech stack configured. Run \`squadron update\` to add it later."`.
8. Call `outro(pc.bold(pc.green('✈  Tech stack updated!')))`.

## Acceptance Criteria
- [ ] Given the user edits the technology for an existing layer, when `update()` completes, then the corresponding `{kebabName}-stack/SKILL.md` on disk contains the new technology value.
- [ ] Given the user removes a layer named "Frontend" (kebabName: `frontend`), when `update()` completes, then `{targetDir}/.github/skills/frontend-stack/SKILL.md` no longer exists and `project-stacks/SKILL.md` no longer references the frontend-stack path.
- [ ] Given the user adds a new "Mobile" layer during update, when `update()` completes, then `{targetDir}/.github/skills/mobile-stack/SKILL.md` exists and `project-stacks/SKILL.md` lists all layers including mobile.
- [ ] Given the user removes all existing layers, when `update()` completes, then `project-stacks/SKILL.md` no longer exists and a hint to run `squadron update` is logged.
- [ ] Given `project-stacks/SKILL.md` does not exist yet (first-time adding via update), when `update()` completes after adding layers, then `project-stacks/SKILL.md` is created correctly.

## Dependencies
001, 005, 006

## Implementation Notes
<!-- Populated by the implementing agent -->

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->
