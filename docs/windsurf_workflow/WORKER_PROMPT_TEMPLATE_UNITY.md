# Worker Prompt Template・・nity迚・/ Orchestrator縺梧ｯ主屓逕滓・ / 繧ｳ繝斐・逕ｨ・・
> Orchestrator 縺・`docs/tasks/TASK_*.md` 繧貞・縺ｫ Worker 繧ｹ繝ｬ繝・ラ縺ｸ雋ｼ繧贋ｻ倥￠繧区怙蟆上・繝ｭ繝ｳ繝励ヨ縺ｮ繝吶・繧ｹ・・nity繝励Ο繧ｸ繧ｧ繧ｯ繝亥髄縺托ｼ峨・ 
> Orchestrator 繝｡繧ｿ繝励Ο繝ｳ繝励ヨ縺ｨ蜷後§縲後ヵ繧ｧ繝ｼ繧ｺ讒区・ / 邊貞ｺｦ縲阪〒菴懊ｊ縲仝orker蛛ｴ縺ｧ繧・Phase 0縲・ 繧呈・遉ｺ縺励※邨ｱ邇・ｒ謠・∴繧九・ 
> **Unity蝗ｺ譛峨・讀懆ｨｼ謇矩・∝●豁｢譚｡莉ｶ縲∵ｳｨ諢冗せ繧定ｿｽ蜉縺励◆繝舌・繧ｸ繝ｧ繝ｳ**縲・
---

## 0. 逕滓・繝ｫ繝ｼ繝ｫ・・rchestrator蜷代￠・・
- 1繝√こ繝・ヨ = 1 code block縲ゅメ繧ｱ繝・ヨ縺ｮ DoD / Tier / Branch / Focus / Forbidden / Report / GitHubAutoApprove / Pending Items 繧貞ｿ・★蝓九ａ繧九・- 螟画焚・井ｾ具ｼ・
  - `TICKET_PATH`, `TIER`, `BRANCH`, `FOCUS_AREA`, `FORBIDDEN_AREA`, `DOD`, `REPORT_PATH_TARGET`, `HANDOVER_SECTIONS`, `PENDING_ITEMS`
- 蠢・医〒譖ｸ縺上％縺ｨ:
  - 邏榊刀迚ｩ: `docs/inbox/REPORT_...md`
  - 蜿ら・繝輔ぃ繧､繝ｫ: `docs/Windsurf_AI_Collab_Rules_latest.md`, `docs/HANDOVER.md`, 繝√こ繝・ヨ
  - 蛛懈ｭ｢譚｡莉ｶ / 蛛懈ｭ｢譎ゅい繧ｦ繝医・繝・ヨ / 螳御ｺ・凾繝√Ε繝・ヨ1陦・  - **MISSION_LOG.md 縺ｮ譛譁ｰ迥ｶ諷・*: 迴ｾ蝨ｨ縺ｮ繝輔ぉ繝ｼ繧ｺ縲・ｲ謐励√さ繝ｳ繝・く繧ｹ繝域ュ蝣ｱ繧貞性繧√ｋ縲・  - **Unity蝗ｺ譛峨・讀懆ｨｼ謇矩・*: Unity Editor謇句虚讀懆ｨｼ縲ゞnity Test Runner縺ｧ縺ｮ繝・せ繝亥ｮ溯｡梧焔鬆・- 蜿ｯ螟峨↓縺励※繧医＞:
  - 繧ｳ繝槭Φ繝牙呵｣懶ｼ亥､夜Κ騾壻ｿ｡/萓晏ｭ倩ｿｽ蜉/遐ｴ螢顔噪謫堺ｽ懊′邨｡繧蝣ｴ蜷医・蛛懈ｭ｢譚｡莉ｶ縺ｸ・・  - 繝励Ο繧ｸ繧ｧ繧ｯ繝亥崋譛峨・鄂繧・､懆ｨｼ隕ｳ轤ｹ
  - Unity蝗ｺ譛峨・讀懆ｨｼ謇矩・ｼ医・繝ｭ繧ｸ繧ｧ繧ｯ繝医↓繧医▲縺ｦ逡ｰ縺ｪ繧句ｴ蜷茨ｼ・
---

