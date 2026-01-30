# 繧ｯ繝ｩ繧､繧｢繝ｳ繝医・繝ｭ繧ｸ繧ｧ繧ｯ繝亥髄縺・Doctor 蛻ｩ逕ｨ繧ｬ繧､繝・
譛ｬ繧ｬ繧､繝峨・縲仝ritingPage 縺ｪ縺ｩ縺ｮ繧ｯ繝ｩ繧､繧｢繝ｳ繝医・繝ｭ繧ｸ繧ｧ繧ｯ繝医〒 shared-workflows 縺ｮ `sw-doctor.js` 繧貞茜逕ｨ縺吶ｋ髫帙・謇矩・ｒ隱ｬ譏弱＠縺ｾ縺吶・
## 讎りｦ・
`sw-doctor.js` 縺ｯ縲√・繝ｭ繧ｸ繧ｧ繧ｯ繝医・迺ｰ蠅・・繧ｹ繧ｯ繝ｪ繝励ヨ繝ｻ繝ｯ繝ｼ繧ｯ繝輔Ο繝ｼ迥ｶ諷九ｒ閾ｪ蜍戊ｨｺ譁ｭ縺吶ｋ繝・・繝ｫ縺ｧ縺吶・
**驥崎ｦ・*: SSOT 繝輔ぃ繧､繝ｫ・・Windsurf_AI_Collab_Rules_latest.md`・峨・縲《hared-workflows 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺ｮ繝舌・繧ｸ繝ｧ繝ｳ縺ｫ繧医▲縺ｦ `v2.0.md` 繧・`v1.1.md` 縺九ｉ閾ｪ蜍慕噪縺ｫ `latest.md` 縺ｨ縺励※陬懷ｮ後＆繧後ｋ蝣ｴ蜷医′縺ゅｊ縺ｾ縺吶・I 縺ｯ蟶ｸ縺ｫ `latest.md` 繧偵お繝ｳ繝医Μ繝昴う繝ｳ繝医→縺励※蜿ら・縺励※縺上□縺輔＞縲ゆｻ･荳九・逕ｨ騾斐↓菴ｿ逕ｨ縺ｧ縺阪∪縺・

- **蛻晄悄繧ｻ繝・ヨ繧｢繝・・讀懆ｨｼ**: SSOT 繝輔ぃ繧､繝ｫ縺ｨ蝓ｺ譛ｬ繝・ぅ繝ｬ繧ｯ繝医Μ讒矩縺ｮ遒ｺ隱・- **螳壽悄逧・↑蛛･蜈ｨ諤ｧ繝√ぉ繝・け**: 髢狗匱荳ｭ縺ｮ逶｣譟ｻ縺ｨ逡ｰ蟶ｸ讀懃衍
- **CI/CD 邨ｱ蜷・*: GitHub Actions 縺ｪ縺ｩ縺九ｉ閾ｪ蜍戊ｨｺ譁ｭ邨先棡繧貞叙蠕・
## 繧ｻ繝・ヨ繧｢繝・・謇矩・
### Step 1: shared-workflows 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺ｮ蟆主・

繝励Ο繧ｸ繧ｧ繧ｯ繝医Ν繝ｼ繝医〒莉･荳九ｒ螳溯｡・

```bash
git submodule add https://github.com/YuShimoji/shared-workflows.git .shared-workflows
git submodule update --init --recursive
```

### Step 2: doctor 繧ｹ繧ｯ繝ｪ繝励ヨ縺ｮ遒ｺ隱・
繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ蟆主・蠕後∽ｻ･荳九・縺・★繧後°縺ｧ doctor 縺悟茜逕ｨ蜿ｯ閭ｽ縺狗｢ｺ隱・

```bash
# 譁ｹ豕・: 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ邨檎罰・域耳螂ｨ・・node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text

