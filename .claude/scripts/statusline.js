#!/usr/bin/env node
const fs = require("fs");
const { execSync } = require("child_process");

// --- 辅助函数：将 Hex 色值转换为终端 TrueColor ANSI 码 ---
const hex = (hexCode) => {
  const cleanHex = hexCode.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  return `\x1b[38;2;${r};${g};${b}m`;
};

// --- 定义 Catppuccin Mocha 色板 ---
const RESET = "\x1b[0m";

const colors = {
  model: hex("#89b4fa"),
  folder: hex("#fab387"),
  branch: hex("#b4befe"),
  separator: hex("#71717A"),
  costLabel: hex("#a6adc8"),
  costValue: hex("#f9e2af"),

  // 进度条状态色
  ctxSafe: hex("#a6e3a1"), // Green
  ctxWarn: hex("#f9e2af"), // Yellow
  ctxAlert: hex("#f38ba8"), // Red
};

const icons = {
  ai: "\uee0d",
  git: "\uf1d2",
  gitbranch: "\uf418",
  react: "\ue7ba",
  vue: "\ue6a0",
  node: "\ued0d",
  typescript: "\ue8ca",
  python: "\ue73c",
  dollar: "\uef8d",
  folder: "\ue5fa",
  context: "\uf051a",
  sparkle: "\uec10",
};

try {
  const input = fs.readFileSync(0, "utf-8");
  if (!input) process.exit(0);

  const data = JSON.parse(input);

  // 1. 提取与处理模型名称
  const model = data.model?.display_name || "Unknown";

  // 2. 提取上下文与成本
  const contextPct = Math.round(data.context_window?.used_percentage || 0);
  const cost = data.cost?.total_cost_usd
    ? data.cost.total_cost_usd.toFixed(3)
    : "0.000";

  // 3. 提取工作区与 Git 分支
  const cwd = data.workspace?.current_dir || process.cwd();
  const folderName = cwd.split(/[\/\\]/).pop();

  let branch = "";
  try {
    const rawBranch = execSync("git branch --show-current", {
      encoding: "utf8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();
    if (rawBranch) {
      branch = `${icons.gitbranch} ${rawBranch}`;
    }
  } catch {}

  // 4. 动态计算上下文颜色与进度条
  let ctxColor = colors.ctxSafe;
  if (contextPct >= 70) ctxColor = colors.ctxWarn;
  if (contextPct >= 90) ctxColor = colors.ctxAlert;

  const filled = Math.floor(contextPct / 10);
  const bar = "█".repeat(filled) + "░".repeat(10 - filled);

  // 5. 组装富文本状态栏
  const parts = [
    `${colors.model}${icons.ai}  ${model}${RESET}`,
    `${colors.folder}${icons.folder} ${folderName}${RESET} ${colors.separator}/ ${colors.branch}${branch}${RESET}`,
    `Ctx: ${ctxColor}${icons.sparkle} ${contextPct}% [${bar}]${RESET}`,
    `${colors.costLabel}Cost: ${colors.costValue}${icons.dollar} ${cost}${RESET}`,
  ];

  const separator = ` ${colors.separator}│${RESET} `;
  console.log(parts.join(separator));
} catch (err) {
  console.log("\x1b[2m\x1b[38;2;243;139;168m◈ StatusLine Error\x1b[0m");
}
