#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Command line arguments parsing
const args = process.argv.slice(2);
const isWorkspace = args.includes('--workspace') || args.includes('-w');

const homeDir = os.homedir();
const cwd = process.cwd();

const skillName = 'clean-arch-checker';
const sourceDir = path.join(__dirname, '..', 'skills', skillName);

console.log(`\n🚀 Universal AI Agent Skill Installer`);
console.log(`----------------------------------------`);
console.log(`Target Skill: ${skillName}`);
console.log(`Install Mode: ${isWorkspace ? 'Workspace Project' : 'Global (User Home)'}`);

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

// Define target directories for various AI Agents (Antigravity, Claude Code, Cursor, etc.)
let targetDirs = [];

if (isWorkspace) {
  targetDirs = [
    path.join(cwd, '.agents', 'skills', skillName),    // Antigravity & Generic Agents
    path.join(cwd, '.claude', 'skills', skillName),    // Claude Code
    path.join(cwd, '.cursor', 'skills', skillName)     // Cursor
  ];
} else {
  targetDirs = [
    path.join(homeDir, '.gemini', 'config', 'skills', skillName), // Antigravity Global
    path.join(homeDir, '.claude', 'skills', skillName),          // Claude Code Global
    path.join(homeDir, '.cursor', 'skills', skillName)           // Cursor Global
  ];
}

try {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Source skill directory not found at: ${sourceDir}`);
  }

  const installedPaths = [];
  targetDirs.forEach((targetDir) => {
    try {
      copyRecursiveSync(sourceDir, targetDir);
      installedPaths.push(targetDir);
    } catch (err) {
      // Ignore directory creation issues if any specific path fails
    }
  });

  // If workspace mode, also add reference in CLAUDE.md for Claude Code
  if (isWorkspace) {
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

  console.log(`\n✅ Skill successfully installed for AI Agents!`);
  installedPaths.forEach((p) => console.log(` 📍 Path: ${p}`));

  console.log(`\n🎉 Installed for AI Agents:`);
  console.log(`   - Antigravity (~/.gemini/config/skills/ or .agents/skills/)`);
  console.log(`   - Claude Code (~/.claude/skills/ or .claude/skills/)`);
  console.log(`   - Cursor (~/.cursor/skills/ or .cursor/skills/)`);
  console.log(`\n👉 Next Steps: Ask your AI Agent: "Check if my project follows Clean Architecture principles"\n`);

} catch (err) {
  console.error(`\n❌ Failed to install skill:`, err.message);
  process.exit(1);
}