# 譁ｹ豕・: 繝ｭ繝ｼ繧ｫ繝ｫ繧ｳ繝斐・・医し繝悶Δ繧ｸ繝･繝ｼ繝ｫ譛ｪ蟆主・縺ｮ蝣ｴ蜷茨ｼ・cp .shared-workflows/scripts/sw-doctor.js scripts/
cp -r .shared-workflows/scripts/utils scripts/
node scripts/sw-doctor.js --profile shared-orch-bootstrap --format text
```

### Step 3: 蛻晄悄險ｺ譁ｭ縺ｮ螳溯｡・
```bash
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text
```

蜃ｺ蜉帑ｾ・

```
Shared Workflows Doctor

Project Root: /path/to/project

Profile: shared-orch-bootstrap - Bootstrap profile: check SSOT files and basic structure only

=== Environment Check ===

笨・shared-workflows detected: /path/to/project/.shared-workflows
笨・docs exists
笨・AI_CONTEXT.md exists
...

笨・Doctor check complete.
```

繧ｨ繝ｩ繝ｼ縺悟・縺溷ｴ蜷医・縲√後ヨ繝ｩ繝悶Ν繧ｷ繝･繝ｼ繝・ぅ繝ｳ繧ｰ縲阪そ繧ｯ繧ｷ繝ｧ繝ｳ繧貞盾辣ｧ縺励※縺上□縺輔＞縲・
## 繝励Ο繝輔ぃ繧､繝ｫ蛻･縺ｮ菴ｿ縺・・縺・
### `shared-orch-bootstrap` (蛻晄悄繧ｻ繝・ヨ繧｢繝・・逕ｨ)

SSOT 繝輔ぃ繧､繝ｫ縺ｨ蝓ｺ譛ｬ繝・ぅ繝ｬ繧ｯ繝医Μ讒矩縺ｮ縺ｿ繧偵メ繧ｧ繝・け縲ょ・蝗槭そ繝・ヨ繧｢繝・・蠕後↓螳溯｡・

```bash
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text
```

**繝√ぉ繝・け蟇ｾ雎｡:**
- shared-workflows 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺ｮ蟄伜惠
- `docs/`, `docs/tasks/`, `docs/inbox/` 繝・ぅ繝ｬ繧ｯ繝医Μ
- `AI_CONTEXT.md`, `docs/HANDOVER.md`, `REPORT_CONFIG.yml`
- SSOT 繝輔ぃ繧､繝ｫ・・docs/Windsurf_AI_Collab_Rules_latest.md` 縺ｪ縺ｩ・・
### `shared-orch-doctor` (螳壽悄逧・↑逶｣譟ｻ逕ｨ)

迺ｰ蠅・+ 繧ｹ繧ｯ繝ｪ繝励ヨ + orchestrator-audit + dev-check 繧貞ｮ溯｡後る幕逋ｺ荳ｭ縺ｮ螳壽悄繝√ぉ繝・け:

```bash
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format text
```

**繝√ぉ繝・け蟇ｾ雎｡:**
- bootstrap 繝励Ο繝輔ぃ繧､繝ｫ縺ｮ蜈ｨ繝√ぉ繝・け
- 繧ｹ繧ｯ繝ｪ繝励ヨ蜿ｯ逕ｨ諤ｧ・・rchestrator-audit.js, report-validator.js 縺ｪ縺ｩ・・- orchestrator-audit.js 縺ｫ繧医ｋ蟾｡蝗樒屮譟ｻ
- dev-check.js 縺ｫ繧医ｋ髢狗匱迺ｰ蠅・ｨｺ譁ｭ

### `ci-strict` (譛ｬ逡ｪ迺ｰ蠅・畑)

蜈ｨ繝√ぉ繝・け繧貞ｮ溯｡後＠縲∬ｭｦ蜻奇ｼ・ARN・峨ｂ螟ｱ謨玲桶縺・ゅΜ繝ｪ繝ｼ繧ｹ蜑阪・蜴ｳ蟇・メ繧ｧ繝・け:

```bash
node .shared-workflows/scripts/sw-doctor.js --profile ci-strict --format text
```

