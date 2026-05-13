# 运行时与依赖管理

## 运行时

- **Node 24**（最新 current/LTS）。`engines.node >= 24`。
- 用 Node 原生 `--env-file=.env` 加载环境变量，**不引入** dotenv 包。
- 包管理统一 pnpm；`packageManager` 字段固定为最新 pnpm。

## 加新依赖

1. 先按 [[docs-lookup]] 查包的当前主版本和 breaking changes
2. 写进 `apps/<which>/package.json` 时用 `^<latest>`，不固定到补丁版
3. `pnpm install` 后立刻 `npx taze -r` 确认没有未应用的更新

## 依赖版本升级（taze）

参考：<https://github.com/antfu-collective/taze>

### 常用命令

```bash
# 检查（不写入）
npx taze              # 范围内升级（^/~ 内）
npx taze major        # 含跨 major（breaking）
npx taze minor        # 到 minor
npx taze patch        # 到 patch
npx taze -r           # monorepo 递归扫所有 package.json（本项目必加 -r）

# 写入 package.json
npx taze -r --write
npx taze major -r --write

# 常用 flags
--include <pkg,...>             # 只检查指定包（支持 regex / 逗号分隔）
--exclude <pkg,...>             # 排除包
-l, --include-locked            # 显示没有 ^ ~ 的固定版本
--maturity-period <days>        # 新版本发布 N 天后才推荐（默认 7，避雷刚发的 bug）
--force                         # 跳过缓存，强制拉最新
```

### 标准升级流程

1. `npx taze major -r`（**不带 --write**）看一眼能升的包
2. 对每个跨 major 的包，**先按 [[docs-lookup]] 拉迁移指南**，决定是否升
3. 列表确定后：`npx taze -r --write --include <a,b,c>` 精准写入
4. `pnpm install` → `pnpm dev` 跑通 + 命中关键 Example 验证
5. 单独 commit，message 写 `chore(deps): bump X from a → b`

### 可选：固化策略

仓库根可放 `taze.config.js` 固定策略（例如某包锁 minor、某包跟 latest）。**v1 阶段先用命令行**，模块铺开后再视情况引入配置文件。
