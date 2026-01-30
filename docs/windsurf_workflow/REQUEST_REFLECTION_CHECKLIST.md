# Request Reflection Checklist

譛邨よ峩譁ｰ: 2025-12-23  
譖ｴ譁ｰ閠・ Cascade

繝ｦ繝ｼ繧ｶ繝ｼ縺九ｉ縺ｮ萓晞ｼ繧偵悟ｮ溯｡梧ｸ医∩ + 繝ｬ繝昴・繝域ｸ医∩縲阪・迥ｶ諷九〒遒ｺ螳溘↓谿九☆縺溘ａ縺ｮ蜈ｱ騾壹メ繧ｧ繝・け繝ｪ繧ｹ繝医０rchestrator/Worker 縺ｯ **繧ｻ繝・す繝ｧ繝ｳ髢句ｧ狗峩蠕後↓蜿ら・縺励∝ｮ御ｺ・燕縺ｫ蠢・★蜀咲｢ｺ隱・* 縺吶ｋ縲・
---

## 1. Intake・井ｾ晞ｼ蜿鈴倡峩蠕鯉ｼ・
1. 萓晞ｼ蜀・ｮｹ繧・`docs/tasks/` 縺ｫ繧ｿ繧ｹ繧ｯ蛹悶＠縲ゝier / Branch / Focus / Forbidden / DoD 繧呈・險倥☆繧九・2. `docs/HANDOVER.md` 縺ｨ `AI_CONTEXT.md`・・ext繧ｻ繧ｯ繧ｷ繝ｧ繝ｳ・峨↓蜿肴丐莠亥ｮ壹ｒ險倬鹸縺吶ｋ縲・3. todo_list 繧呈峩譁ｰ縺励・ｲ陦御ｸｭ縺ｯ **1莉ｶ縺縺・in_progress** 繧剃ｿ昴▽縲・
## 2. Execution・亥ｮ溯｣・ｸｭ縺ｮ蜈ｱ騾夂｢ｺ隱搾ｼ・
- `git status -sb` 縺ｧ荳崎ｦ∝ｷｮ蛻・′辟｡縺・°繧貞ｸｸ縺ｫ逶｣隕悶＠縲∫岼逧・､悶・繝輔ぃ繧､繝ｫ繧呈掠譛溘↓謨ｴ逅・☆繧九・- SSOT荳崎ｶｳ繝ｻ繧ｹ繧ｯ繝ｪ繝励ヨ谺螯ゅ′縺ゅｌ縺ｰ `.shared-workflows/scripts/ensure-ssot.js` 縺ｧ陬懷ｮ後＠縲∬ｧ｣豎ｺ繝ｭ繧ｰ繧呈ｮ九☆縲・- 萓晞ｼ蜀・ｮｹ縺ｨ逡ｰ縺ｪ繧倶ｽ懈･ｭ縺檎匱逕溘＠縺溷ｴ蜷医・蜊ｳ蠎ｧ縺ｫ繧ｿ繧ｹ繧ｯ縺ｸ蜿肴丐縺励．oD繧呈峩譁ｰ縺吶ｋ縲・- 縲悟ｮ溯｣・〒縺阪◆縲阪□縺代〒邨ゅ∴縺壹．oD縺ｫ豐ｿ縺｣縺ｦ讀懆ｨｼ繧ｳ繝槭Φ繝・邨先棡繧偵∪縺ｨ繧√ｋ縲・
## 3. Completion・医メ繝｣繝・ヨ蝣ｱ蜻雁燕縺ｮ蠢・磯・岼・・
1. `docs/inbox/REPORT_<ISO8601>.md` 繧剃ｽ懈・縺励，hanges/Decisions/Verification/Risk/Remaining 繧定ｨ伜・縺吶ｋ縲・2. 繝√こ繝・ヨ・・docs/tasks/TASK_*.md`・峨ｒ DONE 縺ｫ縺励ヽeport 繝代せ縺ｨ邨先棡隕∫ｴ・ｒ霑ｽ險倥☆繧九・3. `docs/HANDOVER.md` 縺ｮ譛譁ｰ迥ｶ豕√ｒ譖ｴ譁ｰ縺励∵悴邨ｱ蜷医Ξ繝昴・繝医ｒ繧ｼ繝ｭ縺ｫ縺吶ｋ縲・4. `node .shared-workflows/scripts/report-validator.js <report>`・医∪縺溘・ `node scripts/report-validator.js ...`・峨〒讀懆ｨｼ縺吶ｋ縲・5. `git status -sb` 縺後け繝ｪ繝ｼ繝ｳ・・??` 繧・`M` 縺ｪ縺暦ｼ峨〒縺ゅｋ縺薙→繧堤｢ｺ隱阪＠縺ｦ縺九ｉ `git push origin <branch>` 繧貞ｮ溯｡後☆繧九・itHubAutoApprove=false 縺ｮ蝣ｴ蜷医・ push 蠢・ｦ∵ｧ繧・Next 縺ｫ譏手ｨ倥＠縺ｦ STOP 縺吶ｋ縲・6. 遶ｶ蜷医ｄ繝・せ繝亥､ｱ謨励′縺ゅｌ縺ｰ縲悟､ｱ謨励阪→縺励※莠句ｮ・譬ｹ諡/谺｡謇九ｒ繝√こ繝・ヨ縺ｨ繝ｬ繝昴・繝医↓谿九☆縲・
## 4. Chat Guard

- Worker/Orchestrator 縺ｨ繧ゅ√メ繝｣繝・ヨ縺ｯ **1陦後Ξ繝昴・繝・* 縺ｮ縺ｿ・・one/Blocked + Report繝代せ・峨・- 繝√Ε繝・ヨ騾∽ｿ｡蜑阪↓蠢・★譛ｬ繝√ぉ繝・け繝ｪ繧ｹ繝医ｒ蜀咲｢ｺ隱阪＠縲√梧悴蜿肴丐縺ｮ萓晞ｼ縲阪′谿九▲縺ｦ縺・↑縺・°繧・`docs/tasks/` 縺ｨ `git status` 縺ｧ蜀咲｢ｺ隱阪☆繧九・
---

縺薙・繝√ぉ繝・け繝ｪ繧ｹ繝医・ `prompts/every_time/ORCHESTRATOR_DRIVER.txt` / `WORKER_METAPROMPT.txt` 縺九ｉ繧ょ盾辣ｧ縺輔ｌ繧九よ焔鬆・ｒ逵∫払縺帙★縲∽ｾ晞ｼ縺梧悴蜿肴丐縺ｮ縺ｾ縺ｾ邨ゆｺ・＠縺ｪ縺・ｈ縺・°逕ｨ縺吶ｋ縺薙→縲・
---
