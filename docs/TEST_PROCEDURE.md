# Test Procedure for Shared Workflows

## 逶ｮ逧・shared-workflows 縺ｮ閾ｪ蟾ｱ菫ｮ蠕ｩ繧ｹ繧ｯ繝ｪ繝励ヨ鄒､縺後∽ｻ悶・繝ｭ繧ｸ繧ｧ繧ｯ繝医〒繧よｭ｣蟶ｸ縺ｫ蜍穂ｽ懊☆繧九％縺ｨ繧堤｢ｺ隱阪☆繧九・
## 蜑肴署譚｡莉ｶ
- Node.js 縺後う繝ｳ繧ｹ繝医・繝ｫ縺輔ｌ縺ｦ縺・ｋ
- Git 縺後う繝ｳ繧ｹ繝医・繝ｫ縺輔ｌ縺ｦ縺・ｋ
- PowerShell 縺ｾ縺溘・ bash 縺悟茜逕ｨ蜿ｯ閭ｽ

## 繝・せ繝育腸蠅・・貅門ｙ

### 1. 繝・せ繝育畑繝励Ο繧ｸ繧ｧ繧ｯ繝医ョ繧｣繝ｬ繧ｯ繝医Μ縺ｮ菴懈・
```powershell
# PowerShell
New-Item -ItemType Directory -Path C:\temp\test-project\docs\tasks -Force
New-Item -ItemType Directory -Path C:\temp\test-project\docs\inbox -Force

# 縺ｾ縺溘・ bash
mkdir -p /tmp/test-project/docs/{tasks,inbox}
```

### 2. 繝・Φ繝励Ξ繝ｼ繝医ヵ繧｡繧､繝ｫ縺ｮ繧ｳ繝斐・
```powershell
# PowerShell
Copy-Item "shared-workflows-1\templates\AI_CONTEXT.md" "C:\temp\test-project\AI_CONTEXT.md"
Copy-Item "shared-workflows-1\docs\windsurf_workflow\HANDOVER_TEMPLATE.md" "C:\temp\test-project\docs\HANDOVER.md"
Copy-Item "shared-workflows-1\REPORT_CONFIG.yml" "C:\temp\test-project\REPORT_CONFIG.yml"

# 縺ｾ縺溘・ bash
cp shared-workflows-1/templates/AI_CONTEXT.md /tmp/test-project/AI_CONTEXT.md
cp shared-workflows-1/docs/windsurf_workflow/HANDOVER_TEMPLATE.md /tmp/test-project/docs/HANDOVER.md
cp shared-workflows-1/REPORT_CONFIG.yml /tmp/test-project/REPORT_CONFIG.yml
```

