---
name: agent-backlog-maintenance
description: Defines the schema, file format, and conventions for creating and maintaining the task backlog used by Squadron agents. Separates active and completed work into distinct directories with independent indexes for minimal context loading.
---

# Backlog Structure

The backlog lives in the `backlog/` directory at the root of the project repository.
Active and completed work are physically separated into distinct subdirectories, each with its own index. This ensures agents only load the context they need.

```
backlog/
  README.md                # Master summary — task counts and links to sub-indexes only
  active/
    README.md              # Index of outstanding tasks (pending, in-progress, blocked)
    001-task-name.md       # Active task files live here
    002-task-name.md
  completed/
    README.md              # Index of completed tasks (historical record)
    003-task-name.md       # Completed task files are moved here from active/
```

# Task File Format

Each task is a single markdown file following this template:

```markdown
# <Task Title>

## Status
<pending|in-progress|completed|blocked>

## Priority
<high|medium|low>

## Milestone
<M<N> — e.g., "M1", or "None" if not part of a milestone>

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
<!-- Populated by the Software Engineer after implementation -->

## Testing Findings
<!-- Populated by the Acceptance Tester after verification -->
```

# Task File Naming

Files are named: `NNN-kebab-case-title.md`

- `NNN` is a zero-padded sequential number assigned at creation time (001, 002, ...). This is a stable identifier, not a guarantee of execution order — actual execution order depends on dependencies and priority.
- The kebab-case title is a short, descriptive slug
- Examples: `001-add-user-model.md`, `002-create-auth-endpoint.md`

# Index Formats

## Master Index (`backlog/README.md`)

The master index provides a summary overview only — it does NOT list individual tasks. This keeps context minimal when an agent needs a quick overview.

```markdown
# Backlog

| Category  | Count |
|-----------|-------|
| Active    | 5     |
| Completed | 3     |
| Total     | 8     |

| Milestones | Count |
|------------|-------|
| Active     | 2     |
| Completed  | 1     |
| Total      | 3     |

- [Active Tasks](active/README.md)
- [Completed Tasks](completed/README.md)
```

## Active Index (`backlog/active/README.md`)

Lists only outstanding tasks (pending, in-progress, blocked). Completed tasks MUST NOT appear here. When all tasks have been completed, retain the table header with no data rows.

```markdown
# Active Tasks

## Milestones

| ID | Title | Description | Tasks |
|----|-------|-------------|-------|
| M1 | <Milestone title> | <Brief description of deliverable business value> | 001, 002 |

## Tasks

| # | Task | Milestone | Priority | Status | Dependencies |
|---|------|-----------|----------|--------|--------------|
| 001 | [Add user model](001-add-user-model.md) | M1 | high | pending | None |
| 002 | [Create auth endpoint](002-create-auth-endpoint.md) | M1 | high | in-progress | 001 |
```

## Completed Index (`backlog/completed/README.md`)

Lists only completed tasks. Serves as a historical record, ordered by task number. Status and Dependencies columns are omitted because all tasks here share the same status (`completed`) and dependencies are no longer actionable.

```markdown
# Completed Tasks

## Completed Milestones

| ID | Title |
|----|-------|
| M1 | User Authentication |

## Tasks

| # | Task | Milestone | Priority |
|---|------|-----------|----------|
| 003 | [Add login page](003-add-login-page.md) | M1 | high |
```

# Task Discovery — Use Tools, Not Full File Reads

Agents MUST use workspace tools to discover and query tasks efficiently. Only read a full task file when you need its complete content for implementation. Prefer tools over bash scripts.

## Find all pending tasks ready to start

Use `grep_search` with pattern `^pending$` and `includePattern` set to `backlog/active/*.md` to locate task files with pending status. Then for each match, check its dependencies are satisfied (see below).

## Check if a dependency is completed

Use `file_search` with query `backlog/completed/NNN-*` (where NNN is the dependency task number, e.g. `backlog/completed/001-*`). If a file is found in `completed/`, the dependency is satisfied. No need to read any file content.

## Find the next task to work on

1. Use `grep_search` with pattern `^pending$` and `includePattern` set to `backlog/active/*.md` to find all pending tasks
2. For each pending task file found, use `grep_search` with pattern `^(None|[0-9, ]+)$` and `includePattern` targeting that specific task file to extract the dependency value. The Dependencies line contains either `None` (no dependencies) or a comma-separated list of zero-padded task IDs (e.g., `001, 002`). Split on `, ` to extract individual IDs.
3. For each dependency ID, use `file_search` with query `backlog/completed/NNN-*` to verify it is completed
4. Among eligible tasks (all dependencies satisfied), select by priority (high → medium → low), then by task number (lowest first)

## Find tasks by priority

Use `grep_search` with pattern `^high$` (or `^medium$`, `^low$`) and `includePattern` set to `backlog/active/*.md`.

## Count tasks

Use `list_dir` on `backlog/active/` and `backlog/completed/` and count `.md` files, excluding `README.md`.

## Find blocked tasks

Use `grep_search` with pattern `^blocked$` and `includePattern` set to `backlog/active/*.md`.

## Search for a task by name or keyword

Use `grep_search` with the keyword and `includePattern` set to `backlog/**/*.md` to search across both active and completed tasks.

## Find tasks in a specific milestone