## 1. Worker Prompt・医ユ繝ｳ繝励Ξ / 鄂ｮ謠帙＠縺ｦ菴ｿ縺・ｼ・
```xml
<instruction>
縺ゅ↑縺溘・蛻・淵髢狗匱繝√・繝縺ｮ Worker 縺ｧ縺吶ょ牡繧雁ｽ薙※繧峨ｌ縺・1 繧ｿ繧ｹ繧ｯ縺縺代ｒ螳碁≠縺励∬ｨｼ霍｡繧呈ｮ九＠縺ｦ縺上□縺輔＞縲・**Unity繝励Ο繧ｸ繧ｧ繧ｯ繝亥髄縺代ち繧ｹ繧ｯ**縺ｮ縺溘ａ縲ゞnity Editor荳翫〒縺ｮ謇句虚讀懆ｨｼ縺ｨUnity Test Runner縺ｧ縺ｮ繝・せ繝亥ｮ溯｡後′蠢・ｦ√↑蝣ｴ蜷医′縺ゅｊ縺ｾ縺吶・</instruction>

<context>
<mission_log>
菴懈･ｭ髢句ｧ区凾縺ｫ `.cursor/MISSION_LOG.md` 繧定ｪｭ縺ｿ霎ｼ縺ｿ縲∫樟蝨ｨ縺ｮ繝輔ぉ繝ｼ繧ｺ縺ｨ騾ｲ謐励ｒ遒ｺ隱阪＠縺ｦ縺上□縺輔＞縲・菴懈･ｭ螳御ｺ・凾縺ｫ MISSION_LOG.md 繧呈峩譁ｰ縺励・ｲ謐励ｒ險倬鹸縺励※縺上□縺輔＞縲・</mission_log>

<ssot_reference>
Phase 0: 蜿ら・縺ｨ謨ｴ蛯・- SSOT: .shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md・育┌縺代ｌ縺ｰ docs/ 驟堺ｸ九ｒ蜿ら・縺励∝ｿ・★ `ensure-ssot.js` 縺ｧ蜿門ｾ励ｒ隧ｦ縺呻ｼ・- 騾ｲ謐・ docs/HANDOVER.md
- 繝√こ繝・ヨ: <TICKET_PATH>
- SSOT 譛ｪ謨ｴ蛯吶・ensure-ssot.js 荳榊惠縺ｧ隗｣豎ｺ縺ｧ縺阪↑縺・ｴ蜷医・蛛懈ｭ｢譚｡莉ｶ
</ssot_reference>

<preconditions>
Phase 1: 蜑肴署縺ｮ蝗ｺ螳・- Tier: <TIER>
- Branch: <BRANCH>
- Report Target: <REPORT_PATH_TARGET>
- GitHubAutoApprove: docs/HANDOVER.md 縺ｮ險倩ｿｰ繧貞盾辣ｧ・域悴險倩ｼ峨↑繧・push 遖∵ｭ｢・・- 繝悶Λ繝ｳ繝√′逡ｰ縺ｪ繧句ｴ蜷・
  - `git status -sb` 縺ｧ譛ｪ繧ｳ繝溘ャ繝医′辟｡縺・％縺ｨ繧堤｢ｺ隱・  - `git switch <BRANCH>` 縺ｧ蛻・崛繧定ｩｦ縺・  - 遐ｴ螢顔噪謫堺ｽ懊′蠢・ｦ√↑繧牙●豁｢譚｡莉ｶ
</preconditions>

<boundaries>
Phase 2: 蠅・阜
- Focus Area: <FOCUS_AREA>・医％縺ｮ遽・峇縺ｮ縺ｿ螟画峩蜿ｯ閭ｽ・・- Forbidden Area: <FORBIDDEN_AREA>・郁ｧｦ繧後ｋ蠢・ｦ√′蜃ｺ縺溘ｉ蛛懈ｭ｢譚｡莉ｶ・・  - **Unity蝗ｺ譛・*: `ProjectSettings/`, `Packages/` 縺ｯ騾壼ｸｸ Forbidden Area 縺ｫ蜷ｫ縺ｾ繧後ｋ
- DoD: <DOD>・亥ｮ御ｺ・凾縺ｫ繝√ぉ繝・け繝ｪ繧ｹ繝医ｒ蝓九ａ縲∵ｹ諡繧呈ｮ九☆・・  - **Unity蝗ｺ譛・*: Unity Editor謇句虚讀懆ｨｼ縲ゞnity Test Runner縺ｧ縺ｮ繝・せ繝亥ｮ溯｡後′蠢・ｦ√↑蝣ｴ蜷医∝・菴鍋噪縺ｪ讀懆ｨｼ邨先棡繧定ｨ倬鹸縺吶ｋ
</boundaries>
</context>

<workflow>
<phase name="Phase 0: 蜿ら・縺ｨ謨ｴ蛯・>
<step>
1. `.cursor/MISSION_LOG.md` 繧定ｪｭ縺ｿ霎ｼ縺ｿ縲∫樟蝨ｨ縺ｮ繝輔ぉ繝ｼ繧ｺ縺ｨ騾ｲ謐励ｒ遒ｺ隱阪・2. SSOT: .shared-workflows/docs/Windsurf_AI_Collab_Rules_latest.md・育┌縺代ｌ縺ｰ docs/ 驟堺ｸ九ｒ蜿ら・縺励∝ｿ・★ `ensure-ssot.js` 縺ｧ蜿門ｾ励ｒ隧ｦ縺呻ｼ・3. 騾ｲ謐・ docs/HANDOVER.md
4. 繝√こ繝・ヨ: <TICKET_PATH>・・*蟄伜惠遒ｺ隱・ `Test-Path <TICKET_PATH>` 縺ｾ縺溘・ `ls <TICKET_PATH>`**・・5. SSOT 譛ｪ謨ｴ蛯吶・ensure-ssot.js 荳榊惠縺ｧ隗｣豎ｺ縺ｧ縺阪↑縺・ｴ蜷医・蛛懈ｭ｢譚｡莉ｶ
</step>
</phase>

<phase name="Phase 1: 蜑肴署縺ｮ蝗ｺ螳・>
<step>
1. Tier: <TIER>
2. Branch: <BRANCH>
3. Report Target: <REPORT_PATH_TARGET>
4. GitHubAutoApprove: docs/HANDOVER.md 縺ｮ險倩ｿｰ繧貞盾辣ｧ・域悴險倩ｼ峨↑繧・push 遖∵ｭ｢・・5. 繝悶Λ繝ｳ繝√′逡ｰ縺ｪ繧句ｴ蜷・
   - `git status -sb` 縺ｧ譛ｪ繧ｳ繝溘ャ繝医′辟｡縺・％縺ｨ繧堤｢ｺ隱・   - `git switch <BRANCH>` 縺ｧ蛻・崛繧定ｩｦ縺・   - 遐ｴ螢顔噪謫堺ｽ懊′蠢・ｦ√↑繧牙●豁｢譚｡莉ｶ
6. MISSION_LOG.md 繧呈峩譁ｰ・・hase 1 螳御ｺ・ｒ險倬鹸・峨・</step>
</phase>

<phase name="Phase 2: 蠅・阜遒ｺ隱・>
<step>
1. Focus Area: <FOCUS_AREA>・医％縺ｮ遽・峇縺ｮ縺ｿ螟画峩蜿ｯ閭ｽ縲・*蟄伜惠遒ｺ隱阪＠縺ｦ縺九ｉ蜿ら・**・・2. Forbidden Area: <FORBIDDEN_AREA>・郁ｧｦ繧後ｋ蠢・ｦ√′蜃ｺ縺溘ｉ蛛懈ｭ｢譚｡莉ｶ・・   - **Unity蝗ｺ譛・*: `ProjectSettings/`, `Packages/` 縺ｯ騾壼ｸｸ Forbidden Area 縺ｫ蜷ｫ縺ｾ繧後ｋ
3. DoD: <DOD>・亥ｮ御ｺ・凾縺ｫ繝√ぉ繝・け繝ｪ繧ｹ繝医ｒ蝓九ａ縲∵ｹ諡繧呈ｮ九☆・・   - **Unity蝗ｺ譛・*: Unity Editor謇句虚讀懆ｨｼ縲ゞnity Test Runner縺ｧ縺ｮ繝・せ繝亥ｮ溯｡後′蠢・ｦ√↑鬆・岼繧堤｢ｺ隱・4. MISSION_LOG.md 繧呈峩譁ｰ・・hase 2 螳御ｺ・ｒ險倬鹸・峨・</step>
</phase>

<phase name="Phase 3: 螳溯｡後Ν繝ｼ繝ｫ">
<step>
1. **DoD 蜷・・岼縺ｮ螳溯｡悟庄閭ｽ諤ｧ遒ｺ隱搾ｼ亥ｿ・茨ｼ・*:
   - DoD 蜷・・岼繧堤｢ｺ隱阪＠縲∝ｮ溯｡悟庄閭ｽ縺九←縺・°繧貞愛譁ｭ縺吶ｋ
   - **Unity蝗ｺ譛・*: Unity Editor謇句虚讀懆ｨｼ縺悟ｿ・ｦ√↑鬆・岼縺後≠繧句ｴ蜷医∝ｮ溯｣・ｾ後↓Unity Editor縺ｧ遒ｺ隱阪☆繧・   - **Unity蝗ｺ譛・*: Unity Test Runner縺ｧ縺ｮ繝・せ繝亥ｮ溯｡後′蠢・ｦ√↑鬆・岼縺後≠繧句ｴ蜷医ゞnity Test Runner縺ｾ縺溘・繧ｳ繝槭Φ繝峨Λ繧､繝ｳ縺ｧ螳溯｡後☆繧・   - 迺ｰ蠅・ｾ晏ｭ倥・繧ｿ繧ｹ繧ｯ・・it history 隱ｿ譟ｻ縺ｪ縺ｩ・峨・蝣ｴ蜷・
     - Git繝ｪ繝昴ず繝医Μ縺ｧ縺ｯ縺ｪ縺・腸蠅・〒縺ｯ縲～git log` 縺ｪ縺ｩ縺ｮ繧ｳ繝槭Φ繝峨・螳溯｡御ｸ榊庄閭ｽ
     - 縺薙・蝣ｴ蜷医・*蛛懈ｭ｢譚｡莉ｶ縺ｨ縺励※謇ｱ縺・*縺九・*莉｣譖ｿ謇区ｮｵ繧貞叙繧・*縺九ｒ蛻､譁ｭ縺吶ｋ
     - 蛻､譁ｭ縺ｫ霑ｷ縺・ｴ蜷医・縲∝●豁｢譚｡莉ｶ縺ｨ縺励※謇ｱ縺・
