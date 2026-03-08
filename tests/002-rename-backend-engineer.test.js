import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');

/**
 * Recursively collects all file paths under a directory.
 */
function collectFiles(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFiles(fullPath));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

// AC1: No occurrences of "Backend Engineer" exist in agents/ source directory
test('agents/ source directory contains no occurrences of "Backend Engineer"', () => {
  const agentsDir = join(projectRoot, 'agents');
  const files = collectFiles(agentsDir);
  const matches = [];
  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    if (content.includes('Backend Engineer')) {
      matches.push(file.replace(projectRoot + '/', ''));
    }
  }
  assert.deepEqual(
    matches,
    [],
    `"Backend Engineer" found in agents/ source files: ${matches.join(', ')}`,
  );
});

// AC2: No occurrences of "Backend Engineer" exist in skills/ source directory
test('skills/ source directory contains no occurrences of "Backend Engineer"', () => {
  const skillsDir = join(projectRoot, 'skills');
  const files = collectFiles(skillsDir);
  const matches = [];
  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    if (content.includes('Backend Engineer')) {
      matches.push(file.replace(projectRoot + '/', ''));
    }
  }
  assert.deepEqual(
    matches,
    [],
    `"Backend Engineer" found in skills/ source files: ${matches.join(', ')}`,
  );
});

// AC3: No occurrences of "Backend Engineer" exist in AGENTS.md or README.md
test('AGENTS.md and README.md contain no occurrences of "Backend Engineer"', () => {
  const agentsMd = readFileSync(join(projectRoot, 'AGENTS.md'), 'utf8');
  const readmeMd = readFileSync(join(projectRoot, 'README.md'), 'utf8');
  assert.ok(
    !agentsMd.includes('Backend Engineer'),
    'AGENTS.md must not contain "Backend Engineer"',
  );
  assert.ok(
    !readmeMd.includes('Backend Engineer'),
    'README.md must not contain "Backend Engineer"',
  );
});

// AC4: agents/software-engineer.agent.md exists and its name: frontmatter field equals "Software Engineer"
test('agents/software-engineer.agent.md exists with frontmatter name: "Software Engineer"', () => {
  const filePath = join(projectRoot, 'agents', 'software-engineer.agent.md');
  assert.ok(existsSync(filePath), 'agents/software-engineer.agent.md must exist');

  const oldFilePath = join(projectRoot, 'agents', 'backend-engineer.agent.md');
  assert.ok(
    !existsSync(oldFilePath),
    'agents/backend-engineer.agent.md must not exist alongside the new software engineer agent file',
  );

  const content = readFileSync(filePath, 'utf8');

  // Extract the YAML frontmatter block (between --- delimiters)
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  assert.ok(frontmatterMatch, 'agents/software-engineer.agent.md must have YAML frontmatter');

  const frontmatter = frontmatterMatch[1];
  assert.match(
    frontmatter,
    /^name:\s*Software Engineer\s*$/m,
    'frontmatter name: field must equal exactly "Software Engineer"',
  );
});
