# Shared Doctor / Check-Fix 繧ｨ繝ｳ繧ｸ繝ｳ險ｭ險域｡・
## 1. 逶ｮ逧・
shared-workflows 縺ｫ髢峨§縺溘せ繧ｯ繝ｪ繝励ヨ鄒､・・nsure-ssot, orchestrator-audit, dev-check, sw-doctor 遲会ｼ峨ｒ縲・縲御ｻｻ諢上・繝ｭ繧ｸ繧ｧ繧ｯ繝医〒蛻ｩ逕ｨ蜿ｯ閭ｽ縺ｪ閾ｪ蟾ｱ險ｺ譁ｭ繝ｻ閾ｪ蟾ｱ菫ｮ蠕ｩ繧ｨ繝ｳ繧ｸ繝ｳ縲阪→縺励※蜀崎ｨｭ險医☆繧九・
譛ｬ險ｭ險医〒縺ｯ縲∝・菴鍋噪縺ｪ繝輔ぃ繧､繝ｫ讒矩・・I_CONTEXT.md, HANDOVER.md, docs/tasks/* 縺ｪ縺ｩ・峨↓萓晏ｭ倥＠縺ｪ縺・謚ｽ雎｡繝｢繝・Ν繧貞ｮ夂ｾｩ縺励√◎縺ｮ荳翫↓ shared-workflows 逕ｨ縺ｮ繝励Λ繧ｰ繧､繝ｳ繧定ｼ峨○繧九％縺ｨ繧堤岼謖・☆縲・
## 2. 繝峨Γ繧､繝ｳ繝｢繝・Ν

### 2.1 Workspace

- 蜊倅ｸ縺ｮ繧ｳ繝ｼ繝峨・繝ｼ繧ｹ / 繝ｪ繝昴ず繝医Μ繧定｡ｨ縺吝腰菴阪・- 繝励Ο繧ｸ繧ｧ繧ｯ繝医Ν繝ｼ繝医ヱ繧ｹ縲∬ｨｭ螳壹ヵ繧｡繧､繝ｫ繝代せ縲∵僑蠑ｵ繝｡繧ｿ繝・・繧ｿ・井ｾ・ Git 繝ｪ繝｢繝ｼ繝医√ヶ繝ｩ繝ｳ繝∝錐・峨ｒ謖√▽縲・- 萓・
  - `projectRoot`: `C:/repo/my-app`
  - `config`: `REPORT_CONFIG.yml`, `.doctorrc` 縺ｪ縺ｩ

### 2.2 Artifact

- Workspace 蜀・・縲悟ｽｹ蜑ｲ繧呈戟縺｣縺溘Μ繧ｽ繝ｼ繧ｹ縲阪・謚ｽ雎｡縲・- 蜈ｷ菴鍋噪縺ｪ繝輔ぃ繧､繝ｫ蠖｢蠑擾ｼ・arkdown/JSON/YAML・峨↓縺ｯ萓晏ｭ倥○縺壹√後％縺・＞縺・э蜻ｳ繧呈戟縺､繧ゅ・縲阪→縺励※螳夂ｾｩ縺吶ｋ縲・- 莉｣陦ｨ萓具ｼ・hared-workflows 逕ｨ繝励Λ繧ｰ繧､繝ｳ縺ｮ隕ｳ轤ｹ・・
  - `Context`: AI_CONTEXT.md
  - `Handover`: docs/HANDOVER.md
  - `TaskBoard`: docs/tasks/*.md
  - `Report`: docs/inbox/REPORT_*.md
- 莉悶・繝ｭ繧ｸ繧ｧ繧ｯ繝医〒縺ｯ縲，ontext/Handover/TaskBoard 縺悟挨繝輔ぃ繧､繝ｫ繧・挨繧ｹ繝医Ξ繝ｼ繧ｸ縺ｧ繧ゅｈ縺・・
### 2.3 Check

- 縺ゅｋ Workspace 縺ｫ蟇ｾ縺励※縲（nvariant 繧呈､懆ｨｼ縺吶ｋ邏皮ｲ矩未謨ｰ縺ｨ縺励※螳夂ｾｩ縺吶ｋ縲・- 蜈･蜉・  - `workspace`: Workspace
  - `options`: 險ｭ螳壹・繝励Ο繝輔ぃ繧､繝ｫ縺ｫ蠢懊§縺溘が繝励す繝ｧ繝ｳ
- 蜃ｺ蜉幢ｼ域ｦょｿｵ・・  - `id`: 荳諢上↑隴伜挨蟄撰ｼ井ｾ・ `ssot.files.present`, `handover.latest_report_linked`・・  - `severity`: `OK | WARN | ERROR`
  - `message`: 莠ｺ髢灘髄縺代Γ繝・そ繝ｼ繧ｸ・域律譛ｬ隱槭′譌｢螳夲ｼ・  - `context`: 霑ｽ蜉諠・ｱ・磯未騾｣繝輔ぃ繧､繝ｫ繝代せ縲∵栢邊九∵署譯医↑縺ｩ・・
### 2.4 Fix (Repair)

- Check 縺ｫ邏舌▼縺丈ｻｻ諢上・菫ｮ蠕ｩ繧｢繧ｯ繧ｷ繝ｧ繝ｳ縲・- 蜈･蜉・  - `workspace`
  - `checkResult`: 荳願ｨ倥・ Check 縺ｮ邨先棡
  - `options`: `dryRun`, `interactive` 縺ｪ縺ｩ
- 蜃ｺ蜉幢ｼ域ｦょｿｵ・・  - `applied`: boolean・亥ｮ滄圀縺ｫ菫ｮ豁｣繧帝←逕ｨ縺励◆縺具ｼ・  - `changes`: 螟画峩繝輔ぃ繧､繝ｫ荳隕ｧ繧・diff 隕∫ｴ・  - `notes`: 莠ｺ髢灘髄縺題ｪｬ譏・
### 2.5 Profile

- 繝√ぉ繝・け髮・粋縺ｨ繝昴Μ繧ｷ繝ｼ縺ｮ邨・・- 諠・ｱ:
  - `id`: 繝励Ο繝輔ぃ繧､繝ｫ蜷搾ｼ井ｾ・ `shared-orch-bootstrap`, `shared-orch-doctor`, `ci-strict`・・  - `checks`: 螳溯｡後☆繧・Check 縺ｮ荳隕ｧ
  - `severityPolicy`: 縺ｩ縺ｮ severity 縺ｧ fail 謇ｱ縺・↓縺吶ｋ縺・  - `autoFixPolicy`: 縺ｩ縺ｮ Check/Fix 繧定・蜍暮←逕ｨ縺吶ｋ縺具ｼ・safe-only`/`none`/`all` 縺ｪ縺ｩ・・
## 3. 繝ｬ繧､繝､讒矩

譛ｬ繧ｨ繝ｳ繧ｸ繝ｳ縺ｯ縲∵ｦゅ・谺｡縺ｮ3繝ｬ繧､繝､縺ｫ蛻・￠繧・

1. **繧ｳ繧｢繧ｨ繝ｳ繧ｸ繝ｳ螻､**
   - Workspace/Artifact/Check/Fix/Profile 縺ｮ蝙句ｮ夂ｾｩ縺ｨ螳溯｡後お繝ｳ繧ｸ繝ｳ縲・   - 繝√ぉ繝・け縺ｮ荳ｦ蛻怜ｮ溯｡後√ち繧､繝繧｢繧ｦ繝医∝・隧ｦ陦後・繝ｪ繧ｷ繝ｼ縺ｪ縺ｩ繧呈桶縺・・   - 蜃ｺ蜉帙・ JSON 縺ｪ縺ｩ縺ｮ讖滓｢ｰ蜿ｯ隱ｭ繝輔か繝ｼ繝槭ャ繝医ｒ譌｢螳壹→縺励∽ｺｺ髢灘髄縺代ユ繧ｭ繧ｹ繝医・蠕梧ｮｵ縺ｧ逕滓・縺吶ｋ縲・
2. **繝励Λ繧ｰ繧､繝ｳ螻､・・hared-workflows 逕ｨ・・*
   - AI_CONTEXT/HANDOVER/docs/tasks/docs/inbox 縺ｫ髢｢縺吶ｋ蜈ｷ菴鍋噪縺ｪ Check/Fix 螳溯｣・・   - 譌｢蟄倥せ繧ｯ繝ｪ繝励ヨ・・rchestrator-audit, todo-sync, todo-leak-preventer 縺ｪ縺ｩ・峨ｒ蠕舌・↓縺薙％縺ｸ髮・ｴ・・
3. **繝輔Ο繝ｳ繝医お繝ｳ繝牙ｱ､・・LI / 繝｡繧ｿ繝励Ο繝ｳ繝励ヨ / CI 騾｣謳ｺ・・*
   - `doctor check`, `doctor fix`, `doctor explain` 縺ｪ縺ｩ縲√Θ繝ｼ繧ｶ繧ГI縺悟他縺ｶ蜈･蜿｣縲・   - 蜃ｺ蜉帛ｽ｢蠑擾ｼ・ext/json/markdown・蛾∈謚槭ｄ profile 驕ｸ謚槭ｒ諡・ｽ薙・
## 4. 譌｢蟄倥せ繧ｯ繝ｪ繝励ヨ縺ｨ縺ｮ繝槭ャ繝斐Φ繧ｰ

### 4.1 orchestrator-audit.js

- 荳ｻ縺ｪ蠖ｹ蜑ｲ
  - docs/tasks, docs/inbox, HANDOVER.md 繧呈ｨｪ譁ｭ縺励※縲∵紛蜷域ｧ繧偵メ繧ｧ繝・け縲・  - Orchestrator 繝ｬ繝昴・繝医・讀懆ｨｼ・・eport-validator 邨檎罰・峨・- 蟆・擂縺ｮ菴咲ｽｮ縺･縺・  - shared-workflows 繝励Λ繧ｰ繧､繝ｳ螻､縺ｮ **隍・焚 Check 縺ｮ髮・粋** 縺ｨ縺励※蜀榊ｮ夂ｾｩ縲・  - 萓・ `handover.latest_orch_report_linked`, `tasks.report_link_exists`, `inbox.empty_after_merge` 縺ｪ縺ｩ縲・
### 4.2 ensure-ssot.js

- 荳ｻ縺ｪ蠖ｹ蜑ｲ
  - shared-workflows 繧ｵ繝悶Δ繧ｸ繝･繝ｼ繝ｫ or 蜈ｱ譛峨け繝ｭ繝ｼ繝ｳ縺九ｉ SSOT 繝輔ぃ繧､繝ｫ繧貞叙蠕励＠縲√・繝ｭ繧ｸ繧ｧ繧ｯ繝亥・縺ｫ謠・∴繧九・- 蟆・擂縺ｮ菴咲ｽｮ縺･縺・  - Check: `ssot.files.present`
  - Fix: `ssot.ensure_files`
  - `--no-fail` 縺ｯ profile 縺ｮ `severityPolicy`/`autoFixPolicy` 縺ｧ繧ｳ繝ｳ繝医Ο繝ｼ繝ｫ縲・
### 4.3 dev-check.js

- 荳ｻ縺ｪ蠖ｹ蜑ｲ
  - 隍・焚繧ｹ繧ｯ繝ｪ繝励ヨ・・etect-project-type, report-style-hint, creativity-booster, adapt-response, todo-sync/todo-leak-preventer・峨ｒ鬆・↓螳溯｡後・  - Git 遶ｶ蜷育憾諷九メ繧ｧ繝・け縲・- 蟆・擂縺ｮ菴咲ｽｮ縺･縺・  - 縲継rofile繧帝∈謚槭＠縺ｦ Check 髮・粋繧貞ｮ溯｡後☆繧・CLI縲阪・荳螳溯｣・竊・`doctor check --profile shared-orch-dev` 縺ｫ邨ｱ蜷医・
### 4.4 sw-doctor.js

- 迴ｾ迥ｶ
  - 迺ｰ蠅・メ繧ｧ繝・け 竊・繧ｹ繧ｯ繝ｪ繝励ヨ蜿ｯ逕ｨ諤ｧ 竊・orchestrator-audit 竊・dev-check 竊・菫ｮ蠕ｩ謠先｡・繧剃ｸ諡ｬ縺ｧ螳溯｡後・- 蟆・擂縺ｮ蠖ｹ蜑ｲ
  - 繧ｳ繧｢繧ｨ繝ｳ繧ｸ繝ｳ縺ｮ **繝ｩ繝ｳ繝翫・/CLI** 縺ｮ1縺､縺ｨ縺励※謨ｴ逅・・  - 谿ｵ髫守噪繝ｪ繝輔ぃ繧ｯ繧ｿ逶ｮ讓・
    1. 迴ｾ蝨ｨ縺ｮ `checkEnvironment` / `checkScripts` / `runAudit` / `runDevCheck` 繧・Check 繧ｪ繝悶ず繧ｧ繧ｯ繝医↓繝槭ャ繝斐Φ繧ｰ・亥・驛ｨAPI・峨・    2. 邨先棡繧・`{ id, severity, message, context }[]` 縺ｧ蜿門ｾ励〒縺阪ｋ繧医≧縺ｫ縺吶ｋ縲・    3. `--format text|json` 縺ｧ蜃ｺ蜉帛ｽ｢蠑上ｒ蛻・ｊ譖ｿ縺亥庄閭ｽ縺ｫ縺吶ｋ縲・    4. `--profile shared-orch-bootstrap|shared-orch-doctor|ci-strict` 縺ｪ縺ｩ縺ｧ繝√ぉ繝・け繧ｻ繝・ヨ繧貞・繧頑崛縺医ｋ縲・
## 5. 谿ｵ髫守噪遘ｻ陦瑚ｨ育判・磯ｫ倥Ξ繝吶Ν・・
### Phase A: 繧ｫ繧ｿ繝ｭ繧ｰ蛹悶→險ｭ險亥崋螳夲ｼ医％縺ｮ繝峨く繝･繝｡繝ｳ繝茨ｼ・
- 譌｢蟄倥せ繧ｯ繝ｪ繝励ヨ縺ｮ謖ｯ繧玖・縺・ｒ Check/Fix 隕ｳ轤ｹ縺ｧ繧ｫ繧ｿ繝ｭ繧ｰ蛹悶☆繧九・- 譛ｬ繝峨く繝･繝｡繝ｳ繝医〒繝峨Γ繧､繝ｳ繝｢繝・Ν縺ｨ繝ｬ繧､繝､讒矩繝ｻ繝槭ャ繝斐Φ繧ｰ繧貞崋螳壹☆繧九・
### Phase B: sw-doctor 縺ｮ蜀・ΚAPI蛹・
- 螟画峩縺ｯ譛蟆城剞縺ｫ謚代∴縺､縺､縲∫樟蝨ｨ縺ｮ
  - `checkEnvironment`
  - `checkScripts`
  - `runAudit`
  - `runDevCheck`
  繧偵√◎繧後◇繧・Check 螳溯｣・・繝ｩ繝・ヱ縺ｨ縺励※謇ｱ縺医ｋ繧医≧蜀・Κ API 繧貞ｰ主・縺吶ｋ縲・- 萓具ｼ医う繝｡繝ｼ繧ｸ縺ｮ縺ｿ繝ｻ螳溯｣・・蛻･繝輔ぉ繝ｼ繧ｺ・・
  - `runChecks(profileId, options) -> CheckResult[]`
- 縺薙・谿ｵ髫弱〒縺ｯ CLI 陦ｨ髱｢縺ｯ讌ｵ蜉帑ｺ呈鋤繧剃ｿ昴▽・・node scripts/sw-doctor.js` 縺ｮ謖ｯ繧玖・縺・・邯ｭ謖・ｼ峨・
### Phase C: 繝励Ο繝輔ぃ繧､繝ｫ縺ｨ蜃ｺ蜉帛ｽ｢蠑上・蟆主・

- `--profile` 繧ｪ繝励す繝ｧ繝ｳ:
  - 萓・ `shared-orch-bootstrap`, `shared-orch-doctor`, `ci-strict`縲・  - 蜷・profile 縺斐→縺ｫ螳溯｡後☆繧・Check 繧ｻ繝・ヨ縺ｨ繝昴Μ繧ｷ繝ｼ繧貞ｮ夂ｾｩ縲・- `--format` 繧ｪ繝励す繝ｧ繝ｳ:
  - `text`・育樟陦御ｺ呈鋤・峨→ `json`・・I 繧・ｻ悶ヤ繝ｼ繝ｫ騾｣謳ｺ逕ｨ・峨ｒ逕ｨ諢上・  - JSON 縺ｫ縺ｯ CheckResult 荳隕ｧ縺ｨ繧ｵ繝槭Μ・・K/WARN/ERROR 謨ｰ縺ｪ縺ｩ・峨ｒ蜷ｫ繧√ｋ縲・
### Phase D: 繝｡繧ｿ繝励Ο繝ｳ繝励ヨ繝ｻ繝峨く繝･繝｡繝ｳ繝医・謨ｴ逅・
- ORCHESTRATOR_METAPROMPT / PROJECT_KICKSTART / WORKER_METAPROMPT 繧偵悟句挨 Node 繧ｹ繧ｯ繝ｪ繝励ヨ蜷阪阪°繧・  縲慧octor profile 蜻ｼ縺ｳ蜃ｺ縺励阪・繝ｼ繧ｹ縺ｮ謖・､ｺ縺ｸ谿ｵ髫守噪縺ｫ譖ｸ縺肴鋤縺医ｋ縲・- 萓・
  - 譌ｧ: `node scripts/orchestrator-audit.js --no-fail`
  - 譁ｰ: `node scripts/sw-doctor.js --profile shared-orch-doctor --format text`

### Phase E: 莉悶・繝ｭ繧ｸ繧ｧ繧ｯ繝亥髄縺第僑蠑ｵ

- shared-workflows 螟悶・繝励Ο繧ｸ繧ｧ繧ｯ繝医〒縲∫峡閾ｪ縺ｮ Artifact/Check/Fix 繧定ｿｽ蜉縺ｧ縺阪ｋ繧ｨ繧ｯ繧ｹ繝・Φ繧ｷ繝ｧ繝ｳ繝昴う繝ｳ繝医ｒ謨ｴ蛯吶・- 諠ｳ螳・
  - `doctor.config.js` 繧・`.doctorrc` 縺ｫ繧医ｋ profile/繝励Λ繧ｰ繧､繝ｳ險ｭ螳壹・  - shared-workflows 縺ｯ縲梧ｨ呎ｺ悶・繝ｩ繧ｰ繧､繝ｳ繧ｻ繝・ヨ縲阪→縺励※蛻ｩ逕ｨ縺輔ｌ繧九・
## 6. CI 騾｣謳ｺ縺ｨ繧ｫ繧ｹ繧ｿ繝險ｭ螳・
### 6.1 CI 縺ｧ縺ｮ蛻ｩ逕ｨ

doctor 縺ｮ JSON 蜃ｺ蜉幢ｼ・--format json`・峨ｒ豢ｻ逕ｨ縺励※縲；itHub Actions 繧・ｻ悶・ CI 繧ｷ繧ｹ繝・Β縺九ｉ:
- 迺ｰ蠅・メ繧ｧ繝・け邨先棡縺ｮ讖滓｢ｰ逧・↑隧穂ｾ｡
- PR 繧ｳ繝｡繝ｳ繝医∈縺ｮ閾ｪ蜍輔Ξ繝昴・繝育函謌・- 繝薙Ν繝牙､ｱ謨怜愛螳夲ｼ・rofile 縺ｮ severityPolicy 縺ｫ蝓ｺ縺･縺擾ｼ・
隧ｳ邏ｰ縺ｯ `docs/CI_INTEGRATION.md` 繧貞盾辣ｧ縲・
### 6.2 繧ｫ繧ｹ繧ｿ繝險ｭ螳夲ｼ・.doctorrc.js`・・
繝励Ο繧ｸ繧ｧ繧ｯ繝亥崋譛峨・ doctor 險ｭ螳壹ｒ `.doctorrc.js` 縺ｧ螳夂ｾｩ蜿ｯ閭ｽ縺ｫ縺吶ｋ・亥ｰ・擂螳溯｣・ｼ・
- 繝励Ο繝輔ぃ繧､繝ｫ縺ｮ霑ｽ蜉繝ｻ荳頑嶌縺・- 繧ｫ繧ｹ繧ｿ繝 Check/Fix 縺ｮ霑ｽ蜉
- 迺ｰ蠅・､画焚繧・､夜Κ險ｭ螳壹・隱ｭ縺ｿ霎ｼ縺ｿ

繝・Φ繝励Ξ繝ｼ繝医・ `templates/.doctorrc.example.js` 繧貞盾辣ｧ縲・
## 7. 莉雁ｾ後・蜆ｪ蜈医ち繧ｹ繧ｯ

1. **笨・sw-doctor 蜀・Κ縺ｧ縺ｮ CheckResult 讒矩縺ｮ蟆主・** (螳御ｺ・
   - CheckResult 驟榊・繧呈ｧ狗ｯ峨＠縲゛SON 蜃ｺ蜉帙↓蟇ｾ蠢懊・
2. **笨・--format / --profile 繧ｪ繝励す繝ｧ繝ｳ縺ｮ莉墓ｧ倡｢ｺ螳・* (螳御ｺ・
   - 3 縺､縺ｮ繝励Ο繝輔ぃ繧､繝ｫ・・ootstrap/doctor/ci-strict・峨ｒ螳夂ｾｩ縲・   - JSON 繧ｹ繧ｭ繝ｼ繝槭ｒ螳溯｣・・
3. **笨・繝｡繧ｿ繝励Ο繝ｳ繝励ヨ縺ｸ縺ｮ doctor 邨ｱ蜷域婿驥昴・隧ｳ邏ｰ蛹・* (螳御ｺ・
   - ORCHESTRATOR_METAPROMPT / PROJECT_KICKSTART 繧・doctor 繝励Ο繝輔ぃ繧､繝ｫ蜻ｼ縺ｳ蜃ｺ縺励・繝ｼ繧ｹ縺ｫ譖ｴ譁ｰ縲・
4. **谺｡繝輔ぉ繝ｼ繧ｺ・亥ｰ・擂螳溯｣・ｼ・*
   - `.doctorrc.js` 縺ｮ繧ｵ繝昴・繝茨ｼ医き繧ｹ繧ｿ繝繝励Ο繝輔ぃ繧､繝ｫ繝ｻCheck/Fix 縺ｮ霑ｽ蜉・・   - 莉悶・繝ｭ繧ｸ繧ｧ繧ｯ繝亥髄縺代・ doctor 繝代ャ繧ｱ繝ｼ繧ｸ蛹厄ｼ・pm 蜈ｬ髢狗ｭ会ｼ・   - GitHub Actions 繝・Φ繝励Ξ繝ｼ繝医・謠蝉ｾ・   - 繝励Λ繧ｰ繧､繝ｳ繧ｷ繧ｹ繝・Β縺ｮ謨ｴ蛯・
縺薙・繝峨く繝･繝｡繝ｳ繝医・縲∽ｸ願ｨ倥ち繧ｹ繧ｯ縺ｮ險ｭ險井ｸ翫・蝓ｺ貅也せ・・SOT・峨→縺励※謇ｱ縺・∝ｮ溯｣・､画峩譎ゅ↓縺ｯ髫乗凾譖ｴ譁ｰ縺吶ｋ縲・