Use `grep_search` with pattern `^M<N>$` (e.g., `^M1$`) and `includePattern` set to `backlog/active/*.md` to find all active tasks belonging to that milestone.

## Find complete/incomplete milestones

Read `backlog/active/README.md` and check the Milestones table. A milestone is complete when none of its task IDs appear in active task files. Use `file_search` with `backlog/completed/NNN-*` for each task ID to verify.

# Milestones

A **milestone** is a group of sequential tasks that, when completed together, deliver measurable business value and form a reviewable unit of work. Each milestone represents a deliverable chunk — a point where an implementation session ends, a PR is created, and the work can be deployed to production.

## Milestone Design Criteria

- Each milestone must deliver identifiable business value — a user-facing feature, a complete subsystem, or a meaningful improvement
- The combined work in a milestone should be reviewable by a human in approximately 1 hour
- Tasks within a milestone are ordered by dependency; cross-milestone dependencies should be minimized
- Every task belongs to exactly one milestone (or "None" for standalone housekeeping tasks)

## Milestone Lifecycle

```
pending → in-progress → completed
```

- **pending**: All tasks in the milestone are pending or blocked. No work has started.
- **in-progress**: At least one task in the milestone is in-progress or completed, but not all are completed.
- **completed**: All tasks in the milestone are completed. The milestone row moves from the active index to the completed index.

Milestone status is derived from its tasks — agents do not set it directly. When updating task status, check whether the milestone status has changed and update the indexes accordingly.

## Completing a Milestone

When the last task in a milestone is completed:

1. Move the milestone row from the `## Milestones` table in `backlog/active/README.md` to the `## Completed Milestones` table in `backlog/completed/README.md`
2. Update milestone counts in `backlog/README.md` (decrement Active, increment Completed)
3. This is the natural point for creating a pull request and deploying to production

# Status Transitions

Tasks follow this lifecycle:

```
pending → in-progress → completed (file moves to completed/)
                      → blocked (file stays in active/)
```

- **pending**: Task is created and waiting to be picked up. File is in `backlog/active/`.
- **in-progress**: An agent is actively working on this task. File is in `backlog/active/`.
- **completed**: All acceptance criteria have passed verification. File is moved to `backlog/completed/`.
- **blocked**: Implementation failed after maximum retry attempts. File stays in `backlog/active/` and requires human intervention.

A blocked task can be unblocked after human intervention resolves the issue:

```
blocked → pending (human resets the task for a fresh attempt)
```

# Updating Task Status (Non-Completion)

When changing a task's status to `in-progress` or `blocked` (i.e., any transition that does NOT involve moving the file to `completed/`):

1. **Update the task file**: Change the `## Status` line to the new status
2. **Update the active index**: Change the Status column for this task in `backlog/active/README.md`

When blocking a task, also populate the `## Testing Findings` section with the unresolved findings that caused the block.

When unblocking a task (returning it to `pending` after human intervention), update the `## Status` line and the active index Status column accordingly.

# Completing a Task — Procedure

When a task reaches `completed` status, perform these steps in order:

1. **Update the task file**: Set `## Status` to `completed`. Populate `## Implementation Notes` and `## Testing Findings`.
2. **Move the file** from `backlog/active/` to `backlog/completed/` using the terminal: `mv backlog/active/NNN-task-name.md backlog/completed/`
3. **Remove the row** for this task from `backlog/active/README.md`
4. **Add a row** for this task to `backlog/completed/README.md`
5. **Update counts** in `backlog/README.md` (decrement Active, increment Completed)

All five steps MUST be performed together — never leave the backlog in an inconsistent state where a task file is in one directory but listed in the other directory's index.

# Creating the Initial Backlog

When creating a new backlog from a specification:

1. Create `backlog/`, `backlog/active/`, and `backlog/completed/` directories
2. Create all task files in `backlog/active/` with status `pending`, each assigned to a milestone
3. Create `backlog/active/README.md` with the Milestones table and all tasks listed
4. Create `backlog/completed/README.md` with empty tables:

```markdown
# Completed Tasks

## Completed Milestones

| ID | Title |
|----|-------|

## Tasks

| # | Task | Milestone | Priority |
|---|------|-----------|----------|
```

5. Create `backlog/README.md` with the correct task and milestone counts (Active = total tasks, Completed = 0; Active milestones = total milestones, Completed milestones = 0)

# Rules

- Only one agent works on a task at a time
- A task cannot move to `in-progress` until all its dependencies are `completed` (verified by checking for the dependency file in `backlog/completed/`)
- A task cannot move to `completed` until the Acceptance Tester reports all criteria as PASS
- Blocked tasks must include the unresolved findings in the Testing Findings section
- Completed task files MUST be moved to `backlog/completed/` — they must NOT remain in `backlog/active/`
- The active index must only list active tasks; the completed index must only list completed tasks
- The master index must only contain summary counts and links — never individual task rows
- Prefer tool-based discovery (grep_search, file_search, list_dir) over reading entire index files when searching for tasks
- Every task should belong to a milestone unless it is a standalone housekeeping task
- Milestone status is derived from task statuses — never set milestone status independently
- When the last task in a milestone is completed, move the milestone to the completed index and update counts
- Cross-milestone dependencies should be avoided where possible; if unavoidable, the dependent milestone must be sequenced after the dependency milestone
