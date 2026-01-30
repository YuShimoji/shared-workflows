# Task: Git 繝ｪ繝昴ず繝医Μ迥ｶ諷九・遒ｺ隱搾ｼ・it status 縺悟､ｱ謨励☆繧句ｴ蜷医・莉｣譖ｿ謇区ｮｵ・・
Status: DONE
Tier: 2
Branch: main
Owner: Worker
Created: 2025-01-03T00:00:00+09:00
Report: docs/inbox/REPORT_TASK_012_20260105_0033.md 

## Objective
- git status 縺悟､ｱ謨励☆繧句ｴ蜷医・莉｣譖ｿ謇区ｮｵ・・git 繝・ぅ繝ｬ繧ｯ繝医Μ縺ｮ蟄伜惠遒ｺ隱阪↑縺ｩ・峨ｒ霑ｽ蜉
- Windows迺ｰ蠅・〒縺ｮ繝輔ぃ繧､繝ｫ蜷榊宛邏・ｼ医さ繝ｭ繝ｳ譁・ｭ暦ｼ峨∈縺ｮ蟇ｾ蠢懊ｒ霑ｽ蜉
- Git繝ｪ繝昴ず繝医Μ縺ｧ縺ｯ縺ｪ縺・腸蠅・〒繧ょ虚菴懷庄閭ｽ縺ｫ縺吶ｋ

## Context
- `git status` 縺悟､ｱ謨励☆繧句ｴ蜷茨ｼ・it繝ｪ繝昴ず繝医Μ縺ｧ縺ｯ縺ｪ縺・∵ｨｩ髯蝉ｸ崎ｶｳ縺ｪ縺ｩ・峨・莉｣譖ｿ謇区ｮｵ縺後↑縺・- Windows迺ｰ蠅・〒縺ｮ繝輔ぃ繧､繝ｫ蜷榊宛邏・ｼ医さ繝ｭ繝ｳ譁・ｭ暦ｼ峨∈縺ｮ蟇ｾ蠢懊′蠢・ｦ・- 荳驛ｨ縺ｮ繧ｹ繧ｯ繝ｪ繝励ヨ・・session-end-check.js`, `report-validator.js`・峨〒 `detectGitRoot` 髢｢謨ｰ繧剃ｽｿ逕ｨ縺励※縺・ｋ縺後∝､ｱ謨玲凾縺ｮ蜃ｦ逅・′荳榊香蛻・- `scripts/report-validator.js` 縺ｮ `detectGitRoot` 髢｢謨ｰ縺ｯ `git rev-parse --show-toplevel` 繧剃ｽｿ逕ｨ
- `scripts/session-end-check.js` 縺ｮ `detectGitRoot` 髢｢謨ｰ繧ょ酔讒・- 螟ｱ謨玲凾縺ｯ `null` 繧定ｿ斐☆縺後～.git` 繝・ぅ繝ｬ繧ｯ繝医Μ縺ｮ蟄伜惠遒ｺ隱阪↑縺ｩ縺ｮ莉｣譖ｿ謇区ｮｵ縺後↑縺・- Windows迺ｰ蠅・〒縺ｮ繝輔ぃ繧､繝ｫ蜷榊宛邏・ｼ医さ繝ｭ繝ｳ譁・ｭ暦ｼ峨∈縺ｮ蟇ｾ蠢懊・譛ｪ螳溯｣・
## Focus Area
- `scripts/report-validator.js` 縺ｮ `detectGitRoot` 髢｢謨ｰ・・git 繝・ぅ繝ｬ繧ｯ繝医Μ縺ｮ蟄伜惠遒ｺ隱阪ｒ霑ｽ蜉・・- `scripts/session-end-check.js` 縺ｮ `detectGitRoot` 髢｢謨ｰ・亥酔讒倥・謾ｹ蝟・ｼ・- Windows迺ｰ蠅・〒縺ｮ繝輔ぃ繧､繝ｫ蜷榊宛邏・ｼ医さ繝ｭ繝ｳ譁・ｭ暦ｼ峨∈縺ｮ蟇ｾ蠢・
## Forbidden Area
- 譌｢蟄倥・Git繧ｳ繝槭Φ繝牙ｮ溯｡後Ο繧ｸ繝・け縺ｮ遐ｴ螢顔噪螟画峩・域里蟄倥・讖溯・縺ｯ邯ｭ謖・ｼ・- 繝輔ぃ繧､繝ｫ繧ｷ繧ｹ繝・Β謫堺ｽ懊・遐ｴ螢顔噪螟画峩