### 3. Git 繝ｪ繝昴ず繝医Μ縺ｮ蛻晄悄蛹・```powershell
# PowerShell
cd C:\temp\test-project
git init
git config user.email "test@example.com"
git config user.name "Test User"
git add .
git commit -m "Initial commit"
```

## 繝・せ繝亥ｮ溯｡・
### Test 0: Cursor 繝ｫ繝ｼ繝ｫ驕ｩ逕ｨ・域耳螂ｨ・・
```powershell
cd C:\temp\test-project
pwsh -NoProfile -File "c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\scripts\apply-cursor-rules.ps1" -ProjectRoot .
Test-Path .cursorrules
Test-Path .cursor/rules.md
```

**譛溷ｾ・ｵ先棡:**
- `.cursorrules=True`, `.cursor/rules.md=True`

### Test 1: sw-doctor.js 縺ｮ蜍穂ｽ懃｢ｺ隱・```powershell
# PowerShell
cd C:\temp\test-project
node "c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\scripts\sw-doctor.js" --profile shared-orch-bootstrap --format text
```

**譛溷ｾ・ｵ先棡:**
- Environment Check 縺ｧ蜈ｨ鬆・岼縺・`笨伝 縺ｧ陦ｨ遉ｺ縺輔ｌ繧・- Script Availability 縺ｧ蜈ｨ繧ｹ繧ｯ繝ｪ繝励ヨ縺瑚ｦ九▽縺九ｉ縺ｪ縺・ｭｦ蜻翫′蜃ｺ繧具ｼ医ユ繧ｹ繝育畑繝励Ο繧ｸ繧ｧ繧ｯ繝医↓縺ｯ scripts/ 縺後↑縺・◆繧・ｼ・- Repair Suggestions 縺ｧ縲君o issues detected縲阪′陦ｨ遉ｺ縺輔ｌ繧・
### Test 2: orchestrator-audit.js 縺ｮ蜍穂ｽ懃｢ｺ隱・```powershell
# PowerShell
cd C:\temp\test-project
node "c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\scripts\orchestrator-audit.js" --no-fail
```

**譛溷ｾ・ｵ先棡:**
- Orchestrator Audit Results 縺瑚｡ｨ遉ｺ縺輔ｌ繧・- tasks: 0, reports: 0 縺ｨ陦ｨ遉ｺ縺輔ｌ繧・- OK 縺ｧ邨ゆｺ・☆繧・
### Test 3: report-validator.js 縺ｮ蜍穂ｽ懃｢ｺ隱・```powershell
# PowerShell
cd C:\temp\test-project
node "c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\scripts\report-validator.js" docs/HANDOVER.md REPORT_CONFIG.yml .
```

**譛溷ｾ・ｵ先棡:**
- Validation for docs/HANDOVER.md: OK 縺瑚｡ｨ遉ｺ縺輔ｌ繧・- handover 繝励Ο繝輔ぃ繧､繝ｫ縺瑚・蜍暮←逕ｨ縺輔ｌ縲∵ｨ呎ｺ悶・繝・ム繝ｼ隴ｦ蜻翫′蜃ｺ縺ｪ縺・
### Test 4: ensure-ssot.js 縺ｮ蜍穂ｽ懃｢ｺ隱搾ｼ・-no-fail 繝輔Λ繧ｰ・・```powershell
# PowerShell
cd C:\temp\test-project
node "c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\scripts\ensure-ssot.js" --no-fail
```

**譛溷ｾ・ｵ先棡:**
- shared-workflows 縺瑚ｦ九▽縺九ｉ縺ｪ縺・ｭｦ蜻翫′蜃ｺ繧・- --no-fail 繝輔Λ繧ｰ縺ｫ繧医ｊ縲√お繝ｩ繝ｼ縺ｧ邨ゆｺ・○縺夊ｭｦ蜻翫〒邯咏ｶ壹☆繧・- Exit code: 0

### Test 5: todo-leak-preventer.js 縺ｮ蜍穂ｽ懃｢ｺ隱・```powershell
# PowerShell
cd C:\temp\test-project
node "c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\scripts\todo-leak-preventer.js"
```

**譛溷ｾ・ｵ先棡:**
- AI_CONTEXT.md 縺ｮ Backlog 繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ繧定ｧ｣譫・- 譛ｪ螳御ｺ・ち繧ｹ繧ｯ・・- [ ]` 蠖｢蠑擾ｼ峨ｒ讀懷・縺励※隴ｦ蜻翫ｒ蜃ｺ縺・
### Test 6: dev-check.js 縺ｮ蜍穂ｽ懃｢ｺ隱・```powershell
# PowerShell
cd C:\temp\test-project
node "c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\scripts\dev-check.js"
```

**譛溷ｾ・ｵ先棡:**
- Running shared workflow diagnostics... 縺瑚｡ｨ遉ｺ縺輔ｌ繧・- 隍・焚縺ｮ繧ｹ繧ｯ繝ｪ繝励ヨ縺碁・ｺ丞ｮ溯｡後＆繧後ｋ
- 蛟句挨繧ｹ繧ｯ繝ｪ繝励ヨ縺悟､ｱ謨励＠縺ｦ繧ょ・菴薙・邯咏ｶ壹☆繧・- All shared workflow scripts executed successfully. 縺ｧ邨ゆｺ・☆繧・
## 繝医Λ繝悶Ν繧ｷ繝･繝ｼ繝・ぅ繝ｳ繧ｰ

### Test 縺悟､ｱ謨励＠縺溷ｴ蜷・1. **繧ｹ繧ｯ繝ｪ繝励ヨ縺瑚ｦ九▽縺九ｉ縺ｪ縺・*
   - shared-workflows-1 縺ｮ繝代せ縺梧ｭ｣縺励＞縺狗｢ｺ隱・   - Node.js 縺後う繝ｳ繧ｹ繝医・繝ｫ縺輔ｌ縺ｦ縺・ｋ縺狗｢ｺ隱・ `node --version`

2. **Git 繧ｨ繝ｩ繝ｼ**
   - 繝・せ繝育畑繝励Ο繧ｸ繧ｧ繧ｯ繝医′ Git 繝ｪ繝昴ず繝医Μ縺狗｢ｺ隱・ `git status`
   - Git 繝ｦ繝ｼ繧ｶ繝ｼ縺瑚ｨｭ螳壹＆繧後※縺・ｋ縺狗｢ｺ隱・ `git config user.name`

3. **繝輔ぃ繧､繝ｫ縺瑚ｦ九▽縺九ｉ縺ｪ縺・*
   - 繝・Φ繝励Ξ繝ｼ繝医ヵ繧｡繧､繝ｫ縺後さ繝斐・縺輔ｌ縺ｦ縺・ｋ縺狗｢ｺ隱・   - 繝代せ縺梧ｭ｣縺励＞縺狗｢ｺ隱搾ｼ・owerShell 縺ｧ縺ｯ螟ｧ譁・ｭ怜ｰ乗枚蟄励ｒ蛹ｺ蛻･縺励↑縺・ｼ・
## 驕狗畑繝ｫ繝ｼ繝励・遒ｺ隱・
### 螳悟・縺ｪ繝ｯ繝ｼ繧ｯ繝輔Ο繝ｼ・域悽逡ｪ迺ｰ蠅・〒縺ｮ菴ｿ逕ｨ・・1. **蛻晄悄蛹悶ヵ繧ｧ繝ｼ繧ｺ**
   ```powershell
   node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text
   ```

2. **逶｣譟ｻ繝輔ぉ繝ｼ繧ｺ**
   ```powershell
   node scripts/orchestrator-audit.js --no-fail
   node scripts/dev-check.js
   ```

3. **菫ｮ蠕ｩ繝輔ぉ繝ｼ繧ｺ・亥ｿ・ｦ√↓蠢懊§縺ｦ・・*
   ```powershell
   node scripts/ensure-ssot.js --no-fail
   git submodule sync --recursive
   git submodule update --init --recursive --remote
   ```

4. **讀懆ｨｼ繝輔ぉ繝ｼ繧ｺ**
   ```powershell
   node scripts/report-validator.js docs/HANDOVER.md REPORT_CONFIG.yml .
   ```

5. **Orchestrator 驕狗畑髢句ｧ具ｼ域ｯ主屓・・*
   - `.shared-workflows/prompts/every_time/ORCHESTRATOR_DRIVER.txt` 繧定ｲｼ繧具ｼ域ｯ主屓縺薙ｌ縺縺托ｼ・
## 謌仙粥蝓ｺ貅・- [ ] sw-doctor.js 縺檎腸蠅・メ繧ｧ繝・け繧貞ｮ御ｺ・- [ ] orchestrator-audit.js 縺・--no-fail 縺ｧ蜍穂ｽ・- [ ] report-validator.js 縺・handover 繝励Ο繝輔ぃ繧､繝ｫ繧定・蜍暮←逕ｨ
- [ ] ensure-ssot.js 縺・--no-fail 縺ｧ隴ｦ蜻翫〒邯咏ｶ・- [ ] todo-leak-preventer.js 縺・Backlog 繧呈ｭ｣遒ｺ縺ｫ隗｣譫・- [ ] dev-check.js 縺悟・繧ｹ繧ｯ繝ｪ繝励ヨ繧帝・ｺ丞ｮ溯｡・- [ ] 繝・せ繝育畑繝励Ο繧ｸ繧ｧ繧ｯ繝医〒蜈ｨ繝・せ繝医′謌仙粥

## 豕ｨ險・- 繝・せ繝育畑繝励Ο繧ｸ繧ｧ繧ｯ繝医・譛ｬ逡ｪ迺ｰ蠅・〒縺ｯ縺ｪ縺上∝虚菴懃｢ｺ隱咲畑縺ｮ縺ｿ
- 螳滄圀縺ｮ驕狗畑縺ｧ縺ｯ縲《hared-workflows 繧・submodule 縺ｨ縺励※蟆主・縺吶ｋ縺薙→繧呈耳螂ｨ
- 蜷・せ繧ｯ繝ｪ繝励ヨ縺ｯ --no-fail 繝輔Λ繧ｰ縺ｧ隴ｦ蜻翫〒邯咏ｶ壹☆繧玖ｨｭ險医↓縺ｪ縺｣縺ｦ縺・ｋ