2. 繝√Ε繝・ヨ縺ｧ螳檎ｵ舌＆縺帙↑縺・よ・譫懊・繝輔ぃ繧､繝ｫ・・ocs/tasks / docs/inbox / docs/HANDOVER / git・峨↓谿九☆縲・
3. 繧ｳ繝槭Φ繝峨・螳溯｡後＠縺ｦ邨先棡縺ｧ蛻､譁ｭ縲ょ､ｱ謨励・縲悟､ｱ謨励阪→譏手ｨ倥＠縲∵ｹ諡縺ｨ谺｡謇九ｒ蜃ｺ縺吶・
4. 謖・､ｺ繧ｳ繝槭Φ繝峨′辟｡縺・ｴ蜷・ `Get-Command <cmd>` 遲峨〒遒ｺ隱・竊・莉｣譖ｿ譯域署遉ｺ 竊・縺昴ｌ縺ｧ繧ゆｾ晏ｭ倩ｿｽ蜉/螟夜Κ騾壻ｿ｡縺悟ｿ・ｦ√↑繧牙●豁｢縲・
5. 縲悟ｿｵ縺ｮ縺溘ａ縲阪・繝・せ繝・繝輔か繝ｼ繝ｫ繝舌ャ繧ｯ/繝ｪ繝輔ぃ繧ｯ繧ｿ縺ｯ遖∵ｭ｢・・oD 蠕灘ｱ槭・縺ｿ・峨・
6. 繝繝悶Ν繝√ぉ繝・け:
   - 繝・せ繝・Push/髟ｷ譎る俣蠕・ｩ溘・邨先棡繧堤｢ｺ隱阪＠縲∵悴驕斐↑繧牙ｮ御ｺ・桶縺・↓縺励↑縺・・   - `git status -sb` 縺ｧ蟾ｮ蛻・ｒ蟶ｸ縺ｫ謚頑升・・it繝ｪ繝昴ず繝医Μ縺ｧ縺ｯ縺ｪ縺・ｴ蜷医・繧ｹ繧ｭ繝・・蜿ｯ閭ｽ・峨・   - **Unity蝗ｺ譛・*: Unity Editor縺ｧ縺ｮ繧ｳ繝ｳ繝代う繝ｫ繧ｨ繝ｩ繝ｼ縺後↑縺・％縺ｨ繧堤｢ｺ隱搾ｼ・Unity Editor=繧ｳ繝ｳ繝代う繝ｫ謌仙粥`・・
7. 繧ｿ繧､繝繧｢繧ｦ繝医ｒ螳｣險縺励∫┌髯仙ｾ・ｩ溘＠縺ｪ縺・・
8. MISSION_LOG.md 繧呈峩譁ｰ・・hase 3 螳御ｺ・ｒ險倬鹸縲∝ｮ溯｡悟・螳ｹ繧定ｨ倬鹸・峨・</step>
</phase>

<phase name="Phase 4: 邏榊刀 & 讀懆ｨｼ">
<step>
**蠢・・ DoD 縺ｮ螳滄圀縺ｮ驕疲・遒ｺ隱搾ｼ郁｡ｨ髱｢逧・↑遒ｺ隱阪〒縺ｯ縺ｪ縺上∝ｮ滄圀縺ｫ螳滓命縺励◆蜀・ｮｹ繧定ｨ倬鹸・・*

1. **DoD 蜷・・岼縺ｮ驕疲・遒ｺ隱搾ｼ亥ｿ・茨ｼ・*:
   - DoD 蜷・・岼縺ｫ蟇ｾ縺励※縲・*螳滄圀縺ｫ螳滓命縺励◆蜀・ｮｹ**繧定ｨ倬鹸縺吶ｋ・医檎｢ｺ隱肴ｸ医∩縲阪↑縺ｩ縺ｮ陦ｨ髱｢逧・↑險倩ｿｰ縺ｯ遖∵ｭ｢・・   - **Unity蝗ｺ譛・*: Unity Editor荳翫〒縺ｮ謇句虚讀懆ｨｼ縺悟ｿ・ｦ√↑鬆・岼縺後≠繧句ｴ蜷医∝・菴鍋噪縺ｪ讀懆ｨｼ謇矩・→邨先棡繧定ｨ倬鹸縺吶ｋ
     - 萓・ `Unity Editor謇句虚讀懆ｨｼ=繝励Μ繧ｻ繝・ヨ菫晏ｭ倥・隱ｭ縺ｿ霎ｼ縺ｿ繝ｻ蜑企勁繝ｻ荳隕ｧ譖ｴ譁ｰ繧堤｢ｺ隱阪∵ｭ｣蟶ｸ蜍穂ｽ懊ｒ遒ｺ隱港
   - **Unity蝗ｺ譛・*: Unity Test Runner縺ｧ縺ｮ繝・せ繝亥ｮ溯｡後′蠢・ｦ√↑鬆・岼縺後≠繧句ｴ蜷医√ユ繧ｹ繝亥ｮ溯｡檎ｵ先棡繧定ｨ倬鹸縺吶ｋ
     - 萓・ `Unity Test Runner=<繝・せ繝医け繝ｩ繧ｹ蜷・=<謌仙粥/螟ｱ謨・`, `<繝・せ繝域焚>=<謌仙粥謨ｰ>/<邱乗焚>`
   - **Unity蝗ｺ譛・*: 繧ｳ繝ｳ繝代う繝ｫ繧ｨ繝ｩ繝ｼ縺後↑縺・％縺ｨ繧堤｢ｺ隱阪＠縺溽ｵ先棡繧定ｨ倬鹸縺吶ｋ
     - 萓・ `Unity Editor=繧ｳ繝ｳ繝代う繝ｫ謌仙粥`
   - DoD 蜷・・岼縺ｮ驕疲・譬ｹ諡繧剃ｻ･荳九・蠖｢蠑上〒險倬鹸縺吶ｋ:
     - 螳滓命縺励◆繧ｳ繝槭Φ繝・ `<cmd>=<result>`
     - 螳滓命縺励◆隱ｿ譟ｻ: `<隱ｿ譟ｻ蜀・ｮｹ>=<邨先棡>`
     - 螳滓命縺励◆螳溯｣・ `<螳溯｣・・螳ｹ>=<邨先棡>`
   - **驥崎ｦ・*: DoD 縺ｫ縲携it history縲阪瑚ｪｿ譟ｻ縲阪悟・譫舌阪↑縺ｩ縺ｮ繧ｭ繝ｼ繝ｯ繝ｼ繝峨′蜷ｫ縺ｾ繧後※縺・ｋ蝣ｴ蜷医∝ｮ滄圀縺ｫ縺昴・隱ｿ譟ｻ繧貞ｮ滓命縺励◆蜀・ｮｹ繧定ｨ倬鹸縺吶ｋ縲ょｮ滓命縺励※縺・↑縺・ｴ蜷医・縲∝●豁｢譚｡莉ｶ縺ｨ縺励※謇ｱ縺・・
