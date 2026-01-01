param(
  [string]$ProjectRoot = "."
)

$ErrorActionPreference = "Stop"

function Write-Info([string]$msg) { Write-Host $msg }

Set-Location $ProjectRoot

$srcCursorrules = $null
if (Test-Path -LiteralPath ".shared-workflows/templates/.cursorrules") {
  $srcCursorrules = ".shared-workflows/templates/.cursorrules"
} elseif (Test-Path -LiteralPath "templates/.cursorrules") {
  $srcCursorrules = "templates/.cursorrules"
} else {
  throw "No .cursorrules template found. Tried: .shared-workflows/templates/.cursorrules, templates/.cursorrules"
}

$srcCursorrulesResolved = (Resolve-Path -LiteralPath $srcCursorrules).Path
Copy-Item -LiteralPath $srcCursorrules ".cursorrules" -Force
Write-Info "Applied: $srcCursorrulesResolved -> .cursorrules"

New-Item -ItemType Directory -Path ".cursor" -Force | Out-Null
$srcCursorRules = $null
if (Test-Path -LiteralPath ".shared-workflows/templates/.cursor/rules.md") {
  $srcCursorRules = ".shared-workflows/templates/.cursor/rules.md"
} elseif (Test-Path -LiteralPath "templates/.cursor/rules.md") {
  $srcCursorRules = "templates/.cursor/rules.md"
}
if ($srcCursorRules) {
  $srcCursorRulesResolved = (Resolve-Path -LiteralPath $srcCursorRules).Path
  Copy-Item -LiteralPath $srcCursorRules ".cursor/rules.md" -Force
  Write-Info "Applied: $srcCursorRulesResolved -> .cursor/rules.md"
} else {
  Write-Info "Skipped: .cursor/rules.md template not found (ok)."
}

Write-Info "Done."


