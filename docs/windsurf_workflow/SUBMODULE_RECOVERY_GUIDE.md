# 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ蠕ｩ譌ｧ繧ｬ繧､繝会ｼ井ｸｭ騾泌濠遶ｯ繝ｭ繝ｼ繝臥憾諷九°繧峨・菫ｮ蠕ｩ・・
縺薙・繧ｬ繧､繝峨・縲～.shared-workflows` 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺御ｸｭ騾泌濠遶ｯ縺ｫ繝ｭ繝ｼ繝峨＆繧後◆迥ｶ諷具ｼ医ヵ繧｡繧､繝ｫ縺瑚ｦ九▽縺九ｉ縺ｪ縺・√せ繧ｯ繝ｪ繝励ヨ縺悟ｮ溯｡後〒縺阪↑縺・ｼ峨°繧画怙譁ｰ迥ｶ諷九↓蠕ｩ譌ｧ縺吶ｋ謇矩・ｒ隱ｬ譏弱＠縺ｾ縺吶・
## 逞・憾縺ｮ遒ｺ隱・
莉･荳九・繧医≧縺ｪ繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｦ縺・ｋ蝣ｴ蜷医√し繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺御ｸｭ騾泌濠遶ｯ縺ｫ繝ｭ繝ｼ繝峨＆繧後※縺・∪縺呻ｼ・
```powershell
# 繧ｨ繝ｩ繝ｼ萓・: 繧ｹ繧ｯ繝ｪ繝励ヨ縺瑚ｦ九▽縺九ｉ縺ｪ縺・pwsh -NoProfile -File .shared-workflows/scripts/apply-cursor-rules.ps1 -ProjectRoot .
# 竊・The argument '.shared-workflows/scripts/apply-cursor-rules.ps1' is not recognized

# 繧ｨ繝ｩ繝ｼ萓・: Node.js繧ｹ繧ｯ繝ｪ繝励ヨ縺瑚ｦ九▽縺九ｉ縺ｪ縺・node .shared-workflows/scripts/sw-update-check.js
# 竊・Error: Cannot find module 'C:\...\.shared-workflows\scripts\sw-update-check.js'
```

## 菫ｮ蠕ｩ謇矩・ｼ域ｮｵ髫守噪繧｢繝励Ο繝ｼ繝・ｼ・
### 繧ｹ繝・ャ繝・: 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺ｮ迥ｶ諷狗｢ｺ隱・
縺ｾ縺壹∫樟蝨ｨ縺ｮ繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺ｮ迥ｶ諷九ｒ遒ｺ隱阪＠縺ｾ縺呻ｼ・
```powershell
# 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺ｮ迥ｶ諷九ｒ遒ｺ隱・git submodule status --recursive

# 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ蜀・・Git迥ｶ諷九ｒ遒ｺ隱・git -C .shared-workflows status -sb

# 迴ｾ蝨ｨ縺ｮ繝悶Λ繝ｳ繝√→繧ｳ繝溘ャ繝医ｒ遒ｺ隱・git -C .shared-workflows rev-parse --abbrev-ref HEAD
git -C .shared-workflows rev-parse HEAD

