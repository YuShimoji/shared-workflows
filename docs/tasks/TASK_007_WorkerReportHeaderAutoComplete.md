# Task: Worker螳御ｺ・Ξ繝昴・繝医・蠢・医・繝・ム繝ｼ閾ｪ蜍戊｣懷ｮ・
Status: DONE
Tier: 2
Branch: main
Owner: Worker
Created: 2025-01-03T00:00:00+09:00
Report: docs/inbox/REPORT_TASK_007_20260104_2115.md

## Objective
- Worker螳御ｺ・Ξ繝昴・繝医↓蠢・医・繝・ム繝ｼ縲梧ｦりｦ√阪梧ｬ｡縺ｮ繧｢繧ｯ繧ｷ繝ｧ繝ｳ縲阪ｒ閾ｪ蜍戊｣懷ｮ後☆繧区ｩ溯・繧貞ｮ溯｣・- Worker繝励Ο繝ｳ繝励ヨ繝・Φ繝励Ξ繝ｼ繝医↓蠢・医・繝・ム繝ｼ繧呈・險倥＠縲～report-validator.js` 縺ｮ隴ｦ蜻翫ｒ莠句燕縺ｫ髦ｲ縺・- Orchestrator繝ｬ繝昴・繝医→蜷梧ｧ倥・閾ｪ蜍戊｣懷ｮ梧ｩ溯・繧淡orker繝ｬ繝昴・繝医↓繧る←逕ｨ

## Context
- `REPORT_CONFIG.yml` 縺ｮ `standard` 繧ｹ繧ｿ繧､繝ｫ縺ｫ縺ｯ縲梧ｦりｦ√阪檎樟迥ｶ縲阪梧ｬ｡縺ｮ繧｢繧ｯ繧ｷ繝ｧ繝ｳ縲阪′蠢・医・繝・ム繝ｼ縺ｨ縺励※螳夂ｾｩ縺輔ｌ縺ｦ縺・ｋ
- `report-validator.js` 縺ｯ `strict_mode: true` 縺ｮ蝣ｴ蜷医√％繧後ｉ縺ｮ繝倥ャ繝繝ｼ繧偵メ繧ｧ繝・け縺励∽ｸ崎ｶｳ譎ゅ↓隴ｦ蜻翫ｒ蜃ｺ縺・- TASK_010 縺ｨ TASK_011 縺ｮ繝ｬ繝昴・繝医〒蠢・医・繝・ム繝ｼ荳崎ｶｳ縺檎匱逕溘＠縺・- `docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` 縺ｮ `output_format` 繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ縺ｫ縲梧ｦりｦ√阪梧ｬ｡縺ｮ繧｢繧ｯ繧ｷ繝ｧ繝ｳ縲阪′蜷ｫ縺ｾ繧後※縺・↑縺・- `prompts/every_time/WORKER_COMPLETION_DRIVER.txt` 縺ｫ繧ょｿ・医・繝・ム繝ｼ縺ｮ譏手ｨ倥′縺ｪ縺・- `scripts/report-orch-cli.js` 縺ｫ縺ｯOrchestrator繝ｬ繝昴・繝育畑縺ｮ閾ｪ蜍戊｣懷ｮ梧ｩ溯・縺悟ｮ溯｣・ｸ医∩・・42-254陦檎岼・・
## Focus Area
- `docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md`・・output_format` 繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ・・- `prompts/every_time/WORKER_COMPLETION_DRIVER.txt`
- `prompts/every_time/WORKER_METAPROMPT.txt`・亥ｿ・ｦ√↓蠢懊§縺ｦ・・- `docs/Worker_Prompt.md`・亥ｿ・ｦ√↓蠢懊§縺ｦ・・
## Forbidden Area
- 譌｢蟄倥・繝ｬ繝昴・繝医ヵ繧ｩ繝ｼ繝槭ャ繝医・遐ｴ螢顔噪螟画峩・亥ｾ梧婿莠呈鋤諤ｧ繧剃ｿ昴▽・・- `REPORT_CONFIG.yml` 縺ｮ譌｢蟄倩ｨｭ螳壹・螟画峩
- `report-validator.js` 縺ｮ讀懆ｨｼ繝ｭ繧ｸ繝・け縺ｮ螟画峩・郁ｭｦ蜻翫・邯ｭ謖・ｼ・
## Constraints
- 繝・せ繝・ 荳ｻ隕√ヱ繧ｹ縺ｮ縺ｿ・域里蟄倥・Worker繝ｬ繝昴・繝医ユ繝ｳ繝励Ξ繝ｼ繝医ｒ菴ｿ逕ｨ縺励◆讀懆ｨｼ・・- 繝輔か繝ｼ繝ｫ繝舌ャ繧ｯ: 譁ｰ隕剰ｿｽ蜉遖∵ｭ｢
- 譌｢蟄倥・Orchestrator繝ｬ繝昴・繝郁・蜍戊｣懷ｮ梧ｩ溯・・・report-orch-cli.js`・峨・繝代ち繝ｼ繝ｳ繧貞盾閠・↓縺吶ｋ
- 蠕梧婿莠呈鋤諤ｧ繧剃ｿ昴▽縺溘ａ縲∵里蟄倥・繝ｬ繝昴・繝医ヵ繧ｩ繝ｼ繝槭ャ繝医→縺ｮ謨ｴ蜷域ｧ繧堤｢ｺ隱阪☆繧・
## DoD
- [x] `docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` 縺ｮ `output_format` 繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ縺ｫ縲梧ｦりｦ√阪梧ｬ｡縺ｮ繧｢繧ｯ繧ｷ繝ｧ繝ｳ縲阪ｒ霑ｽ蜉
  - 螳溯｣・・螳ｹ: 207-208陦檎岼縺ｫ縲梧ｦりｦ√阪そ繧ｯ繧ｷ繝ｧ繝ｳ縲・31-232陦檎岼縺ｫ縲梧ｬ｡縺ｮ繧｢繧ｯ繧ｷ繝ｧ繝ｳ縲阪そ繧ｯ繧ｷ繝ｧ繝ｳ繧定ｿｽ蜉
- [x] `prompts/every_time/WORKER_COMPLETION_DRIVER.txt` 縺ｫ蠢・医・繝・ム繝ｼ縺ｮ譏手ｨ倥ｒ霑ｽ蜉
  - 螳溯｣・・螳ｹ: Phase 1縺ｮ繝溘ャ繧ｷ繝ｧ繝ｳ繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ・・逡ｪ逶ｮ縺ｮ鬆・岼・峨↓蠢・医・繝・ム繝ｼ縺ｮ譏手ｨ倥ｒ霑ｽ蜉
- [x] 螳溯｣・ｾ後～report-validator.js` 縺ｮ隴ｦ蜻翫′貂帛ｰ代☆繧九％縺ｨ繧堤｢ｺ隱搾ｼ域里蟄倥・Worker繝ｬ繝昴・繝医〒讀懆ｨｼ・・  - 讀懆ｨｼ邨先棡: 菴懈・縺励◆繝ｬ繝昴・繝医〒 `report-validator.js` 繧貞ｮ溯｡後＠縲√梧ｦりｦ√阪梧ｬ｡縺ｮ繧｢繧ｯ繧ｷ繝ｧ繝ｳ縲阪・霑ｽ蜉貂医∩繧堤｢ｺ隱阪りｭｦ蜻翫・縲檎樟迥ｶ縲阪・繝・ム繝ｼ荳崎ｶｳ縺ｮ縺ｿ・・orker繝ｬ繝昴・繝医〒縺ｯ險ｱ螳ｹ遽・峇・・- [x] `sw-doctor.js` 縺ｧ繧ｷ繧ｹ繝・Β蛛･蜈ｨ諤ｧ繧堤｢ｺ隱・  - 讀懆ｨｼ邨先棡: `node scripts/sw-doctor.js --profile shared-orch-bootstrap --format text` 繧貞ｮ溯｡後＠縲∝ｿ・域ｩ溯・縺ｯ豁｣蟶ｸ縺ｫ蜍穂ｽ懊☆繧九％縺ｨ繧堤｢ｺ隱・- [x] docs/inbox/ 縺ｫ繝ｬ繝昴・繝茨ｼ・EPORT_TASK_007_*.md・峨′菴懈・縺輔ｌ縺ｦ縺・ｋ
  - 螳溯｣・・螳ｹ: `docs/inbox/REPORT_TASK_007_20260104_2115.md` 繧剃ｽ懈・
- [x] 譛ｬ繝√こ繝・ヨ縺ｮ Report 谺・↓繝ｬ繝昴・繝医ヱ繧ｹ縺瑚ｿｽ險倥＆繧後※縺・ｋ
  - 螳溯｣・・螳ｹ: Report 谺・↓ `docs/inbox/REPORT_TASK_007_20260104_2115.md` 繧定ｿｽ險・
## Notes
- Status 縺ｯ OPEN / IN_PROGRESS / BLOCKED / DONE 繧呈Φ螳・- BLOCKED 縺ｮ蝣ｴ蜷医・縲∽ｺ句ｮ・譬ｹ諡/谺｡謇具ｼ亥呵｣懶ｼ峨ｒ譛ｬ譁・↓霑ｽ險倥＠縲ヽeport 縺ｫ docs/inbox/REPORT_...md 繧貞ｿ・★險ｭ螳・- 螳溯｣・・譌｢蟄倥・繧ｳ繝ｼ繝峨ヱ繧ｿ繝ｼ繝ｳ・・report-orch-cli.js` 縺ｮ242-254陦檎岼・峨ｒ蜿り・↓縺吶ｋ