## JSON 蜃ｺ蜉帙Δ繝ｼ繝会ｼ・I 騾｣謳ｺ逕ｨ・・
GitHub Actions 縺ｪ縺ｩ縺九ｉ讖滓｢ｰ蜿ｯ隱ｭ縺ｪ邨先棡繧貞叙蠕・

```bash
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format json
```

蜃ｺ蜉帑ｾ・

```json
{
  "projectRoot": "/path/to/project",
  "profile": "shared-orch-doctor",
  "profileDescription": "Doctor profile: full environment + audit + dev-check",
  "summary": {
    "issues": [],
    "warnings": []
  },
  "results": {
    "environment": [...],
    "scripts": [...],
    "audit": [...],
    "devCheck": [...]
  }
}
```

## GitHub Actions 縺ｧ縺ｮ蛻ｩ逕ｨ

`.github/workflows/doctor-check.yml` 繧剃ｽ懈・:

```yaml
name: Doctor Health Check

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  doctor-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: recursive

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Run Doctor Bootstrap Check
        run: |
          node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format json > doctor-bootstrap.json
          ISSUES=$(jq '.summary.issues | length' doctor-bootstrap.json)
          if [ "$ISSUES" -gt 0 ]; then
            echo "笶・Bootstrap check failed"
            cat doctor-bootstrap.json
            exit 1
          fi
          echo "笨・Bootstrap check passed"

      - name: Run Doctor Full Check
        run: |
          node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format json > doctor-full.json
          ISSUES=$(jq '.summary.issues | length' doctor-full.json)
          if [ "$ISSUES" -gt 0 ]; then
            echo "笶・Full check failed"
            cat doctor-full.json
            exit 1
          fi
          echo "笨・Full check passed"
```

隧ｳ邏ｰ縺ｯ `docs/CI_INTEGRATION.md` 繧貞盾辣ｧ縲・
## 繧ｫ繧ｹ繧ｿ繝險ｭ螳・
繝励Ο繧ｸ繧ｧ繧ｯ繝亥崋譛峨・ doctor 險ｭ螳壹ｒ陦後＞縺溘＞蝣ｴ蜷医・縲√・繝ｭ繧ｸ繧ｧ繧ｯ繝医Ν繝ｼ繝医↓ `.doctorrc.js` 繧帝・鄂ｮ:

```javascript
module.exports = {
  profiles: {
    'my-project-check': {
      description: 'Custom profile for my project',
      checks: ['env.*', 'script.*'],
      severityPolicy: {
        ERROR: 'fail',
        WARN: 'warn',
        OK: 'pass'
      },
      runAudit: true,
      runDevCheck: false
    }
  }
};
```

繝・Φ繝励Ξ繝ｼ繝医・ `.shared-workflows/templates/.doctorrc.example.js` 繧貞盾辣ｧ縲・
## 繝医Λ繝悶Ν繧ｷ繝･繝ｼ繝・ぅ繝ｳ繧ｰ

### doctor 繧ｹ繧ｯ繝ｪ繝励ヨ縺瑚ｦ九▽縺九ｉ縺ｪ縺・
```bash
# 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ迥ｶ諷九ｒ遒ｺ隱・git submodule status

# 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ繧貞・蛻晄悄蛹・git submodule sync --recursive
git submodule update --init --recursive --remote
```

### 迺ｰ蠅・メ繧ｧ繝・け縺悟､ｱ謨励☆繧・
```bash
# 隧ｳ邏ｰ繧堤｢ｺ隱・node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text

# 荳崎ｶｳ縺励※縺・ｋ繝輔ぃ繧､繝ｫ/繝・ぅ繝ｬ繧ｯ繝医Μ繧呈焔蜍穂ｽ懈・
mkdir -p docs/tasks docs/inbox
touch docs/tasks/.gitkeep docs/inbox/.gitkeep
```

### JSON 繝代・繧ｹ繧ｨ繝ｩ繝ｼ

```bash
# stderr 繧堤｢ｺ隱・node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format json 2>&1 | head -20

# doctor 縺梧ｭ｣蟶ｸ縺ｫ邨ゆｺ・＠縺ｦ縺・ｋ縺狗｢ｺ隱・node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format json
echo "Exit code: $?"
```