## Constraints
- 繝・せ繝・ 荳ｻ隕√ヱ繧ｹ縺ｮ縺ｿ・・it繝ｪ繝昴ず繝医Μ縺ｧ縺ｯ縺ｪ縺・腸蠅・〒縺ｮ讀懆ｨｼ・・- 繝輔か繝ｼ繝ｫ繝舌ャ繧ｯ: 譁ｰ隕剰ｿｽ蜉遖∵ｭ｢
- 譌｢蟄倥・ `detectGitRoot` 髢｢謨ｰ縺ｮ繝代ち繝ｼ繝ｳ繧貞盾閠・↓縺吶ｋ
- 蠕梧婿莠呈鋤諤ｧ繧剃ｿ昴▽縺溘ａ縲∵里蟄倥・讖溯・縺ｨ縺ｮ謨ｴ蜷域ｧ繧堤｢ｺ隱阪☆繧・
## DoD
- [x] `detectGitRoot` 髢｢謨ｰ縺ｫ `.git` 繝・ぅ繝ｬ繧ｯ繝医Μ縺ｮ蟄伜惠遒ｺ隱阪ｒ霑ｽ蜉
- [x] `git rev-parse` 縺悟､ｱ謨励＠縺溷ｴ蜷医∬ｦｪ繝・ぅ繝ｬ繧ｯ繝医Μ繧帝■縺｣縺ｦ `.git` 繝・ぅ繝ｬ繧ｯ繝医Μ繧呈爾縺・- [x] Windows迺ｰ蠅・〒縺ｮ繝輔ぃ繧､繝ｫ蜷榊宛邏・ｼ医さ繝ｭ繝ｳ譁・ｭ暦ｼ峨∈縺ｮ蟇ｾ蠢懊ｒ霑ｽ蜉
- [x] 螳溯｣・ｾ後；it繝ｪ繝昴ず繝医Μ縺ｧ縺ｯ縺ｪ縺・腸蠅・〒蜍穂ｽ懃｢ｺ隱・- [x] Windows迺ｰ蠅・〒縺ｮ蜍穂ｽ懃｢ｺ隱・- [x] `sw-doctor.js` 縺ｧ繧ｷ繧ｹ繝・Β蛛･蜈ｨ諤ｧ繧堤｢ｺ隱・- [x] docs/inbox/ 縺ｫ繝ｬ繝昴・繝茨ｼ・EPORT_TASK_012_*.md・峨′菴懈・縺輔ｌ縺ｦ縺・ｋ
- [x] 譛ｬ繝√こ繝・ヨ縺ｮ Report 谺・↓繝ｬ繝昴・繝医ヱ繧ｹ縺瑚ｿｽ險倥＆繧後※縺・ｋ

## Notes
- Status 縺ｯ OPEN / IN_PROGRESS / BLOCKED / DONE 繧呈Φ螳・- BLOCKED 縺ｮ蝣ｴ蜷医・縲∽ｺ句ｮ・譬ｹ諡/谺｡謇具ｼ亥呵｣懶ｼ峨ｒ譛ｬ譁・↓霑ｽ險倥＠縲ヽeport 縺ｫ docs/inbox/REPORT_...md 繧貞ｿ・★險ｭ螳・- 螳溯｣・・譌｢蟄倥・ `detectGitRoot` 髢｢謨ｰ縺ｮ繝代ち繝ｼ繝ｳ繧貞盾閠・↓縺吶ｋ
- Windows迺ｰ蠅・〒縺ｮ繝輔ぃ繧､繝ｫ蜷榊宛邏・ｼ医さ繝ｭ繝ｳ譁・ｭ暦ｼ峨∈縺ｮ蟇ｾ蠢懊・縲√ヵ繧｡繧､繝ｫ蜷阪・繧ｵ繝九ち繧､繧ｺ縺ｪ縺ｩ繧呈､懆ｨ弱☆繧・