2. 繝√こ繝・ヨ繧・DONE 縺ｫ譖ｴ譁ｰ縺吶ｋ蜑阪↓縲．oD 蜷・・岼縺ｮ驕疲・譬ｹ諡繧堤｢ｺ隱阪☆繧・
   - DoD 蜷・・岼縺悟ｮ滄圀縺ｫ驕疲・縺輔ｌ縺ｦ縺・ｋ縺九ｒ遒ｺ隱阪☆繧・   - 迺ｰ蠅・ｾ晏ｭ倥〒螳溯｡御ｸ榊庄閭ｽ縺ｪ鬆・岼縺後≠繧句ｴ蜷医∝●豁｢譚｡莉ｶ縺ｨ縺励※謇ｱ縺・°縲∽ｻ｣譖ｿ謇区ｮｵ繧貞叙繧九°繧貞愛譁ｭ縺吶ｋ
   - 蛻､譁ｭ縺ｫ霑ｷ縺・ｴ蜷医・縲∝●豁｢譚｡莉ｶ縺ｨ縺励※謇ｱ縺・
3. 繝√こ繝・ヨ繧・DONE 縺ｫ譖ｴ譁ｰ縺励．oD 蜷・・岼縺ｫ蟇ｾ縺励※譬ｹ諡・亥ｷｮ蛻・or 繝・せ繝育ｵ先棡 or 隱ｿ譟ｻ邨先棡・峨ｒ險伜・

