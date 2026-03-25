---
# Trigger - when should this workflow run?
on:
  schedule: weekly on Friday

# Permissions - what can this workflow access?
# Write operations (creating issues, PRs, comments, etc.) are handled
# automatically by the safe-outputs job with its own scoped permissions.
permissions:
  contents: read
  issues: read

mcp-servers:
  tavily:
    command: npx
    args: ["-y", "@tavily/mcp-server"]
    env:
      TAVILY_API_KEY: "${{ secrets.TAVILY_API_KEY }}"
    allowed: ["search", "research"]

# Network access
network:
  allowed:
    - defaults
    - "*.tavily.com"
    - "*.arxiv.org"

# Outputs - what APIs and tools can the AI use?
safe-outputs:
  create-issue:          # Creates issues (default max: 1)
    max: 1               # Optional: specify maximum number
    title-prefix: "[research] "
    labels: [research, improvements]
    close-older-issues: true
---

# research_workflow

The agent performs deep research on the topic of Multi Agent Code Generator Architectures and summarises key findings that can be applied to Squadron in order to improve its quality and maintain its relevance.

## Instructions

### Research

Read fixed sources of information:
 - https://github.blog/changelog/

Use the Tavily `research` tool with the following prompt
```md
Analyse the latest research in the areas of Multi Agent Code Generation Frameworks and LLM Agents Collaboration Evaluation.

Produce a summary of the top 10 developments in these areas with a bias towards trustworthy, reputable information sources like arxiv and other research publication sources. Treat blogs like medium.com as noteworthy but less trusted.

The output must take the form of a top 10 list with each item containing:
 - A title.
 - A summary of no more than 800 words.
 - Citations.
```

 ### Analyse
 Summarise all of the latest information and distill it down into actionable insights that can be applied to this project.

 Ensure that the actions have not already been incorporated into the design. We only want to add new research and ideas.
 
 Each action must have:
  - A title that provides an at a glance summary of the action to be done
  - A summary of the action as well as the evidence that supports the relevance of the action. This summary must be no more than 250 words 
  - A prompt that can be given to Squadron to self-improve. The prompt must contain sufficient detail and context on what the concrete improvement is. The word limit for the prompt is 600 words.

For example
````md
## Action 1 — Iterative Debug-Retry Loop (Execution-Feedback Cycle)

**Summary**

Current Squadron workflow runs a single implementation pass (Backend Engineer → tests pass or fail). Research from AgentCoder (Huang et al., 2023) and Reflexion (Shinn et al., 2023) demonstrates that giving a coding agent the *output of test execution* as structured feedback—and repeating up to N times—substantially improves pass rates on HumanEval and MBPP benchmarks (AgentCoder reports ~9% absolute gain over single-pass baselines). Self-Refine (Madaan et al., 2023) generalises this: any generative agent benefits from iterative refinement driven by concrete feedback rather than a single forward pass. Squadron's Task Dispatcher currently marks a task blocked if the Engineer's first implementation fails tests; it does not retry with execution feedback. Adding a bounded debug loop (max 3 iterations) before escalating would directly reduce blocked tasks and reviewer load.

**Prompt for Squadron**

```md
Improve the Task Dispatcher and Backend Engineer agents to support an iterative debug-retry loop.

Context: Research (AgentCoder 2023, Reflexion 2023, Self-Refine 2023) shows that feeding test execution output back to the coding agent in a structured loop dramatically improves code quality without requiring additional model invocations for review or acceptance testing until the loop converges.

Concrete change:
After the Backend Engineer completes an implementation attempt, the Task Dispatcher should:
1. Run the test suite and capture structured output (pass/fail counts, failing test names, error messages, stack traces).
2. If tests fail, re-invoke the Backend Engineer with a prompt that includes:
   - The original task description and acceptance criteria.
   - The full diff of the implementation just written.
   - The structured test output showing exactly which tests failed and why.
   - The instruction: "Fix only the failing tests listed above. Do not change passing tests or unrelated code."
3. Repeat up to a maximum of 3 retry iterations.
4. If tests still fail after 3 iterations, mark the task blocked with a clear summary of the failures.
5. If tests pass at any iteration, continue to the Code Reviewer step as normal.

Add a new skill file `/plugins/squadron/skills/debug-retry-loop/SKILL.md` documenting this procedure so the Task Dispatcher can reference it by name rather than inlining the steps. Update the `task-delegation-engineering-workflow` skill to include a step invoking the debug-retry-loop skill between the Backend Engineer step and the Code Reviewer step.
```
````

The maximum number of actions to recommend is 5.

When rating multiple actions to select the top 5, use the following criteria:
 - Reputability: More reputable sources of information like arxiv rank higher than personal blog posts
 - Relevance: Topics highly relevant to Agent Coding Teams rank higher than general LLM research
 - Timeliness: More recent research is more relevant than older research
 - Popularity: More widely discussed and accepted sources rank higher than more niche content. However, being unpopular doesn't automatically mean bad. We might be ahead of the crowd.

 ### Citation
 At the bottom of the issue cite each of the references used in the generation of the report.