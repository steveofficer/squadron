# Squadron — Agent Instructions

This file is the shared context for every agent interaction in this repository. Follow these rules without exception. When this file conflicts with an individual agent's instructions, this file takes precedence.

## What This Project Is

Squadron is an npm package (`npx squadron`) that installs a suite of autonomous coding agents and skills into a target project's `.github/` directory. It is designed for GitHub Copilot's Premium Request billing model — agents complete work in single passes with deep upfront context to minimize model invocations.

This repository is both the **source code** for the Squadron package and a **consumer** of its own agents (Squadron is developed using Squadron).

## Principles

These are the foundational rules of this project. They override any conflicting guidance and should rarely change.

1. **Source is truth** — The canonical agent and skill definitions live in `/agents/` and `/skills/`. The copies under `.github/` are installed artifacts.
2. **Humans gate installation** — Only a human decides when to copy source agents into `.github/`. Agents must never modify anything under `.github/agents/` or `.github/skills/`.
3. **One job per agent** — Each agent has a single, well-defined responsibility. Do not combine roles or expand an agent's scope beyond its stated purpose.
4. **Autonomy within scope** — Agents complete their assigned work independently but must not modify code outside the boundaries of their current task.
5. **Quality is non-negotiable** — Every code change must pass review and acceptance testing before being marked complete.
6. **Skills over duplication** — Procedural knowledge (how to commit, manage the backlog, format reviews) lives in skill files. Never duplicate skill content inside agent definitions — reference the skill by name.
7. **Context efficiency** — Sub-agents receive only what they need for their specific job. Do not dump entire project context into delegation prompts.
8. **Extract dynamic rules into skills** — Agent files must not inline scenario-specific or context-dependent workflow details. If a workflow branch applies only in certain situations (e.g., a specific task type or delegation pattern), extract it into a dedicated skill file. The agent references the skill by name and loads it only when that scenario applies. This keeps the agent's base context window small and ensures the model only loads the instructions relevant to the current task.

## Repository Structure

```
squadron/
├── agents/                # SOURCE — canonical agent definitions (modifiable)
├── skills/                # SOURCE — canonical skill definitions (modifiable)
├── .github/
│   ├── agents/            # INSTALLED — do NOT modify (human-managed)
│   └── skills/            # INSTALLED — do NOT modify (human-managed)
├── cli.js                 # CLI installer
├── package.json           # Package manifest
├── README.md              # Project documentation
└── AGENTS.md              # This file — shared agent context
```

### Source vs Installed

The `/agents/` and `/skills/` directories are the **source of truth**. The `cli.js` installer copies them into a target project's `.github/` directory. The `.github/agents/` and `.github/skills/` in *this* repository exist because Squadron was bootstrapped using its own agents. A human updates these installed copies when they decide it is time — agents must never touch them.

## Modification Boundaries

### Agents MAY modify

- `/agents/*.agent.md` — source agent definitions
- `/skills/*/SKILL.md` — source skill definitions
- `cli.js` — the CLI installer
- `package.json` — package metadata and dependencies
- `README.md` — project documentation
- `AGENTS.md` — this file, when project rules need updating
- `backlog/**` — task backlog files (following the `agent-backlog-maintenance` skill)
- New source files required by the project

### Agents MUST NOT modify

- `.github/agents/**` — installed agent copies, managed exclusively by humans
- `.github/skills/**` — installed skill copies, managed exclusively by humans
- `node_modules/` — managed by npm
- `.git/` — managed by git

When in doubt: if a file is under `.github/`, do not modify it.

## Technology & Conventions

- **Runtime**: Node.js >= 18
- **Module system**: ES Modules (`"type": "module"` in package.json)
- **Build step**: None — source files are distributed directly
- **Dependencies**: Minimize additions. Justify any new dependency. Current dependencies: `@clack/prompts`, `picocolors`
- **Code style**: Match existing patterns exactly. Semicolons are used. Prefer `const`; use `let` only when reassignment is needed. Never `var`.
- **Error handling**: Handle errors explicitly. Never swallow exceptions silently.
- **File naming**: kebab-case for all files. Agent files use the pattern `<name>.agent.md`. Skill files are always named `SKILL.md` inside a named directory.

## Agent & Skill Development

When creating or modifying agent definitions in `/agents/`:

- Include YAML frontmatter with: `name`, `description`, `model`, `tools`, `user-invokable`
- Agents that delegate must include an `agents` field listing their delegates
- Define clearly: Role, Workflow (step-by-step), and Quality Standards
- Keep scope narrow — if a workflow grows beyond the agent's core responsibility, split it into multiple agents

When creating or modifying skill definitions in `/skills/`:

- Each skill lives in its own directory under `/skills/`
- The file must be named `SKILL.md` with YAML frontmatter containing `name` and `description`
- Skills define **procedures and formats**, not roles — they are shared knowledge consumed by multiple agents

## Workflow

Squadron follows a structured workflow. Agents must respect this sequence:

1. **Refine Requirements** → clarify ambiguities, produce a refined spec
   - **Requirement Conflict Resolver** → invoked automatically when new requirements may conflict with existing code
2. **Backlog Creator** → decompose the spec into tasks with acceptance criteria, grouped into deliverable milestones
3. **Task Dispatcher** → for each milestone (user may select specific milestones or all):
   - Create a milestone branch
   - For each task in the milestone, orchestrate:
     - **Test Engineer** → write tests first (TDD)
     - **Software Engineer** → implement to pass the tests
     - **Code Reviewer** → multi-perspective review (strict, reasonable, lenient)
     - **Acceptance Tester** → verify acceptance criteria are met
     - **Technical Writer** → update documentation
   - **Commit** each task following the `commit-to-git` skill
   - Complete the milestone → signal PR readiness

### Skill References

Agents must follow these skills for their respective concerns — do not improvise alternatives:

| Concern | Skill | Used by |
|---------|-------|---------|
| Backlog operations | `agent-backlog-maintenance` | Backlog Creator, Task Dispatcher |
| Git commits & branches | `commit-to-git` | Task Dispatcher |
| Code review format | `review-findings` | Strict, Reasonable, and Lenient Reviewers |
| Task type classification | `task-delegation-task-identification` | Task Dispatcher |
| Documentation task workflow | `task-delegation-documentation-workflow` | Task Dispatcher |
| Code review task workflow | `task-delegation-ci-cd-workflow` | Task Dispatcher |
| Test-only task workflow | `task-delegation-test-workflow` | Task Dispatcher |
| Implementation task workflow | `task-delegation-engineering-workflow` | Task Dispatcher |

## Quality Standards

- All code changes must pass existing tests before a task is marked complete
- Every backlog task must have verifiable acceptance criteria
- Every backlog task must belong to a deliverable milestone (or be explicitly standalone)
- Milestones must deliver identifiable business value and be reviewable by a human in approximately 1 hour
- Code review is mandatory for every task — never skip the review step
- Acceptance testing is mandatory — never mark a task complete without verification
- Documentation must be updated when user-facing behavior changes
- The backlog must always be in a consistent state: no orphaned entries, correct counts, correct milestone assignments, files in the right directories
- Each commit must leave the codebase in a working state with all tests passing
- Branches are created per milestone, not per task — all tasks in a milestone share a branch

## Evolving This Document

This file is a living document. Update it when:

- A new convention is established that all agents must follow
- A new agent or skill is added that changes the workflow
- A recurring agent mistake reveals a missing rule
- The project's technology, structure, or patterns change

Keep sections independent so rules can be added or removed without cascading edits. Add new rules as bullets in the relevant section.