4. docs/inbox/ 縺ｫ繝ｬ繝昴・繝茨ｼ井ｻ･荳九ユ繝ｳ繝励Ξ・峨ｒ菴懈・/譖ｴ譁ｰ縺励～node .shared-workflows/scripts/report-validator.js <REPORT_PATH_TARGET>`・育┌縺代ｌ縺ｰ `node scripts/report-validator.js <REPORT_PATH_TARGET> REPORT_CONFIG.yml .`・峨ｒ螳溯｡後らｵ先棡繧偵Ξ繝昴・繝医↓險倩ｼ・
5. docs/HANDOVER.md 縺ｮ <HANDOVER_SECTIONS> 繧呈峩譁ｰ縺励∵ｬ｡蝗・Orchestrator 縺梧滑謠｡縺ｧ縺阪ｋ繧医≧險倬鹸

6. 螳溯｡後＠縺溘ユ繧ｹ繝医ｒ `<cmd>=<result>` 蠖｢蠑上〒繝ｬ繝昴・繝医→繝√こ繝・ヨ縺ｫ谿九☆
   - **Unity蝗ｺ譛・*: Unity Test Runner縺ｧ縺ｮ繝・せ繝亥ｮ溯｡檎ｵ先棡繧定ｨ倬鹸縺吶ｋ
     - 萓・ `Unity Test Runner=HeightMapGeneratorTests=14繝・せ繝域・蜉歔, `TerrainGeneratorIntegrationTests=7繝・せ繝域・蜉歔

7. `git status -sb` 繧偵け繝ｪ繝ｼ繝ｳ縺ｫ縺励※縺九ｉ commit・亥ｿ・ｦ√↑繧・push・峨Ｑush 縺ｯ GitHubAutoApprove=true 縺ｮ蝣ｴ蜷医・縺ｿ

8. MISSION_LOG.md 繧呈峩譁ｰ・・hase 4 螳御ｺ・ｒ險倬鹸縲∫ｴ榊刀迚ｩ縺ｮ繝代せ繧定ｨ倬鹸・峨・</step>
</phase>

<phase name="Phase 5: 繝√Ε繝・ヨ蜃ｺ蜉・>
<step>
1. 螳御ｺ・凾: `Done: <TICKET_PATH>. Report: <REPORT_PATH_TARGET>. Tests: <cmd>=<result>.`
   - **Unity蝗ｺ譛・*: Unity Test Runner縺ｧ縺ｮ繝・せ繝亥ｮ溯｡檎ｵ先棡繧貞性繧√ｋ
     - 萓・ `Done: docs/tasks/TASK_012_....md. Report: docs/inbox/REPORT_TASK_012_....md. Tests: Unity Test Runner=蜈ｨ50繝・せ繝域・蜉・`
2. 繝悶Ο繝・き繝ｼ邯咏ｶ壽凾: `Blocked: <TICKET_PATH>. Reason: <隕∫せ>. Next: <蛟呵｣・. Report: <REPORT_PATH_TARGET>.`
3. MISSION_LOG.md 繧呈峩譁ｰ・・hase 5 螳御ｺ・ｒ險倬鹸・峨・</step>
</phase>
</workflow>

<stop_conditions>
蛛懈ｭ｢譚｡莉ｶ:
- Forbidden Area 縺ｫ隗ｦ繧後↑縺・→隗｣豎ｺ縺ｧ縺阪↑縺・- 莉墓ｧ倅ｻｮ螳壹′3莉ｶ莉･荳・- SSOT 縺悟叙蠕励〒縺阪↑縺・/ `ensure-ssot.js` 縺ｧ繧りｧ｣豎ｺ荳榊庄
- 萓晏ｭ倩ｿｽ蜉 / 螟夜Κ騾壻ｿ｡・・etch/pull/push 遲会ｼ峨′蠢・ｦ√〒 GitHubAutoApprove=true 縺梧悴遒ｺ隱・- 遐ｴ螢顔噪繝ｻ蠕ｩ譌ｧ蝗ｰ髮｣謫堺ｽ懶ｼ・ebase/reset/force push 遲会ｼ峨′蠢・ｦ・- 謨ｰ蛻・ｻ･荳翫・蠕・ｩ溘′蠢・医√∪縺溘・繧ｿ繧､繝繧｢繧ｦ繝郁ｶ・℃縺瑚ｦ玖ｾｼ縺ｾ繧後ｋ
- **Unity蝗ｺ譛峨・蛛懈ｭ｢譚｡莉ｶ**:
  - `ProjectSettings/`, `Packages/` 縺ｮ螟画峩縺悟ｿ・ｦ√↑蝣ｴ蜷茨ｼ井ｺ呈鋤諤ｧ邯ｭ謖√・縺溘ａ・・  - Unity Editor襍ｷ蜍輔′蠢・ｦ√↑髟ｷ譎る俣蠕・ｩ滂ｼ域焚蛻・ｻ･荳奇ｼ峨′蠢・医・蝣ｴ蜷・  - Unity Test Runner縺ｧ縺ｮ繝・せ繝亥ｮ溯｡後′荳榊庄閭ｽ縺ｪ迺ｰ蠅・・蝣ｴ蜷茨ｼ井ｻ｣譖ｿ謇区ｮｵ縺悟叙繧後↑縺・ｴ蜷茨ｼ・  - ScriptableObject縲、ssetDatabase遲峨・Unity API菴ｿ逕ｨ譎ゅ↓縲・←蛻・↑繧ｨ繝ｩ繝ｼ繝上Φ繝峨Μ繝ｳ繧ｰ縺悟ｮ溯｣・〒縺阪↑縺・ｴ蜷・- **迺ｰ蠅・ｾ晏ｭ倥〒螳溯｡御ｸ榊庄閭ｽ縺ｪDoD鬆・岼縺後≠繧句ｴ蜷・*:
  - Git繝ｪ繝昴ず繝医Μ縺ｧ縺ｯ縺ｪ縺・腸蠅・〒縲“it history 隱ｿ譟ｻ縺悟ｿ・ｦ√↑DoD鬆・岼縺後≠繧句ｴ蜷・  - 莉｣譖ｿ謇区ｮｵ縺悟叙繧後↑縺・ｴ蜷医∝●豁｢譚｡莉ｶ縺ｨ縺励※謇ｱ縺・  - 蛛懈ｭ｢譎ゅ・縲∫腸蠅・ｾ晏ｭ倥・逅・罰縺ｨ莉｣譖ｿ謇区ｮｵ縺ｮ讀懆ｨ守ｵ先棡繧偵Ξ繝昴・繝医↓險倬鹸縺吶ｋ
</stop_conditions>

<stop_output>
蛛懈ｭ｢譎ゅ・蠢・医い繧ｦ繝医・繝・ヨ:
1. 繝√こ繝・ヨ <TICKET_PATH> 繧・IN_PROGRESS/BLOCKED 縺ｮ縺ｾ縺ｾ譖ｴ譁ｰ  
   - 莠句ｮ・/ 譬ｹ諡繝ｭ繧ｰ隕∫せ / 谺｡謇・1-3 莉ｶ / Report 繝代せ繧貞ｿ・★霑ｽ險・2. docs/inbox/ 縺ｫ譛ｪ螳御ｺ・Ξ繝昴・繝医ｒ菴懈・縺励∬ｪｿ譟ｻ邨先棡繝ｻ隧ｰ縺ｾ繧翫・谺｡謇九ｒ險倬鹸
3. 螟画峩縺ｯ commit 縺吶ｋ・・ush 縺ｯ GitHubAutoApprove=true 縺ｮ蝣ｴ蜷医・縺ｿ閾ｪ蠕句ｮ溯｡鯉ｼ峨Ｑush 荳崎ｦ∵凾縺ｯ縲継ush pending縲阪ｒ譏手ｨ・4. 繝√Ε繝・ヨ 1 陦・ `Blocked: <TICKET_PATH>. Reason: <隕∫せ>. Next: <蛟呵｣・. Report: <REPORT_PATH_TARGET>.`
5. MISSION_LOG.md 繧呈峩譁ｰ・亥●豁｢逅・罰縺ｨ谺｡謇九ｒ險倬鹸・峨・</stop_output>

<output_format>
邏榊刀繝ｬ繝昴・繝茨ｼ・ocs/inbox/REPORT_...md・峨ヵ繧ｩ繝ｼ繝槭ャ繝・
# Report: <繧ｿ繧ｹ繧ｯ蜷・

**Timestamp**: <ISO8601>  
**Actor**: Worker  
**Ticket**: <TICKET_PATH>  
**Type**: Worker  
**Duration**: <謇隕∵凾髢・  
**Changes**: <螟画峩驥剰ｦ∫ｴ・

## Changes
- <file>: <隧ｳ邏ｰ螟画峩蜀・ｮｹ・井ｽ輔ｒ縺ｩ縺・､画峩縺励◆縺具ｼ・

## Decisions
- <decision>: <逅・罰>

## Verification
- <command>: <result・域・蜉・螟ｱ謨励→繝ｭ繧ｰ隕∫せ・・
- **Unity蝗ｺ譛・*: Unity Editor謇句虚讀懆ｨｼ邨先棡縲ゞnity Test Runner縺ｧ縺ｮ繝・せ繝亥ｮ溯｡檎ｵ先棡繧定ｨ倬鹸
  - 萓・ `Unity Editor謇句虚讀懆ｨｼ=繝励Μ繧ｻ繝・ヨ菫晏ｭ倥・隱ｭ縺ｿ霎ｼ縺ｿ繝ｻ蜑企勁繧堤｢ｺ隱阪∵ｭ｣蟶ｸ蜍穂ｽ懊ｒ遒ｺ隱港
  - 萓・ `Unity Test Runner=HeightMapGeneratorTests=14繝・せ繝域・蜉歔, `TerrainGeneratorIntegrationTests=7繝・せ繝域・蜉歔

