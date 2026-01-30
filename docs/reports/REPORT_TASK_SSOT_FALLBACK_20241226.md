# SSOT 繝舌・繧ｸ繝ｧ繝ｳ繝輔か繝ｼ繝ｫ繝舌ャ繧ｯ蟇ｾ蠢懊Ξ繝昴・繝・
**Report ID**: REPORT_TASK_SSOT_FALLBACK_20241226  
**Timestamp**: 2024-12-26T14:00:00+09:00
**Actor**: Worker
**Ticket**: docs/tasks/TASK_002_OnboardingRefStandard.md
**Type**: Worker
**Duration**: 1.5h
**Changes**: prompts/*.txt, scripts/ensure-ssot.js, scripts/sw-doctor.js, docs/CENTRAL_REPO_REF.md

## 讎りｦ・
shared-workflows 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺ｮ繝舌・繧ｸ繝ｧ繝ｳ蟾ｮ逡ｰ・・1.1 縺ｮ縺ｿ繧呈戟縺､蜿､縺・さ繝溘ャ繝・vs v2.0/latest 繧呈戟縺､譁ｰ縺励＞繧ｳ繝溘ャ繝茨ｼ峨↓繧医ｊ縲゜ickstart 繧ｻ繝・ヨ繧｢繝・・縺後郡SOT 繝輔ぃ繧､繝ｫ縺瑚ｦ九▽縺九ｉ縺ｪ縺・阪お繝ｩ繝ｼ縺ｧ螟ｱ謨励☆繧句撫鬘後ｒ菫ｮ豁｣縺励∪縺励◆縲・
## 螳滓命蜀・ｮｹ

### 1. 繝励Ο繝ｳ繝励ヨ鄒､縺ｮ菫ｮ豁｣

蜈ｨ縺ｦ縺ｮ繝励Ο繝ｳ繝励ヨ繝輔ぃ繧､繝ｫ縺ｫ SSOT 繝舌・繧ｸ繝ｧ繝ｳ繝輔か繝ｼ繝ｫ繝舌ャ繧ｯ鬆・ｺ擾ｼ・latest` 竊・`v2.0` 竊・`v1.1`・峨ｒ譏手ｨ倥＠縲∵怙蛻昴↓隕九▽縺九▲縺溘ヵ繧｡繧､繝ｫ繧貞渕貅悶Ν繝ｼ繝ｫ縺ｨ縺励※謇ｱ縺・ｈ縺・､画峩縲・
**菫ｮ豁｣繝輔ぃ繧､繝ｫ**:
- `prompts/first_time/PROJECT_KICKSTART.txt`
- `prompts/first_time/PROJECT_KICKSTART_RESUME.txt`
- `prompts/every_time/ORCHESTRATOR_METAPROMPT.txt`
- `prompts/every_time/ORCHESTRATOR_RESUME.txt`

**螟画峩蜀・ｮｹ**:
```
譛蜆ｪ蜈医〒隱ｭ繧繧ゅ・・・SOT 蜿ら・鬆・ｺ擾ｼ・
- 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺後≠繧句ｴ蜷・ `.shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md` 竊・辟｡縺代ｌ縺ｰ `.shared-workflows/docs/Windsurf_AI_Collab_Rules_v2.0.md` 竊・辟｡縺代ｌ縺ｰ `.shared-workflows/docs/Windsurf_AI_Collab_Rules_v1.1.md`
- 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺檎┌縺・ｴ蜷・ `docs/Windsurf_AI_Collab_Rules_v2.0.md` 竊・辟｡縺代ｌ縺ｰ `docs/Windsurf_AI_Collab_Rules_v1.1.md`
- **驥崎ｦ・*: 荳願ｨ・SSOT 縺ｮ縺・■譛蛻昴↓隕九▽縺九▲縺溘ヵ繧｡繧､繝ｫ繧偵後％縺ｮ繧ｻ繝・ヨ繧｢繝・・縺ｮ蝓ｺ貅悶Ν繝ｼ繝ｫ縲阪→縺励※謇ｱ縺・√ヰ繝ｼ繧ｸ繝ｧ繝ｳ驕輔＞縺ｧ繧ｨ繝ｩ繝ｼ縺ｫ縺励↑縺・```

### 2. 繧ｹ繧ｯ繝ｪ繝励ヨ縺ｮ菫ｮ豁｣

**`scripts/ensure-ssot.js`**:
```javascript
const FILES = [
  'docs/Windsurf_AI_Collab_Rules_latest.md',
  'docs/Windsurf_AI_Collab_Rules_v2.0.md',
  'docs/Windsurf_AI_Collab_Rules_v1.1.md'  // 霑ｽ蜉
];
```

**`scripts/sw-doctor.js`**:
```javascript
// Check SSOT files (fallback order: latest -> v2.0 -> v1.1)
const ssotFiles = [
  'docs/Windsurf_AI_Collab_Rules_latest.md',
  'docs/Windsurf_AI_Collab_Rules_v2.0.md',
  'docs/Windsurf_AI_Collab_Rules_v1.1.md'  // 霑ｽ蜉
];
```

### 3. 繝峨く繝･繝｡繝ｳ繝医・譖ｴ譁ｰ

**`docs/CENTRAL_REPO_REF.md`**:
- SSOT 繝舌・繧ｸ繝ｧ繝ｳ繝輔か繝ｼ繝ｫ繝舌ャ繧ｯ鬆・ｺ上そ繧ｯ繧ｷ繝ｧ繝ｳ繧定ｿｽ蜉
- 繝輔か繝ｼ繝ｫ繝舌ャ繧ｯ謌ｦ逡･縺ｮ隧ｳ邏ｰ隱ｬ譏弱ｒ險倩ｼ・
**`docs/CLIENT_PROJECT_DOCTOR_GUIDE.md`**:
- SSOT 繝輔ぃ繧､繝ｫ縺ｮ繝舌・繧ｸ繝ｧ繝ｳ蟾ｮ逡ｰ縺ｫ縺､縺・※縺ｮ豕ｨ諢乗嶌縺阪ｒ霑ｽ蜉

### 4. 繝・せ繝育ｵ先棡

#### 繝ｭ繝ｼ繧ｫ繝ｫ繝・せ繝茨ｼ・hared-workflows-1 繝ｪ繝昴ず繝医Μ蜀・ｼ・
```bash
# ensure-ssot.js 縺ｮ繝倥Ν繝苓｡ｨ遉ｺ
$ node scripts/ensure-ssot.js --help
笨・豁｣蟶ｸ蜍穂ｽ懃｢ｺ隱・
# sw-doctor.js 縺ｮ bootstrap 繝励Ο繝輔ぃ繧､繝ｫ螳溯｡・$ node scripts/sw-doctor.js --profile shared-orch-bootstrap --format text
笨・SSOT docs/Windsurf_AI_Collab_Rules_latest.md exists
笨・SSOT docs/Windsurf_AI_Collab_Rules_v2.0.md exists
笨・No issues detected. System is healthy.
```

## 菫ｮ豁｣蜑阪・蝠城｡・
### 逞・憾
- WritingPage 縺ｪ縺ｩ繧ｯ繝ｩ繧､繧｢繝ｳ繝医・繝ｭ繧ｸ繧ｧ繧ｯ繝医〒 Kickstart 繧ｻ繝・ヨ繧｢繝・・螳溯｡梧凾縺ｫ縲√形docs/Windsurf_AI_Collab_Rules_v2.0.md` 縺瑚ｦ九▽縺九ｉ縺ｪ縺・阪お繝ｩ繝ｼ縺檎匱逕・- 螳滄圀縺ｫ縺ｯ繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺ｫ `v1.1.md` 縺ｮ縺ｿ縺悟ｭ伜惠縺励※縺・◆

### 蜴溷屏
1. 繝励Ο繝ｳ繝励ヨ縺・`v2.0.md` 縺ｾ縺溘・ `latest.md` 繧貞燕謠舌↓險倩ｿｰ縺輔ｌ縺ｦ縺・◆
2. 繧ｯ繝ｩ繧､繧｢繝ｳ繝医・繝ｭ繧ｸ繧ｧ繧ｯ繝医・繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺悟商縺・さ繝溘ャ繝茨ｼ・0.1.0 邉ｻ・峨ｒ謖・＠縺ｦ縺翫ｊ縲～v1.1.md` 縺励°蜷ｫ縺ｾ繧後※縺・↑縺九▲縺・3. `ensure-ssot.js` 縺ｨ `sw-doctor.js` 縺・`v1.1.md` 繧偵ヵ繧ｩ繝ｼ繝ｫ繝舌ャ繧ｯ蟇ｾ雎｡縺ｫ蜷ｫ繧√※縺・↑縺九▲縺・
## 菫ｮ豁｣蠕後・蜍穂ｽ・
### 譛溷ｾ・＆繧後ｋ蜍穂ｽ・1. Kickstart 繝励Ο繝ｳ繝励ヨ螳溯｡梧凾縲ヾSOT 繝輔ぃ繧､繝ｫ繧・`latest` 竊・`v2.0` 竊・`v1.1` 縺ｮ鬆・〒謗｢邏｢
2. 譛蛻昴↓隕九▽縺九▲縺溘ヵ繧｡繧､繝ｫ繧偵悟渕貅悶Ν繝ｼ繝ｫ縲阪→縺励※謇ｱ縺・√そ繝・ヨ繧｢繝・・繧堤ｶ夊｡・3. `ensure-ssot.js` 縺ｯ蛻ｩ逕ｨ蜿ｯ閭ｽ縺ｪ蜈ｨ繝舌・繧ｸ繝ｧ繝ｳ縺ｮ繧ｳ繝斐・繧定ｩｦ陦・4. `sw-doctor.js` 縺ｯ蜈ｨ繝舌・繧ｸ繝ｧ繝ｳ縺ｮ蟄伜惠繧堤｢ｺ隱阪＠縲∝ｰ代↑縺上→繧・縺､縺ゅｌ縺ｰ豁｣蟶ｸ縺ｨ蛻､螳・
### 谺｡縺ｮ繧ｹ繝・ャ繝・
#### 蠢・・ 繧ｯ繝ｩ繧､繧｢繝ｳ繝医・繝ｭ繧ｸ繧ｧ繧ｯ繝医〒縺ｮ蜍穂ｽ懃｢ｺ隱・1. WritingPage 繝励Ο繧ｸ繧ｧ繧ｯ繝医〒 Kickstart 繝励Ο繝ｳ繝励ヨ・・PROJECT_KICKSTART.txt`・峨ｒ螳溯｡・2. v1.1 縺ｮ縺ｿ繧呈戟縺､繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺ｧ豁｣蟶ｸ縺ｫ繧ｻ繝・ヨ繧｢繝・・縺悟ｮ御ｺ・☆繧九％縺ｨ繧堤｢ｺ隱・3. 繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺ｪ縺・％縺ｨ繧堤｢ｺ隱・
#### 繧ｪ繝励す繝ｧ繝ｳ: 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ譖ｴ譁ｰ謌ｦ逡･縺ｮ讀懆ｨ・- 繧ｯ繝ｩ繧､繧｢繝ｳ繝医・繝ｭ繧ｸ繧ｧ繧ｯ繝医・繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ繧呈怙譁ｰ繧ｳ繝溘ャ繝医↓譖ｴ譁ｰ縺吶ｋ縺・- v1.1 繝吶・繧ｹ縺ｧ縺ｮ驕狗畑繧堤ｶ咏ｶ壹☆繧九°

## 繧ｳ繝溘ャ繝亥ｱ･豁ｴ

```bash
# Commit 1: 繝励Ο繝ｳ繝励ヨ縺ｨ繝峨く繝･繝｡繝ｳ繝医・菫ｮ豁｣
commit 7ead429
fix: add SSOT version fallback to all prompts (latest -> v2.0 -> v1.1)

# Commit 2: 繧ｹ繧ｯ繝ｪ繝励ヨ縺ｮ菫ｮ豁｣
commit ed71ba5
fix: add v1.1 fallback support to ensure-ssot and sw-doctor
```

## 髢｢騾｣繝輔ぃ繧､繝ｫ

### 菫ｮ豁｣縺輔ｌ縺溘ヵ繧｡繧､繝ｫ
- `@c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\prompts\first_time\PROJECT_KICKSTART.txt:6-10`
- `@c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\prompts\first_time\PROJECT_KICKSTART_RESUME.txt:6`
- `@c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\prompts\every_time\ORCHESTRATOR_METAPROMPT.txt:91`
- `@c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\prompts\every_time\ORCHESTRATOR_RESUME.txt:7`
- `@c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\scripts\ensure-ssot.js:5-9`
- `@c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\scripts\sw-doctor.js:159`
- `@c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\docs\CENTRAL_REPO_REF.md:9-17`
- `@c:\Users\thank\Storage\Media Contents Projects\shared-workflows-1\docs\CLIENT_PROJECT_DOCTOR_GUIDE.md:9`

### 蜿ら・繝峨く繝･繝｡繝ｳ繝・- `docs/CENTRAL_REPO_REF.md`: 繝輔か繝ｼ繝ｫ繝舌ャ繧ｯ謌ｦ逡･縺ｮ隧ｳ邏ｰ
- `docs/CLIENT_PROJECT_DOCTOR_GUIDE.md`: 繧ｯ繝ｩ繧､繧｢繝ｳ繝医・繝ｭ繧ｸ繧ｧ繧ｯ繝亥髄縺大茜逕ｨ繧ｬ繧､繝・- `docs/windsurf_workflow/OPEN_HERE.md`: 驕狗畑閠・髄縺大・蜿｣繧ｬ繧､繝・
## Risk
- 繧ｯ繝ｩ繧､繧｢繝ｳ繝医・繝ｭ繧ｸ繧ｧ繧ｯ繝医・繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺梧･ｵ遶ｯ縺ｫ蜿､縺・ｴ蜷医～ensure-ssot.js` 閾ｪ菴薙′蟄伜惠縺励↑縺・庄閭ｽ諤ｧ縺後≠繧翫√◎縺ｮ蝣ｴ蜷医・謇句虚縺ｧ縺ｮ繝輔ぃ繧､繝ｫ繧ｳ繝斐・縺悟ｿ・ｦ√↓縺ｪ繧九・
## Proposals
- `ensure-ssot.js` 繧・`curl` 遲峨〒逶ｴ謗･繝繧ｦ繝ｳ繝ｭ繝ｼ繝峨＠縺ｦ螳溯｡後〒縺阪ｋ繝ｯ繝ｳ繝ｩ繧､繝翫・縺ｮ謠蝉ｾ帙・
---

**Report Status**: 笨・COMPLETED  
**Next Action**: WritingPage 繝励Ο繧ｸ繧ｧ繧ｯ繝医〒縺ｮ蜍穂ｽ懃｢ｺ隱・
