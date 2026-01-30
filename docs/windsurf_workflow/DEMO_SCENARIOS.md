# DEMO_SCENARIOS・・ritingPage縺ｧ縺ｮ蜈ｷ菴馴°逕ｨ繧ｷ繝翫Μ繧ｪ髮・ｼ・
縺薙・繝輔ぃ繧､繝ｫ縺ｯ縲梧ｶ郁ｲｻ蛛ｴ繝励Ο繧ｸ繧ｧ繧ｯ繝茨ｼ井ｾ・ WritingPage・峨阪〒 shared-workflows 繧偵←縺・屓縺吶°縺ｮ **螳滉ｾ矩寔**縺ｧ縺吶・ 
豈主屓縺ｮ驕狗畑繝ｫ繝ｼ繝ｫ縺ｯ SSOT `docs/windsurf_workflow/EVERY_SESSION.md` 縺ｫ蠕薙＞縺ｾ縺呻ｼ育泝逶ｾ縺励◆繧・SSOT 蜆ｪ蜈茨ｼ峨・
---

## 蜑肴署・・ritingPage蛛ｴ縺ｮ驟咲ｽｮ・・
- shared-workflows 縺・submodule 縺ｨ縺励※ `.shared-workflows/` 縺ｫ蟄伜惠縺吶ｋ
- `docs/tasks/` / `docs/inbox/` / `docs/HANDOVER.md` / `AI_CONTEXT.md` 縺悟ｭ伜惠縺吶ｋ

---

## 繧ｷ繝翫Μ繧ｪ1: 縲碁幕蟋具ｼ井ｻ頑律縺ｯ菴輔ｂ蛻・°繧峨↑縺・ｼ峨阪°繧牙ｮ牙・縺ｫ襍ｷ蜍輔☆繧・
逶ｮ逧・ 菴懈･ｭ髢句ｧ句燕縺ｫ縲梧峩譁ｰ驕・ｌ/迺ｰ蠅・ｸ榊ｙ/蜿ら・貍上ｌ縲阪ｒ貎ｰ縺励．river 繧定ｲｼ繧九□縺代・迥ｶ諷九↓縺吶ｋ縲・
WritingPage 繝ｫ繝ｼ繝医〒螳溯｡・

```powershell
node .shared-workflows/scripts/sw-update-check.js
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text
pwsh -NoProfile -File .shared-workflows/scripts/apply-cursor-rules.ps1 -ProjectRoot .
```

譛溷ｾ・ｵ先棡:
- `sw-update-check`: `Behind origin/main: 0`・域怙譁ｰ・・ 
  - 繧ゅ＠ `Behind origin/main: N` 縺ｪ繧峨・*蜈医↓ submodule 繧呈峩譁ｰ**縺励※縺九ｉ邯夊｡後☆繧具ｼ医す繝翫Μ繧ｪ4蜿ら・・・- `sw-doctor`: ERROR 縺檎┌縺・ｼ・ARN 縺ｯ逅・罰縺悟・縺九ｌ縺ｰ險ｱ螳ｹ・・- `apply-cursor-rules`: `.cursorrules` 縺ｨ `.cursor/rules.md` 縺碁・鄂ｮ縺輔ｌ繧・
谺｡縺ｫ繧・ｋ縺薙→:
- 繝√Ε繝・ヨ縺ｫ `.shared-workflows/prompts/every_time/ORCHESTRATOR_DRIVER.txt` 繧定ｲｼ繧具ｼ域ｯ主屓縺薙ｌ縺縺托ｼ・
---

## 繧ｷ繝翫Μ繧ｪ2: 譁ｰ隕上ち繧ｹ繧ｯ繧・莉ｶ襍ｷ逾ｨ竊淡orker縺ｫ蟋碑ｭｲ竊堤ｴ榊刀蝗槫庶縺ｮ豬√ｌ繧貞屓縺・
逶ｮ逧・ 窶廾rchestrator縺悟ｮ溯｣・＠縺ｪ縺・昴ｒ螳医▲縺溘∪縺ｾ縲∫｢ｺ螳溘↓蜑埼ｲ縺吶ｋ縲・
### 2-A: Orchestrator・医≠縺ｪ縺滂ｼ峨′陦後≧縺薙→

