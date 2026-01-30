# Windsurf Autopilot Guide

Windsurf IDE 縺ｮ閾ｪ蠕玖ｵｰ陦後ｒ陬懷勧縺吶ｋ AutoHotkey 繧ｹ繧ｯ繝ｪ繝励ヨ・・scripts/ahk/windsurf_autopilot.ahk`・峨・蛻ｩ逕ｨ繧ｬ繧､繝峨・DE 繧ｪ繝ｼ繧ｱ繧ｹ繝医Ξ繝ｼ繧ｷ繝ｧ繝ｳ荳ｭ縺ｧ繧ょ盾辣ｧ縺励ｄ縺吶＞繧医≧縲悟ｰ主・繝ｻ謫堺ｽ懊・螳牙・縲阪・繧､繝ｳ繝医ｒ 1 譫壹↓縺ｾ縺ｨ繧√※縺・∪縺吶・
## 1. 讎りｦ・- **蜈･蜉幄・蜍募喧**: Alt+Enter 騾∽ｿ｡縲√ヵ繧｡繧､繝ｫ謖・､ｺ縺ｮ謚穂ｸ九∽ｸ崎ｦ√ち繝悶・閾ｪ蜍輔け繝ｭ繝ｼ繧ｺ縲・- **繝槭Ν繝√せ繝ｬ繝・ラ蟾｡蝗・*: Cascade 縺ｮ蜷・せ繝ｬ繝・ラ繧貞ｷ｡蝗槭＠縲√が繝ｬ繝ｳ繧ｸ濶ｲ縺ｮ Run 繝懊ち繝ｳ繧呈､懷・縺励※繝輔か繝ｼ繧ｫ繧ｹ縲・- **繝ｦ繝ｼ繧ｶ繝ｼ謫堺ｽ懷━蜈・*: `A_TimeIdlePhysical` 繧堤屮隕悶＠縲√・繧ｦ繧ｹ/繧ｭ繝ｼ謫堺ｽ應ｸｭ縺ｯ莉句・繧呈椛豁｢縲・- **螳牙・繝医げ繝ｫ**: 蜿ｳ竊貞ｷｦ蜷梧凾繧ｯ繝ｪ繝・け縺ｾ縺溘・・井ｻｻ諢剰ｨｭ螳壹・・宇8/F9 縺ｧ ON/OFF縲・
## 2. 蟆主・謇矩・1. **邂｡逅・・ｨｩ髯舌〒螳溯｡・*: AHK v1.1 繧偵う繝ｳ繧ｹ繝医・繝ｫ蠕後～windsurf_autopilot.ahk` 繧偵ム繝悶Ν繧ｯ繝ｪ繝・け縲６AC 繝励Ο繝ｳ繝励ヨ縺ｯ縲後・縺・阪・2. **UTF-8(BOM) 菫晏ｭ・*: 譌･譛ｬ隱槭・菴ｿ縺｣縺ｦ縺・↑縺・′縲∬ｦ∽ｻｶ縺ｫ蜷医ｏ縺帷ｷｨ髮・凾縺ｯ UTF-8(BOM) 繧堤ｶｭ謖√・3. **險ｭ螳壼､邱ｨ髮・*: 繝輔ぃ繧､繝ｫ蜈磯ｭ縺ｮ `global` 螳夂ｾｩ縺ｧ謖吝虚繧定ｪｿ謨ｴ・井ｾ・ `AutoStartWhenWindsurfRunning := true`・峨・
## 3. 謫堺ｽ懈婿豕・| 謫堺ｽ・| 譌｢螳壼､ | 隱ｬ譏・|
| --- | --- | --- |
| 閾ｪ蜍暮幕蟋・| `AutoStartWhenWindsurfRunning := false` | true 縺ｫ縺吶ｋ縺ｨ Windsurf 繝励Ο繧ｻ繧ｹ讀懃衍縺ｧ閾ｪ蜍・ON |
| 蜿ｳ竊貞ｷｦ繧ｯ繝ｪ繝・け | 譛牙柑 | 繝槭え繧ｹ縺ｮ縺ｿ縺ｧ AUTO ON/OFF 繧貞・譖ｿ縲ＡRequireRightFirstForToggle` 縺ｧ蛻ｶ蠕｡ |
| F8/F9 | `EnableKeyboardHotkeys := false` | true 縺ｫ縺吶ｌ縺ｰ F8=髢句ｧ九：9=蛛懈ｭ｢・・indsurf 繧｢繧ｯ繝・ぅ繝匁凾縺ｮ縺ｿ・・|
| Shift+Esc | `EnableResetHotkey := true` | 邱頑･蛛懈ｭ｢・・憾諷九Μ繧ｻ繝・ヨ縲ゆｸ崎ｦ√↑繧・false |

HUD 縺ｯ逕ｻ髱｢蜿ｳ荳奇ｼ・HudAnchorRightPx`, `HudAnchorTopPx`・峨↓蟶ｸ鬧舌＠縲∫憾諷九ｒ濶ｲ縺ｧ陦ｨ遉ｺ縺励∪縺吶・
## 4. Timers / 荳ｻ縺ｪ讖溯・
- **TimerPulse**: 繧ｪ繝ｬ繝ｳ繧ｸ讀懃衍邨先棡繧貞渕縺ｫ Alt+Enter 騾∽ｿ｡縲よ怙蟆城俣髫斐√ヰ繝ｼ繧ｹ繝井ｸ企剞縲√け繝ｼ繝ｫ繝繧ｦ繝ｳ繧貞・阡ｵ縲・- **TimerPatrol**: 蜷・Windsurf 繧ｦ繧｣繝ｳ繝峨え繧貞ｷ｡蝗槭＠縲ヽun 繝懊ち繝ｳ繧貞ｺ・ｯ・峇・亥承荳倶ｸｭ蠢・ｼ峨〒 PixelSearch縲りｦ九▽縺九ｉ縺ｪ縺・ｴ蜷医・繧ｿ繝門ｷ｡蝗槭ｒ蜻ｼ縺ｳ蜃ｺ縺励・- **TimerFileWatch**: `docs/inbox/next_instruction.txt` 繧堤屮隕悶＠縲∝・螳ｹ繧定ｲｼ繧贋ｻ倥￠竊但lt+Enter竊偵ヵ繧｡繧､繝ｫ蜑企勁縲・- **TimerCloseTabs**: `Commit/Index/Merge` 遲峨・荳譎ゅち繝悶ｒ閾ｪ蜍輔〒 `Ctrl+W`縲・
## 5. 繧ｿ繝門ｷ｡蝗橸ｼ・ascade 蟇ｾ蠢懶ｼ・- `EnableTabCycle := true` 縺ｧ譛牙柑縲・- Run 繝懊ち繝ｳ縺瑚ｦ句ｽ薙◆繧峨↑縺・ｴ蜷医～Ctrl+PgDn` 繧呈怙螟ｧ `TabCycleMaxSteps` 蝗樣∽ｿ｡縺励∬ｵｷ轤ｹ繧ｿ繝悶∈謌ｻ繧九・- `TabCycleCooldownMs` 縺ｫ繧医ｊ鬆ｻ郢√↑蛻・崛繧呈椛豁｢縲・
## 6. 螳牙・荳翫・豕ｨ諢・- `IdleThresholdMs` 繧堤洒縺上＠縺吶℃繧九→謇句虚謫堺ｽ懊→遶ｶ蜷医＠縺ｾ縺吶・00ms縲・s 繧呈耳螂ｨ縲・- `ClickOrangeBeforeAltEnter` 繧・false 縺ｫ縺吶ｋ縺ｨ縲√ヵ繧ｩ繝ｼ繧ｫ繧ｹ縺縺大ｽ薙※縺ｦ Alt+Enter 繧帝√ｋ繝｢繝ｼ繝峨↓縺ｪ繧翫∪縺吶・- 繧ｿ繝門ｷ｡蝗樔ｸｭ繧・`IsSafeToAct()` 繧貞・繝√ぉ繝・け縺吶ｋ縺溘ａ縲√Θ繝ｼ繧ｶ繝ｼ謫堺ｽ懊′蜈･縺｣縺溘ｉ蜊ｳ蛛懈ｭ｢縺励∪縺吶・
## 7. 繝医Λ繝悶Ν繧ｷ繝･繝ｼ繝・ぅ繝ｳ繧ｰ
| 逞・憾 | 蟇ｾ蠢・|
| --- | --- |
| HUD 縺檎樟繧後↑縺・/ `Invalid option` | 蜈磯ｭ縺ｮ `HudAnchor*` 繧堤ｷｨ髮・ｾ後～Gui, Show` 繧堤峩謗･險育ｮ励○縺壼､画焚繧呈検繧薙〒縺・ｋ縺狗｢ｺ隱・|
| Alt+Enter 縺碁｣謇薙＆繧後ｋ | `MinAltEnterIntervalMs` 繧剃ｸ翫￡繧九～MaxAltEnterBurstCount` 繧剃ｸ九￡繧・|
| Run 繝懊ち繝ｳ繧定ｦ句､ｱ縺・| `SearchArea*` 豈皮紫繧定ｪｿ謨ｴ縺励∝承荳句ｯ・ｊ縺ｮ繧ｨ繝ｪ繧｢繧貞ｺ・￡繧・|
| 繧ｿ繝門ｷ｡蝗槭′豁｢縺ｾ繧峨↑縺・| `TabCycleMaxSteps` 繧貞｢玲ｸ帙＠縲∫ｵゆｺ・凾縺ｫ HUD 縺・OFF 縺ｫ縺ｪ繧九°遒ｺ隱・|

## 8. 蜿り・- 繧ｹ繧ｯ繝ｪ繝励ヨ: `scripts/ahk/windsurf_autopilot.ahk`
- 繧ｭ繝ｼ繝槭ャ繝励・險ｭ險郁ｳ・侭: `Windsurf_AHK_Keymap.md`, `Windsurf_AHK_Design.md`
