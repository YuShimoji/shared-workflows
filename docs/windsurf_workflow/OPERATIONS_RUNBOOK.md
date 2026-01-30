# Operations Runbook・亥ｮ溽ｨｼ蜒肴焔鬆・/ 謌仙粥繝ｻ螟ｱ謨怜愛螳夲ｼ・
**豈主屓縺ｮ驕狗畑SSOT・域怙蜆ｪ蜈茨ｼ・*: `docs/windsurf_workflow/EVERY_SESSION.md`  
縺薙・ Runbook 縺ｯ縲瑚ｩｳ邏ｰ謇矩・閭梧勹/萓・繝医Λ繝悶Ν繧ｷ繝･繝ｼ繝医阪ｒ謇ｱ縺・よｯ主屓縺ｮ蛻､譁ｭ繧・ｵゆｺ・凾繝・Φ繝励Ξ縺ｯ SSOT 縺ｫ蠕薙≧縲・
逶ｮ逧・ shared-workflows 繧剃ｻ悶・繝ｭ繧ｸ繧ｧ繧ｯ繝医∈驕ｩ逕ｨ縺励・*蜀咲樟諤ｧ縺ｮ縺ゅｋ驕狗畑**・域ｭ｢縺ｾ繧翫↓縺上＞繝ｻ螢翫ｌ縺ｫ縺上＞・峨ｒ螳溽樟縺吶ｋ縲・
---

## 1) 繝ｦ繝ｼ繧ｶ繝ｼ・磯°逕ｨ閠・ｼ峨′繧・ｋ縺薙→

### 蛻晏屓・医・繝ｭ繧ｸ繧ｧ繧ｯ繝亥ｰ主・・・
1. `.shared-workflows/` 繧貞ｰ主・・・ubmodule 謗ｨ螂ｨ・・2. Cursor 繝ｫ繝ｼ繝ｫ繧帝←逕ｨ・域耳螂ｨ・・   - `pwsh -NoProfile -File .shared-workflows/scripts/apply-cursor-rules.ps1 -ProjectRoot .`
3. Kickstart 繧貞ｮ溯｡鯉ｼ亥・蝗槭・縺ｿ・・   - `.shared-workflows/prompts/first_time/PROJECT_KICKSTART.txt`

### 豈主屓・医そ繝・す繝ｧ繝ｳ髢句ｧ具ｼ・
1. ・域耳螂ｨ・芽ｨｺ譁ｭ
   - `node .shared-workflows/scripts/sw-doctor.js --profile shared-orch-bootstrap --format text`
2. Orchestrator Driver 繧定ｲｼ繧具ｼ・*豈主屓縺薙ｌ縺縺・*・・   - `.shared-workflows/prompts/every_time/ORCHESTRATOR_DRIVER.txt`

---