1. Driver 繧定ｲｼ縺｣縺ｦ Orchestrator 繧定ｵｷ蜍・2. Phase 4・医メ繧ｱ繝・ヨ逋ｺ陦鯉ｼ峨〒 `docs/tasks/TASK_XXX_*.md` 繧定ｵｷ逾ｨ・・tatus: OPEN・・3. Phase 5・・orker襍ｷ蜍包ｼ峨〒 Worker prompt 繧堤函謌・4. Worker 縺ｫ雋ｼ繧贋ｻ倥￠縺ｦ螳溯｡後＆縺帙ｋ

### 2-B: Worker・亥挨繧ｹ繝ｬ繝・ラ・峨′邏榊刀縺吶ｋ繧ゅ・

- `docs/inbox/REPORT_TASK_XXX_<ISO8601>.md`・亥ｿ・茨ｼ・- 繝√こ繝・ヨ (`docs/tasks/TASK_XXX_*.md`) 縺ｮ譖ｴ譁ｰ・・tatus / Report path / 譬ｹ諡・・- commit・亥ｿ・ｦ√↑繧・push縲・itHubAutoApprove 縺ｮ謇ｱ縺・・ HANDOVER 縺ｫ蠕薙≧・・
### 2-C: 谺｡蝗朧rchestrator縺悟屓蜿弱☆繧九ｂ縺ｮ

- `docs/inbox/` 縺ｮ REPORT 繧・`docs/HANDOVER.md` 縺ｸ邨ｱ蜷茨ｼ・hase 1・・- 縺昴・蠕後（nbox 縺ｮ REPORT 繧呈紛逅・ｼ・inalize-phase 縺御ｽｿ縺医ｋ縺ｪ繧牙━蜈茨ｼ・
邨ゆｺ・凾縺ｮ蠑ｷ蛻ｶ・磯㍾隕・ｼ・
- Orchestrator 縺ｯ繝√Ε繝・ヨ `## 谺｡縺ｮ繧｢繧ｯ繧ｷ繝ｧ繝ｳ` 縺ｫ **繝ｦ繝ｼ繧ｶ繝ｼ霑比ｿ｡繝・Φ繝励Ξ・亥ｮ御ｺ・愛螳・驕ｸ謚櫁い1-3・・*繧貞ｿ・★蜃ｺ縺・ 
  ・・eport-validator 縺檎┌縺・→ ERROR 縺ｫ縺ｪ繧翫∪縺呻ｼ・
---

## 繧ｷ繝翫Μ繧ｪ3: 髟ｷ螟ｧ菴懈･ｭ縺ｧ豁｢縺ｾ縺｣縺・蜀埼幕縺励◆縺・ｼ医さ繝ｳ繝・く繧ｹ繝医Ο繧ｹ繝亥ｯｾ遲厄ｼ・
逶ｮ逧・ 窶懊メ繝｣繝・ヨ萓晏ｭ倪昴ｒ貂帙ｉ縺励∫憾諷九ヵ繧｡繧､繝ｫ縺ｧ蜀埼幕縺ｧ縺阪ｋ繧医≧縺ｫ縺吶ｋ縲・
謗ｨ螂ｨ:
- `.cursor/MISSION_LOG.md` 繧剃ｽ懊ｋ・育┌縺代ｌ縺ｰ `.cursor/MISSION_LOG_TEMPLATE.md` 縺九ｉ菴懈・・・- Orchestrator 縺ｯ繝輔ぉ繝ｼ繧ｺ譖ｴ譁ｰ/繝悶Ο繝・き繝ｼ/谺｡謇九ｒ **豈主屓** `MISSION_LOG.md` 縺ｫ谿九☆

