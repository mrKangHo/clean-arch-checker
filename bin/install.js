#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Command line arguments parsing
const args = process.argv.slice(2);
const isWorkspace = args.includes('--workspace') || args.includes('-w');

const homeDir = os.homedir();
const cwd = process.cwd();

// Set target installation path
const targetBaseDir = isWorkspace
  ? path.join(cwd, '.agents', 'skills')
  : path.join(homeDir, '.gemini', 'config', 'skills');

const skillName = 'clean-arch-checker';
const targetDir = path.join(targetBaseDir, skillName);
const sourceDir = path.join(__dirname, '..', 'skills', skillName);

console.log(`\n🚀 Antigravity Skill Installer`);
console.log(`----------------------------------------`);
console.log(`Target Skill: ${skillName}`);
console.log(`Install Mode: ${isWorkspace ? 'Workspace Project (.agents/skills/)' : 'Global (~/.gemini/config/skills/)'}`);

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

try {
  if (!fs.existsSync(sourceDir)) {
    throw new Error(`Source skill directory not found at: ${sourceDir}`);
  }

  copyRecursiveSync(sourceDir, targetDir);

  console.log(`\n✅ Skill successfully installed!`);
  console.log(`📍 Path: ${targetDir}\n`);
  console.log(`🎉 Next Steps:`);
  console.log(`   Open Antigravity and ask: "Check if my project follows Clean Architecture principles"\n`);
} catch (err) {
  console.error(`\n❌ Failed to install skill:`, err.message);
  process.exit(1);
}