## 2) Orchestrator 縺梧ｯ主屓繧・ｋ縺薙→・磯°逕ｨ縺ｮ鬪ｨ譬ｼ・・
### 蜈･蜉幢ｼ・rchestrator縺ｸ縺ｮ謖・､ｺ・・
- **謚募・縺吶ｋ縺ｮ縺ｯ Driver 縺縺・*: `ORCHESTRATOR_DRIVER.txt`
- 迥ｶ諷鬼SOT: `.cursor/MISSION_LOG.md`
- 繧ｿ繧ｹ繧ｯSSOT: `docs/tasks/`
- 邏榊刀: `docs/inbox/` 竊・谺｡蝗朧rchestrator縺悟屓蜿弱＠縺ｦ `docs/HANDOVER.md` 縺ｸ邨ｱ蜷・
### 譛溷ｾ・＆繧後ｋ謌先棡迚ｩ・医ヵ繧｡繧､繝ｫ・・
- `.cursor/MISSION_LOG.md` 縺梧峩譁ｰ縺輔ｌ邯壹￠繧具ｼ・urrent Phase/Blockers/Next・・- `docs/tasks/TASK_*.md` 縺・Status/DoD/Report 縺ｧ謨ｴ蜷・- `docs/inbox/REPORT_*.md`・・orker邏榊刀・俄・蝗槫庶蠕後・ `docs/reports/` 縺ｸ繧｢繝ｼ繧ｫ繧､繝・- `docs/HANDOVER.md` 縺梧怙譁ｰ縺ｫ蜿肴丐縺輔ｌ繧・
### 譛溷ｾ・＆繧後ｋ繝√Ε繝・ヨ蜃ｺ蜉幢ｼ域・蜉滓凾・・
Orchestrator 縺ｮ繝√Ε繝・ヨ蜃ｺ蜉帙・ **蝗ｺ螳・繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ**:
1. `## 迴ｾ迥ｶ`
2. `## 谺｡縺ｮ繧｢繧ｯ繧ｷ繝ｧ繝ｳ`
3. `## 繧ｬ繧､繝荏
4. `## 繝｡繧ｿ繝励Ο繝ｳ繝励ヨ蜀肴兜蜈･譚｡莉ｶ`
5. `## 謾ｹ蝟・署譯茨ｼ・ew Feature Proposal・荏

霑ｽ蜉繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ・井ｽ懈･ｭ隧穂ｾ｡/邨占ｫ・遲会ｼ峨′豺ｷ縺悶▲縺ｦ縺・◆繧牙､ｱ謨励・
### 荳ｭ髢灘ｱ蜻奇ｼ磯聞螟ｧ菴懈･ｭ縺ｮ螳牙ｮ壼喧・・
- 繝・・繝ｫ蜻ｼ縺ｳ蜃ｺ縺・0蝗槭＃縺ｨ縲√∪縺溘・繝輔ぃ繧､繝ｫ邱ｨ髮・蝗槭＃縺ｨ縺ｫ **荳ｭ髢灘ｱ蜻・*繧貞・縺・- 荳ｭ髢灘ｱ蜻翫↓縺ｯ縲梧ｬ｡縺ｮ繝｡繝・そ繝ｼ繧ｸ縺ｧ繝ｦ繝ｼ繧ｶ繝ｼ縺瑚ｿ斐☆縺ｹ縺埼∈謚櫁い・・-3莉ｶ・峨阪ｒ蜷ｫ繧√ｋ

---

## 3) 謌仙粥蛻､螳夲ｼ・efinition of Success・・
譛菴朱剞縲∽ｻ･荳九′貅縺溘＆繧後※縺・ｌ縺ｰ謌仙粥:

- Driver 縺ｩ縺翫ｊ縺ｫ繝輔ぉ繝ｼ繧ｺ縺碁ｲ縺ｿ縲｀ISSION_LOG 縺梧峩譁ｰ縺輔ｌ縺ｦ縺・ｋ
- `docs/tasks/` 縺ｨ `docs/HANDOVER.md` 縺ｮ謨ｴ蜷医′蜿悶ｌ縺ｦ縺・ｋ
- `report-validator.js` 縺・OK・亥ｰ代↑縺上→繧・HANDOVER 縺ｨ譛譁ｰ繝ｬ繝昴・繝茨ｼ・- 繝√Ε繝・ヨ蜃ｺ蜉帙′蝗ｺ螳・繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ縺ｧ縲∵隼蝟・署譯医′蜷ｫ縺ｾ繧後ｋ

---

## 4) 螟ｱ謨怜愛螳夲ｼ・ailure Signals・・
莉･荳九・ 窶懆ｦ∽ｿｮ豁｣窶・縺ｮ螟ｱ謨励す繧ｰ繝翫Ν:

- Driver 繧定ｲｼ縺｣縺溘・縺ｫ縲＾rchestrator 縺・**荳蠎ｦ縺阪ｊ縺ｧ邨ゆｺ・*縺玲ｬ｡縺ｮ陦悟虚縺梧ｮ九ｉ縺ｪ縺・- 蝗ｺ螳・繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ縺悟ｴｩ繧後ｋ・域隼蝟・署譯域ｬ關ｽ縲√そ繧ｯ繧ｷ繝ｧ繝ｳ霑ｽ蜉縺ｪ縺ｩ・・- `docs/tasks` 縺・DONE 縺ｪ縺ｮ縺ｫ DoD譬ｹ諡縺檎┌縺・/ report 縺檎┌縺・- `docs/inbox` 縺悟屓蜿弱＆繧後★谿九ｊ邯壹￠繧・- `.shared-workflows/scripts/apply-cursor-rules.ps1` 縺ｪ縺ｩ **譁ｰ繝輔ぃ繧､繝ｫ縺・submodule 縺ｫ辟｡縺・*・・ 譖ｴ譁ｰ驕・ｌ・・
蟇ｾ蠢・
- `sw-doctor` 繧貞ｮ溯｡後＠縲仝ARN/ERROR 繧呈ｽｰ縺・- submodule 繧呈峩譁ｰ・郁ｦｪrepo蛛ｴ縺ｧ `git submodule update --init --recursive --remote` 遲会ｼ・

