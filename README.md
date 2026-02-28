# Squadron

Squadron is an Agentic Coding Suite built specifically for **GitHub Copilot** and its **Premium Request billing model**.

It provides a team of autonomous, specialized agents that take a specification from idea to implementation — refining requirements, breaking work into tasks, writing code, testing, and documenting changes.

Humans provide the vision. Agents provide the implementation.

## Why Squadron Exists

Most agentic coding suites are designed for platforms with token-based billing. On those platforms, every optimization is measured in tokens: prompts are compressed, context windows are trimmed, and output is kept terse — because tokens are the unit of cost.

GitHub Copilot works differently. Copilot bills by **Premium Request** — each time the model is invoked counts as a request, regardless of how many tokens it uses. The token-optimizing strategies used by other agent frameworks actively work against you here: frequent small model calls, iterative prompt refinement, and chatty tool loops all drive up your Premium Request count without any reduction in cost.

**Squadron is designed from the ground up around this billing model.** Its defining characteristic is minimizing the number of model invocations. It achieves this by:

- **Using Copilot's native `subAgent` feature** to delegate work to background agents that run outside your active request context
- **Batching work into large, autonomous tasks** rather than small iterative steps that each require a separate request
- **Giving agents deep, complete context upfront** so they can complete work in a single pass without back-and-forth clarification

If you are using GitHub Copilot and paying per Premium Request, Squadron is built for you. If you are on a token-billed platform, other frameworks may serve you better.

## Getting Started

1. Open your project in VS Code with GitHub Copilot enabled
2. Copy the `agents/` and `skills/` directories into your project's `.github/` directory
3. Invoke the **Refine Requirements** agent with your specification to begin

## The Workflow

```mermaid
flowchart TD
    U1(["You provide a spec"]):::user
    U2(["You review the backlog"]):::user

    RR["**Refine Requirements**\nAsks clarifying questions\nProduces a refined spec"]:::entrypoint
    BC["**Backlog Creator**\nDecomposes spec into discrete\ntasks with acceptance criteria"]:::autonomous
    DISP["**Task Dispatcher**\nOrchestrates all agents\nper task; retries on failure"]:::entrypoint

    BE["**Backend Engineer**\nImplements code"]:::autonomous
    TE["**Test Engineer**\nWrites tests"]:::autonomous
    CR["**Code Reviewer**\nSynthesises a multi-perspective\nconsolidated verdict"]:::autonomous
    AT["**Acceptance Tester**\nVerifies acceptance criteria"]:::autonomous
    TW["**Technical Writer**\nUpdates docs"]:::autonomous

    SR["**Strict Reviewer**\nEvery detail"]:::subreview
    RRev["**Reasonable Reviewer**\nWhat matters"]:::subreview
    LR["**Lenient Reviewer**\nShow-stoppers only"]:::subreview

    U1         --> RR
    RR         -- "delegates to" --> BC
    BC         --> U2
    U2         --> DISP
    DISP       -- "implements"   --> BE
    DISP       -- "tests"        --> TE
    DISP       -- "reviews"      --> CR
    DISP       -- "verifies"     --> AT
    DISP       -- "documents"    --> TW
    CR         --> SR
    CR         --> RRev
    CR         --> LR

    subgraph legend["Legend"]
        L1(["User entry point"]):::user
        L2["Autonomous — background"]:::autonomous
        L3["User-invoked agent"]:::entrypoint
        L4["Code review sub-agent"]:::subreview
    end

    classDef user       fill:#dbeafe,stroke:#2563eb,color:#1e3a5f
    classDef entrypoint fill:#dcfce7,stroke:#16a34a,color:#14532d,stroke-width:2px
    classDef autonomous fill:#fef9c3,stroke:#ca8a04,color:#713f12
    classDef subreview  fill:#f3e8ff,stroke:#9333ea,color:#3b0764
```

### Step 1: Refine Requirements

Invoke the **Refine Requirements** agent with your feature request, bug report, or specification. This agent:

