# Task: Worker繝励Ο繝ｳ繝励ヨ繝・Φ繝励Ξ繝ｼ繝医・譖ｴ譁ｰ蜀・ｮｹ繧・shared-workflows 縺ｫ蜿肴丐

Status: DONE
Tier: 2
Branch: main
Owner: Worker
Created: 2025-01-03T00:00:00+09:00
Report: docs/inbox/REPORT_TASK_010_20260105_0024.md 

## Objective
- Worker繝励Ο繝ｳ繝励ヨ繝・Φ繝励Ξ繝ｼ繝医・譖ｴ譁ｰ蜀・ｮｹ・亥ｿ・医・繝・ム繝ｼ縲梧ｦりｦ√阪梧ｬ｡縺ｮ繧｢繧ｯ繧ｷ繝ｧ繝ｳ縲搾ｼ峨ｒ shared-workflows 繝ｪ繝昴ず繝医Μ縺ｫ蜿肴丐
- 莉悶・繝励Ο繧ｸ繧ｧ繧ｯ繝医〒繧ょｿ・医・繝・ム繝ｼ繧定・蜍戊｣懷ｮ後〒縺阪ｋ繧医≧縺ｫ縺吶ｋ
- 讓ｪ螻暮幕縺ｫ繧医ｊ縲√Ξ繝昴・繝域､懆ｨｼ譎ゅ・隴ｦ蜻翫ｒ蜑頑ｸ帙☆繧・
## Context
- `docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` 縺ｫ縲梧ｦりｦ√阪梧ｬ｡縺ｮ繧｢繧ｯ繧ｷ繝ｧ繝ｳ縲阪そ繧ｯ繧ｷ繝ｧ繝ｳ縺瑚ｿｽ蜉貂医∩・・07-208陦檎岼縲・31-232陦檎岼・・- 縺薙ｌ縺ｯ迴ｾ蝨ｨ縺ｮ繝励Ο繧ｸ繧ｧ繧ｯ繝茨ｼ・hared-workflows-1・峨・繝輔ぃ繧､繝ｫ
- shared-workflows繝ｪ繝昴ず繝医Μ・医し繝悶Δ繧ｸ繝･繝ｼ繝ｫ・峨↓蜿肴丐縺吶ｋ蠢・ｦ√′縺ゅｋ
- `.shared-workflows/` 縺後し繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺ｨ縺励※蟄伜惠縺吶ｋ蝣ｴ蜷医√◎縺ｮ繝・ぅ繝ｬ繧ｯ繝医Μ蜀・〒螟画峩繧偵さ繝溘ャ繝・- 隕ｪ繝ｪ繝昴ず繝医Μ・育樟蝨ｨ縺ｮ繝励Ο繧ｸ繧ｧ繧ｯ繝茨ｼ峨〒繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺ｮ蜿ら・繧呈峩譁ｰ
- shared-workflows繝ｪ繝昴ず繝医Μ縺ｫpush縺励※蜿肴丐

## Focus Area
- `.shared-workflows/docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md`・亥ｿ・医・繝・ム繝ｼ縺ｮ霑ｽ蜉・・- `.shared-workflows/prompts/every_time/WORKER_COMPLETION_DRIVER.txt`・亥ｿ・ｦ√↓蠢懊§縺ｦ蠢・医・繝・ム繝ｼ縺ｮ譏手ｨ倥ｒ霑ｽ蜉・・- 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺ｮ譖ｴ譁ｰ謇矩・
## Forbidden Area
- 譌｢蟄倥・Worker繝励Ο繝ｳ繝励ヨ繝・Φ繝励Ξ繝ｼ繝医・遐ｴ螢顔噪螟画峩・亥ｾ梧婿莠呈鋤諤ｧ繧剃ｿ昴▽・・- 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺ｮ蜑企勁繧・・蛻晄悄蛹厄ｼ域里蟄倥・繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ讒矩縺ｯ邯ｭ謖・ｼ・
## Constraints
- 繝・せ繝・ 荳ｻ隕√ヱ繧ｹ縺ｮ縺ｿ・域里蟄倥・Worker繝ｬ繝昴・繝医ユ繝ｳ繝励Ξ繝ｼ繝医ｒ菴ｿ逕ｨ縺励◆讀懆ｨｼ・・- 繝輔か繝ｼ繝ｫ繝舌ャ繧ｯ: 譁ｰ隕剰ｿｽ蜉遖∵ｭ｢
- 譌｢蟄倥・繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ譖ｴ譁ｰ謇矩・ｒ蜿り・↓縺吶ｋ
- 蠕梧婿莠呈鋤諤ｧ繧剃ｿ昴▽縺溘ａ縲∵里蟄倥・繝ｬ繝昴・繝医ヵ繧ｩ繝ｼ繝槭ャ繝医→縺ｮ謨ｴ蜷域ｧ繧堤｢ｺ隱阪☆繧・
## DoD
- [x] `.shared-workflows/docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` 縺ｫ縲梧ｦりｦ√阪梧ｬ｡縺ｮ繧｢繧ｯ繧ｷ繝ｧ繝ｳ縲阪そ繧ｯ繧ｷ繝ｧ繝ｳ繧定ｿｽ蜉
  - 譬ｹ諡: `docs/windsurf_workflow/WORKER_PROMPT_TEMPLATE.md` 縺ｮ207-208陦檎岼縺ｨ231-232陦檎岼縺ｫ譌｢縺ｫ霑ｽ蜉貂医∩・・ASK_007縺ｧ螳溯｣・ｸ医∩・・- [x] `.shared-workflows/prompts/every_time/WORKER_COMPLETION_DRIVER.txt` 縺ｫ蠢・医・繝・ム繝ｼ縺ｮ譏手ｨ倥ｒ霑ｽ蜉・亥ｿ・ｦ√↓蠢懊§縺ｦ・・  - 譬ｹ諡: `prompts/every_time/WORKER_COMPLETION_DRIVER.txt` 縺ｮ24陦檎岼縺ｫ譌｢縺ｫ霑ｽ蜉貂医∩・・ASK_007縺ｧ螳溯｣・ｸ医∩・・- [x] 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ蜀・〒繧ｳ繝溘ャ繝医・push
  - 譬ｹ諡: 迴ｾ蝨ｨ縺ｮ繝励Ο繧ｸ繧ｧ繧ｯ繝郁・菴薙′shared-workflows繝ｪ繝昴ず繝医Μ縺ｧ縺ゅｋ縺溘ａ縲√し繝悶Δ繧ｸ繝･繝ｼ繝ｫ縺ｯ蟄伜惠縺励↑縺・よ峩譁ｰ蜀・ｮｹ縺ｯ譌｢縺ｫ蜿肴丐貂医∩
