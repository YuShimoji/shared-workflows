# Task: Worker螳御ｺ・Ξ繝昴・繝医・閾ｪ蜍慕ｵｱ蜷医せ繧ｯ繝ｪ繝励ヨ菴懈・

Status: DONE
Tier: 2
Branch: main
Owner: Worker
Created: 2025-01-03T00:00:00+09:00
Report: docs/inbox/REPORT_TASK_008_20250103.md

## Objective
- Worker螳御ｺ・Ξ繝昴・繝医ｒ閾ｪ蜍慕噪縺ｫ `docs/inbox/` 縺九ｉ蝗槫庶縺励～docs/HANDOVER.md` 縺ｫ邨ｱ蜷医☆繧九せ繧ｯ繝ｪ繝励ヨ讖溯・繧貞ｮ溯｣・- Orchestrator縺ｮ菴懈･ｭ雋闕ｷ繧定ｻｽ貂帙＠縲∫ｵｱ蜷域ｼ上ｌ縺ｮ繝ｪ繧ｹ繧ｯ繧呈賜髯､
- `finalize-phase.js` 縺ｫWorker繝ｬ繝昴・繝育ｵｱ蜷域ｩ溯・繧定ｿｽ蜉

## Context
- `scripts/finalize-phase.js` 縺ｯ譌｢縺ｫ蟄伜惠縺励√Ξ繝昴・繝医・繧｢繝ｼ繧ｫ繧､繝厄ｼ・docs/inbox/` 竊・`docs/reports/`・峨・螳溯｣・ｸ医∩
- 縺励°縺励～docs/HANDOVER.md` 縺ｸ縺ｮ閾ｪ蜍慕ｵｱ蜷域ｩ溯・縺ｯ螳溯｣・＆繧後※縺・↑縺・- Orchestrator縺ｯ謇句虚縺ｧWorker繝ｬ繝昴・繝医ｒ隱ｭ縺ｿ蜿悶ｊ縲？ANDOVER.md縺ｫ邨ｱ蜷医☆繧句ｿ・ｦ√′縺ゅｋ
- `scripts/report-orch-cli.js` 縺ｫ縺ｯ `updateHandoverLatest` 髢｢謨ｰ縺後≠繧翫＾rchestrator繝ｬ繝昴・繝育畑縺ｮHANDOVER譖ｴ譁ｰ縺ｯ螳溯｣・ｸ医∩・・9-107陦檎岼・・- Worker繝ｬ繝昴・繝医ｒHANDOVER縺ｫ邨ｱ蜷医☆繧区ｩ溯・縺ｯ譛ｪ螳溯｣・- `docs/HANDOVER.md` 縺ｮ36陦檎岼縺ｫ縲形finalize-phase.js` 縺ｮ HANDOVER 閾ｪ蜍墓峩譁ｰ讖溯・霑ｽ蜉・育樟蝨ｨ縺ｯ Task 縺ｮ縺ｿ・峨阪→縺・≧繝舌ャ繧ｯ繝ｭ繧ｰ鬆・岼縺梧里縺ｫ蟄伜惠

