# Task: 繝ｬ繝昴・繝域ｬ謳崎ｪｿ譟ｻ・・ocs/inbox / HANDOVER 謨ｴ蜷域ｧ・・
Status: DONE
Tier: 1
Branch: main
Owner: Orchestrator
Created: 2025-12-22T02:59+09:00
Report: docs/reports/REPORT_TASK_005_20251226_1345.md
## Objective

- docs/inbox/ 縺ｮ REPORT_* 縺ｨ docs/HANDOVER.md・・atest Orchestrator Report / Progress 谺・ｼ峨・蜀・ｮｹ繧堤ｪ√″蜷医ｏ縺帙∵ｬ謳阪・驥崎､・・譛ｪ邨ｱ蜷医Ξ繝昴・繝医ｒ豢励＞蜃ｺ縺吶・- Orchestrator 繝ｬ繝昴・繝医・菫晏ｭ假ｽ樊､懆ｨｼ・曰ANDOVER 蜿肴丐縺ｾ縺ｧ縺ｮ謇矩・′繝｡繧ｿ繝励Ο繝ｳ繝励ヨ騾壹ｊ讖溯・縺励※縺・ｋ縺九ｒ遒ｺ隱阪＠縲∝撫鬘後′縺ゅｌ縺ｰ譛蟆丈ｿｮ豁｣繧定｡後≧縲・
## Context

- 譛譁ｰ繧ｻ繝・す繝ｧ繝ｳ縺ｧ `REPORT_ORCH_20251222T015500.md` 繧堤ｵｱ蜷亥ｾ後∵眠縺励＞繧ｻ繝・す繝ｧ繝ｳ蛻・・繝ｬ繝昴・繝医′縺ｾ縺菴懈・縺輔ｌ縺ｦ縺・↑縺・・- 窶懊Ξ繝昴・繝域ｬ謳坂・縺・Phase 1 縺ｮ繝悶Ο繝・き繝ｼ縺ｨ縺励※謖吶′縺｣縺ｦ縺翫ｊ縲‥ocs/tasks/ 縺ｫ繝√こ繝・ヨ縺悟ｭ伜惠縺励↑縺九▲縺溘◆繧∵悽繝√こ繝・ヨ縺ｧ霑ｽ霍｡縺吶ｋ縲・- report-validator.js 縺ｮ蠑墓焚謖・ｮ夲ｼ・onfig/path・峨′驕ｵ螳医＆繧後※縺・ｋ縺九ｂ蜷医ｏ縺帙※轤ｹ讀懊☆繧九・
## Focus Area

- `docs/inbox/`
- `docs/HANDOVER.md`
- `templates/ORCHESTRATOR_REPORT_TEMPLATE.md`
- `scripts/report-validator.js`
- `prompts/every_time/ORCHESTRATOR_METAPROMPT.txt`・・hase 6 縺ｮ謇矩・｢ｺ隱搾ｼ・
## Forbidden Area

- Worker 邏榊刀迚ｩ縺ｮ蜀・ｮｹ謾ｹ螟会ｼ医が繝ｪ繧ｸ繝翫Ν繝ｬ繝昴・繝域悽譁・ｒ譖ｸ縺肴鋤縺医↑縺・ｼ・- 繝励Ο繧ｸ繧ｧ繧ｯ繝医さ繝ｼ繝会ｼ・rc/ 驟堺ｸ具ｼ峨・螳溯｣・､画峩
- 荳崎ｦ√↑繝・Φ繝励Ξ霑ｽ蜉繝ｻ蜑企勁

## Constraints

- 繝・せ繝・ `node .shared-workflows/scripts/report-validator.js <report>` 縺ｾ縺溘・ `node scripts/report-validator.js <report> REPORT_CONFIG.yml .` 繧堤畑縺・※讀懆ｨｼ繝ｭ繧ｰ繧呈ｮ九☆縲・- 繝輔か繝ｼ繝ｫ繝舌ャ繧ｯ: 繝ｬ繝昴・繝医′蟄伜惠縺励↑縺・ｴ蜷医・縲？ANDOVER 蛛ｴ縺ｫ 窶懆ｩｲ蠖薙Ξ繝昴・繝域悴菴懈・窶・縺ｨ TODO 繧呈・遉ｺ縺励∫ｩｺ縺ｮ繝ｬ繝昴・繝医ｒ謐城縺励↑縺・・- 邨先棡縺ｯ繝峨く繝･繝｡繝ｳ繝茨ｼ・arkdown・画峩譁ｰ縺ｨ繝ｭ繧ｰ縺ｫ髯仙ｮ壹☆繧九１DF/螟夜Κ驟榊ｸ・・荳崎ｦ√・
## DoD

- [ ] docs/inbox/ 縺ｫ縺ゅｋ蜈ｨ繝ｬ繝昴・繝医↓縺､縺・※縲？ANDOVER 縺ｸ縺ｮ蜿肴丐迥ｶ豕√ｒ遒ｺ隱阪＠縲∽ｸ崎ｶｳ縺励※縺・ｌ縺ｰ邨ｱ蜷・or TODO 險倩ｼ峨ｒ螳御ｺ・- [ ] report-validator 螳溯｡檎ｵ先棡・医さ繝槭Φ繝峨・繝ｭ繧ｰ繝ｻconfig 繝代せ・峨ｒ繝ｬ繝昴・繝医↓險倩ｼ・- [ ] 繝ｬ繝昴・繝域ｬ謳阪↓髢｢縺吶ｋ蜴溷屏縺ｨ谺｡繧｢繧ｯ繧ｷ繝ｧ繝ｳ・井ｾ・ 繝ｬ繝昴・繝井ｽ懈・縲√ユ繝ｳ繝励Ξ菫ｮ豁｣・峨ｒ蛻玲嫌
- [ ] 繝√こ繝・ヨ Report 谺・↓ `docs/inbox/REPORT_TASK_005_*.md` 縺ｮ繝代せ繧定ｿｽ險・
## Notes

- Orchestrator 繝ｬ繝昴・繝井ｽ懈・繝輔Ο繝ｼ・・hase 6・峨〒 CLI 縺御ｽｿ縺医↑縺・ｴ蜷医・莉｣譖ｿ謇矩・ｂ謨ｴ逅・＠縲？ANDOVER 縺ｫ 窶懈焔蜍輔〒螳滓命縺励◆窶・縺ｨ縺・≧繝ｭ繧ｰ繧呈ｮ九☆縲・- docs/tasks/ 縺ｨ縺ｮ謨ｴ蜷域ｧ繝√ぉ繝・け逕ｨ縺ｫ `node scripts/todo-sync.js` 繧貞ｮ溯｡後＠縲、I_CONTEXT 縺ｮ Next 繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ縺ｫ繧ょ渚譏縺輔○繧九・