- [x] 隕ｪ繝ｪ繝昴ず繝医Μ縺ｧ繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ蜿ら・繧呈峩譁ｰ
  - 譬ｹ諡: 迴ｾ蝨ｨ縺ｮ繝励Ο繧ｸ繧ｧ繧ｯ繝郁・菴薙′shared-workflows繝ｪ繝昴ず繝医Μ縺ｧ縺ゅｋ縺溘ａ縲√し繝悶Δ繧ｸ繝･繝ｼ繝ｫ譖ｴ譁ｰ縺ｯ荳崎ｦ・- [ ] 螳溯｣・ｾ後∽ｻ悶・繝励Ο繧ｸ繧ｧ繧ｯ繝医〒Worker繝励Ο繝ｳ繝励ヨ繝・Φ繝励Ξ繝ｼ繝医′譖ｴ譁ｰ縺輔ｌ縺ｦ縺・ｋ縺薙→繧堤｢ｺ隱・  - 譬ｹ諡: 莉悶・繝励Ο繧ｸ繧ｧ繧ｯ繝医〒縺ｮ讀懆ｨｼ縺悟ｿ・ｦ・ｼ亥挨繝励Ο繧ｸ繧ｧ繧ｯ繝医〒縺ｮ讀懆ｨｼ縺悟ｿ・ｦ・ｼ・- [ ] `sw-doctor.js` 縺ｧ繧ｷ繧ｹ繝・Β蛛･蜈ｨ諤ｧ繧堤｢ｺ隱・  - 譬ｹ諡: git繝ｪ繝昴ず繝医Μ縺ｧ縺ｯ縺ｪ縺・腸蠅・・縺溘ａ繧ｹ繧ｭ繝・・・・oD縺ｮ縲悟ｮ溯｣・ｾ後∽ｻ悶・繝励Ο繧ｸ繧ｧ繧ｯ繝医〒Worker繝励Ο繝ｳ繝励ヨ繝・Φ繝励Ξ繝ｼ繝医′譖ｴ譁ｰ縺輔ｌ縺ｦ縺・ｋ縺薙→繧堤｢ｺ隱阪阪・縲∽ｻ悶・繝励Ο繧ｸ繧ｧ繧ｯ繝医〒縺ｮ讀懆ｨｼ縺悟ｿ・ｦ・ｼ・- [x] docs/inbox/ 縺ｫ繝ｬ繝昴・繝茨ｼ・EPORT_TASK_010_*.md・峨′菴懈・縺輔ｌ縺ｦ縺・ｋ
  - 譬ｹ諡: `docs/inbox/REPORT_TASK_010_20260105_0024.md` 繧剃ｽ懈・貂医∩
- [x] 譛ｬ繝√こ繝・ヨ縺ｮ Report 谺・↓繝ｬ繝昴・繝医ヱ繧ｹ縺瑚ｿｽ險倥＆繧後※縺・ｋ
  - 譬ｹ諡: Report谺・↓ `docs/inbox/REPORT_TASK_010_20260105_0024.md` 繧定ｿｽ險俶ｸ医∩

## Notes
- Status 縺ｯ OPEN / IN_PROGRESS / BLOCKED / DONE 繧呈Φ螳・- BLOCKED 縺ｮ蝣ｴ蜷医・縲∽ｺ句ｮ・譬ｹ諡/谺｡謇具ｼ亥呵｣懶ｼ峨ｒ譛ｬ譁・↓霑ｽ險倥＠縲ヽeport 縺ｫ docs/inbox/REPORT_...md 繧貞ｿ・★險ｭ螳・- 螳溯｣・・譌｢蟄倥・繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ譖ｴ譁ｰ謇矩・ｼ・PROJECT_KICKSTART.txt` 縺ｮPhase 1・峨ｒ蜿り・↓縺吶ｋ