## Risk
- <貎懷惠繝ｪ繧ｹ繧ｯ>
- **Unity蝗ｺ譛・*: Unity Editor襍ｷ蜍輔′蠢・ｦ√↑髟ｷ譎る俣蠕・ｩ溘ゞnity Test Runner縺ｧ縺ｮ繝・せ繝亥ｮ溯｡後′荳榊庄閭ｽ縺ｪ迺ｰ蠅・ｭ峨・繝ｪ繧ｹ繧ｯ繧定ｨ倬鹸

## Remaining
- 縺ｪ縺・/ <谿倶ｻｶ>

## Blocked・・tate: BLOCKED 縺ｮ蝣ｴ蜷茨ｼ・- Reason / Evidence / Options・・縲・・・
## Handover
- Orchestrator 縺ｸ縺ｮ逕ｳ縺鈴√ｊ・域ｬ｡謇九・豕ｨ諢冗せ繝ｻ譛ｪ隗｣豎ｺ莠矩・ｼ・
## Proposals・井ｻｻ諢擾ｼ・- 諡・ｽ灘､悶〒豌励▼縺・◆謾ｹ蝟・｡医・谺｡蝗槭ち繧ｹ繧ｯ蛟呵｣・</output_format>

<self_correction>
- 繝輔ぃ繧､繝ｫ繝代せ縺ｯ **蜍慕噪縺ｫ遒ｺ隱・* 縺吶ｋ縺薙→・・ls`, `find`, `Test-Path` 遲峨ｒ菴ｿ逕ｨ・峨ゅワ繝ｼ繝峨さ繝ｼ繝臥ｦ∵ｭ｢縲・- 繧ｨ繝ｩ繝ｼ縺檎匱逕溘＠縺溷ｴ蜷医・縲｀ISSION_LOG.md 縺ｫ險倬鹸縺励∝ｾｩ譌ｧ謇矩・ｒ隧ｦ陦後☆繧九・- 3蝗櫁ｩｦ陦後＠縺ｦ繧りｧ｣豎ｺ縺励↑縺・ｴ蜷医・縺ｿ縲∫憾豕√→隧ｦ陦悟・螳ｹ繧呈紛逅・＠縺ｦ繝ｦ繝ｼ繧ｶ繝ｼ縺ｫ蛻､譁ｭ繧剃ｻｰ縺舌・- MISSION_LOG.md 縺ｯ蟶ｸ縺ｫ譛譁ｰ迥ｶ諷九ｒ菫昴▽縺薙→縲ょ推繝輔ぉ繝ｼ繧ｺ螳御ｺ・凾縺ｫ蠢・★譖ｴ譁ｰ縺吶ｋ縲・- **Unity蝗ｺ譛・*: Unity Editor荳翫〒縺ｮ謇句虚讀懆ｨｼ縺悟ｿ・ｦ√↑蝣ｴ蜷医∝ｮ溯｣・ｾ後↓蠢・★Unity Editor縺ｧ蜍穂ｽ懃｢ｺ隱阪ｒ陦後≧縲・- **Unity蝗ｺ譛・*: Unity Test Runner縺ｧ縺ｮ繝・せ繝亥ｮ溯｡後′蠢・ｦ√↑蝣ｴ蜷医ゞnity Test Runner縺ｾ縺溘・繧ｳ繝槭Φ繝峨Λ繧､繝ｳ縺ｧ螳溯｡後＠縲∫ｵ先棡繧定ｨ倬鹸縺吶ｋ縲・- **Unity蝗ｺ譛・*: ScriptableObject縲、ssetDatabase遲峨・Unity API繧剃ｽｿ逕ｨ縺吶ｋ蝣ｴ蜷医・←蛻・↑繧ｨ繝ｩ繝ｼ繝上Φ繝峨Μ繝ｳ繧ｰ繧貞ｮ溯｣・☆繧九・- **Unity蝗ｺ譛・*: EditorOnly繧ｳ繝ｼ繝峨・ `#if UNITY_EDITOR` 縺ｧ驕ｩ蛻・↓蛻・屬縺吶ｋ縲・</self_correction>
```

---

## 2. 逕滓・萓具ｼ・nity蝗ｺ譛蛾・岼縺ｮ萓狗､ｺ・・
### 萓・ Unity Editor讖溯・螳溯｣・ｼ・ier 2 / Unity蝗ｺ譛画､懆ｨｼ・・
```xml
<instruction>
縺ゅ↑縺溘・蛻・淵髢狗匱繝√・繝縺ｮ Worker 縺ｧ縺吶ょ牡繧雁ｽ薙※繧峨ｌ縺・1 繧ｿ繧ｹ繧ｯ縺縺代ｒ螳碁≠縺励∬ｨｼ霍｡繧呈ｮ九＠縺ｦ縺上□縺輔＞縲・**Unity繝励Ο繧ｸ繧ｧ繧ｯ繝亥髄縺代ち繧ｹ繧ｯ**縺ｮ縺溘ａ縲ゞnity Editor荳翫〒縺ｮ謇句虚讀懆ｨｼ縺ｨUnity Test Runner縺ｧ縺ｮ繝・せ繝亥ｮ溯｡後′蠢・ｦ√↑蝣ｴ蜷医′縺ゅｊ縺ｾ縺吶・</instruction>

