# CI Integration Guide for Doctor

## 讎りｦ・
`sw-doctor.js` 縺ｯ JSON 蜃ｺ蜉帙Δ繝ｼ繝会ｼ・--format json`・峨↓繧医ｊ縲，I/CD 繝代う繝励Λ繧､繝ｳ縺九ｉ讖滓｢ｰ蜿ｯ隱ｭ縺ｪ險ｺ譁ｭ邨先棡繧貞叙蠕励〒縺阪∪縺吶・
縺薙・繧ｬ繧､繝峨〒縺ｯ縲；itHub Actions 繧剃ｾ九↓縲‥octor 繧・CI 縺ｫ邨ｱ蜷医☆繧区婿豕輔ｒ隱ｬ譏弱＠縺ｾ縺吶・
## GitHub Actions 縺ｧ縺ｮ蛻ｩ逕ｨ

### 蝓ｺ譛ｬ逧・↑繝ｯ繝ｼ繧ｯ繝輔Ο繝ｼ萓・
```yaml
name: Doctor Health Check

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]
  schedule:
    # 豈取律 09:00 UTC 縺ｫ螳溯｡・    - cron: '0 9 * * *'

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
        id: bootstrap
        run: |
          node scripts/sw-doctor.js --profile shared-orch-bootstrap --format json > doctor-bootstrap.json
          cat doctor-bootstrap.json

      - name: Parse Bootstrap Results
        run: |
          ISSUES=$(jq '.summary.issues | length' doctor-bootstrap.json)
          WARNINGS=$(jq '.summary.warnings | length' doctor-bootstrap.json)
          echo "Bootstrap Issues: $ISSUES, Warnings: $WARNINGS"
          if [ "$ISSUES" -gt 0 ]; then
            echo "笶・Bootstrap check failed"
            exit 1
          fi

      - name: Run Doctor Full Check
        id: doctor
        run: |
          node scripts/sw-doctor.js --profile shared-orch-doctor --format json > doctor-full.json
          cat doctor-full.json

      - name: Upload Doctor Reports
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: doctor-reports
          path: doctor-*.json

      - name: Comment on PR
        if: github.event_name == 'pull_request' && always()
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const bootstrap = JSON.parse(fs.readFileSync('doctor-bootstrap.json', 'utf8'));
            const full = JSON.parse(fs.readFileSync('doctor-full.json', 'utf8'));
            
            const comment = `## 唱 Doctor Health Check
            
### Bootstrap Profile
- Issues: ${bootstrap.summary.issues.length}
- Warnings: ${bootstrap.summary.warnings.length}

### Full Profile
- Issues: ${full.summary.issues.length}
- Warnings: ${full.summary.warnings.length}

${bootstrap.summary.issues.length > 0 ? '笶・Bootstrap check failed' : '笨・Bootstrap check passed'}
${full.summary.issues.length > 0 ? '笶・Full check failed' : '笨・Full check passed'}
            `;
            
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

### CI Strict Profile・域悽逡ｪ迺ｰ蠅・畑・・
```yaml
  doctor-ci-strict:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          submodules: recursive

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Run Doctor CI Strict Check
        run: |
          node scripts/sw-doctor.js --profile ci-strict --format json > doctor-ci-strict.json
          cat doctor-ci-strict.json

      - name: Evaluate Results
        run: |
          ISSUES=$(jq '.summary.issues | length' doctor-ci-strict.json)
          WARNINGS=$(jq '.summary.warnings | length' doctor-ci-strict.json)
          
          if [ "$ISSUES" -gt 0 ] || [ "$WARNINGS" -gt 0 ]; then
            echo "笶・CI Strict check failed"
            jq '.summary' doctor-ci-strict.json
            exit 1
          fi
          echo "笨・All checks passed"
```

## JSON 蜃ｺ蜉帙せ繧ｭ繝ｼ繝・
doctor 縺ｮ JSON 蜃ｺ蜉帙・莉･荳九・讒矩繧呈戟縺｡縺ｾ縺・

```json
{
  "projectRoot": "/path/to/project",
  "profile": "shared-orch-doctor",
  "profileDescription": "Doctor profile: full environment + audit + dev-check",
  "summary": {
    "issues": ["issue message 1", "issue message 2"],
    "warnings": ["warning message 1"]
  },
  "results": {
    "environment": [
      {
        "id": "env.required-dir",
        "severity": "OK|WARN|ERROR",
        "message": "Human-readable message",
        "context": {
          "dir": "docs/tasks",
          "path": "/full/path/to/docs/tasks"
        }
      }
    ],
    "scripts": [...],
    "audit": [...],
    "devCheck": [...]
  }
}
```

