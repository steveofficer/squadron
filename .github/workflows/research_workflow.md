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
    allowed: ["search", "search_news"]

# Network access
network:
  allowed:
    - defaults
    - "*.tavily.com"

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

And search the web using the following search phrases
 - `multi agent system code generation architecture`
 - `LLM multi agent workflow orchestration`
 - `agent role planner coder debugger system`
 - `agentic workflow iterative refinement coding`
 - `multi agent planning loop debugging agent research`
 - `self evolving agent workflow LLM`
 - `multi agent code generation framework paper`
 - `LLM agents collaboration evaluation benchmark`
 - `agent based programming languages multi agent systems`

Following deep links is allowed, however go no further than 2 links deep.
This means that you can follow: "The initial search results page" -> "A top 3 result" -> "A reference for the result".

Once you have followed a link from a research article you cannot go any deeper.

 ### Analyse
 Summarise all of the latest information and distill it down onto actionable insights that can be applied to this project.
 Each action must have:
  - A title that provides an at a glance summary of the action to be done
  - A summary of the action as well as the evidence that supports the relevance of the action. This summary must be no more than 250 words 
  - A prompt that can be given to Squadron to self-improve. The prompt must contain sufficient detail and context on what the concrete improvement is. The word limit for the prompt is 600 words.

You can have no more than 5 actions recommended.
When rating multiple actions use the following criteria to rank them:
 - Reputability: More reputable sources of information like arxiv rank higher than personal blog posts
 - Relevance: Topics highly relevant to Agent Coding Teams rank higher than general LLM research
 - Timeliness: More recent research is more relevant than older research
 - Popularity: More widely discussed and accepted sources rank higher than more niche content. However, being unpopular doesn't automatically mean bad. We might be ahead of the crowd.

 ### Citation
 At the bottom of the issue cite each of the references used in the generation of the report.