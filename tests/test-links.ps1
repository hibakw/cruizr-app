# CRUIZR - Link Audit & Dead Route Checker

$htmlPath = "c:\Users\khiba\OneDrive\Desktop\cruizr-app\index.html"
$content = Get-Content $htmlPath -Raw

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Running CRUIZR Link & Route Audit " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Search for dead href="#"
$emptyHrefMatches = [regex]::Matches($content, 'href\s*=\s*["'']#["'']')
$emptyCount = $emptyHrefMatches.Count

if ($emptyCount -eq 0) {
    Write-Host " [PASS] Zero unmapped href='#' links found!" -ForegroundColor Green
} else {
    Write-Host " [FAIL] Found $emptyCount instances of unmapped href='#'!" -ForegroundColor Red
}

# 2. Extract all local anchor targets (#target) and check if the element exists in HTML
$anchorMatches = [regex]::Matches($content, 'href\s*=\s*["'']#([a-zA-Z0-9\-_]+)["'']')
$missingTargets = 0

foreach ($m in $anchorMatches) {
    $targetId = $m.Groups[1].Value
    # Check if id="targetId" exists in the document
    if (-not ($content -match "id\s*=\s*[`"']$targetId[`"']")) {
        Write-Host " [WARN] Anchor #$targetId does not have a matching element id='$targetId' in HTML!" -ForegroundColor Yellow
        $missingTargets++
    }
}

if ($missingTargets -eq 0) {
    Write-Host " [PASS] All on-page anchor targets exist in the DOM!" -ForegroundColor Green
}

Write-Host "-----------------------------------------"
if ($emptyCount -eq 0 -and $missingTargets -eq 0) {
    Write-Host "Link Audit: 100% SUCCESS" -ForegroundColor Green
    exit 0
} else {
    Write-Host "Link Audit: FAILED ($emptyCount empty hrefs, $missingTargets missing targets)" -ForegroundColor Red
    exit 1
}
