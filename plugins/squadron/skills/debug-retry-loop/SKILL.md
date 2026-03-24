---
name: debug-retry-loop
description: Defines the iterative debug-retry procedure used by the Task Dispatcher after a Software Engineer implementation attempt — running the test suite, capturing structured failure output, and re-invoking the Software Engineer with targeted context until tests pass or the retry limit is reached.
---

# Debug-Retry Loop

Use this procedure immediately after the Software Engineer completes an implementation attempt. Track the current retry count starting at 0 (the initial implementation attempt does not count as a retry).

## Step 1: Run Tests

Run the full test suite and capture structured output, including:
- Total pass and fail counts
- The name of every failing test
- The full error message for each failure
- The stack trace for each failure

## Step 2: Exit on Pass

If all tests pass, exit the loop and proceed to the **Code Review** step.

## Step 3: Re-invoke on Fail

If any tests fail, re-invoke the **Software Engineer** with a prompt that includes:
- The original task description and acceptance criteria
- The full diff of the implementation just written
- The structured test output from Step 1 showing exactly which tests failed and why
- The instruction: "Fix only the failing tests listed above. Do not change passing tests or unrelated code."

Increment the retry count by 1.

## Step 4: Enforce the Retry Limit

Repeat Steps 1–3 for a maximum of **3 retry iterations**. The initial implementation attempt does not count toward this limit.

## Step 5: Block on Persistent Failure

If tests still fail after 3 retry iterations, stop immediately. Mark the task as **blocked** with a clear summary that includes:
- The total number of retries attempted
- The names of all still-failing tests
- The last error message and stack trace for each failing test

Do not proceed to Code Review or any subsequent step.

## Step 6: Continue on Success

If tests pass at the end of any retry iteration, exit the loop immediately and proceed to the **Code Reviewer** step.
