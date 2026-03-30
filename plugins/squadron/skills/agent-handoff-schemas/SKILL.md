---
name: agent-handoff-schemas
description: Defines typed output schemas for structured data passed between agents during the engineering workflow. Agents that produce handoff data must emit a labeled JSON block so downstream agents can parse it reliably.
---

# Agent Handoff Schemas

Agents in the engineering workflow pass structured data to one another at each step. This skill defines the required output format and the typed schema each producing agent must follow.

## Output Block Format

Wrap all structured handoff output in a labeled fenced block:

```
```json agent-handoff
{ ... }
```
```

The `agent-handoff` label is required. It identifies the block as machine-readable handoff data and distinguishes it from other JSON snippets in an agent's response. Downstream agents must read from this block and ignore unlabeled code blocks.

## Schemas

### TestResults

Produced by the **Test Engineer** at the end of its workflow.

| Field | Type | Description |
|-------|------|-------------|
| `files_created` | `string[]` | Repository-relative paths of every test file written |
| `tests_written` | `object[]` | One entry per test case (see sub-fields below) |
| `tests_written[].name` | `string` | Exact test name as it appears in the test runner |
| `tests_written[].criterion` | `string` | The acceptance criterion this test verifies |
| `tests_written[].file` | `string` | Repository-relative path of the file containing this test |
| `framework` | `string` | Testing framework used (e.g. `"node:test"`, `"jest"`, `"vitest"`) |

```json agent-handoff
{
  "files_created": ["tests/unit/checkout.test.ts"],
  "tests_written": [
    {
      "name": "applies discount code to cart total",
      "criterion": "Discount codes reduce the cart total by the specified percentage",
      "file": "tests/unit/checkout.test.ts"
    },
    {
      "name": "rejects expired discount codes",
      "criterion": "Expired discount codes are rejected with a 400 error",
      "file": "tests/unit/checkout.test.ts"
    }
  ],
  "framework": "node:test"
}
```

---

### ImplementationSummary

Produced by the **Software Engineer** at the end of its workflow.

| Field | Type | Description |
|-------|------|-------------|
| `files_modified` | `string[]` | Repository-relative paths of every file created or changed |
| `approach` | `string` | Short description of the implementation strategy |
| `trade_offs` | `string` | Notable trade-offs or limitations of the approach taken |
| `tests_passing` | `boolean` | Whether the TDD tests were passing at the time of submission |

```json agent-handoff
{
  "files_modified": [
    "src/checkout/discounts.ts",
    "src/checkout/cart.ts"
  ],
  "approach": "Added a DiscountService that validates and applies codes before the cart total is finalised. Codes are looked up from the existing promotions table.",
  "trade_offs": "Discount validation is synchronous; bulk cart operations may see latency if many codes are evaluated at once.",
  "tests_passing": true
}
```

---

### ReviewVerdict

Produced by the **Code Reviewer** at the end of its workflow.

| Field | Type | Description |
|-------|------|-------------|
| `verdict` | `"PASS"` \| `"REWORK"` | Overall review outcome |
| `findings` | `object[]` | One entry per finding (empty array when verdict is PASS) |
| `findings[].severity` | `"blocking"` \| `"minor"` | Severity class (see mapping below) |
| `findings[].file` | `string` | Repository-relative path of the affected file |
| `findings[].issue` | `string` | Description of what is wrong |
| `findings[].suggestion` | `string` | Concrete action the Software Engineer should take |

**Severity mapping**

| Value | Covers |
|-------|--------|
| `"blocking"` | Confirmed Issues and Show-Stoppers |
| `"minor"` | Likely Issues, Potential Issues, and Nitpicks |

A verdict of `"REWORK"` must be issued whenever one or more `"blocking"` findings are present.

```json agent-handoff
{
  "verdict": "REWORK",
  "findings": [
    {
      "severity": "blocking",
      "file": "src/checkout/discounts.ts",
      "issue": "Discount percentage is not validated — values above 100 are accepted and produce a negative cart total.",
      "suggestion": "Add a guard that rejects codes whose discount percentage is outside the range 0–100."
    },
    {
      "severity": "minor",
      "file": "src/checkout/cart.ts",
      "issue": "Variable name `d` is not descriptive.",
      "suggestion": "Rename `d` to `discountCode` for clarity."
    }
  ]
}
```

---

### AcceptanceReport

Produced by the **Acceptance Tester** at the end of its workflow.

| Field | Type | Description |
|-------|------|-------------|
| `overall` | `"PASS"` \| `"FAIL"` | Aggregate result across all criteria |
| `criteria` | `object[]` | One entry per acceptance criterion |
| `criteria[].text` | `string` | The acceptance criterion as stated in the task |
| `criteria[].result` | `"PASS"` \| `"FAIL"` | Whether this criterion was satisfied |
| `criteria[].evidence` | `string` | Test name, output, or observation that supports the result |

`overall` is `"PASS"` only when every criterion's `result` is `"PASS"`.

```json agent-handoff
{
  "overall": "PASS",
  "criteria": [
    {
      "text": "Discount codes reduce the cart total by the specified percentage",
      "result": "PASS",
      "evidence": "applies discount code to cart total — passed (node:test)"
    },
    {
      "text": "Expired discount codes are rejected with a 400 error",
      "result": "PASS",
      "evidence": "rejects expired discount codes — passed (node:test)"
    }
  ]
}
```