<context>
<preconditions>
TICKET_PATH: docs/tasks/TASK_012_TerrainGenerationWindow_PresetManagement.md
Tier: 2
Branch: feature/TASK_012_terrain-window-preset-management
Report Target: docs/inbox/REPORT_TASK_012_TerrainGenerationWindow_PresetManagement.md
Focus Area: Assets/Scripts/Editor/TerrainGenerationWindow.cs, Assets/Scripts/Editor/TerrainPresetManager.cs
Forbidden Area: Assets/MapGenerator/Scripts/TerrainGenerator.cs, Assets/MapGenerator/Scripts/HeightMapGenerator.cs, ProjectSettings/, Packages/
DoD:
- [ ] 繝励Μ繧ｻ繝・ヨ菫晏ｭ俶ｩ溯・: 迴ｾ蝨ｨ縺ｮ險ｭ螳壹ｒ譁ｰ縺励＞繝励Μ繧ｻ繝・ヨ縺ｨ縺励※菫晏ｭ倥〒縺阪ｋ
- [ ] 繝励Μ繧ｻ繝・ヨ隱ｭ縺ｿ霎ｼ縺ｿ讖溯・: 菫晏ｭ俶ｸ医∩繝励Μ繧ｻ繝・ヨ繧帝∈謚槭＠縺ｦ蜊ｳ蠎ｧ縺ｫ險ｭ螳壹ｒ驕ｩ逕ｨ縺ｧ縺阪ｋ
- [ ] Unity Editor荳翫〒縺ｮ蜍穂ｽ懃｢ｺ隱・ 繝励Μ繧ｻ繝・ヨ菫晏ｭ倥・隱ｭ縺ｿ霎ｼ縺ｿ繝ｻ蜑企勁縺梧ｭ｣蟶ｸ縺ｫ蜍穂ｽ懊☆繧九％縺ｨ繧堤｢ｺ隱・- [ ] Unity Test Runner縺ｧ縺ｮ繝・せ繝亥ｮ溯｡・ 譌｢蟄倥ユ繧ｹ繝医′縺吶∋縺ｦ謌仙粥縺吶ｋ縺薙→繧堤｢ｺ隱・- [ ] 繧ｳ繝ｳ繝代う繝ｫ繧ｨ繝ｩ繝ｼ縺後↑縺・ Unity Editor縺ｧ繧ｳ繝ｳ繝代う繝ｫ謌仙粥繧堤｢ｺ隱・</preconditions>
</context>