# 繝・ぅ繝ｬ繧ｯ繝医Μ縺ｮ蟄伜惠遒ｺ隱・Test-Path .shared-workflows
Test-Path .shared-workflows/scripts
Test-Path .shared-workflows/scripts/apply-cursor-rules.ps1
```

### 繧ｹ繝・ャ繝・: 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺ｮ蜷梧悄縺ｨ譖ｴ譁ｰ・域耳螂ｨ・壹∪縺壹％繧後ｒ隧ｦ縺呻ｼ・
繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺ｮ險ｭ螳壹ｒ蜷梧悄縺励∵怙譁ｰ迥ｶ諷九↓譖ｴ譁ｰ縺励∪縺呻ｼ・
```powershell
# 繝励Ο繧ｸ繧ｧ繧ｯ繝医Ν繝ｼ繝医〒螳溯｡・git submodule sync --recursive
git submodule update --init --recursive --remote
```

**驥崎ｦ・*: `--remote` 繧ｪ繝励す繝ｧ繝ｳ繧剃ｻ倥￠繧九％縺ｨ縺ｧ縲√Μ繝｢繝ｼ繝医Μ繝昴ず繝医Μ縺ｮ譛譁ｰ繧ｳ繝溘ャ繝医ｒ蜿門ｾ励＠縺ｾ縺吶・
### 繧ｹ繝・ャ繝・: 譖ｴ譁ｰ蠕後・遒ｺ隱・
譖ｴ譁ｰ蠕後∝ｿ・ｦ√↑繝輔ぃ繧､繝ｫ縺悟ｭ伜惠縺吶ｋ縺薙→繧堤｢ｺ隱阪＠縺ｾ縺呻ｼ・
```powershell
# 繧ｹ繧ｯ繝ｪ繝励ヨ縺ｮ蟄伜惠遒ｺ隱・Test-Path .shared-workflows/scripts/apply-cursor-rules.ps1
Test-Path .shared-workflows/scripts/sw-update-check.js
Test-Path .shared-workflows/scripts/ensure-ssot.js

# 譖ｴ譁ｰ繝√ぉ繝・け繧ｹ繧ｯ繝ｪ繝励ヨ繧貞ｮ溯｡鯉ｼ亥虚菴懃｢ｺ隱搾ｼ・node .shared-workflows/scripts/sw-update-check.js --no-fetch
```

### 繧ｹ繝・ャ繝・: 螳悟・蜀榊・譛溷喧・医せ繝・ャ繝・縺ｧ隗｣豎ｺ縺励↑縺・ｴ蜷茨ｼ・
繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺悟ｮ悟・縺ｫ螢翫ｌ縺ｦ縺・ｋ蝣ｴ蜷医・縲∽ｸ蠎ｦ蜑企勁縺励※蜀崎ｿｽ蜉縺励∪縺呻ｼ・
```powershell
# 笞・・豕ｨ諢・ 縺薙・謇矩・・繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ蜀・・繝ｭ繝ｼ繧ｫ繝ｫ螟画峩繧貞､ｱ縺・∪縺・
# 1. 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ繧帝撼蛻晄悄蛹・git submodule deinit -f .shared-workflows

# 2. 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ繧貞炎髯､・・it邂｡逅・°繧牙､悶☆・・git rm -f .shared-workflows

# 3. 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ繧貞・霑ｽ蜉
git submodule add https://github.com/YuShimoji/shared-workflows.git .shared-workflows

# 4. 蜷梧悄縺ｨ譖ｴ譁ｰ
git submodule sync --recursive
git submodule update --init --recursive --remote
```

**豕ｨ諢・*: 繧ｹ繝・ャ繝・繧貞ｮ溯｡後☆繧九→縲∬ｦｪ繝ｪ繝昴ず繝医Μ縺ｮ `.gitmodules` 縺ｨ `.shared-workflows` 縺ｮ蜿ら・縺梧峩譁ｰ縺輔ｌ縺ｾ縺吶ょ､画峩繧偵さ繝溘ャ繝医☆繧句ｿ・ｦ√′縺ゅｊ縺ｾ縺呻ｼ・
```powershell
# 螟画峩繧堤｢ｺ隱・git status -sb

# 繧ｳ繝溘ャ繝茨ｼ亥ｿ・ｦ√↓蠢懊§縺ｦ・・git add .shared-workflows .gitmodules
git commit -m "chore: shared-workflows submodule蜀榊・譛溷喧"
```

### 繧ｹ繝・ャ繝・: 隕ｪ繝ｪ繝昴ず繝医Μ縺ｧ縺ｮ蜿ら・譖ｴ譁ｰ・磯㍾隕・ｼ・
繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ繧呈峩譁ｰ縺励◆蠕後・縲・*蠢・★隕ｪ繝ｪ繝昴ず繝医Μ蛛ｴ縺ｧ蜿ら・繧ｳ繝溘ャ繝医ｒ譖ｴ譁ｰ**縺吶ｋ蠢・ｦ√′縺ゅｊ縺ｾ縺呻ｼ・
```powershell
# 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺ｮ蜿ら・縺梧峩譁ｰ縺輔ｌ縺ｦ縺・ｋ縺薙→繧堤｢ｺ隱・git status -sb
# 竊・.shared-workflows 縺悟､画峩蟇ｾ雎｡縺ｨ縺励※陦ｨ遉ｺ縺輔ｌ繧九・縺・
# 螟画峩繧偵せ繝・・繧ｸ繝ｳ繧ｰ
git add .shared-workflows

