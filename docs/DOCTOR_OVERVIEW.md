# Doctor Overview - 邨ｱ蜷郁ｨｺ譁ｭ繝・・繝ｫ

## 讎りｦ・
`sw-doctor.js` 縺ｯ縲《hared-workflows 繝励Ο繧ｸ繧ｧ繧ｯ繝医♀繧医・繧ｯ繝ｩ繧､繧｢繝ｳ繝医・繝ｭ繧ｸ繧ｧ繧ｯ繝医・迺ｰ蠅・・繧ｹ繧ｯ繝ｪ繝励ヨ繝ｻ繝ｯ繝ｼ繧ｯ繝輔Ο繝ｼ迥ｶ諷九ｒ閾ｪ蜍戊ｨｺ譁ｭ縺吶ｋ繝・・繝ｫ縺ｧ縺吶・
## 荳ｻ縺ｪ迚ｹ蠕ｴ

- **繝励Ο繝輔ぃ繧､繝ｫ繝吶・繧ｹ縺ｮ險ｺ譁ｭ**: 逕ｨ騾斐↓蠢懊§縺ｦ 4 縺､縺ｮ繝励Ο繝輔ぃ繧､繝ｫ縺九ｉ驕ｸ謚槫庄閭ｽ
- **讒矩蛹門・蜉・*: JSON/Text 蠖｢蠑上〒讖滓｢ｰ蜿ｯ隱ｭ縺ｪ險ｺ譁ｭ邨先棡繧呈署萓・- **CI/CD 邨ｱ蜷・*: GitHub Actions 縺ｪ縺ｩ縺九ｉ閾ｪ蜍募ｮ溯｡悟庄閭ｽ
- **諡｡蠑ｵ蜿ｯ閭ｽ**: 繧ｫ繧ｹ繧ｿ繝繝励Ο繝輔ぃ繧､繝ｫ繧・メ繧ｧ繝・け髢｢謨ｰ縺ｮ霑ｽ蜉縺悟ｮｹ譏・
## 繝励Ο繝輔ぃ繧､繝ｫ荳隕ｧ

### 1. `shared-orch-bootstrap`
**逕ｨ騾・*: 蛻晄悄繧ｻ繝・ヨ繧｢繝・・讀懆ｨｼ

SSOT 繝輔ぃ繧､繝ｫ縺ｨ蝓ｺ譛ｬ繝・ぅ繝ｬ繧ｯ繝医Μ讒矩縺ｮ縺ｿ繧偵メ繧ｧ繝・け縲ょ・蝗槭そ繝・ヨ繧｢繝・・蠕後↓螳溯｡後・
```bash
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text
```

**繝√ぉ繝・け蟇ｾ雎｡**:
- shared-workflows 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ
- `docs/`, `docs/tasks/`, `docs/inbox/` 繝・ぅ繝ｬ繧ｯ繝医Μ
- `AI_CONTEXT.md`, `docs/HANDOVER.md`, `REPORT_CONFIG.yml`
- SSOT 繝輔ぃ繧､繝ｫ

### 2. `shared-orch-doctor`
**逕ｨ騾・*: 螳壽悄逧・↑逶｣譟ｻ

迺ｰ蠅・+ 繧ｹ繧ｯ繝ｪ繝励ヨ + orchestrator-audit + dev-check 繧貞ｮ溯｡後る幕逋ｺ荳ｭ縺ｮ螳壽悄繝√ぉ繝・け縲・
```bash
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format text
```

**繝√ぉ繝・け蟇ｾ雎｡**:
- bootstrap 繝励Ο繝輔ぃ繧､繝ｫ縺ｮ蜈ｨ繝√ぉ繝・け
- 繧ｹ繧ｯ繝ｪ繝励ヨ蜿ｯ逕ｨ諤ｧ
- orchestrator-audit.js 縺ｫ繧医ｋ蟾｡蝗樒屮譟ｻ
- dev-check.js 縺ｫ繧医ｋ髢狗匱迺ｰ蠅・ｨｺ譁ｭ

### 3. `ci-strict`
**逕ｨ騾・*: 譛ｬ逡ｪ迺ｰ蠅・畑縺ｮ蜴ｳ蟇・メ繧ｧ繝・け

蜈ｨ繝√ぉ繝・け繧貞ｮ溯｡後＠縲∬ｭｦ蜻奇ｼ・ARN・峨ｂ螟ｱ謨玲桶縺・ゅΜ繝ｪ繝ｼ繧ｹ蜑阪・蜴ｳ蟇・メ繧ｧ繝・け縲・
```bash
node .shared-workflows/scripts/sw-doctor.js --profile ci-strict --format text
```

**繝√ぉ繝・け蟇ｾ雎｡**:
- shared-orch-doctor 繝励Ο繝輔ぃ繧､繝ｫ縺ｮ蜈ｨ繝√ぉ繝・け
- 隴ｦ蜻翫ｂ螟ｱ謨玲桶縺・ｼ・everityPolicy: WARN 竊・fail・・
### 4. `report-validation`
**逕ｨ騾・*: 繝ｬ繝昴・繝域､懆ｨｼ

HANDOVER.md 縺ｨ AI_CONTEXT.md 縺ｮ讀懆ｨｼ縲ゅΞ繝昴・繝亥刀雉ｪ遒ｺ隱阪・
```bash
node .shared-workflows/scripts/sw-doctor.js --profile report-validation --format text
```

