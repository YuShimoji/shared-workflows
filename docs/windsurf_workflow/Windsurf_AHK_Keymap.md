# Windsurf Autopilot Keymap Reference

繧ｪ繝ｼ繝医ヱ繧､繝ｭ繝・ヨ縺ｧ蛻ｩ逕ｨ縺吶ｋ繝帙ャ繝医く繝ｼ・上せ繧､繝・メ縺ｮ荳隕ｧ縲ゅお繝ｳ繝峨Θ繝ｼ繧ｶ繝ｼ縺・`scripts/ahk/windsurf_autopilot.ahk` 縺ｮ `global` 險ｭ螳壹ｒ隱ｿ謨ｴ縺吶ｋ髫帙・繝ｪ繝輔ぃ繝ｬ繝ｳ繧ｹ縺ｨ縺励※菴ｿ逕ｨ縺吶ｋ縲・
## 1. 繧ｰ繝ｭ繝ｼ繝舌Ν險ｭ螳壹→諢丞袖
| 螟画焚 | 譌｢螳壼､ | 隱ｬ譏・|
| --- | --- | --- |
| `EnableKeyboardHotkeys` | `false` | true 縺ｧ F8/F9 繧呈怏蜉ｹ (Windsurf 繧｢繧ｯ繝・ぅ繝匁凾縺ｮ縺ｿ) |
| `EnableResetHotkey` | `true` | true 縺ｧ Shift+Esc 繧堤ｷ頑･繝ｪ繧ｻ繝・ヨ縺ｫ蜑ｲ繧雁ｽ薙※ |
| `RequireRightFirstForToggle` | `true` | 蜿ｳ竊貞ｷｦ縺ｮ鬆・ｺ乗､懃衍縺ｧ隱､辷・ｒ髦ｲ豁｢ |
| `RightFirstWindowMs` | `350` | 蜿ｳ謚ｼ荳銀・蟾ｦ謚ｼ荳九・險ｱ螳ｹ譎る俣 (ms) |
| `AutoStartWhenWindsurfRunning` | `false` | true 縺ｧ Windsurf.exe 讀懷・譎ゅ↓閾ｪ蜍輔せ繧ｿ繝ｼ繝・|
| `AutoStartWhenWindsurfActive` | `false` | true 縺ｧ Windsurf 縺悟燕髱｢縺ｫ縺ｪ縺｣縺溽椪髢薙↓閾ｪ蜍輔せ繧ｿ繝ｼ繝・|
| `IdleThresholdMs` | `700` | 繝ｦ繝ｼ繧ｶ繝ｼ謫堺ｽ懷愛螳壹ゅ％繧後ｈ繧顔洒縺・→莉句・縺励ｄ縺吶￥縺ｪ繧・|
| `HudAnchorRightPx / HudAnchorTopPx` | `120 / 40` | HUD 縺ｮ蜿ｳ荳翫°繧峨・繧ｪ繝輔そ繝・ヨ |