### 繧ｹ繧ｯ繝ｪ繝励ヨ螳溯｡梧ｨｩ髯舌お繝ｩ繝ｼ

Windows PowerShell 縺ｮ蝣ｴ蜷・

```powershell
# Node.js 縺悟茜逕ｨ蜿ｯ閭ｽ縺狗｢ｺ隱・node --version

# 繧ｹ繧ｯ繝ｪ繝励ヨ螳溯｡後・繝ｪ繧ｷ繝ｼ繧堤｢ｺ隱・Get-ExecutionPolicy

# 蠢・ｦ√↓蠢懊§縺ｦ繝昴Μ繧ｷ繝ｼ繧貞､画峩
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

## 繧医￥縺ゅｋ雉ｪ蝠・
### Q: doctor 繧呈ｯ取律螳溯｡後☆繧句ｿ・ｦ√′縺ゅｋ縺具ｼ・
A: 謗ｨ螂ｨ縺ｧ縺吶ら音縺ｫ莉･荳九・繧ｿ繧､繝溘Φ繧ｰ縺ｧ螳溯｡後＠縺ｦ縺上□縺輔＞:
- PR 菴懈・譎・- main 繝悶Λ繝ｳ繝√∈縺ｮ繝槭・繧ｸ蜑・- CI/CD 繝代う繝励Λ繧､繝ｳ縺ｮ螳壽悄螳溯｡鯉ｼ井ｾ・ 豈取律 09:00・・
### Q: doctor 縺ｮ邨先棡縺ｫ蝓ｺ縺･縺・※閾ｪ蜍穂ｿｮ蠕ｩ縺ｧ縺阪ｋ縺具ｼ・
A: 迴ｾ蝨ｨ縺ｯ險ｺ譁ｭ縺ｮ縺ｿ縺ｧ縺吶ゆｿｮ蠕ｩ縺ｯ莉･荳九・繧ｹ繧ｯ繝ｪ繝励ヨ繧呈焔蜍募ｮ溯｡後＠縺ｦ縺上□縺輔＞:
- `node .shared-workflows/scripts/ensure-ssot.js --no-fail` (SSOT 繝輔ぃ繧､繝ｫ陬懷ｮ・
- `node .shared-workflows/scripts/orchestrator-audit.js --no-fail` (蟾｡蝗樒屮譟ｻ)

蟆・擂逧・↓縺ｯ閾ｪ蜍穂ｿｮ蠕ｩ讖溯・縺ｮ霑ｽ蜉繧剃ｺ亥ｮ壹＠縺ｦ縺・∪縺吶・
### Q: 莉悶・繝ｭ繧ｸ繧ｧ繧ｯ繝医〒 doctor 繧偵き繧ｹ繧ｿ繝槭う繧ｺ縺ｧ縺阪ｋ縺具ｼ・
A: 縺ｯ縺・Ａ.doctorrc.js` 縺ｧ繝励Ο繝輔ぃ繧､繝ｫ繧・き繧ｹ繧ｿ繝 Check/Fix 繧貞ｮ夂ｾｩ縺ｧ縺阪∪縺吶りｩｳ邏ｰ縺ｯ縲後き繧ｹ繧ｿ繝險ｭ螳壹阪そ繧ｯ繧ｷ繝ｧ繝ｳ繧貞盾辣ｧ縲・
## 蜿り・ｳ・侭

- `docs/CI_INTEGRATION.md` - CI/CD 邨ｱ蜷医ぎ繧､繝・- `docs/ARCH_DOCTOR_DESIGN.md` - Doctor 繧｢繝ｼ繧ｭ繝・け繝√Ε險ｭ險・- `.shared-workflows/templates/.doctorrc.example.js` - 險ｭ螳壹ヵ繧｡繧､繝ｫ繝・Φ繝励Ξ繝ｼ繝・- `docs/Windsurf_AI_Collab_Rules_latest.md` - 荳ｭ螟ｮ繝ｫ繝ｼ繝ｫ・・SOT・・
