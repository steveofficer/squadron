# Wire Tech Stack Collection into Install and Generate Skill Files

## Status
pending

## Priority
high

## Description
Wire the `collectTechStack()` function (task 002) into `main()` in `cli.js` and use the utilities from task 001 to write the generated skill files into the target project.

**Changes to `main()` after the target directory is confirmed and before the overwrite check / file copy:**

1. Call `const layers = await collectTechStack()`.
2. If `layers.length > 0`, after the agent/skill files are copied, call `writeLayerSkillFile()` for each layer and `writeProjectStacksIndex()` for the full set of layers. Do this inside the existing spinner block (start/stop) or a separate spinner — use `s.start('Configuring tech stack...')`.
3. If `layers.length === 0`, after install completes log a hint using `log.info()`: `"No tech stack configured. Run \`squadron update\` to add it later."`. Do not write any stack skill files.

After writing stack skill files, log success feedback using `log.success()` showing the number of layers configured, e.g. `"3 tech stack layers configured"`.

The existing install behaviour (agent + skill file copying, success messages, outro) must remain completely unchanged when the user skips all tech stack prompts.

## Acceptance Criteria
- [ ] Given the user configures 2 layers during install, when install completes, then `{targetDir}/.github/skills/project-stacks/SKILL.md` exists and each `{kebabName}-stack/SKILL.md` file exists in `{targetDir}/.github/skills/`.
- [ ] Given the user skips all tech stack prompts (empty layers), when install completes, then no `project-stacks/` or `*-stack/` directories are created in `{targetDir}/.github/skills/`, and a hint message mentioning `squadron update` is logged.
- [ ] Given the user skips all tech stack prompts, when install completes, then all agent and skill files are still copied successfully (existing install behaviour unchanged).
- [ ] Given 3 layers are configured, when install completes, then a log.success message reports "3 tech stack layers configured" (or equivalent wording showing the count).

## Dependencies
001, 002

## Implementation Notes
<!-- Populated by the implementing agent -->

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->