## 2. 繝帙ャ繝医く繝ｼ荳隕ｧ
| 蜈･蜉・| 譛牙柑譚｡莉ｶ | 蜍穂ｽ・|
| --- | --- | --- |
| **蜿ｳ繧ｯ繝ｪ繝・け謚ｼ荳具ｼ句ｷｦ繧ｯ繝ｪ繝・け** | 蟶ｸ譎・(Windsurf 繧｢繧ｯ繝・ぅ繝・ | AUTO ON/OFF 繝医げ繝ｫ縲ＡClickToggleCooldownMs` 縺ｧ騾｣謇捺椛蛻ｶ |
| **F8** | `EnableKeyboardHotkeys := true` | AutoStart縲ＡIsWindsurfActive()` 縺・true 縺ｮ縺ｨ縺阪・縺ｿ蜿励￠莉倥￠ |
| **F9** | `EnableKeyboardHotkeys := true` | AutoStop |
| **Shift + Esc** | `EnableResetHotkey := true` | AutoReset・育憾諷九Μ繧ｻ繝・ヨ・・AUTO OFF・・|
| **Ctrl + PgDn** | `EnableTabCycle := true` 縺九▽ Run 繝懊ち繝ｳ譛ｪ讀懃衍 | TimerPatrol/MaybeCycleTabs 縺九ｉ騾∽ｿ｡縺輔ｌ縲∵ｬ｡繧ｹ繝ｬ繝・ラ縺ｸ遘ｻ蜍・|
| **Alt + Enter** | AUTO ON 縺ｧ譚｡莉ｶ謌千ｫ区凾 | 繧ｷ繧ｹ繝・Β縺瑚・蜍暮∽ｿ｡縲ＡMinAltEnterIntervalMs`/`MaxAltEnterBurstCount` 縺ｧ蛻ｶ蠕｡ |
| **Ctrl + W** | 荳崎ｦ√ち繝匁､懷・譎・| Git繧ｿ繝悶↑縺ｩ荳譎ゅン繝･繝ｼ繧定・蜍輔け繝ｭ繝ｼ繧ｺ |

## 3. Mouse Gesture Flow
1. 蜿ｳ繧ｯ繝ｪ繝・け繧呈款縺礼ｶ壹￠繧九・2. 350ms 莉･蜀・↓蟾ｦ繧ｯ繝ｪ繝・け繧呈款縺吶・3. HUD 縺ｮ濶ｲ縺悟､峨ｏ繧顔憾諷九′蛻・ｊ譖ｿ繧上ｋ縲・
`ClickToggleCooldownMs`・域里螳・650ms・峨ｈ繧顔洒縺・俣髫斐〒騾｣邯壹ヨ繧ｰ繝ｫ縺ｯ縺ｧ縺阪↑縺・・
## 4. 繧ｿ繝門ｷ｡蝗槭Ο繧ｸ繝・け
- `EnableTabCycle := true` 縺ｮ蝣ｴ蜷医ヽun 繝懊ち繝ｳ縺悟叙蠕励〒縺阪↑縺・→ `Ctrl+PgDn` 繧帝∽ｿ｡縲・- `TabCycleMaxSteps` 蝗槭〒謇薙■蛻・ｊ縲～TabCycleOriginHwnd` 繧貞・繧｢繧ｯ繝・ぅ繝門喧縲・- `TabCycleCooldownMs` 邨碁℃縺ｾ縺ｧ蜀榊ｷ｡蝗槭＠縺ｪ縺・・
## 5. 隱ｿ謨ｴ縺ｮ謖・・
- **繧ｭ繝ｼ陦晉ｪ∝屓驕ｿ**: F8/F9 繧剃ｽｿ縺・ｴ蜷医・ VS Code 縺ｮ繝・ヵ繧ｩ繝ｫ繝・(F8=谺｡縺ｮ蝠城｡・ 縺ｨ縺ｮ驥崎､・↓豕ｨ諢上・- **閾ｪ蜍暮幕蟋・*: 繝・ヵ繧ｩ繝ｫ繝医・ OFF縲ゅメ繝ｼ繝譁ｹ驥昴↓蜷医ｏ縺帙※ `AutoStartWhenWindsurfRunning` 繧・true 縺ｫ縺吶ｋ縺ｪ縺ｩ縲、I 縺悟ｸｸ縺ｫ襍ｰ縺｣縺ｦ濶ｯ縺・ｴ髱｢縺ｧ縺ｮ縺ｿ譛牙柑蛹悶・- **邱頑･蛛懈ｭ｢**: Shift+Esc 莉･螟悶↓縲√ち繧ｹ繧ｯ繝槭ロ繝ｼ繧ｸ繝｣縺ｧ AHK 繧定誠縺ｨ縺呎焔谿ｵ繧ょ捉遏･縺励※縺翫￥縲・
## 6. 蜿ら・
- 繧ｬ繧､繝・ `Windsurf_AHK_Guide.md`
- 險ｭ險医ラ繧ｭ繝･繝｡繝ｳ繝・ `Windsurf_AHK_Design.md`
