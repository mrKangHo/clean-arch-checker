#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');
const readline = require('readline');

const args = process.argv.slice(2);
const homeDir = os.homedir();
const cwd = process.cwd();

const skillName = 'clean-arch-checker';
const sourceDir = path.join(__dirname, '..', 'skills', skillName);

// Flags for non-interactive / CI run
const isYes = args.includes('-y') || args.includes('--yes') || args.includes('--all');
const isWorkspaceFlag = args.includes('--workspace') || args.includes('-w');
const isGlobalFlag = args.includes('--global') || args.includes('-g');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => rl.question(query, (ans) => {
    rl.close();
    resolve(ans.trim());
  }));
}

async function main() {
  console.log(`\n🛡️  Clean Architecture Checker Skill Installer`);
  console.log(`=================================================`);

  let isWorkspace = isWorkspaceFlag;
  if (!isWorkspaceFlag && !isGlobalFlag && !isYes) {
    console.log(`\n📌 [Step 1/2] Select Installation Scope:`);
    console.log(`  1) Global    (All projects on your machine - Recommended)`);
    console.log(`  2) Workspace (Current project repository only)`);
    const scopeChoice = await askQuestion(`👉 Enter choice (1-2) [Default: 1]: `);
    if (scopeChoice === '2') {
      isWorkspace = true;
    }
  }

  let selectedAgents = ['all'];
  if (!isYes) {
    console.log(`\n🤖 [Step 2/2] Select AI Agent(s) to install for:`);
    console.log(`  1) All AI Agents (Claude Code, Antigravity, Cursor) - Recommended`);
    console.log(`  2) Claude Code   (~/.claude/skills/ or .claude/skills/)`);
    console.log(`  3) Antigravity   (~/.gemini/config/skills/ or .agents/skills/)`);
    console.log(`  4) Cursor        (~/.cursor/skills/ or .cursor/skills/)`);
    const agentChoice = await askQuestion(`👉 Enter choice (1-4) [Default: 1]: `);
    
    if (agentChoice === '2') selectedAgents = ['claude'];
    else if (agentChoice === '3') selectedAgents = ['antigravity'];
    else if (agentChoice === '4') selectedAgents = ['cursor'];
  }

  console.log(`\n🚀 Installing ${skillName} skill...`);
  console.log(`-------------------------------------------------`);

  const installedPaths = [];
  const targets = [];
  const installAll = selectedAgents.includes('all');

  if (isWorkspace) {
    if (installAll || selectedAgents.includes('antigravity')) {
      targets.push({ name: 'Antigravity Workspace', path: path.join(cwd, '.agents', 'skills', skillName) });
    }
    if (installAll || selectedAgents.includes('claude')) {
      targets.push({ name: 'Claude Code Workspace', path: path.join(cwd, '.claude', 'skills', skillName) });
      
      // Auto link in CLAUDE.md for Claude Code
      const claudeMdPath = path.join(cwd, 'CLAUDE.md');
      const skillRef = `\n\n## Clean Architecture Checker Skill\nSee instructions in [.claude/skills/clean-arch-checker/SKILL.md](.claude/skills/clean-arch-checker/SKILL.md)\n`;
      if (!fs.existsSync(claudeMdPath)) {
        fs.writeFileSync(claudeMdPath, `# Project Guidelines${skillRef}`);
      } else {
        const existing = fs.readFileSync(claudeMdPath, 'utf8');
        if (!existing.includes('clean-arch-checker')) {
          fs.appendFileSync(claudeMdPath, skillRef);
        }
      }
    }
    if (installAll || selectedAgents.includes('cursor')) {
      targets.push({ name: 'Cursor Workspace', path: path.join(cwd, '.cursor', 'skills', skillName) });
    }
  } else {
    if (installAll || selectedAgents.includes('antigravity')) {
      targets.push({ name: 'Antigravity Global', path: path.join(homeDir, '.gemini', 'config', 'skills', skillName) });
    }
    if (installAll || selectedAgents.includes('claude')) {
      targets.push({ name: 'Claude Code Global', path: path.join(homeDir, '.claude', 'skills', skillName) });
    }
    if (installAll || selectedAgents.includes('cursor')) {
      targets.push({ name: 'Cursor Global', path: path.join(homeDir, '.cursor', 'skills', skillName) });
    }
  }

  targets.forEach((t) => {
    try {
      copyRecursiveSync(sourceDir, t.path);
      console.log(` ✅ Installed for ${t.name.padEnd(22)} -> ${t.path}`);
      installedPaths.push(t.path);
    } catch (err) {
      console.error(` ❌ Failed to install for ${t.name}:`, err.message);
    }
  });

  console.log(`\n🎉 Skill installation successfully completed!`);
  console.log(`👉 Open your AI Agent and ask: "Check if my project follows Clean Architecture principles"\n`);
}

main().catch((err) => {
  console.error(`\n❌ Installation error:`, err.message);
  process.exit(1);
});
