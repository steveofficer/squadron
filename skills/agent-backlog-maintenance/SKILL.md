---
name: agent-backlog-maintenance
description: Defines the schema, file format, and conventions for creating and maintaining the task backlog used by Squadron agents.
---

# Backlog Structure

The backlog lives in the `backlog/` directory at the root of the project repository.

```
backlog/
  README.md            # Index of all tasks with status summary
  001-task-name.md     # Individual task file
  002-task-name.md
  ...
```

# Task File Format

Each task is a single markdown file following this template:

```markdown
# <Task Title>

## Status
<pending|in-progress|completed|blocked>

## Priority
<high|medium|low>

## Description
<Clear, specific description of what needs to be implemented.
Include enough context that the implementing agent does not need
to reference the original specification.>

## Acceptance Criteria
- [ ] Given <context>, when <action>, then <expected result>
- [ ] Given <context>, when <action>, then <expected result>

## Dependencies
<Comma-separated task IDs (e.g., "001, 002"), or "None">

## Implementation Notes
<!-- Populated by the Backend Engineer after implementation -->

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->
```

# Task File Naming

Files are named: `NNN-kebab-case-title.md`

- `NNN` is a zero-padded sequential number indicating execution order (001, 002, ...)
- The kebab-case title is a short, descriptive slug
- Examples: `001-add-user-model.md`, `002-create-auth-endpoint.md`

# Backlog Index (README.md)

The `backlog/README.md` file contains a summary table of all tasks:

```markdown
# Backlog

## Tasks

| # | Task | Priority | Status | Dependencies |
|---|------|----------|--------|--------------|
| 001 | [Add user model](001-add-user-model.md) | high | pending | None |
| 002 | [Create auth endpoint](002-create-auth-endpoint.md) | high | pending | 001 |
```

# Status Transitions

Tasks follow this lifecycle:

```
pending → in-progress → completed
                      → blocked (if retries exhausted)
```

- **pending**: task is created and waiting to be picked up
- **in-progress**: an agent is actively working on this task
- **completed**: all acceptance criteria have passed verification
- **blocked**: implementation failed after maximum retry attempts; requires human intervention

# Rules

- Only one agent works on a task at a time
- A task cannot move to `in-progress` until all its dependencies are `completed`
- A task cannot move to `completed` until the Acceptance Tester reports all criteria as PASS
- Blocked tasks must include the unresolved findings in the Testing Findings section
- The backlog index must be updated whenever a task's status changes