## Focus Area
- `scripts/finalize-phase.js`・・orker繝ｬ繝昴・繝育ｵｱ蜷域ｩ溯・縺ｮ霑ｽ蜉・・- `docs/HANDOVER.md` 縺ｮ縲檎ｵｱ蜷医Ξ繝昴・繝医阪そ繧ｯ繧ｷ繝ｧ繝ｳ
- Worker繝ｬ繝昴・繝医・荳ｻ隕∵ュ蝣ｱ謚ｽ蜃ｺ繝ｭ繧ｸ繝・け・・icket縲，hanges縲？andover・・
## Forbidden Area
- 譌｢蟄倥・ `finalize-phase.js` 縺ｮ蜍穂ｽ懊ｒ遐ｴ螢翫☆繧句､画峩・医い繝ｼ繧ｫ繧､繝匁ｩ溯・縺ｯ邯ｭ謖・ｼ・- `docs/HANDOVER.md` 縺ｮ譌｢蟄倥そ繧ｯ繧ｷ繝ｧ繝ｳ讒矩縺ｮ遐ｴ螢顔噪螟画峩
- Orchestrator繝ｬ繝昴・繝育ｵｱ蜷域ｩ溯・・・report-orch-cli.js`・峨・螟画峩

## Constraints
- 繝・せ繝・ 荳ｻ隕√ヱ繧ｹ縺ｮ縺ｿ・域里蟄倥・Worker繝ｬ繝昴・繝医ｒ菴ｿ逕ｨ縺励◆讀懆ｨｼ・・- 繝輔か繝ｼ繝ｫ繝舌ャ繧ｯ: 譁ｰ隕剰ｿｽ蜉遖∵ｭ｢
- 譌｢蟄倥・Orchestrator繝ｬ繝昴・繝育ｵｱ蜷域ｩ溯・・・report-orch-cli.js` 縺ｮ `updateHandoverLatest`・峨・繝代ち繝ｼ繝ｳ繧貞盾閠・↓縺吶ｋ
- Worker繝ｬ繝昴・繝医°繧我ｸｻ隕∵ュ蝣ｱ・・icket縲，hanges縲？andover・峨ｒ謚ｽ蜃ｺ縺励※HANDOVER縺ｫ邨ｱ蜷・
## DoD
- [x] `scripts/finalize-phase.js` 縺ｫWorker繝ｬ繝昴・繝育ｵｱ蜷域ｩ溯・繧定ｿｽ蜉
  - 譬ｹ諡: `extractWorkerReportInfo()` 縺ｨ `integrateWorkerReports()` 髢｢謨ｰ繧貞ｮ溯｣・＠縲～main()` 縺ｫ邨ｱ蜷亥・逅・ｒ霑ｽ蜉
- [x] Worker繝ｬ繝昴・繝医°繧我ｸｻ隕∵ュ蝣ｱ・・icket縲，hanges縲？andover・峨ｒ謚ｽ蜃ｺ縺吶ｋ繝ｭ繧ｸ繝・け繧貞ｮ溯｣・  - 譬ｹ諡: `extractWorkerReportInfo()` 髢｢謨ｰ縺ｧTicket縲，hanges縲？andover諠・ｱ繧呈歓蜃ｺ縺吶ｋ繝ｭ繧ｸ繝・け繧貞ｮ溯｣・- [x] `docs/HANDOVER.md` 縺ｮ縲檎ｵｱ蜷医Ξ繝昴・繝医阪そ繧ｯ繧ｷ繝ｧ繝ｳ縺ｫWorker繝ｬ繝昴・繝医・繧ｵ繝槭Μ繝ｼ繧定・蜍戊ｿｽ蜉
  - 譬ｹ諡: `integrateWorkerReports()` 髢｢謨ｰ縺ｧHANDOVER.md縺ｮ縲檎ｵｱ蜷医Ξ繝昴・繝医阪そ繧ｯ繧ｷ繝ｧ繝ｳ縺ｫWorker繝ｬ繝昴・繝医ｒ閾ｪ蜍戊ｿｽ蜉縺吶ｋ讖溯・繧貞ｮ溯｣・- [x] 螳溯｣・ｾ後∝ｮ滄圀縺ｮWorker繝ｬ繝昴・繝医〒蜍穂ｽ懃｢ｺ隱・  - 譬ｹ諡: `node scripts/test-worker-integration.js` 縺ｧ5縺､縺ｮWorker繝ｬ繝昴・繝医ｒ讀懷・縺励・縺､縺ｮ譁ｰ縺励＞繝ｬ繝昴・繝医ｒHANDOVER.md縺ｫ邨ｱ蜷医☆繧九％縺ｨ繧堤｢ｺ隱・- [x] Orchestrator縺ｮ菴懈･ｭ雋闕ｷ縺瑚ｻｽ貂帙＆繧後ｋ縺薙→繧堤｢ｺ隱搾ｼ域焔蜍慕ｵｱ蜷医′荳崎ｦ√↓縺ｪ繧具ｼ・  - 譬ｹ諡: `finalize-phase.js` 繧貞ｮ溯｡後☆繧九→縲仝orker繝ｬ繝昴・繝医′閾ｪ蜍慕噪縺ｫHANDOVER.md縺ｫ邨ｱ蜷医＆繧後ｋ縺溘ａ縲∵焔蜍慕ｵｱ蜷医′荳崎ｦ・- [x] `sw-doctor.js` 縺ｧ繧ｷ繧ｹ繝・Β蛛･蜈ｨ諤ｧ繧堤｢ｺ隱・  - 譬ｹ諡: `node scripts/sw-doctor.js --profile shared-orch-doctor --format text` 繧貞ｮ溯｡後＠縲・㍾螟ｧ縺ｪ繧ｨ繝ｩ繝ｼ縺ｪ縺励ｒ遒ｺ隱・- [x] docs/inbox/ 縺ｫ繝ｬ繝昴・繝茨ｼ・EPORT_TASK_008_*.md・峨′菴懈・縺輔ｌ縺ｦ縺・ｋ
  - 譬ｹ諡: `docs/inbox/REPORT_TASK_008_20250103.md` 繧剃ｽ懈・
- [x] 譛ｬ繝√こ繝・ヨ縺ｮ Report 谺・↓繝ｬ繝昴・繝医ヱ繧ｹ縺瑚ｿｽ險倥＆繧後※縺・ｋ
  - 譬ｹ諡: Report 谺・↓ `docs/inbox/REPORT_TASK_008_20250103.md` 繧定ｿｽ險・
## Notes
- Status 縺ｯ OPEN / IN_PROGRESS / BLOCKED / DONE 繧呈Φ螳・- BLOCKED 縺ｮ蝣ｴ蜷医・縲∽ｺ句ｮ・譬ｹ諡/谺｡謇具ｼ亥呵｣懶ｼ峨ｒ譛ｬ譁・↓霑ｽ險倥＠縲ヽeport 縺ｫ docs/inbox/REPORT_...md 繧貞ｿ・★險ｭ螳・- 螳溯｣・・譌｢蟄倥・繧ｳ繝ｼ繝峨ヱ繧ｿ繝ｼ繝ｳ・・report-orch-cli.js` 縺ｮ `updateHandoverLatest`・峨ｒ蜿り・↓縺吶ｋ
- Worker繝ｬ繝昴・繝医・繝輔か繝ｼ繝槭ャ繝医・ `docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` 縺ｮ `output_format` 繧貞盾辣ｧ