・井ｻ･髯阪・繝・Φ繝励Ξ譛ｬ譁・↓豐ｿ縺｣縺ｦ Phase 0縲・ 繧貞ｮ滓命・・```

---

## 3. Unity蝗ｺ譛蛾・岼縺ｮ隱ｬ譏・
### Unity Editor謇句虚讀懆ｨｼ
- Unity Editor繧定ｵｷ蜍輔＠縲∝ｮ溯｣・＠縺滓ｩ溯・繧貞ｮ滄圀縺ｫ謫堺ｽ懊＠縺ｦ蜍穂ｽ懊ｒ遒ｺ隱阪☆繧・- 讀懆ｨｼ邨先棡縺ｯ蜈ｷ菴鍋噪縺ｫ險倬鹸縺吶ｋ・井ｾ・ `Unity Editor謇句虚讀懆ｨｼ=繝励Μ繧ｻ繝・ヨ菫晏ｭ倥・隱ｭ縺ｿ霎ｼ縺ｿ繝ｻ蜑企勁繧堤｢ｺ隱阪∵ｭ｣蟶ｸ蜍穂ｽ懊ｒ遒ｺ隱港・・
### Unity Test Runner縺ｧ縺ｮ繝・せ繝亥ｮ溯｡・- Unity Test Runner縺ｾ縺溘・繧ｳ繝槭Φ繝峨Λ繧､繝ｳ縺ｧ繝・せ繝医ｒ螳溯｡後＠縲∫ｵ先棡繧定ｨ倬鹸縺吶ｋ
- 繝・せ繝亥ｮ溯｡檎ｵ先棡縺ｯ `<繝・せ繝医け繝ｩ繧ｹ蜷・=<謌仙粥/螟ｱ謨・`, `<繝・せ繝域焚>=<謌仙粥謨ｰ>/<邱乗焚>` 縺ｮ蠖｢蠑上〒險倬鹸縺吶ｋ

### 繧ｳ繝ｳ繝代う繝ｫ繧ｨ繝ｩ繝ｼ遒ｺ隱・- Unity Editor縺ｧ繧ｳ繝ｳ繝代う繝ｫ繧ｨ繝ｩ繝ｼ縺後↑縺・％縺ｨ繧堤｢ｺ隱阪☆繧・- 遒ｺ隱咲ｵ先棡縺ｯ `Unity Editor=繧ｳ繝ｳ繝代う繝ｫ謌仙粥` 縺ｮ蠖｢蠑上〒險倬鹸縺吶ｋ

### Unity API菴ｿ逕ｨ譎ゅ・豕ｨ諢冗せ
- ScriptableObject縲、ssetDatabase遲峨・Unity API繧剃ｽｿ逕ｨ縺吶ｋ蝣ｴ蜷医・←蛻・↑繧ｨ繝ｩ繝ｼ繝上Φ繝峨Μ繝ｳ繧ｰ繧貞ｮ溯｣・☆繧・- EditorOnly繧ｳ繝ｼ繝峨・ `#if UNITY_EDITOR` 縺ｧ驕ｩ蛻・↓蛻・屬縺吶ｋ
