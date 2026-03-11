# Squadron Agent & Skill Review

**Last Updated**: 8 March 2026 (Revision 2)
**Scope**: Full analysis of all agents (12), skills (8), workflow design, source/installed drift, and cross-reference consistency.

---

## Table of Contents

- [1. Inventory Summary](#1-inventory-summary)
- [2. Changes Since Last Review](#2-changes-since-last-review)
- [3. Critical Finding: Source/Installed Drift](#3-critical-finding-sourceinstalled-drift)
- [4. Agent-by-Agent Assessment](#4-agent-by-agent-assessment)
- [5. Skill-by-Skill Assessment](#5-skill-by-skill-assessment)
- [6. Cross-Reference Consistency Audit](#6-cross-reference-consistency-audit)
- [7. Architectural Analysis](#7-architectural-analysis)
- [8. Gap Analysis — What's Missing](#8-gap-analysis--whats-missing)
- [9. Redundancy Analysis — What Could Be Removed](#9-redundancy-analysis--what-could-be-removed)
- [10. Recommendations](#10-recommendations)
- [11. Summary Matrix](#11-summary-matrix)

---

## 1. Inventory Summary

### Agents (12 source files in `agents/`)

| Agent | User-Invokable | Delegates To | Role |
|-------|:-:|---|---|
| Refine Requirements | Yes | Backlog Creator, Requirement Conflict Resolver | Entry point — req analysis |
| Requirement Conflict Resolver | No | — | Conflict analysis |
| Backlog Creator | No | — | Task decomposition |
| Task Dispatcher | Yes | Software Engineer, Test Engineer, Code Reviewer, Acceptance Tester, Technical Writer | Orchestration |
| Test Engineer | No | — | Test authoring |
| Software Engineer | No | — | Implementation |
| Code Reviewer | No | Strict, Reasonable, Lenient Reviewers | Review orchestration |
| Strict Reviewer | No | — | Exhaustive review |
| Reasonable Reviewer | No | — | Pragmatic review |
| Lenient Reviewer | No | — | Show-stopper review |
| Acceptance Tester | No | — | Verification |
| Technical Writer | No | — | Documentation |

### Skills (8)

| Skill | Primary Consumers |
|-------|------------------|
| agent-backlog-maintenance | Backlog Creator, Task Dispatcher |
| commit-to-git | Task Dispatcher |
| review-findings | Strict, Reasonable, Lenient Reviewers |
| task-delegation-task-identification | Task Dispatcher |
| task-delegation-documentation-workflow | Task Dispatcher |
| task-delegation-ci-cd-workflow | Task Dispatcher |
| task-delegation-engineering-workflow | Task Dispatcher |
| task-delegation-test-workflow | Task Dispatcher |

---

## 2. Changes Since Last Review

The first review (Revision 1) was conducted against the pre-rename codebase. Since then, backlog tasks 002–005 completed the **Backend Engineer → Software Engineer rename**:

| What Changed | Details |
|---|---|
| Agent file renamed | `agents/backend-engineer.agent.md` → `agents/software-engineer.agent.md` |
| Frontmatter updated | `name: Software Engineer` |
| Source references updated | All occurrences of "Backend Engineer" in `agents/`, `skills/`, `AGENTS.md`, `README.md` now say "Software Engineer" |

**Previous Revision 1 recommendations resolved:**

| # | Recommendation | Status |
|---|---|---|
| 2 | Rename "Backend Engineer" to "Software Engineer" | ✅ Completed (tasks 002–005) |

**Previous Revision 1 recommendations still open:**

| # | Recommendation | Status |
|---|---|---|
| 1 | Add error recovery guidance to Task Dispatcher | Open |
| 3 | Add task sizing guidance to Backlog Creator | Open |
| 4 | Clarify Test Engineer's dual mode | Open |
| 5 | Add a skill for sub-agent failure handling patterns | Open |
| 6 | Consider cross-session memory | Open (low priority) |
| 7 | Document agent extensibility in README | Open (low priority) |
| 8 | Add integration test guidance to Test Engineer | Open (low priority) |

---

## 3. Critical Finding: Source/Installed Drift

**Severity: HIGH — This is the most important finding in this review.**

The `.github/` installed artifacts (which Squadron uses to develop itself) have drifted significantly from the `/plugins/squadron/agents/` and `/plugins/squadron/skills/` source files. Per AGENTS.md, "A human updates these installed copies when they decide it is time." The current drift is so substantial that the installed agents are effectively running a **different system** from what the source defines.

### 3.1 File-Level Drift

| Component | Source (`plugins/squadron/`) | Installed (`.github/`) | Drift |
|---|---|---|---|
| Implementation agent | `software-engineer.agent.md` | `backend-engineer.agent.md` | **Wrong filename and name** |
| Task Dispatcher `agents:` field | `["Software Engineer", ...]` | `["Backend Engineer", ...]` | **References wrong agent name** |
| Backlog Creator | Has milestone support (§3–§7) | No milestone concept at all | **Major feature gap** |
| Refine Requirements | Delegates with milestone instructions | No milestone mention | Feature gap |
| Task Dispatcher | Milestone-scoped processing, branch-per-milestone | Branch-per-task, no milestone awareness | **Major workflow difference** |
| commit-to-git skill | `<type>/M<N>-<milestone-slug>` | `<type>/<task-id>` | **Different branching model** |
| agent-backlog-maintenance skill | Has Milestone field, milestone tables, milestone counts | No milestone concept | **Major schema gap** |
| task-delegation-engineering-workflow | References "Software Engineer" | References "Backend Engineer" | Name mismatch |
| task-delegation-task-identification | References "Software Engineer" | References "Backend Engineer" | Name mismatch |

### 3.2 Impact

Since Squadron is developed using its **installed** agents (in `.github/`), the following consequences are observable:

1. **Existing backlog files lack milestone support.** The `backlog/README.md` master index has no `Milestones` count table. The `backlog/active/README.md` has no `## Milestones` table. The `backlog/completed/README.md` has no `## Completed Milestones` table. Completed task files have no `## Milestone` field. All of this is because the installed Backlog Creator doesn't know about milestones.

2. **The installed Task Dispatcher references "Backend Engineer"** in its `agents:` frontmatter. In Copilot's agent framework, this means it attempts to delegate to an agent named "Backend Engineer" — and `.github/agents/backend-engineer.agent.md` still exists (unchanged), so delegation currently works. However, the source intent is "Software Engineer", and new installations via `npx squadron` will install the source files (with `software-engineer.agent.md` and no `backend-engineer.agent.md`).

3. **Branch naming is inconsistent.** The source system creates branches per milestone (`feat/M1-user-auth`); the installed system creates branches per task (`feat/003-add-token-refresh`). The existing git history follows the per-task model.

### 3.3 Recommendation

**Re-install the source agents and skills into `.github/`.** Until this is done, the project is developing against an older version of its own agent system. This is the single highest-priority action item from this review.

After re-installation, the existing backlog structure will need a one-time migration to add milestone fields to any remaining active task files and update the index formats.

---

## 4. Agent-by-Agent Assessment

### Refine Requirements — ✅ Well-designed

**Strengths:**
- Thorough 5-phase workflow (Understand → Analyze → Detect Conflicts → Synthesize → Delegate)
- Excellent conflict detection pipeline with escalation to the user
- Includes TDD test scenario generation in the spec — bridges requirements to implementation
- Good use of `askQuestions` tool with batching guidance

**Observations:**
- Phase 3 (conflict detection) is comprehensive — it proactively checks existing code before finalizing. This addresses a common failure mode where new features break existing behavior.
- The agent has a dual role: requirements refinement AND delegation to Backlog Creator. Acceptable because the handoff is a natural terminal step, not a parallel responsibility.

### Requirement Conflict Resolver — ✅ Well-designed

**Strengths:**
- Clear three-outcome model (Resolved / False Alarm / Unresolvable)
- Explicit anti-patterns (no configuration toggles, no hand-waving)
- Read-only — `tools: [read, search]` prevents file modification

**Observations:**
- Appropriately scoped as a non-user-invocable specialist with one clear job.
- The "no feature toggles" rule prevents deferred conflict resolution — good design choice.

### Backlog Creator — ✅ Well-designed, minor issue

**Strengths:**
- Clear task decomposition guidance with acceptance criteria format
- Milestone grouping with sizing guidelines (3–8 tasks per milestone)
- References the `agent-backlog-maintenance` skill for index creation

**Issue — Task template duplicated with minor inconsistencies:**

The Backlog Creator inlines its own task template (§5) which is nearly identical to the template in the `agent-backlog-maintenance` skill, but with small differences:

| Field | Backlog Creator template | agent-backlog-maintenance skill template |
|---|---|---|
| Implementation Notes comment | `<!-- Populated by the implementing agent -->` | `<!-- Populated by the Software Engineer after implementation -->` |
| Dependencies placeholder | `<List task IDs this depends on, or "None">` | `<Comma-separated task IDs (e.g., "001, 002"), or "None">` |
| Description placeholder | `<Clear, specific description of what needs to be implemented>` | Includes: `Include enough context that the implementing agent does not need to reference the original specification.` |
| Status placeholder | `pending` (only value shown) | `<pending\|in-progress\|completed\|blocked>` (all values shown) |

The Backlog Creator's `<!-- Populated by the implementing agent -->` is actually more correct than the skill's `<!-- Populated by the Software Engineer after implementation -->`, because documentation-only tasks are implemented by the Technical Writer, not the Software Engineer.

**Recommendation:** Consolidate the template. The Backlog Creator should reference the `agent-backlog-maintenance` skill's template rather than defining its own. Alternatively, make both templates identical and use the Backlog Creator's more general "implementing agent" wording.

### Task Dispatcher — ✅ Well-designed, minor issue

**Strengths:**
- Intelligent task classification before delegation (Step 2a)
- Four distinct workflow paths based on task type
- 4-iteration limit prevents infinite rework loops
- Branch creation per milestone for clean git history
- Milestone-scoped processing with user milestone selection
- Comprehensive delegation guidelines with context efficiency

**Issue — Task discovery logic duplicated from skill:**

The Task Dispatcher's Step 1 inlines specific `grep_search` and `file_search` patterns for task discovery:
```
1. Use `grep_search` with pattern `^pending$` and `includePattern` set to `backlog/active/*.md`
3. For each task, verify its dependencies are completed by checking for the dependency file in `backlog/completed/` using `file_search`
```

These exact patterns are already defined in the `agent-backlog-maintenance` skill under "Task Discovery" and "Find the next task to work on." Per Principle 6 ("Skills over duplication — Never duplicate skill content inside agent definitions"), the Task Dispatcher should reference the skill instead of inlining the patterns.

**Recommendation:** Replace the inline discovery steps with a reference: "Follow the `agent-backlog-maintenance` skill's 'Find the next task to work on' procedure, filtering to tasks belonging to the current milestone."

### Test Engineer — ✅ Well-designed

**Strengths:**
- Clear workflow: understand → design → write → run → report
- Good testing principles (AAA pattern, deterministic, independent)
- Framework-agnostic — adapts to whatever the project uses

**Observations:**
- The agent is used in both TDD mode (write tests before implementation) and post-implementation mode (write tests after code exists). The prompt handles both implicitly through the input it receives (the engineering workflow says "before any implementation exists"; the test workflow says "existing implementation that needs test coverage"), but doesn't explicitly acknowledge these two modes within its own definition.

### Software Engineer — ✅ Well-designed

**Strengths:**
- Tight scope: one task at a time, no scope creep
- Research → Plan → Implement → Verify cycle
- Explicit constraint: "never modify code outside the scope"
- Self-verification: runs existing tests to check for regressions

**Observations:**
- Now correctly named "Software Engineer" — technology-neutral, matching the prompt's generic implementation guidance.
- No guidance on what to do when a pre-written TDD test appears incorrect — the engineer is told to make tests pass, but sometimes the test itself may be wrong. The current design relies on the Code Reviewer to catch this, which is a reasonable separation of concerns.

### Code Reviewer — ✅ Well-designed, standout feature

**Strengths:**
- Multi-perspective review with confidence classification framework
- Iteration awareness (relaxed criteria on iteration 4) prevents infinite loops
- Strict + Lenient agreement treated as show-stopper — catches issues the Reasonable reviewer might normalize
- Clear deduplication rules for overlapping findings

**Observations:**
- The most sophisticated agent in the system. The tri-reviewer ensemble with confidence classification is the system's signature architectural decision.
- Uses 3 sub-agent calls per review — cost-effective under Premium Request billing where background agents don't consume the user's quota.

### Strict Reviewer — ✅ Well-designed

- Clear mandate: flag everything, well-categorized review areas
- Uses the `review-findings` skill for consistent output format
- Functions as designed — unilateral findings become optional nitpicks in the consolidated review

### Reasonable Reviewer — ✅ Well-designed

- Explicit "what to ignore" section prevents scope creep into nitpicking
- Focus on security is appropriate for the "what matters" reviewer
- "Empty review is a valid review" guidance prevents manufactured findings

### Lenient Reviewer — ✅ Well-designed

- Very tight scope: broken logic, security holes, catastrophic issues only
- Extensive "what to ignore" list keeps signal-to-noise high
- Asymmetric severity: when this reviewer flags something, the Code Reviewer treats it as high-severity

### Acceptance Tester — ✅ Well-designed

- Evidence-driven verification with per-criterion PASS/FAIL
- Has `edit` tools scoped to backlog file updates (not implementation code)
- Runs the full test suite via `execute` tool

### Technical Writer — ✅ Well-designed, minor issue

**Strengths:**
- Emphasis on diagrams over prose (Mermaid support)
- Keep a Changelog format compliance
- Clear document impact analysis workflow

**Issue — CHANGELOG.md referenced but doesn't exist:**

The Technical Writer's workflow (§2) states: `CHANGELOG.md: always — every completed task gets a changelog entry`. However, no `CHANGELOG.md` file exists in the project. The "always" directive creates a confusing instruction — the writer is told to update a file that doesn't exist.

**Evidence:** `file_search` for `CHANGELOG*` returns no results. The completed backlog tasks (001–005) do not include changelog entries, confirming the Technical Writer has been operating without this file.

**Recommendation:** Either (a) create a `CHANGELOG.md` to match the agent's expectation, or (b) change the "always" directive to "if the project has a CHANGELOG.md" so the instruction is conditional.

**Issue — No `execute` tool:**

The Technical Writer has `tools: [read, edit, search]` — no `execute`. Its workflow step 5 says "Verify: Confirm all documentation references are accurate" and "Ensure code examples are syntactically correct." Without `execute`, the writer cannot run any verification commands. This is mitigated by the Acceptance Tester (which has `execute`) handling post-hoc verification, but it means the writer's own verification step is limited to visual inspection.

---

## 5. Skill-by-Skill Assessment

### agent-backlog-maintenance — ✅ Comprehensive, minor issue

- Separation of active/completed into distinct directories is strong for context efficiency
- Tool-based task discovery procedures are detailed and practical
- Clear status lifecycle: pending → in-progress → completed/blocked
- Milestone lifecycle (pending → in-progress → completed) with derived status is well-defined

**Issue:** The Implementation Notes template comment says `<!-- Populated by the Software Engineer after implementation -->`. This is too specific — documentation-only tasks are implemented by the Technical Writer. Should say "implementing agent" (matching the Backlog Creator's template) or list both: "Software Engineer or Technical Writer."

### commit-to-git — ✅ Clean and sufficient

- Conventional Commits is a well-established standard
- Milestone-based branch naming (`<type>/M<N>-<milestone-slug>`) provides traceability
- One commit per task keeps history clean
- "All tasks within a milestone share the same branch" is clearly stated

### review-findings — ✅ Essential for consistency

- Three severity profiles (one per reviewer type) ensure consistent output
- Mandatory `Recommendation: PASS / REWORK NEEDED` line enables machine parsing
- Empty review format prevents reviewers from manufacturing findings

### task-delegation-task-identification — ✅ Well-structured

- Five task types cover the realistic taxonomy of backlog work
- Examples for each type reduce ambiguity
- "Err on the side of including more agents" is good default guidance

### task-delegation-documentation-workflow — ✅ Simple and correct

- Two-step workflow (Technical Writer → Acceptance Tester) is the minimum viable path
- 4-iteration limit consistent with other workflows

### task-delegation-ci-cd-workflow — ✅ Good escalation path

- Handles the case where a review discovers implementation work is needed — escalates to the engineering workflow
- This adaptive behavior is a strength

### task-delegation-engineering-workflow — ✅ Complete TDD cycle

- Full 6-step workflow covers the entire implementation lifecycle
- TDD ordering (tests first) is enforced structurally
- Includes documentation as Step 6 — ensures docs don't get forgotten

### task-delegation-test-workflow — ✅ Appropriate

- Test → Review → Verify is the right pipeline for test-only work
- Code review of test code is important — bad tests are worse than no tests

---

## 6. Cross-Reference Consistency Audit

This section verifies that all names, references, and cross-links between agents, skills, and documentation are internally consistent.

### 6.1 Agent Names — Source Files ✅

All 12 source agent files have consistent `name:` frontmatter:

| File | `name:` |
|---|---|
| `acceptance-tester.agent.md` | Acceptance Tester |
| `backlog-creator.agent.md` | Backlog Creator |
| `code-reviewer.agent.md` | Code Reviewer |
| `lenient-reviewer.agent.md` | Lenient Reviewer |
| `reasonable-reviewer.agent.md` | Reasonable Reviewer |
| `refine-requirements.agent.md` | Refine Requirements |
| `requirement-conflict-resolver.agent.md` | Requirement Conflict Resolver |
| `software-engineer.agent.md` | Software Engineer |
| `strict-reviewer.agent.md` | Strict Reviewer |
| `task-dispatcher.agent.md` | Task Dispatcher |
| `technical-writer.agent.md` | Technical Writer |
| `test-engineer.agent.md` | Test Engineer |

### 6.2 Delegation `agents:` Fields ✅

| Delegator | `agents:` list | All targets exist as source files? |
|---|---|---|
| Refine Requirements | `["Backlog Creator", "Requirement Conflict Resolver"]` | ✅ |
| Task Dispatcher | `["Software Engineer", "Test Engineer", "Code Reviewer", "Acceptance Tester", "Technical Writer"]` | ✅ |
| Code Reviewer | `["Strict Reviewer", "Reasonable Reviewer", "Lenient Reviewer"]` | ✅ |

### 6.3 Model Consistency ✅

All 12 agents use `model: Claude Sonnet 4.6`. No mismatches.

### 6.4 Tool Assignments ✅

| Agent | Tools | Appropriate? |
|---|---|---|
| Refine Requirements | `read, search, agent, vscode/askQuestions` | ✅ Needs agent delegation and user interaction |
| Requirement Conflict Resolver | `read, search` | ✅ Read-only analysis |
| Backlog Creator | `read, search, edit` | ✅ Creates backlog files |
| Task Dispatcher | `read, edit, search, execute, agent, todo` | ✅ Full orchestration |
| Test Engineer | `read, edit, execute, search` | ✅ Writes and runs tests |
| Software Engineer | `read, edit, execute, search` | ✅ Implements and verifies |
| Code Reviewer | `read, search, agent` | ✅ Delegates to sub-reviewers, read-only |
| Strict/Reasonable/Lenient Reviewers | `read, search` | ✅ Read-only review |
| Acceptance Tester | `read, edit, execute, search` | ✅ Runs tests, updates backlog |
| Technical Writer | `read, edit, search` | ⚠️ No `execute` — cannot verify code examples (see §4) |

### 6.5 Skill References in Source Agents ✅

| Agent | References Skill | Skill Exists? |
|---|---|---|
| Backlog Creator | `agent-backlog-maintenance` | ✅ |
| Task Dispatcher | `commit-to-git`, `task-delegation-task-identification`, `task-delegation-*-workflow` (4) | ✅ All 6 |
| Strict Reviewer | `review-findings` | ✅ |
| Reasonable Reviewer | `review-findings` | ✅ |
| Lenient Reviewer | `review-findings` | ✅ |

### 6.6 AGENTS.md Skill Reference Table ✅

The table in AGENTS.md lists 8 skills with their consumers. All mappings match the actual agent/skill content.

### 6.7 README.md Agent Descriptions ✅

All 12 agents are documented in the "Meet the Agents" section with accurate descriptions. The Mermaid flowchart correctly shows the delegation topology with the Software Engineer name.

---

## 7. Architectural Analysis

### Delegation Topology

```
User
 ├── Refine Requirements (entry)
 │    ├── Requirement Conflict Resolver
 │    └── Backlog Creator
 └── Task Dispatcher (entry)
      ├── Test Engineer
      ├── Software Engineer
      ├── Code Reviewer
      │    ├── Strict Reviewer
      │    ├── Reasonable Reviewer
      │    └── Lenient Reviewer
      ├── Acceptance Tester
      └── Technical Writer
```

**Maximum delegation depth**: 3 levels (User → Task Dispatcher → Code Reviewer → Strict/Reasonable/Lenient)

This is within the recommended range. Delegation chains beyond 4 levels suffer from context degradation and error amplification.

### Context Flow Analysis

| Handoff | Context Quality | Notes |
|---------|:-:|---|
| User → Refine Requirements | High | User provides raw spec, agent researches codebase |
| Refine Requirements → Backlog Creator | High | Refined spec is comprehensive |
| Task Dispatcher → Test Engineer | Medium | Task description + codebase context; no prior implementation |
| Task Dispatcher → Software Engineer | High | Task + test summary + codebase context |
| Task Dispatcher → Code Reviewer | High | Task + file list + implementation summary |
| Code Reviewer → Sub-reviewers | High | Same context provided to all three |
| Task Dispatcher → Acceptance Tester | High | Task + implementation + test summaries |
| Task Dispatcher → Technical Writer | Medium | Summary of changes; writer must research docs independently |

The weakest handoff is Task Dispatcher → Technical Writer, where the writer receives a summary but may need to re-read implementation code. Acceptable given the writer has read/search tools.

### Feedback Loop Design

The system has one feedback loop: the Code Review + Acceptance Test → rework cycle. This loop is:

- **Bounded**: max 4 iterations
- **Convergent**: iteration 4 relaxes criteria to force termination
- **Informative**: each iteration passes specific rework instructions, not generic "try again"

Well-designed. Unbounded feedback loops are the most common failure mode in multi-agent systems.

---

## 8. Gap Analysis — What's Missing

### 8.1 Error Recovery Guidance — Medium Priority

**Gap**: No explicit handling for sub-agent catastrophic failures (crash, no output, build-breaking code). The Task Dispatcher has a 4-iteration limit but no error recovery strategy.

**Impact**: If the Software Engineer produces code that causes a build-breaking error (not just a failing test), the system has no specialized recovery path.

**Recommendation**: Add a "When a sub-agent fails" section to the Task Dispatcher covering: retry with simplified context, skip and report blocked, escalate to user.

### 8.2 Security Reviewer — Low Priority

**Gap**: Security review is distributed across three reviewer agents (the Reasonable Reviewer has the most explicit guidance).

**Impact**: For this project (an npm CLI tool), the risk is low. For users adopting Squadron for web applications or API services, a dedicated security review may be warranted.

**Recommendation**: Not needed for Squadron. The Reasonable Reviewer's security focus is adequate for this project's risk profile.

### 8.3 Integration/E2E Test Guidance — Low Priority

**Gap**: The Test Engineer focuses on unit tests. No dedicated integration testing strategy.

**Impact**: For Squadron's own codebase (a CLI with simple file operations), this is fine.

**Recommendation**: Consider adding a paragraph about when integration tests are appropriate.

---

## 9. Redundancy Analysis — What Could Be Removed

### 9.1 Three Sub-Reviewers — **Keep All Three**

The confidence classification (unanimous = confirmed, one-only = nitpick/show-stopper) requires three data points. Reducing to two would lose nuance.

### 9.2 Acceptance Tester vs. Test Engineer — **Keep Both**

Distinct roles: Test Engineer writes tests (producer), Acceptance Tester verifies criteria (verifier). The Acceptance Tester checks criteria that may not be automatable.

### 9.3 Four Workflow Skills — **Keep All Four**

Follows Principle 8. Each is loaded only when needed, keeping context windows small.

### 9.4 Requirement Conflict Resolver — **Keep**

Follows Principle 3 (one job per agent). Folding into Refine Requirements would bloat its context.

---

## 10. Recommendations

### Critical Priority

| # | Recommendation | Rationale | Evidence |
|---|---|---|---|
| 1 | **Re-install source agents/skills into `.github/`** | The installed artifacts are running a fundamentally different system — no milestones, wrong agent name, different branching model. Squadron is developing itself against stale agents. | See §3 for full diff analysis. 4 agent files and 3 skill files have content drift. |

### High Priority

| # | Recommendation | Rationale | Evidence |
|---|---|---|---|
| 2 | **Consolidate duplicated task template** | The Backlog Creator inlines a task template that is nearly identical to the `agent-backlog-maintenance` skill's template, but with minor inconsistencies (Implementation Notes comment, Dependencies format, Description guidance). This violates Principle 6 ("Never duplicate skill content inside agent definitions"). | See §4 Backlog Creator for field-by-field comparison. |
| 3 | **Remove inlined task discovery from Task Dispatcher** | The Task Dispatcher's Step 1 duplicates `grep_search`/`file_search` patterns already defined in the `agent-backlog-maintenance` skill. Violates Principle 6. | Task Dispatcher Step 1 vs. skill's "Find the next task to work on" section contain identical patterns. |
| 4 | **Fix `agent-backlog-maintenance` Implementation Notes comment** | The skill says `<!-- Populated by the Software Engineer after implementation -->` but documentation-only tasks are implemented by the Technical Writer. The comment is too specific. | Compare with Backlog Creator's more correct `<!-- Populated by the implementing agent -->`. |

### Medium Priority

| # | Recommendation | Rationale | Evidence |
|---|---|---|---|
| 5 | **Create `CHANGELOG.md` or make it conditional** | The Technical Writer says `CHANGELOG.md: always — every completed task gets a changelog entry`. No `CHANGELOG.md` exists in the project. The "always" directive creates a confusing instruction. | `file_search` for `CHANGELOG*` returns no results. Completed tasks 001–005 have no changelog entries. |
| 6 | **Add error recovery guidance to Task Dispatcher** | No explicit handling for sub-agent catastrophic failures. | No "error recovery" or "what to do when" section exists in the agent definition. |
| 7 | **Clarify Test Engineer's dual mode** | The agent operates in TDD mode and post-implementation mode but doesn't acknowledge the difference. | Engineering workflow says "before any implementation exists"; test workflow says "existing implementation that needs test coverage" — the agent itself doesn't distinguish these. |
| 8 | **Add task sizing guidance to Backlog Creator** | No heuristic for task size beyond milestone sizing (3–8 tasks). Individual task granularity is undefined. | No mention of file count limits, complexity bounds, or "single session" sizing in the agent definition. |

### Low Priority

| # | Recommendation | Rationale | Evidence |
|---|---|---|---|
| 9 | **Consider adding `execute` to Technical Writer** | The writer cannot run verification commands despite having a "Verify" workflow step. | `tools: [read, edit, search]` — no `execute`. Step 5 says "Ensure code examples are syntactically correct." |
| 10 | **Document agent extensibility in README** | Users adopting Squadron may want to add domain-specific agents. | No "extending" or "customization" section in README.md. |
| 11 | **Add integration test guidance to Test Engineer** | The prompt biases toward unit tests. | "Prefer small focused unit tests; use integration tests only for cross-component behavior" — no guidance on *when* integration tests are actually needed. |

### No Action Needed

| Item | Reason |
|------|--------|
| Three sub-reviewers | Ensemble approach requires three data points for triangulation |
| Four workflow skills | Context efficiency justifies file count; follows Principle 8 |
| Separate Requirement Conflict Resolver | Follows Principle 3; folding into Refine Requirements would bloat context |
| Separate Acceptance Tester | Distinct from Test Engineer; checks non-automatable criteria |
| Security Reviewer agent | Reasonable Reviewer covers security adequately for this project |
| Backend Engineer rename | ✅ Already completed in tasks 002–005 |

---

## 11. Summary Matrix

| Component | Verdict | Action |
|-----------|---------|--------|
| **Installed `.github/` artifacts** | ⛔ Stale | **Re-install from source** |
| Refine Requirements | ✅ Keep as-is | — |
| Requirement Conflict Resolver | ✅ Keep as-is | — |
| Backlog Creator | ⚠️ Minor fix | Deduplicate task template, reference skill |
| Task Dispatcher | ⚠️ Minor fix | Remove inlined discovery patterns, add error recovery |
| Test Engineer | ✅ Keep, minor enhancement | Clarify dual-mode usage |
| Software Engineer | ✅ Keep as-is | — |
| Code Reviewer | ✅ Keep as-is | — |
| Strict Reviewer | ✅ Keep as-is | — |
| Reasonable Reviewer | ✅ Keep as-is | — |
| Lenient Reviewer | ✅ Keep as-is | — |
| Acceptance Tester | ✅ Keep as-is | — |
| Technical Writer | ⚠️ Minor fix | CHANGELOG directive, consider `execute` tool |
| agent-backlog-maintenance | ⚠️ Minor fix | Fix Implementation Notes comment |
| commit-to-git | ✅ Keep as-is | — |
| review-findings | ✅ Keep as-is | — |
| task-delegation-task-identification | ✅ Keep as-is | — |
| task-delegation-documentation-workflow | ✅ Keep as-is | — |
| task-delegation-ci-cd-workflow | ✅ Keep as-is | — |
| task-delegation-engineering-workflow | ✅ Keep as-is | — |
| task-delegation-test-workflow | ✅ Keep as-is | — |

**Overall Assessment**: The source agent and skill definitions are well-designed, well-scoped, and internally consistent after the Software Engineer rename. The most critical issue is that the installed `.github/` artifacts have not been updated to match the source — they lack milestone support, use the old agent name, and follow a different branching model. Re-installation is the single highest-priority action. Beyond that, there are four substantive improvements: deduplicating the task template (Principle 6 violation), removing inlined discovery patterns (Principle 6 violation), fixing the Implementation Notes comment specificity, and resolving the CHANGELOG.md "always" directive that references a non-existent file.
