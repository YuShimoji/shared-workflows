# Fix encoding script
# Convert all Markdown files to UTF-8 with BOM

param(
    [string]$TargetPath = "docs"
)

$ErrorActionPreference = "Stop"

Write-Host "Starting encoding fix script..." -ForegroundColor Green
Write-Host "Target path: $TargetPath" -ForegroundColor Yellow

# Create UTF-8 with BOM encoding
$utf8WithBom = New-Object System.Text.UTF8Encoding $true

# Find Markdown files
$files = Get-ChildItem -Path $TargetPath -Filter *.md -Recurse -File

$count = 0
foreach ($file in $files) {
    try {
        # Read file with default encoding (auto-detect)
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::Default)
        
        # Write file with UTF-8 with BOM
        [System.IO.File]::WriteAllText($file.FullName, $content, $utf8WithBom)
        
        $count++
        Write-Host "Fixed: $($file.FullName)" -ForegroundColor Green
    }
    catch {
        Write-Host "Error: $($file.FullName) - $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nCompleted: Fixed $count files." -ForegroundColor Green
