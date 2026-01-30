# Windsurf Autopilot Design Notes

譛ｬ繝峨く繝･繝｡繝ｳ繝医・ `scripts/ahk/windsurf_autopilot.ahk` 縺ｮ險ｭ險域婿驥昴・繧｢繝ｫ繧ｴ繝ｪ繧ｺ繝繧偵∪縺ｨ繧√∝ｰ・擂縺ｮ謾ｹ菫ｮ譎ゅ↓蜿ら・縺ｧ縺阪ｋ繧医≧縺ｫ縺励◆繧ゅ・縺ｧ縺吶・
## 1. 逶ｮ逧・→繧ｹ繧ｳ繝ｼ繝・- Windsurf IDE (Cascade) 縺ｮ閾ｪ蠕九Ρ繝ｼ繧ｯ繝輔Ο繝ｼ繧堤┌莠ｺ蛹悶＠縲＾rchestrator/Agent 縺ｮ騾ｲ陦後ｒ豁｢繧√↑縺・・- 繝槭け繝ｭ證ｴ襍ｰ繝ｻ繝ｦ繝ｼ繧ｶ繝ｼ謫堺ｽ懊・荵励▲蜿悶ｊ繧帝亟縺弱▽縺､縲、lt+Enter・上ち繝門ｷ｡蝗橸ｼ乗欠遉ｺ繝輔ぃ繧､繝ｫ謚募・縺ｪ縺ｩ繧定・蜍募宛蠕｡縲・
## 2. 繧ｳ繝ｳ繝昴・繝阪Φ繝・### 2.1 HUD 繝ｬ繧､繝､繝ｼ
- GUI: `Gui, +AlwaysOnTop -Caption +ToolWindow +E0x20`
- 騾城℃繧ｦ繧｣繝ｳ繝峨え縺ｧ繧ｯ繝ｪ繝・け繧偵ヶ繝ｭ繝・け縺励↑縺・・- `HudAnchorRightPx`, `HudAnchorTopPx` 縺ｫ繧医ｊ逕ｻ髱｢蜿ｳ荳翫∈蝗ｺ螳壹・
### 2.2 繝医げ繝ｫ蛻ｶ蠕｡
- **Mouse Gesture**: 蜿ｳ繧ｯ繝ｪ繝・け謚ｼ荳倶ｸｭ縺ｫ蟾ｦ繧ｯ繝ｪ繝・け (`RequireRightFirstForToggle`)縲・- **Keyboard**: 莉ｻ諢剰ｨｭ螳・(`EnableKeyboardHotkeys`) 縺ｧ F8/F9縲・- **Reset**: Shift+Esc (莉ｻ諢剰ｨｭ螳・縲りｨｭ螳唹FF縺ｮ蝣ｴ蜷医∵焔蜍輔〒 AHK 繧堤ｵゆｺ・☆繧九・
### 2.3 繧ｻ繝ｼ繝輔ユ繧｣
- `IsSafeToAct()` 縺ｧ `A_TimeIdlePhysical` 縺ｨ菫ｮ鬟ｾ繧ｭ繝ｼ謚ｼ荳九ｒ逶｣隕悶・- `ResetAltEnterBurst()` 縺ｧ Alt+Enter 迥ｶ諷九・繧ｿ繝門ｷ｡蝗樒憾諷九ｒ螳悟・縺ｫ蛻晄悄蛹悶・- 繧ｿ繝門ｷ｡蝗樔ｸｭ繧・PixelSearch 荳ｭ繧る・蠎ｦ `IsSafeToAct()` 繧貞・隧穂ｾ｡縺励√Θ繝ｼ繧ｶ繝ｼ謫堺ｽ懊′蜈･繧後・蜊ｳ荳ｭ豁｢縲・
## 3. 荳ｻ縺ｪ繧ｿ繧､繝槭・縺ｮ繝輔Ο繝ｼ
```
TimerPulse 竊・(Idle蛻､螳・ 竊・(繧ｪ繝ｬ繝ｳ繧ｸ譛譁ｰ迥ｶ諷狗｢ｺ隱・ 竊・Alt+Enter騾∽ｿ｡ or Skip
TimerPatrol 竊・蜿ｳ荳矩㍾轤ｹPixelSearch 竊・隕九▽縺九ｉ縺ｪ縺代ｌ縺ｰ MaybeCycleTabs()
TimerFileWatch 竊・next_instruction.txt 蜿肴丐 竊・Alt+Enter
TimerCloseTabs 竊・Git邉ｻ繧ｿ繝悶ｒ髢峨§繧・```

### 3.1 繧ｪ繝ｬ繝ｳ繧ｸ讀懃衍
- 讀懃ｴ｢遽・峇繧・`SearchAreaLeftRatio~BottomRatio` 縺ｧ繝代Λ繝｡繝医Μ繝・け縺ｫ螳夂ｾｩ縲・- 譛菴主ｹ・・鬮倥＆繧・`SearchAreaMinWidthPx/MinHeightPx` 縺ｧ菫晁ｨｼ縺励；UI邵ｮ蟆冗腸蠅・〒繧よ､懃衍縲・- `PixelSearch` 縺ｮ險ｱ螳ｹ隱､蟾ｮ縺ｯ 15 (`Fast RGB`)縲り牡縺悟､牙虚縺吶ｋ蝣ｴ蜷医・縺薙％繧定ｪｿ謨ｴ縺吶ｋ縲・
### 3.2 Alt+Enter 騾∽ｿ｡蛻ｶ蠕｡
- `MinAltEnterIntervalMs`, `MaxAltEnterBurstCount`, `AltEnterBurstCooldownMs` 縺ｫ繧医ｊ縲∝ｸｸ譎る｣謇薙ｒ髦ｲ豁｢縲・- `ClickOrangeBeforeAltEnter` true 縺ｧ Run 繝懊ち繝ｳ繧偵け繝ｪ繝・け縺励※縺九ｉ騾∽ｿ｡縲・
### 3.3 繧ｿ繝門ｷ｡蝗槭い繝ｫ繧ｴ繝ｪ繧ｺ繝
1. TimerPatrol 縺・Run 繝懊ち繝ｳ繧定ｦ九▽縺代ｉ繧後↑縺・ｴ蜷・`MaybeCycleTabs()` 繧貞他縺ｳ蜃ｺ縺吶・2. `Ctrl+PgDn` 繧帝∽ｿ｡縲～TabCycleSteps` 繧偵う繝ｳ繧ｯ繝ｪ繝｡繝ｳ繝医・3. `TabCycleMaxSteps` 縺ｫ驕斐＠縺溘ｉ `TabCycleOriginHwnd` 繧貞・繧｢繧ｯ繝・ぅ繝悶↓縺励～TabCycleCooldownMs` 縺縺大ｷ｡蝗槭ｒ蛛懈ｭ｢縲・4. 蟾｡蝗樣比ｸｭ縺ｧ繧・Run 繝懊ち繝ｳ繧呈､懃衍縺吶ｌ縺ｰ繧ｫ繧ｦ繝ｳ繧ｿ縺ｨ繧ｯ繝ｼ繝ｫ繝繧ｦ繝ｳ繧偵Μ繧ｻ繝・ヨ縲・
## 4. 莉雁ｾ後・髢狗匱繧｢繧､繝・い
1. **繝舌ャ繧ｯ繧ｰ繝ｩ繧ｦ繝ｳ繝蛾∽ｿ｡繝｢繝ｼ繝・*: WinActivate 繧剃ｽｿ繧上★縺ｫ蟇ｾ雎｡繧ｦ繧｣繝ｳ繝峨え縺ｸ繝｡繝・そ繝ｼ繧ｸ繧帝√ｋ・・endMessage/PostMessage 縺ｸ縺ｮ鄂ｮ謠幢ｼ峨・2. **繝ｬ繧､繧｢繧ｦ繝亥ｭｦ鄙・*: PixelSearch 繧定｣懷勧縺吶ｋ縺溘ａ縲，ascade 蜀・Κ縺ｮ UI 隕∫ｴ繧・OCR/逕ｻ蜒上ユ繝ｳ繝励Ξ繝ｼ繝医〒陬懷ｮ後＠縲√が繝ｬ繝ｳ繧ｸ濶ｲ莉･螟悶・繝医Μ繧ｬ繧よ､懆ｨ弱・3. **蟾｡蝗槭・繝ｪ繧ｷ繝ｼ諡｡蠑ｵ**: `Ctrl+[ / Ctrl+]` 繧・靴ascade: Focus on Next Thread縲阪さ繝槭Φ繝峨ｒ蜿悶ｊ蜈･繧後√ち繝門ｷ｡蝗槭→螻･豁ｴ蟾｡蝗槭ｒ蛻・ｊ譖ｿ縺医ｋ縲・4. **Diagnostics 繝代ロ繝ｫ**: HUD 霑代￥縺ｫ繝溘ル繝ｭ繧ｰ・域怙蠕後・ Alt+Enter 譎ょ綾繧・ち繝門ｷ｡蝗槫屓謨ｰ・峨ｒ陦ｨ遉ｺ縺吶ｋ繧ｪ繝励す繝ｧ繝ｳ縲・5. **繝ｦ繝九ャ繝医ユ繧ｹ繝茨ｼ上す繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ**: `AutoHotkey.dll` 繧堤畑縺・◆繧ｷ繝溘Η繝ｬ繝ｼ繧ｷ繝ｧ繝ｳ迺ｰ蠅・√∪縺溘・ Powershell 縺九ｉ縺ｮ繝｢繝・け蜈･蜉帙〒蝗槫ｸｰ繝・せ繝医ｒ閾ｪ蜍募喧縲・
## 5. 繝輔ぃ繧､繝ｫ髢｢騾｣
- 繧ｹ繧ｯ繝ｪ繝励ヨ譛ｬ菴・ `scripts/ahk/windsurf_autopilot.ahk`
- 繧ｬ繧､繝・ `Windsurf_AHK_Guide.md`
- 繧ｭ繝ｼ繝槭ャ繝・ `Windsurf_AHK_Keymap.md`
- 蟆・擂縺薙・險ｭ險医ラ繧ｭ繝･繝｡繝ｳ繝医ｒ譖ｴ譁ｰ縺吶ｋ蝣ｴ蜷医・縲∽ｸ願ｨ・3 縺､縺ｮ謨ｴ蜷域ｧ繧ょ酔譎ゅ↓遒ｺ隱阪☆繧九・