# 繧ｳ繝溘ャ繝茨ｼ井ｻ悶・螟画峩縺ｨ荳邱偵〒繧ょ庄・・git commit -m "chore: shared-workflows submodule譖ｴ譁ｰ"

# 繝励ャ繧ｷ繝･・亥ｿ・ｦ√↓蠢懊§縺ｦ・・git push origin main
```

**遖∵ｭ｢莠矩・*: `git -C .shared-workflows pull` 縺縺代〒縲梧峩譁ｰ螳御ｺ・阪→蛻､譁ｭ縺励↑縺・％縺ｨ縲りｦｪ蛛ｴ縺ｮ蜿ら・繧ｳ繝溘ャ繝医′譖ｴ譁ｰ縺輔ｌ縺壹∽ｻ悶・迺ｰ蠅・〒蜀咲樟縺ｧ縺阪↑縺上↑繧翫∪縺吶・
## 繝医Λ繝悶Ν繧ｷ繝･繝ｼ繝・ぅ繝ｳ繧ｰ

### 蝠城｡・: `git submodule update` 縺御ｽ輔ｂ蜃ｺ蜉帙＠縺ｪ縺・
**蜴溷屏**: 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺梧里縺ｫ譛譁ｰ縺ｨ蛻､譁ｭ縺輔ｌ縺ｦ縺・ｋ縲√∪縺溘・險ｭ螳壹′螢翫ｌ縺ｦ縺・ｋ蜿ｯ閭ｽ諤ｧ縺後≠繧翫∪縺吶・
**蟇ｾ蜃ｦ**:
```powershell
# 蠑ｷ蛻ｶ逧・↓蜀榊叙蠕・git submodule update --init --recursive --remote --force
```

### 蝠城｡・: 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ繝・ぅ繝ｬ繧ｯ繝医Μ縺ｯ蟄伜惠縺吶ｋ縺後∽ｸｭ霄ｫ縺檎ｩｺ

**蜴溷屏**: 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺ｮ繝ｯ繝ｼ繧ｯ繝・Μ繝ｼ縺梧ｬ謳阪＠縺ｦ縺・∪縺吶・
**蟇ｾ蜃ｦ**: 繧ｹ繝・ャ繝・・亥ｮ悟・蜀榊・譛溷喧・峨ｒ螳溯｡後＠縺ｦ縺上□縺輔＞縲・
### 蝠城｡・: 繝阪ャ繝医Ρ繝ｼ繧ｯ繧ｨ繝ｩ繝ｼ縺ｧ繝ｪ繝｢繝ｼ繝医°繧牙叙蠕励〒縺阪↑縺・
**蟇ｾ蜃ｦ**: 繝ｭ繝ｼ繧ｫ繝ｫ縺ｫ蜈ｱ譛峨け繝ｭ繝ｼ繝ｳ縺後≠繧句ｴ蜷医・縲∽ｸ譎ら噪縺ｫ繝代せ繧堤峩謗･謖・ｮ壹＠縺ｦ繧ｹ繧ｯ繝ｪ繝励ヨ繧貞ｮ溯｡後〒縺阪∪縺呻ｼ・
```powershell
# 萓・ 隕ｪ繝・ぅ繝ｬ繧ｯ繝医Μ縺ｫ shared-workflows 縺ｮ繧ｯ繝ｭ繝ｼ繝ｳ縺後≠繧句ｴ蜷・node ../shared-workflows/scripts/sw-update-check.js --project-root .
```

縺溘□縺励√％繧後・荳譎ら噪縺ｪ蝗樣∩遲悶〒縺吶ょ庄閭ｽ縺ｪ髯舌ｊ繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ繧呈ｭ｣縺励￥菫ｮ蠕ｩ縺励※縺上□縺輔＞縲・
### 蝠城｡・: PowerShell縺ｧ繝代せ縺瑚ｪ崎ｭ倥＆繧後↑縺・
**蜴溷屏**: 繝代せ縺ｮ謖・ｮ壽婿豕輔ｄ螳溯｡後・繝ｪ繧ｷ繝ｼ縺ｮ蝠城｡後〒縺吶・
**蟇ｾ蜃ｦ**:
```powershell
# 邨ｶ蟇ｾ繝代せ縺ｧ螳溯｡・pwsh -NoProfile -File "$PWD\.shared-workflows\scripts\apply-cursor-rules.ps1" -ProjectRoot .

