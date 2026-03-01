# Add Stack Skill File Generation Utilities

## Status
completed

## Priority
high

## Description
Add two utility functions to `cli.js` that generate and write tech stack skill files into a target project's `.github/skills/` directory.

**Functions to add:**

1. `writeLayerSkillFile(targetDir, layerName, technology, libraries)` — creates `{targetDir}/.github/skills/{kebabLayerName}-stack/SKILL.md` with the layer skill content.
   - `layerName` is the human-readable name (e.g. "Backend", "My Custom Layer").
   - `kebabLayerName` is derived by converting to lowercase and replacing spaces with hyphens (e.g. "My Custom Layer" → `my-custom-layer`).
   - The file must use the `skill` fenced code block format with YAML frontmatter, matching the format used by existing skills in `skills/commit-to-git/SKILL.md`:
     ```
     ````skill
     ---
     name: backend-stack
     description: Technology stack for the Backend layer of this project.
     ---

     # Backend Stack

     ## Technology
     .NET 8

     ## Key Libraries
     Entity Framework Core, MediatR, FluentValidation
     ````
     ```
   - If `libraries` is empty/blank, omit the `## Key Libraries` section.

2. `writeProjectStacksIndex(targetDir, layers)` — creates `{targetDir}/.github/skills/project-stacks/SKILL.md` as the master index.
   - `layers` is an array of `{ name, kebabName }` objects.
   - The file must use the `skill` fenced code block format with YAML frontmatter.
   - The body lists each layer with a link to its skill file:
     ```
     ````skill
     ---
     name: project-stacks
     description: Index of technology stack skills for this project. Load this first to discover tech context, then load each listed skill.
     ---

     # Project Technology Stacks

     Load all of the following skill files before implementing, testing, or reviewing code:

     - Backend: `.github/skills/backend-stack/SKILL.md`
     - Frontend: `.github/skills/frontend-stack/SKILL.md`
     ````
     ```

Both functions must use `fs.mkdirSync(..., { recursive: true })` to create directories and `fs.writeFileSync()` to write the file content. These are pure synchronous functions — no prompts, no logging.

## Acceptance Criteria
- [ ] Given a `targetDir`, `layerName` of "Backend", `technology` of ".NET 8", and `libraries` of "EF Core, MediatR", when `writeLayerSkillFile()` is called, then `{targetDir}/.github/skills/backend-stack/SKILL.md` is created containing a `skill` fenced block with correct frontmatter `name: backend-stack`, a `## Technology` section with ".NET 8", and a `## Key Libraries` section with "EF Core, MediatR".
- [ ] Given a `layerName` of "My Custom Layer", when `writeLayerSkillFile()` is called, then the file is written to `{targetDir}/.github/skills/my-custom-layer-stack/SKILL.md` and the frontmatter `name` is `my-custom-layer-stack`.
- [ ] Given `libraries` is an empty string or blank, when `writeLayerSkillFile()` is called, then the generated file does not contain a `## Key Libraries` section.
- [ ] Given a `layers` array with two entries (Backend and Frontend), when `writeProjectStacksIndex()` is called, then `{targetDir}/.github/skills/project-stacks/SKILL.md` is created containing a `skill` fenced block listing both skill file paths.
- [ ] Given the target `.github/skills/{layer}-stack/` directory does not yet exist, when either function is called, then the directory is created automatically without error.

## Dependencies
None

## Implementation Notes
<!-- Populated by the implementing agent -->

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->

Added `writeLayerSkillFile(targetDir, layerName, technology, libraries)` and `writeProjectStacksIndex(targetDir, layers)` to `cli.js`. Both functions use `fs.mkdirSync` with `recursive: true` and `fs.writeFileSync`. Layer skill files use the ````skill fenced block format with YAML frontmatter, including optional Key Libraries section.
