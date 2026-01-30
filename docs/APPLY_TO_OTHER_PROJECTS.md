# 莉悶・繝ｭ繧ｸ繧ｧ繧ｯ繝医∈縺ｮ驕ｩ逕ｨ・亥・迴ｾ謇矩・ｼ・
## 繧ｷ繝翫Μ繧ｪA: submodule 縺ｧ蟆主・・域耳螂ｨ・・
蜑肴署: 蟇ｾ雎｡繝励Ο繧ｸ繧ｧ繧ｯ繝医・繝ｪ繝昴ず繝医Μ逶ｴ荳九〒菴懈･ｭ縺吶ｋ縲・
1) submodule 蟆主・・亥・蝗槭・縺ｿ・・
```bash
git submodule add https://github.com/YuShimoji/shared-workflows.git .shared-workflows
git submodule update --init --recursive
```

陬懆ｶｳ・医Ο繝ｼ繧ｫ繝ｫ繝代せ縺ｧ縺ｮ繝・Δ繧貞屓縺吝ｴ蜷茨ｼ・
- Git 縺ｮ險ｭ螳壹↓繧医▲縺ｦ縺ｯ `fatal: transport 'file' not allowed` 縺ｫ縺ｪ繧翫∪縺吶・- 縺昴・蝣ｴ蜷医・縲後◎縺ｮ繧ｳ繝槭Φ繝峨□縺代崎ｨｱ蜿ｯ縺励∪縺呻ｼ医げ繝ｭ繝ｼ繝舌Ν螟画峩荳崎ｦ・ｼ・

```bash
git -c protocol.file.allow=always submodule add <LOCAL_PATH_TO_SHARED_WORKFLOWS> .shared-workflows
git -c protocol.file.allow=always submodule update --init --recursive
```

2) Cursor 繝ｫ繝ｼ繝ｫ驕ｩ逕ｨ・域耳螂ｨ・・
PowerShell:
```powershell
pwsh -File .shared-workflows/scripts/apply-cursor-rules.ps1 -ProjectRoot .
```

3) Orchestrator 驕狗畑髢句ｧ具ｼ医メ繝｣繝・ヨ縺ｫ雋ｼ繧九・縺ｯ1縺､縺縺托ｼ・- `.shared-workflows/prompts/every_time/ORCHESTRATOR_DRIVER.txt`

## 繧ｷ繝翫Μ繧ｪB: submodule 繧剃ｽｿ繧上↑縺・ｼ医さ繝斐・驕狗畑・・
繝阪ャ繝医Ρ繝ｼ繧ｯ/讓ｩ髯千ｭ峨・逅・罰縺ｧ submodule 繧剃ｽｿ縺医↑縺・ｴ蜷医・
1) shared-workflows 繧偵Ο繝ｼ繧ｫ繝ｫ縺ｫ驟咲ｽｮ・井ｾ・ `../shared-workflows-1/`・・2) 蜈･蜿｣繧貞崋螳壹＠縺ｦ驕狗畑
- `docs/windsurf_workflow/OPEN_HERE.md` 繧貞盾辣ｧ縺励∝ｿ・ｦ√ヵ繧｡繧､繝ｫ繧偵さ繝斐・縺励※驟咲ｽｮ
3) Cursor 繝ｫ繝ｼ繝ｫ驕ｩ逕ｨ

PowerShell・・hared-workflows 繝ｪ繝昴ず繝医Μ逶ｴ荳九〒螳溯｡鯉ｼ・
```powershell
pwsh -File scripts/apply-cursor-rules.ps1 -ProjectRoot .
```

## 繧ｷ繝翫Μ繧ｪC: 窶懊→縺ｫ縺九￥螳牙ｮ壼喧窶昴□縺大・縺ｫ蜈･繧後ｋ

髟ｷ螟ｧ菴懈･ｭ縺ｧ豁｢縺ｾ繧翫ｄ縺吶＞/豐磯ｻ咏ｵゆｺ・′螟壹＞蝣ｴ蜷医・縲√∪縺壹Ν繝ｼ繝ｫ驕ｩ逕ｨ縺縺題｡後≧縲・
1) `.cursorrules` 縺ｨ `.cursor/rules.md` 繧帝・鄂ｮ
2) Orchestrator Driver 縺ｮ縲御ｸｭ髢灘ｱ蜻翫Ν繝ｼ繝ｫ縲阪ｒ驕狗畑髢句ｧ・

