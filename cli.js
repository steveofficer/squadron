#!/usr/bin/env node

import { intro, outro, text, confirm, spinner, log, cancel, isCancel } from '@clack/prompts';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pc from 'picocolors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOGO = `
${pc.dim('  · · · · · ✈                                       ✈ · · · · ·')}
${pc.cyan('      · · · ✈                                     ✈ · · ·      ')}
${pc.cyan('          · ✈  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ✈ ·          ')}
${pc.bold(pc.white('            ✈  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ✈            '))}

${pc.cyan('  ███████  █████   █  █  █████  ████   ████   █████  █   █')}
${pc.cyan('  █       █     █  █  █  █   █  █   █  █   █  █   █  ██  █')}
${pc.yellow('  ███████ █     █  █  █  █████  █   █  ████   █   █  █ █ █')}
${pc.yellow('        █ █  █  █  █  █  █   █  █   █  █  █   █   █  █  ██')}
${pc.bold(pc.white('  ███████  ██ ██    ██   █   █  ████   █   █  █████  █   █'))}

${pc.dim('  ╔═════════════════════════════════════════════════════════╗')}
${pc.bold(pc.cyan('  ║  ✈  An Agentic Coding Suite for GitHub Copilot      ║'))}
${pc.dim('  ║     Humans provide the vision · Agents implement it   ║')}
${pc.dim('  ╚═════════════════════════════════════════════════════════╝')}
`;

function isEmptyDir(dir) {
  try {
    const entries = fs.readdirSync(dir);
    return entries.length === 0;
  } catch {
    return false;
  }
}

function isGitRepo(dir) {
  try {
    return fs.existsSync(path.join(dir, '.git'));
  } catch {
    return false;
  }
}

function detectTargetDir() {
  const cwd = process.cwd();

  if (isEmptyDir(cwd)) {
    return { suggestion: cwd, reason: 'empty directory' };
  }

  if (isGitRepo(cwd)) {
    return { suggestion: cwd, reason: 'git repository' };
  }

  return { suggestion: null, reason: null };
}

function copyDirRecursive(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function countFiles(dir) {
  let count = 0;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      count += countFiles(path.join(dir, entry.name));
    } else {
      count++;
    }
  }
  return count;
}

async function main() {
  console.log(LOGO);

  intro(pc.bgCyan(pc.black(' squadron install ')));

  const { suggestion, reason } = detectTargetDir();

  let targetDir;

  if (suggestion) {
    log.info(`Detected ${pc.bold(reason)} at ${pc.dim(suggestion)}`);

    const dir = await text({
      message: 'Where should Squadron be installed?',
      placeholder: suggestion,
      defaultValue: suggestion,
      validate(value) {
        if (!value || value.trim().length === 0) return 'Please enter a directory path.';
      },
    });

    if (isCancel(dir)) {
      cancel('Installation cancelled.');
      process.exit(0);
    }

    targetDir = dir;
  } else {
    const dir = await text({
      message: 'Where should Squadron be installed?',
      placeholder: '/path/to/your/project',
      validate(value) {
        if (!value || value.trim().length === 0) return 'Please enter a directory path.';
      },
    });

    if (isCancel(dir)) {
      cancel('Installation cancelled.');
      process.exit(0);
    }

    targetDir = dir;
  }

  // Resolve path
  targetDir = path.resolve(targetDir);

  // Verify directory exists
  if (!fs.existsSync(targetDir)) {
    const shouldCreate = await confirm({
      message: `Directory ${pc.dim(targetDir)} does not exist. Create it?`,
    });

    if (isCancel(shouldCreate) || !shouldCreate) {
      cancel('Installation cancelled.');
      process.exit(0);
    }

    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Check if .github/agents or .github/skills already exist
  const agentsDest = path.join(targetDir, '.github', 'agents');
  const skillsDest = path.join(targetDir, '.github', 'skills');
  const agentsExist = fs.existsSync(agentsDest);
  const skillsExist = fs.existsSync(skillsDest);

  if (agentsExist || skillsExist) {
    const existing = [agentsExist && '.github/agents', skillsExist && '.github/skills'].filter(Boolean).join(' and ');
    const shouldOverwrite = await confirm({
      message: `${pc.yellow(existing)} already exists. Overwrite?`,
    });

    if (isCancel(shouldOverwrite) || !shouldOverwrite) {
      cancel('Installation cancelled.');
      process.exit(0);
    }
  }

  // Copy files
  const s = spinner();
  s.start('Installing Squadron agents and skills');

  const agentsSrc = path.join(__dirname, 'agents');
  const skillsSrc = path.join(__dirname, 'skills');

  // Small delay for dramatic effect
  await new Promise((r) => setTimeout(r, 800));

  copyDirRecursive(agentsSrc, agentsDest);
  copyDirRecursive(skillsSrc, skillsDest);

  const agentCount = countFiles(agentsSrc);
  const skillCount = countFiles(skillsSrc);

  await new Promise((r) => setTimeout(r, 400));
  s.stop('Squadron installed successfully!');

  log.success(`${pc.bold(agentCount)} agents → ${pc.dim(path.relative(process.cwd(), agentsDest) || agentsDest)}`);
  log.success(`${pc.bold(skillCount)} skills → ${pc.dim(path.relative(process.cwd(), skillsDest) || skillsDest)}`);

  outro(pc.bold(pc.green('✈  Squadron cleared for takeoff!')));
}

main().catch((err) => {
  console.error(pc.red('Error:'), err.message);
  process.exit(1);
});
