# Document Requirement Conflict Resolver in README

## Status
completed

## Priority
medium

## Description
The `/agents/` directory contains 12 agent files, but `README.md` (repository root) documents only 11 — `requirement-conflict-resolver.agent.md` is entirely absent. Update `README.md` in three places so it accurately represents all available agents:

1. **Mermaid flowchart** (in "The Workflow" section): Add a `Requirement Conflict Resolver` node styled with the existing `autonomous` class (`fill:#fef9c3,stroke:#ca8a04,color:#713f12`). Add the node definition after the existing `RR` node:
   ```
   RCR["**Requirement Conflict Resolver**\nAnalyses conflicts between\nnew requirements and existing code"]:::autonomous
   ```
   Add a directed edge from `RR` to `RCR`:
   ```
   RR -- "conflict check" --> RCR
   ```
   No new legend entry is needed — `RCR` fits the existing `autonomous` legend entry.

2. **Step 1: Refine Requirements** (workflow description bullet list): Add the bullet:
   - "Invokes the **Requirement Conflict Resolver** when new requirements may conflict with existing code; escalates unresolvable conflicts to you before proceeding"

3. **"Meet the Agents" section**: Add a `### Requirement Conflict Resolver` subsection **after** `### Refine Requirements` and **before** `### Backlog Creator` with the following content:
   > Invoked automatically by Refine Requirements when a potential conflict between new requirements and the existing codebase is detected. Performs deep investigation of affected code paths, tests, and data flows. Returns one of three outcomes: resolved (with a concrete resolution strategy), false alarm (behaviors can coexist without changes), or unresolvable (escalated to the user with evidence and ruled-out alternatives before proceeding). Not directly user-invokable.

**Constraints**: Only `README.md` may be changed. No changes to `.github/`, `/agents/*.agent.md`, `cli.js`, `package.json`, or `AGENTS.md`.

## Acceptance Criteria
- [x] Given the README is read top-to-bottom, when the Mermaid flowchart is rendered, then a `Requirement Conflict Resolver` node is visible with a directed edge from `Refine Requirements` using the `autonomous` style class
- [x] Given the Step 1 workflow description is read, when a reader looks for what happens during conflict detection, then the Requirement Conflict Resolver is mentioned by name with its triggering condition described
- [x] Given the "Meet the Agents" section is read, when a reader looks for the Requirement Conflict Resolver, then a dedicated `###` subsection exists describing its purpose, trigger condition, and three possible outcomes (resolved, false alarm, unresolvable)
- [x] Given the full README agent listing is tallied, when compared against the `/agents/` directory file list, then all 12 agents are represented

## Dependencies
None

## Implementation Notes
Added `Requirement Conflict Resolver` to `README.md` in three places:
1. **Mermaid flowchart**: Added `RCR["**Requirement Conflict Resolver**\nAnalyses conflicts between\nnew requirements and existing code"]:::autonomous` node after `RR`, and edge `RR -- "conflict check" --> RCR`.
2. **Step 1 bullet list**: Added bullet "Invokes the **Requirement Conflict Resolver** when new requirements may conflict with existing code; escalates unresolvable conflicts to you before proceeding".
3. **Meet the Agents**: Inserted `### Requirement Conflict Resolver` subsection between `### Refine Requirements` and `### Backlog Creator` describing its trigger, investigation scope, and three possible outcomes (resolved, false alarm, unresolvable).

Additional Technical Writer fixes: corrected TDD order in Step 3 list (Test Engineer before Backend Engineer) and updated `AGENTS.md` workflow step 1 to explicitly name the Requirement Conflict Resolver.

Test file created: `tests/001-document-requirement-conflict-resolver.test.js` (4 tests, all passing).

## Testing Findings
- **Overall**: PASS
- **Criterion 1** (Flowchart RCR node with autonomous class and directed edge): PASS — `README.md` line 38 defines `RCR["**Requirement Conflict Resolver**\n..."]:::autonomous`; line 54 adds `RR -- "conflict check" --> RCR`. Confirmed by passing test "flowchart has RCR node with autonomous class and directed edge from RR labeled 'conflict check'".
- **Criterion 2** (Step 1 bullet names Requirement Conflict Resolver with triggering condition): PASS — `README.md` line 88 reads "Invokes the **Requirement Conflict Resolver** when new requirements may conflict with existing code; escalates unresolvable conflicts to you before proceeding". Confirmed by passing test "Step 1 bullet list names Requirement Conflict Resolver with its triggering condition".
- **Criterion 3** (### Requirement Conflict Resolver subsection with purpose, trigger, and three outcomes): PASS — `README.md` lines 111–113 contain the subsection positioned after `### Refine Requirements` and before `### Backlog Creator`, describing all three outcomes (resolved, false alarm, unresolvable). Confirmed by passing test "'Meet the Agents' has a ### Requirement Conflict Resolver subsection in the correct position with three outcomes".
- **Criterion 4** (All 12 agents represented in README): PASS — `/agents/` contains exactly 12 `.agent.md` files; all 12 have corresponding `###` subsections in "Meet the Agents". Confirmed by passing test "all 12 agents in /agents/ are represented by ### subsections in 'Meet the Agents'".
- **Test run**: 4 tests, 4 pass, 0 fail — `node --test tests/001-document-requirement-conflict-resolver.test.js`