蜀埼幕謇矩・ｼ・ritingPage蛛ｴ・・

```powershell
node .shared-workflows/scripts/sw-update-check.js
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text
```

谺｡縺ｫ:
- Driver 繧貞酔縺倥メ繝｣繝・ヨ縺ｫ雋ｼ繧具ｼ亥・髢九ｂ Driver 縺ｧ邨ｱ荳・・- Orchestrator 縺ｯ `MISSION_LOG.md` 縺ｮ Current Phase 繧担SOT縺ｨ縺励※邯壹″繧帝ｲ繧√ｋ

陬懆ｶｳ:
- `sw-doctor` 縺ｯ `MISSION_LOG.md` 縺・IN_PROGRESS 縺ｮ縺ｾ縺ｾ髟ｷ譎る俣譖ｴ譁ｰ縺輔ｌ縺ｪ縺・ｴ蜷医↓ WARN 繧貞・縺呻ｼ亥●豁｢讀懃衍縺ｮ莉｣逅・ｼ・
---

## 繧ｷ繝翫Μ繧ｪ4: 縲茎hared-workflows 蛛ｴ縺梧峩譁ｰ縺輔ｌ縺ｦ縺・※縲仝ritingPage縺瑚ｿｽ蠕薙〒縺阪※縺・↑縺・・
逞・憾:
- `.shared-workflows/scripts/apply-cursor-rules.ps1` 縺檎┌縺・- `EVERY_SESSION.md` 縺檎┌縺・- Driver / 繝｢繧ｸ繝･繝ｼ繝ｫ縺瑚ｦ九▽縺九ｉ縺ｪ縺・- `sw-doctor` 縺後経utdated submodule 縺ｮ蜿ｯ閭ｽ諤ｧ縲阪ｒ WARN 縺吶ｋ

蟇ｾ蠢懶ｼ・ritingPage蛛ｴ・・

```powershell
git -C .shared-workflows fetch origin
git -C .shared-workflows checkout main
git -C .shared-workflows pull --ff-only
node .shared-workflows/scripts/sw-update-check.js --no-fetch
node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text
```

譛溷ｾ・ｵ先棡:
- `Behind origin/main: 0`
- `sw-doctor` 縺ｮ workflow asset WARN 縺梧ｶ医∴繧・
---

## 繧ｷ繝翫Μ繧ｪ5: 縲悟ｮ御ｺ・＠縺溘→諤昴▲縺溘′縲∝ｮ溘・螳御ｺ・〒縺ｯ縺ｪ縺・堺ｺ区腐繧剃ｻ慕ｵ・∩縺ｧ貎ｰ縺・
逶ｮ逧・ 窶懷ｮ御ｺ・ｮ｣險縺ｮ逕倥＆窶昴ｒ縲√ユ繝ｳ繝励Ξ・久alidator 縺ｧ蠑ｷ蛻ｶ縺吶ｋ縲・
Orchestrator Report 縺ｮ菫晏ｭ伜ｾ後↓蠢・★螳溯｡・

```powershell
node .shared-workflows/scripts/report-validator.js docs/inbox/REPORT_ORCH_<ISO8601>.md REPORT_CONFIG.yml .
```

驥崎ｦ・
- Orchestrator・亥崋螳・繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ蠖｢蠑擾ｼ峨〒縺ｯ縲～## 谺｡縺ｮ繧｢繧ｯ繧ｷ繝ｧ繝ｳ` 縺ｫ **繝ｦ繝ｼ繧ｶ繝ｼ霑比ｿ｡繝・Φ繝励Ξ**縺檎┌縺・→ validator 縺・ERROR 縺ｫ縺ｪ繧・ 
  竊・窶懈ｬ｡縺ｮ謖・､ｺ縺梧尠譏ｧ縺ｪ縺ｾ縺ｾ邨ゅｏ繧銀昴・繧・**讖滓｢ｰ逧・↓遖∵ｭ｢**縺ｧ縺阪ｋ