# 縺ｾ縺溘・縲∝・縺ｫ繝・ぅ繝ｬ繧ｯ繝医Μ縺ｫ遘ｻ蜍・cd .shared-workflows/scripts
pwsh -NoProfile -File apply-cursor-rules.ps1 -ProjectRoot ../..
```

## 讀懆ｨｼ繝√ぉ繝・け繝ｪ繧ｹ繝・
菫ｮ蠕ｩ縺悟ｮ御ｺ・＠縺溘ｉ縲∽ｻ･荳九ｒ遒ｺ隱阪＠縺ｦ縺上□縺輔＞・・
- [ ] `git submodule status --recursive` 縺ｧ繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺梧ｭ｣蟶ｸ縺ｫ陦ｨ遉ｺ縺輔ｌ繧・- [ ] `.shared-workflows/scripts/apply-cursor-rules.ps1` 縺悟ｭ伜惠縺吶ｋ
- [ ] `.shared-workflows/scripts/sw-update-check.js` 縺悟ｭ伜惠縺吶ｋ
- [ ] `node .shared-workflows/scripts/sw-update-check.js --no-fetch` 縺梧ｭ｣蟶ｸ縺ｫ螳溯｡後＆繧後ｋ
- [ ] `pwsh -NoProfile -File .shared-workflows/scripts/apply-cursor-rules.ps1 -ProjectRoot .` 縺梧ｭ｣蟶ｸ縺ｫ螳溯｡後＆繧後ｋ
- [ ] `git status -sb` 縺ｧ `.shared-workflows` 縺梧峩譁ｰ蟇ｾ雎｡縺ｨ縺励※陦ｨ遉ｺ縺輔ｌ繧具ｼ域峩譁ｰ縺励◆蝣ｴ蜷茨ｼ・
## 蜿り・ラ繧ｭ繝･繝｡繝ｳ繝・
- **驕狗畑蜈･蜿｣**: `.shared-workflows/docs/windsurf_workflow/OPEN_HERE.md`
- **蛻晏屓繧ｻ繝・ヨ繧｢繝・・**: `.shared-workflows/prompts/first_time/PROJECT_KICKSTART.txt`
- **莉悶・繝ｭ繧ｸ繧ｧ繧ｯ繝磯←逕ｨ**: `docs/APPLY_TO_OTHER_PROJECTS.md`
- **譖ｴ譁ｰ繧ｬ繧､繝・*: `docs/inbox/REPORT_OTHER_PROJECTS_UPDATE_GUIDE_20250105.md`

## 縺ｾ縺ｨ繧・
1. **縺ｾ縺夊ｩｦ縺・*: `git submodule sync --recursive` 竊・`git submodule update --init --recursive --remote`
2. **縺昴ｌ縺ｧ繧ゅム繝｡**: 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ繧貞ｮ悟・縺ｫ蜑企勁縺励※蜀崎ｿｽ蜉・医せ繝・ャ繝・・・3. **蠢・★螳溯｡・*: 隕ｪ繝ｪ繝昴ず繝医Μ縺ｧ蜿ら・繧ｳ繝溘ャ繝医ｒ譖ｴ譁ｰ・医せ繝・ャ繝・・・4. **讀懆ｨｼ**: 繧ｹ繧ｯ繝ｪ繝励ヨ縺梧ｭ｣蟶ｸ縺ｫ螳溯｡後〒縺阪ｋ縺薙→繧堤｢ｺ隱・