- Researches your codebase for context
- Identifies ambiguities, gaps, and implicit assumptions
- Asks you clarifying questions to resolve them
- Produces a refined, unambiguous specification
- Delegates to the **Backlog Creator** to generate a task backlog

### Step 2: Review the Backlog

The **Backlog Creator** breaks the refined specification into small, discrete tasks — each with specific acceptance criteria, priority, and dependency ordering. Review the generated backlog in the `backlog/` directory. You can adjust tasks, priorities, or acceptance criteria before proceeding.

### Step 3: Execute with Task Dispatcher

Invoke the **Task Dispatcher** agent to begin implementation. For each task, it:

1. Delegates to **Backend Engineer** for implementation
2. Delegates to **Test Engineer** for test coverage
3. Delegates to **Code Reviewer** for a multi-perspective code review (strict, reasonable, and lenient)
4. Delegates to **Acceptance Tester** for verification against acceptance criteria
5. Re-attempts implementation if the code review or acceptance criteria aren't met (up to 4 iterations)
6. Delegates to **Technical Writer** for documentation updates
7. Commits changes and updates the backlog

## Meet the Agents

### Refine Requirements
**Entry point** — the first agent you interact with. Performs deep analysis of your specification, asks clarifying questions to eliminate ambiguities, and ensures requirements are complete and implementable before any code is written.

### Backlog Creator
Takes the refined specification and decomposes it into small, independently implementable tasks. Each task has specific acceptance criteria, priority, and dependency ordering. Creates structured backlog files in the `backlog/` directory.

### Task Dispatcher
The engineering manager. Reads the backlog, selects tasks in dependency and priority order, delegates to specialist agents, and ensures each task passes acceptance testing before marking it complete. Handles retries and escalation for blocked tasks.

### Backend Engineer
Implements a single task from the backlog. Researches the codebase, writes production-quality code following project conventions, and verifies changes pass existing tests.

### Test Engineer
Writes comprehensive tests for implemented features. Covers happy paths, edge cases, and error scenarios following the project's testing framework and conventions.

### Acceptance Tester
Verifies that implementations meet their acceptance criteria. Reviews code changes, runs the test suite, and reports detailed pass/fail findings for each criterion.

### Code Reviewer
Orchestrates a multi-perspective code review by delegating to three sub-agents — Strict, Reasonable, and Lenient reviewers. Synthesizes their findings into a consolidated verdict using a confidence framework: issues found by all three reviewers are confirmed legitimate, issues found only by the strict reviewer are treated as optional nitpicks. Determines whether code needs rework or can proceed.

### Strict Reviewer
The nitpicky reviewer. Examines every line for correctness, code quality, convention adherence, edge cases, and readability. Flags everything — no detail is too small. Findings that only this reviewer catches are classified as nitpicks in the consolidated review.

### Reasonable Reviewer
The pragmatic reviewer. Focuses on what matters for long-term codebase health: correctness, security vulnerabilities, maintainability concerns, and non-idiomatic code. Ignores trivial stylistic preferences.

### Lenient Reviewer
The quick-scan reviewer. Only flags show-stopping issues — broken logic, security holes, and catastrophic problems. Everything else is off its radar. If this reviewer flags something, it's serious.

### Technical Writer
Maintains project documentation. Updates README files, changelogs, API documentation, and other docs to accurately reflect completed changes.

## Skills

### Agent Backlog Maintenance
Defines the schema, file format, naming conventions, and lifecycle rules for the task backlog. Used by the Backlog Creator and Task Dispatcher to ensure consistent backlog management.

### Commit to Git
Defines commit message formatting ([Conventional Commits](https://www.conventionalcommits.org/)), branch naming conventions, and commit scope guidelines. Used by the Task Dispatcher when committing completed work.

## Design Principles

- **Specialization**: each agent has one job and does it well
- **Autonomy**: agents work independently within their defined scope
- **Quality gates**: every task passes acceptance testing before completion
- **Human oversight**: humans review requirements and the backlog before implementation begins
- **Context efficiency**: sub-agents receive only the context they need, keeping context windows small
- **Cost optimization**: work is delegated to specialized sub-agents via `runSubagent`, minimizing token usage per Premium Request