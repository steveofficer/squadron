---
name: commit-to-git
description: Conventions for committing code to git including commit message format, branch naming, and commit scope.
---

# Commit Message Format

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

Task: <task-id>
```

## Types

| Type | Use for |
|------|---------|
| `feat` | A new feature or capability |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `test` | Adding or updating tests |
| `refactor` | Code restructuring without behavior change |
| `chore` | Maintenance tasks (dependencies, configs, tooling) |

## Rules

- **Description**: imperative mood, lowercase, no trailing period, max 72 characters
- **Scope**: the module, component, or area affected (e.g., `auth`, `api`, `db`)
- **Body**: explain *what* and *why*, not *how*. Wrap at 72 characters.
- **Task reference**: include the backlog task ID on a `Task:` trailer line

## Examples

```
feat(auth): add JWT token refresh endpoint

Implement automatic token refresh when the access token expires.
Refresh tokens are rotated on each use for security.

Task: 003-add-token-refresh
```

```
fix(api): handle empty request body in user creation

Return 400 with a validation error instead of 500 when the
request body is missing or empty.

Task: 012-fix-user-creation-validation
```

```
test(auth): add tests for token expiry edge cases

Task: 003-add-token-refresh
```

```
docs(readme): add setup instructions for local development

Task: 015-update-readme
```

# Branch Naming

When working on a task from the backlog, create a branch named:

```
<type>/<task-id>
```

Examples:
- `feat/003-add-token-refresh`
- `fix/012-fix-user-creation-validation`
- `docs/015-update-readme`

# Commit Scope

- Commit after each completed task — one task produces one commit (or a small number of logically related commits)
- Each commit must leave the codebase in a working state with all tests passing
- Never commit generated files, secrets, `.env` files, or environment-specific configuration
- Include all related changes (code, tests, documentation) in the same commit when they belong to the same task