### 邨先棡縺ｮ隗｣驥・
- **`summary.issues`**: 螟ｱ謨玲桶縺・↓縺ｪ縺｣縺溘メ繧ｧ繝・け・・xit code 1 縺ｧ邨ゆｺ・ｼ・- **`summary.warnings`**: 隴ｦ蜻頑桶縺・↓縺ｪ縺｣縺溘メ繧ｧ繝・け・・rofile 縺ｮ severityPolicy 縺ｫ萓晏ｭ假ｼ・- **`results`**: 蜈ｨ繝√ぉ繝・け邨先棡縺ｮ隧ｳ邏ｰ・・d, severity, message, context 繧貞性繧・・
## 繝励Ο繝輔ぃ繧､繝ｫ蛻･縺ｮ逕ｨ騾・
### `shared-orch-bootstrap`
- **逕ｨ騾・*: 蛻晄悄繧ｻ繝・ヨ繧｢繝・・讀懆ｨｼ縲∫腸蠅・ｺ門ｙ遒ｺ隱・- **繝√ぉ繝・け蟇ｾ雎｡**: SSOT 繝輔ぃ繧､繝ｫ縲∝渕譛ｬ繝・ぅ繝ｬ繧ｯ繝医Μ讒矩
- **謗ｨ螂ｨ螳溯｡後ち繧､繝溘Φ繧ｰ**: PR 菴懈・譎ゅ∝・蝗槭そ繝・ヨ繧｢繝・・蠕・
### `shared-orch-doctor`
- **逕ｨ騾・*: 螳壽悄逧・↑蛛･蜈ｨ諤ｧ繝√ぉ繝・け縲・幕逋ｺ荳ｭ縺ｮ逶｣譟ｻ
- **繝√ぉ繝・け蟇ｾ雎｡**: 迺ｰ蠅・+ 繧ｹ繧ｯ繝ｪ繝励ヨ + orchestrator-audit + dev-check
- **謗ｨ螂ｨ螳溯｡後ち繧､繝溘Φ繧ｰ**: 豈取律縺ｮ螳壽悄螳溯｡後￣R 繝槭・繧ｸ蜑・
### `ci-strict`
- **逕ｨ騾・*: 譛ｬ逡ｪ迺ｰ蠅・∈縺ｮ蜿肴丐蜑阪・蜴ｳ蟇・メ繧ｧ繝・け
- **繝√ぉ繝・け蟇ｾ雎｡**: 蜈ｨ繝√ぉ繝・け・・ARN 繧・fail 謇ｱ縺・ｼ・- **謗ｨ螂ｨ螳溯｡後ち繧､繝溘Φ繧ｰ**: 繝ｪ繝ｪ繝ｼ繧ｹ蜑阪［ain 繝悶Λ繝ｳ繝√∈縺ｮ繝槭・繧ｸ譎・
## 繧ｫ繧ｹ繧ｿ繝險ｭ螳・
繝励Ο繧ｸ繧ｧ繧ｯ繝亥崋譛峨・ doctor 險ｭ螳壹ｒ陦後＞縺溘＞蝣ｴ蜷医・縲√・繝ｭ繧ｸ繧ｧ繧ｯ繝医Ν繝ｼ繝医↓ `.doctorrc.js` 繧帝・鄂ｮ縺励∪縺・

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

縺昴・蠕後∽ｻ･荳九・繧ｳ繝槭Φ繝峨〒螳溯｡・

```bash
node scripts/sw-doctor.js --profile my-project-check --format json
```

## 繝医Λ繝悶Ν繧ｷ繝･繝ｼ繝・ぅ繝ｳ繧ｰ

### doctor 縺瑚ｦ九▽縺九ｉ縺ｪ縺・
```bash
# shared-workflows submodule 縺九ｉ螳溯｡・node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format json

# 縺ｾ縺溘・縲√Ο繝ｼ繧ｫ繝ｫ繧ｳ繝斐・繧貞茜逕ｨ
node scripts/sw-doctor.js --profile shared-orch-bootstrap --format json
```

### JSON 繝代・繧ｹ 繧ｨ繝ｩ繝ｼ

doctor 縺ｮ蜃ｺ蜉帙′ JSON 縺ｧ縺ｪ縺・ｴ蜷医∽ｻ･荳九ｒ遒ｺ隱・

1. `--format json` 繧ｪ繝励す繝ｧ繝ｳ縺梧欠螳壹＆繧後※縺・ｋ縺・2. stderr 縺ｫ隴ｦ蜻翫Γ繝・そ繝ｼ繧ｸ縺悟・縺ｦ縺・↑縺・°
3. doctor 繧ｹ繧ｯ繝ｪ繝励ヨ閾ｪ菴薙′繧ｨ繝ｩ繝ｼ縺ｧ邨ゆｺ・＠縺ｦ縺・↑縺・°

```bash
# 繝・ヰ繝・げ: stderr 繧堤｢ｺ隱・node scripts/sw-doctor.js --profile shared-orch-doctor --format json 2>&1 | head -20
```

### 繝励Ο繝輔ぃ繧､繝ｫ縺瑚ｦ九▽縺九ｉ縺ｪ縺・
```bash
# 蛻ｩ逕ｨ蜿ｯ閭ｽ縺ｪ繝励Ο繝輔ぃ繧､繝ｫ繧堤｢ｺ隱搾ｼ・ext 蜃ｺ蜉帙〒遒ｺ隱搾ｼ・node scripts/sw-doctor.js --profile shared-orch-doctor --format text
```

## 谺｡縺ｮ繧ｹ繝・ャ繝・
- CI 邨先棡繧・Slack 繧・ｻ悶・騾夂衍繧ｷ繧ｹ繝・Β縺ｫ騾｣謳ｺ
- doctor 縺ｮ邨先棡縺ｫ蝓ｺ縺･縺・※閾ｪ蜍穂ｿｮ蠕ｩ繧貞ｮ溯｡鯉ｼ井ｾ・ `ensure-ssot.js` 縺ｮ閾ｪ蜍募ｮ溯｡鯉ｼ・- 繧ｫ繧ｹ繧ｿ繝繝励Ο繝輔ぃ繧､繝ｫ繧貞ｮ夂ｾｩ縺励※縲√・繝ｭ繧ｸ繧ｧ繧ｯ繝亥崋譛峨・繝√ぉ繝・け繧定ｿｽ蜉
