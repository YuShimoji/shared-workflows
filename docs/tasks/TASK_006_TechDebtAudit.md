# Task: 繝励Ο繧ｸ繧ｧ繧ｯ繝育屮譟ｻ縺ｨ謚陦鍋噪雋蛯ｵ縺ｮ謨ｴ逅・(Technical Debt & Unimplemented Features)

Status: DONE
Tier: 1
Branch: main
Owner: Orchestrator
Created: 2025-12-29T05:40:00+09:00

## Objective
- 繝励Ο繧ｸ繧ｧ繧ｯ繝亥・菴薙・逶｣譟ｻ縺ｧ逋ｺ隕九＆繧後◆謚陦鍋噪雋蛯ｵ縲∽ｸ肴紛蜷医∵悴螳溯｣・ｩ溯・繧呈紛逅・＠縲∝━蜈磯・ｽ阪ｒ莉倥￠縺ｦ隗｣豸医☆繧九・- 迚ｹ縺ｫ `scripts/` 驟堺ｸ九・繝・・繝ｫ鄒､縺ｮ謨ｴ蜷域ｧ縺ｨ縲～AI_CONTEXT.md` 縺ｸ縺ｮ閾ｪ蜍募酔譛滓ｩ溯・縺ｮ荳崎ｶｳ繧定ｧ｣豸医☆繧九・
## Context
- 逶｣譟ｻ縺ｫ繧医ｊ縲～report-orch-cli.js` 縺・`HANDOVER.md` 縺ｯ譖ｴ譁ｰ縺吶ｋ縺・`AI_CONTEXT.md` 縺ｮ騾ｲ謐礼紫繧・Worker 繧ｹ繝・・繧ｿ繧ｹ繧呈峩譁ｰ縺励↑縺・％縺ｨ縺悟愛譏弱・- 繧ｳ繝ｼ繝牙・縺ｫ `TODO`/`FIXME` 縺梧淵蝨ｨ縺励※縺翫ｊ縲√％繧後ｉ繧偵メ繧ｱ繝・ヨ蛹悶＠縺ｦ邂｡逅・☆繧句ｿ・ｦ√′縺ゅｋ縲・- SSOT 荳譛ｬ蛹悶↓莨ｴ縺・∝商縺・`v1.1.md` 繧・`v2.0.md` 縺ｫ縲碁撼謗ｨ螂ｨ/繝ｬ繧ｬ繧ｷ繝ｼ縲阪・隴ｦ蜻翫ｒ繧医ｊ蠑ｷ隱ｿ縺励※霑ｽ蜉縺吶ｋ蠢・ｦ√′縺ゅｋ縲・
## Focus Area
- `scripts/` 驟堺ｸ九・蜈ｨ繧ｹ繧ｯ繝ｪ繝励ヨ
- `docs/Windsurf_AI_Collab_Rules_v1.1.md`
- `docs/Windsurf_AI_Collab_Rules_v2.0.md`
- `AI_CONTEXT.md` (繝舌ャ繧ｯ繝ｭ繧ｰ繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ)

## Forbidden Area
- 譌｢蟄倥・豁｣蟶ｸ蜍穂ｽ懊＠縺ｦ縺・ｋ繝ｭ繧ｸ繝・け縺ｮ遐ｴ螢顔噪螟画峩
- SSOT (`latest.md`) 縺ｮ蝓ｺ譛ｬ繝ｫ繝ｼ繝ｫ縺ｮ謾ｹ螟会ｼ井ｸ譛ｬ蛹悶・邯ｭ謖√☆繧具ｼ・
## Constraints
- 蜷・ｿｮ豁｣縺ｯ譛蟆城剞縺ｨ縺励∝虚菴懃｢ｺ隱搾ｼ・sw-doctor.js`・峨ｒ莨ｴ縺・％縺ｨ縲・- 繝√こ繝・ヨ蛹悶☆繧矩圀縺ｯ縲∵悽繧ｿ繧ｹ繧ｯ縺ｮ繧ｵ繝悶ち繧ｹ繧ｯ縺ｨ縺励※縺ｧ縺ｯ縺ｪ縺上∵眠隕上メ繧ｱ繝・ヨ縺ｨ縺励※ `docs/tasks/` 縺ｫ襍ｷ逾ｨ縺吶ｋ縺薙→繧呈､懆ｨ弱☆繧九・
## DoD
- [x] `report-orch-cli.js` 縺ｫ `--sync-context` 繧ｪ繝励す繝ｧ繝ｳ縺悟ｮ溯｣・＆繧後～AI_CONTEXT.md` 縺梧峩譁ｰ縺輔ｌ繧九・- [x] 譌ｧ SSOT 繝輔ぃ繧､繝ｫ (`v1.1.md`, `v2.0.md`) 縺ｫ譏守｢ｺ縺ｪ繝ｬ繧ｬ繧ｷ繝ｼ隴ｦ蜻翫′霑ｽ蜉縺輔ｌ縺ｦ縺・ｋ縲・- [x] 讀懷・縺輔ｌ縺滉ｸｻ隕√↑ TODO/FIXME 縺後∝ｿ・ｦ√↓蠢懊§縺ｦ譁ｰ隕上メ繧ｱ繝・ヨ蛹悶＆繧後※縺・ｋ縲・- [x] 譛ｬ繝√こ繝・ヨ縺ｮ Report 谺・↓螳御ｺ・Ξ繝昴・繝医′邏蝉ｻ倥￠繧峨ｌ縺ｦ縺・ｋ縲・
## Notes
- `report-orch-cli.js` 縺ｮ諡｡蠑ｵ縺ｯ縲～todo-sync.js` 縺ｮ繝ｭ繧ｸ繝・け繧貞盾閠・↓縺吶ｋ縲・
## Report
- [REPORT_ORCH_20260104_2115.md](../inbox/REPORT_ORCH_20260104_2115.md): 謚陦鍋噪雋蛯ｵ縺ｮ謨ｴ逅・ｮ御ｺ・Ξ繝昴・繝・
