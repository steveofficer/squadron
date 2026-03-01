#!/usr/bin/env node

import { intro, outro, text, confirm, select, spinner, log, cancel, isCancel } from '@clack/prompts';
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

// Task 001: Stack skill file generation utilities

function toKebabName(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

function writeLayerSkillFile(targetDir, layerName, technology, libraries) {
  const kebabLayerName = toKebabName(layerName);
  const dirPath = path.join(targetDir, '.github', 'skills', `${kebabLayerName}-stack`);
  fs.mkdirSync(dirPath, { recursive: true });

  let content = `\`\`\`\`skill\n---\nname: ${kebabLayerName}-stack\ndescription: Technology stack for the ${layerName} layer of this project.\n---\n\n# ${layerName} Stack\n\n## Technology\n${technology}\n`;
  if (libraries && libraries.trim()) {
    content += `\n## Key Libraries\n${libraries}\n`;
  }
  content += `\`\`\`\`\n`;

  fs.writeFileSync(path.join(dirPath, 'SKILL.md'), content);
}

function writeProjectStacksIndex(targetDir, layers) {
  const dirPath = path.join(targetDir, '.github', 'skills', 'project-stacks');
  fs.mkdirSync(dirPath, { recursive: true });

  const lines = layers.map(({ name, kebabName }) => `- ${name}: \`.github/skills/${kebabName}-stack/SKILL.md\``).join('\n');
  const content = `\`\`\`\`skill\n---\nname: project-stacks\ndescription: Index of technology stack skills for this project. Load this first to discover tech context, then load each listed skill.\n---\n\n# Project Technology Stacks\n\nLoad all of the following skill files before implementing, testing, or reviewing code:\n\n${lines}\n\`\`\`\`\n`;

  fs.writeFileSync(path.join(dirPath, 'SKILL.md'), content);
}

// Task 005: Stack config reader

function readExistingLayers(targetDir) {
  const indexPath = path.join(targetDir, '.github', 'skills', 'project-stacks', 'SKILL.md');
  if (!fs.existsSync(indexPath)) return [];

  const content = fs.readFileSync(indexPath, 'utf8');
  const layers = [];

  const lineRegex = /^- (.+): `\.github\/skills\/(.+)-stack\/SKILL\.md`/;
  for (const line of content.split('\n')) {
    const match = line.match(lineRegex);
    if (!match) continue;
    const [, name, kebabName] = match;

    const layerPath = path.join(targetDir, '.github', 'skills', `${kebabName}-stack`, 'SKILL.md');
    if (!fs.existsSync(layerPath)) {
      layers.push({ name, kebabName, technology: '', libraries: '' });
      continue;
    }

    const layerContent = fs.readFileSync(layerPath, 'utf8');
    const techMatch = layerContent.match(/## Technology\n([^\n]+)/);
    const libsMatch = layerContent.match(/## Key Libraries\n([^\n]+)/);

    layers.push({
      name,
      kebabName,
      technology: techMatch ? techMatch[1].trim() : '',
      libraries: libsMatch ? libsMatch[1].trim() : '',
    });
  }

  return layers;
}

// Task 004: Shared target directory resolution

async function resolveTargetDir() {
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

  targetDir = path.resolve(targetDir);

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

  return targetDir;
}

// Task 002: Tech stack collection prompts

async function collectTechStack() {
  const layers = [];
  const predefined = ['Frontend', 'Backend', 'Database', 'Mobile', 'Infrastructure'];

  for (const layerName of predefined) {
    const has = await confirm({ message: `Does your project have a ${pc.bold(layerName)} layer?` });
    if (isCancel(has)) { cancel('Installation cancelled.'); process.exit(0); }
    if (!has) continue;

    const technology = await text({
      message: `What technology does your ${pc.bold(layerName)} use?`,
      validate(value) {
        if (!value || value.trim().length === 0) return 'Please enter a technology.';
      },
    });
    if (isCancel(technology)) { cancel('Installation cancelled.'); process.exit(0); }

    const libraries = await text({
      message: `Any key libraries for ${pc.bold(layerName)}? (optional, comma-separated)`,
    });
    if (isCancel(libraries)) { cancel('Installation cancelled.'); process.exit(0); }

    layers.push({
      name: layerName,
      kebabName: toKebabName(layerName),
      technology: String(technology),
      libraries: libraries ? String(libraries) : '',
    });
  }

  while (true) {
    const addCustom = await confirm({ message: 'Do you want to add a custom layer?' });
    if (isCancel(addCustom)) { cancel('Installation cancelled.'); process.exit(0); }
    if (!addCustom) break;

    const customName = await text({
      message: 'Custom layer name?',
      validate(value) {
        if (!value || value.trim().length === 0) return 'Please enter a layer name.';
      },
    });
    if (isCancel(customName)) { cancel('Installation cancelled.'); process.exit(0); }

    const customTech = await text({
      message: `What technology does your ${pc.bold(customName)} use?`,
      validate(value) {
        if (!value || value.trim().length === 0) return 'Please enter a technology.';
      },
    });
    if (isCancel(customTech)) { cancel('Installation cancelled.'); process.exit(0); }

    const customLibs = await text({
      message: `Any key libraries for ${pc.bold(customName)}? (optional, comma-separated)`,
    });
    if (isCancel(customLibs)) { cancel('Installation cancelled.'); process.exit(0); }

    const name = String(customName);
    layers.push({
      name,
      kebabName: toKebabName(name),
      technology: String(customTech),
      libraries: customLibs ? String(customLibs) : '',
    });
  }

  return layers;
}

// Task 006: Update menu flow

async function promptSingleLayer(existingKebabNames) {
  const predefined = ['Frontend', 'Backend', 'Database', 'Mobile', 'Infrastructure'];
  const available = predefined.filter((n) => !existingKebabNames.has(toKebabName(n)));

  const sourceOptions = [
    ...available.map((n) => ({ value: `pre:${n}`, label: n })),
    { value: 'custom', label: 'Custom layer name…' },
    { value: 'cancel', label: 'Cancel' },
  ];

  const source = await select({
    message: 'Which layer do you want to add?',
    options: sourceOptions,
  });
  if (isCancel(source) || source === 'cancel') return null;

  let layerName;
  if (String(source).startsWith('pre:')) {
    layerName = String(source).slice(4);
  } else {
    const customName = await text({
      message: 'Custom layer name?',
      validate(value) {
        if (!value || value.trim().length === 0) return 'Please enter a layer name.';
        if (existingKebabNames.has(toKebabName(value.trim()))) return 'A layer with this name already exists.';
      },
    });
    if (isCancel(customName)) { cancel('Operation cancelled.'); process.exit(0); }
    layerName = String(customName).trim();
  }

  const technology = await text({
    message: `What technology does your ${pc.bold(layerName)} use?`,
    validate(value) {
      if (!value || value.trim().length === 0) return 'Please enter a technology.';
    },
  });
  if (isCancel(technology)) { cancel('Operation cancelled.'); process.exit(0); }

  const libraries = await text({
    message: `Any key libraries for ${pc.bold(layerName)}? (optional, comma-separated)`,
  });
  if (isCancel(libraries)) { cancel('Operation cancelled.'); process.exit(0); }

  return {
    name: layerName,
    kebabName: toKebabName(layerName),
    technology: String(technology),
    libraries: libraries ? String(libraries) : '',
  };
}

async function runUpdateMenu(initialLayers) {
  const layers = [...initialLayers];
  const removed = [];

  if (layers.length === 0) {
    log.info('No tech stack configured yet. Let\'s add some layers.');
    const newLayers = await collectTechStack();
    return { layers: newLayers, removed: [] };
  }

  while (true) {
    const editOptions = layers.map((l) => ({ value: `edit:${l.kebabName}`, label: `Edit ${l.name}` }));
    const menuOptions = [
      ...editOptions,
      { value: 'add', label: 'Add a new layer' },
      { value: 'remove', label: 'Remove a layer' },
      { value: 'done', label: 'Done' },
    ];

    const choice = await select({
      message: 'What would you like to do?',
      options: menuOptions,
    });
    if (isCancel(choice)) { cancel('Operation cancelled.'); process.exit(0); }

    if (choice === 'done') break;

    if (String(choice).startsWith('edit:')) {
      const kebabName = String(choice).slice('edit:'.length);
      const layer = layers.find((l) => l.kebabName === kebabName);

      const newTech = await text({
        message: `What technology does your ${pc.bold(layer.name)} use?`,
        defaultValue: layer.technology,
        validate(value) {
          if (!value || value.trim().length === 0) return 'Please enter a technology.';
        },
      });
      if (isCancel(newTech)) { cancel('Operation cancelled.'); process.exit(0); }

      const newLibs = await text({
        message: `Any key libraries for ${pc.bold(layer.name)}? (optional, comma-separated)`,
        defaultValue: layer.libraries,
      });
      if (isCancel(newLibs)) { cancel('Operation cancelled.'); process.exit(0); }

      layer.technology = String(newTech);
      layer.libraries = newLibs ? String(newLibs) : '';

    } else if (choice === 'add') {
      const existingKebabNames = new Set(layers.map((l) => l.kebabName));
      const newLayer = await promptSingleLayer(existingKebabNames);
      if (newLayer) layers.push(newLayer);

    } else if (choice === 'remove') {
      const removeOptions = layers.map((l) => ({ value: l.kebabName, label: l.name }));
      const toRemove = await select({
        message: 'Which layer do you want to remove?',
        options: removeOptions,
      });
      if (isCancel(toRemove)) { cancel('Operation cancelled.'); process.exit(0); }

      const removeLayer = layers.find((l) => l.kebabName === toRemove);
      const confirmed = await confirm({
        message: `Remove ${removeLayer.name}? This will delete its skill file.`,
      });
      if (isCancel(confirmed)) { cancel('Operation cancelled.'); process.exit(0); }

      if (confirmed) {
        const idx = layers.indexOf(removeLayer);
        layers.splice(idx, 1);
        removed.push(removeLayer.kebabName);

        if (layers.length === 0) {
          log.warn('All layers removed. No tech stack will be configured.');
        }
      }
    }
  }

  return { layers, removed };
}

async function main() {
  console.log(LOGO);

  intro(pc.bgCyan(pc.black(' squadron install ')));

  const targetDir = await resolveTargetDir();

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

  // Task 002/003: Collect tech stack configuration (after overwrite confirmation)
  const layers = await collectTechStack();

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

  // Task 003: Write tech stack skill files inside the same install block
  if (layers.length > 0) {
    for (const layer of layers) {
      writeLayerSkillFile(targetDir, layer.name, layer.technology, layer.libraries);
    }
    writeProjectStacksIndex(targetDir, layers);
  }

  await new Promise((r) => setTimeout(r, 400));
  s.stop('Squadron installed successfully!');

  log.success(`${pc.bold(agentCount)} agents → ${pc.dim(path.relative(process.cwd(), agentsDest) || agentsDest)}`);
  log.success(`${pc.bold(skillCount)} skills → ${pc.dim(path.relative(process.cwd(), skillsDest) || skillsDest)}`);

  if (layers.length > 0) {
    log.success(`${pc.bold(layers.length)} tech stack layers configured`);
  } else {
    log.info('No tech stack configured. Run `squadron update` to add it later.');
  }

  outro(pc.bold(pc.green('✈  Squadron cleared for takeoff!')));
}

// Task 007: Complete update function

async function update() {
  intro(pc.bgCyan(pc.black(' squadron update ')));

  const targetDir = await resolveTargetDir();
  const existingLayers = readExistingLayers(targetDir);

  const { layers, removed } = await runUpdateMenu(existingLayers);

  const s = spinner();
  s.start('Updating tech stack configuration...');

  for (const kebabName of removed) {
    try {
      fs.rmSync(path.join(targetDir, '.github', 'skills', `${kebabName}-stack`), { recursive: true, force: true });
    } catch (err) {
      log.warn(`Could not remove ${kebabName}-stack directory: ${err.message}`);
    }
  }

  for (const layer of layers) {
    writeLayerSkillFile(targetDir, layer.name, layer.technology, layer.libraries);
  }

  if (layers.length > 0) {
    writeProjectStacksIndex(targetDir, layers);
  } else {
    try {
      fs.rmSync(path.join(targetDir, '.github', 'skills', 'project-stacks'), { recursive: true, force: true });
    } catch (err) {
      log.warn(`Could not remove project-stacks directory: ${err.message}`);
    }
  }

  s.stop('Tech stack updated!');

  for (const layer of layers) {
    log.success(`${layer.name} layer configured`);
  }
  for (const kebabName of removed) {
    log.warn(`${kebabName} layer removed`);
  }
  if (layers.length === 0) {
    log.info('No tech stack configured. Add layers anytime by running `squadron update` again.');
  }

  outro(pc.bold(pc.green('✈  Tech stack updated!')));
}

// Task 004: Dispatcher

const subcommand = process.argv[2];
if (subcommand === 'update') {
  update().catch((err) => { console.error(pc.red('Error:'), err.message); process.exit(1); });
} else if (!subcommand) {
  main().catch((err) => { console.error(pc.red('Error:'), err.message); process.exit(1); });
} else {
  console.error(pc.red(`Unknown subcommand: ${subcommand}`));
  console.error(`Usage: squadron [update]`);
  process.exit(1);
}
