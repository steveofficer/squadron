import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const readmeContent = readFileSync(join(projectRoot, 'README.md'), 'utf8');

/**
 * Extracts the body of the "## Meet the Agents" section (up to the next "## "
 * top-level heading) using string indexing to avoid non-greedy regex surprises.
 * Returns null when the section is absent.
 */
function extractMeetAgentsSection(content) {
  const HEADING = '\n## Meet the Agents\n';
  const start = content.indexOf(HEADING);
  if (start === -1) return null;
  const bodyStart = start + HEADING.length;
  const nextSection = content.indexOf('\n## ', bodyStart);
  return nextSection === -1 ? content.slice(bodyStart) : content.slice(bodyStart, nextSection);
}

// AC1: Mermaid flowchart contains a Requirement Conflict Resolver node (RCR) with
//      the autonomous style class and a directed edge from RR labeled "conflict check".
test('flowchart has RCR node with autonomous class and directed edge from RR labeled "conflict check"', () => {
  const mermaidMatch = readmeContent.match(/```mermaid\n([\s\S]*?)```/);
  assert.ok(mermaidMatch, 'README must contain a mermaid code block');
  const mermaid = mermaidMatch[1];

  // Node must be defined with the label "Requirement Conflict Resolver" and the autonomous class
  assert.match(
    mermaid,
    /RCR\[.*Requirement Conflict Resolver.*\]:::autonomous/,
    'RCR node must be defined with "Requirement Conflict Resolver" label and :::autonomous style class',
  );

  // Directed edge: RR -- "conflict check" --> RCR  (allow optional whitespace / arrow styles)
  assert.match(
    mermaid,
    /RR\s*--[^-\n]*conflict check[^-\n]*-->\s*RCR/,
    'Mermaid diagram must have a directed edge from RR to RCR labeled "conflict check"',
  );
});

// AC2: Step 1 bullet list names the Requirement Conflict Resolver and describes its trigger.
test('Step 1 bullet list names Requirement Conflict Resolver with its triggering condition', () => {
  const step1Match = readmeContent.match(/### Step 1: Refine Requirements([\s\S]*?)### Step 2/);
  assert.ok(step1Match, '"### Step 1: Refine Requirements" section must exist');
  const step1Content = step1Match[1];

  // Find the bullet that mentions the Requirement Conflict Resolver
  const lines = step1Content.split('\n');
  const rcrBullet = lines.find(
    (line) => /^\s*[-*]/.test(line) && line.includes('Requirement Conflict Resolver'),
  );

  assert.ok(
    rcrBullet,
    'Step 1 must have a bullet point that names the "Requirement Conflict Resolver"',
  );

  // The same bullet should describe when it fires (triggering condition)
  assert.match(
    rcrBullet,
    /conflict|when|trigger|detects|found/i,
    'The Requirement Conflict Resolver bullet must describe its triggering condition',
  );
});

// AC3: "Meet the Agents" has a ### Requirement Conflict Resolver subsection positioned
//      after ### Refine Requirements and before ### Backlog Creator, describing
//      purpose, trigger condition, and three possible outcomes.
test('"Meet the Agents" has a ### Requirement Conflict Resolver subsection in the correct position with three outcomes', () => {
  const meetAgentsContent = extractMeetAgentsSection(readmeContent);
  assert.ok(meetAgentsContent !== null, '"## Meet the Agents" section must exist');

  // Subsection must exist
  assert.match(
    meetAgentsContent,
    /### Requirement Conflict Resolver/,
    '"Meet the Agents" must contain a "### Requirement Conflict Resolver" subsection',
  );

  // Position: after ### Refine Requirements, before ### Backlog Creator
  const refinePos = meetAgentsContent.indexOf('### Refine Requirements');
  const rcrPos = meetAgentsContent.indexOf('### Requirement Conflict Resolver');
  const backlogPos = meetAgentsContent.indexOf('### Backlog Creator');

  assert.ok(refinePos !== -1, '"### Refine Requirements" must be present');
  assert.ok(backlogPos !== -1, '"### Backlog Creator" must be present');
  assert.ok(
    rcrPos > refinePos,
    '"### Requirement Conflict Resolver" must appear after "### Refine Requirements"',
  );
  assert.ok(
    rcrPos < backlogPos,
    '"### Requirement Conflict Resolver" must appear before "### Backlog Creator"',
  );

  // Extract the subsection body (content up to the next ###)
  const rcrSectionMatch = meetAgentsContent.match(
    /### Requirement Conflict Resolver([\s\S]*?)(?=###|$)/,
  );
  assert.ok(rcrSectionMatch, '"### Requirement Conflict Resolver" must have body content');
  const rcrBody = rcrSectionMatch[1];

  // Three required outcomes
  assert.match(rcrBody, /resolv/i, 'RCR section must describe the "resolved" outcome');
  assert.match(rcrBody, /false alarm/i, 'RCR section must describe the "false alarm" outcome');
  assert.match(rcrBody, /unresolvable/i, 'RCR section must describe the "unresolvable" outcome');
});

// AC4: Total agent count in README matches the 12 files present in /agents/.
test('all 12 agents in /agents/ are represented by ### subsections in "Meet the Agents"', () => {
  const agentsDir = join(projectRoot, 'agents');
  const agentFiles = readdirSync(agentsDir).filter((f) => f.endsWith('.agent.md'));

  assert.strictEqual(
    agentFiles.length,
    12,
    `Expected exactly 12 .agent.md files in /agents/, found ${agentFiles.length}`,
  );

  // Derive heading text from filename: "foo-bar-baz.agent.md" → "Foo Bar Baz"
  const toHeading = (filename) =>
    filename
      .replace('.agent.md', '')
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

  const meetAgentsContent = extractMeetAgentsSection(readmeContent);
  assert.ok(meetAgentsContent !== null, '"## Meet the Agents" section must exist');

  for (const filename of agentFiles) {
    const heading = toHeading(filename);
    assert.match(
      meetAgentsContent,
      new RegExp(`### ${heading}`),
      `README "Meet the Agents" must contain "### ${heading}"`,
    );
  }
});