**繝√ぉ繝・け蟇ｾ雎｡**:
- 迺ｰ蠅・メ繧ｧ繝・け
- 繧ｹ繧ｯ繝ｪ繝励ヨ蜿ｯ逕ｨ諤ｧ
- report-validator.js 縺ｫ繧医ｋ HANDOVER.md 讀懆ｨｼ
- todo-leak-preventer.js 縺ｫ繧医ｋ AI_CONTEXT.md 繝舌ャ繧ｯ繝ｭ繧ｰ讀懆ｨｼ

## 蜃ｺ蜉帛ｽ｢蠑・
### Text 蠖｢蠑擾ｼ医ョ繝輔か繝ｫ繝茨ｼ・
```
Shared Workflows Doctor

Project Root: /path/to/project

Profile: shared-orch-doctor - Doctor profile: full environment + audit + dev-check

=== Environment Check ===

笨・shared-workflows detected: /path/to/project
笨・docs exists
...

=== Repair Suggestions ===

笨・No issues detected. System is healthy.

笨・Doctor check complete.
```

### JSON 蠖｢蠑・
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

## 蛻ｩ逕ｨ繧ｷ繝ｼ繝ｳ

### 蛻晄悄繧ｻ繝・ヨ繧｢繝・・譎・```bash
# PROJECT_KICKSTART.txt 螳溯｡悟ｾ・node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text
```

### 髢狗匱荳ｭ縺ｮ螳壽悄繝√ぉ繝・け
```bash
# 豈取律縺ｮ髢句ｧ区凾縲√∪縺溘・ PR 菴懈・蜑・node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-doctor --format text
```

### CI/CD 繝代う繝励Λ繧､繝ｳ
```bash
# GitHub Actions 繝ｯ繝ｼ繧ｯ繝輔Ο繝ｼ蜀・node .shared-workflows/scripts/sw-doctor.js --profile ci-strict --format json
```

### 繝ｬ繝昴・繝域､懆ｨｼ
```bash
# HANDOVER.md 譖ｴ譁ｰ蠕・node .shared-workflows/scripts/sw-doctor.js --profile report-validation --format text
```

## 蜀・Κ API・医・繝ｭ繧ｰ繝ｩ繝槭ユ繧｣繝・け蛻ｩ逕ｨ・・
`sw-doctor.js` 縺ｯ莉･荳九・髢｢謨ｰ繧貞､夜Κ縺九ｉ蛻ｩ逕ｨ蜿ｯ閭ｽ:

```javascript
const {
  checkEnvironment,
  checkScripts,
  runAudit,
  runDevCheck,
  runReportValidation,
  runTodoCheck,
  runAllChecks,
  createCheckResult,
  doctorProfiles
} = require('./scripts/sw-doctor.js');

// 萓・ 蜈ｨ繝√ぉ繝・け繧貞ｮ溯｡・const result = runAllChecks(projectRoot, 'shared-orch-doctor', { quiet: false });
console.log(result.summary);
```

## CheckResult 讒矩

蜈ｨ繝√ぉ繝・け邨先棡縺ｯ莉･荳九・讒矩縺ｧ霑斐＆繧後ｋ:

```javascript
{
  id: 'env.required-dir',           // 繝√ぉ繝・け ID
  severity: 'OK|WARN|ERROR',        // 驥崎ｦ∝ｺｦ
  message: 'docs exists',           // 繝｡繝・そ繝ｼ繧ｸ
  context: {                        // 繧ｳ繝ｳ繝・く繧ｹ繝域ュ蝣ｱ
    dir: 'docs',
    path: '/full/path/to/docs'
  }
}
```

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

## 蜿り・ｳ・侭

- `docs/CLIENT_PROJECT_DOCTOR_GUIDE.md` - 繧ｯ繝ｩ繧､繧｢繝ｳ繝医・繝ｭ繧ｸ繧ｧ繧ｯ繝亥髄縺大茜逕ｨ繧ｬ繧､繝・- `docs/CI_INTEGRATION.md` - CI/CD 邨ｱ蜷医ぎ繧､繝・- `docs/ARCH_DOCTOR_DESIGN.md` - 繧｢繝ｼ繧ｭ繝・け繝√Ε險ｭ險・- `.github/workflows/doctor-health-check.yml` - GitHub Actions 繝ｯ繝ｼ繧ｯ繝輔Ο繝ｼ萓・- `templates/.doctorrc.example.js` - 繧ｫ繧ｹ繧ｿ繝險ｭ螳壹ヵ繧｡繧､繝ｫ繝・Φ繝励Ξ繝ｼ繝・
## 莉雁ｾ後・諡｡蠑ｵ莠亥ｮ・
- `.doctorrc.js` 縺ｮ繧ｵ繝昴・繝茨ｼ医き繧ｹ繧ｿ繝繝励Ο繝輔ぃ繧､繝ｫ繝ｻCheck/Fix 縺ｮ霑ｽ蜉・・- 繝励Λ繧ｰ繧､繝ｳ繧ｷ繧ｹ繝・Β縺ｮ謨ｴ蛯・- 閾ｪ蜍穂ｿｮ蠕ｩ讖溯・縺ｮ霑ｽ蜉
- npm 繝代ャ繧ｱ繝ｼ繧ｸ蛹・
