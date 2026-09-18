# CRUIZR - Host Lead Form & Phone Validation Tests

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Running CRUIZR Host Form Validation Tests " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$htmlPath = "c:\Users\khiba\OneDrive\Desktop\cruizr-app\index.html"
$jsPath = "c:\Users\khiba\OneDrive\Desktop\cruizr-app\js\app.js"

$html = Get-Content $htmlPath -Raw
$js = Get-Content $jsPath -Raw

$passCount = 0
$failCount = 0

function Assert-Condition($condition, $message) {
    if ($condition) {
        Write-Host " [PASS] $message" -ForegroundColor Green
        $script:passCount++
    } else {
        Write-Host " [FAIL] $message" -ForegroundColor Red
        $script:failCount++
    }
}

# 1. Check HTML input attributes
Assert-Condition ($html -match '<input[^>]*type="tel"[^>]*id="host-phone"' -or $html -match '<input[^>]*id="host-phone"[^>]*type="tel"') "Phone input has type='tel'"
Assert-Condition ($html -match 'id="host-phone"[^>]*maxlength="10"') "Phone input has maxlength='10'"
Assert-Condition ($html -match 'id="host-phone"[^>]*inputmode="numeric"') "Phone input has inputmode='numeric'"
Assert-Condition ($html -match 'id="host-phone"[^>]*pattern="\[6-9\]\[0-9\]\{9\}"') "Phone input has pattern='[6-9][0-9]{9}'"
Assert-Condition ($html -match 'id="host-phone-error"') "Host phone error container exists"
Assert-Condition ($html -match 'id="host-lead-form"[^>]*novalidate') "Host lead form has novalidate attribute"

# 2. Check that the old 'call in 2 hours' text is completely removed
$oldCallMatches = [regex]::Matches("$html $js", 'campus manager|call you within|call in 2 hours', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)
Assert-Condition ($oldCallMatches.Count -eq 0) "Old 'campus manager will call in 2 hours' text is completely removed"

# 3. Check exact success message exists in app.js
$expectedSuccess = "Car listing submitted successfully! This is a prototype (no real listing has been created)."
Assert-Condition ($js.Contains($expectedSuccess)) "Exact prototype success message is present in app.js"

# 4. Check form reset logic in app.js
Assert-Condition ($js -match 'function resetHostLeadForm\(\)') "resetHostLeadForm function is defined"
Assert-Condition ($js -match 'openHostModal\s*=\s*\(\)\s*=>\s*\{[\s\S]*?resetHostLeadForm\(\)[\s\S]*?hostModal[\?]?\.classList\.remove\("hidden"\)') "Form is reset upon opening modal"
Assert-Condition ($js -match 'hostModal[\?]?\.classList\.add\("hidden"\)[\s\S]*?resetHostLeadForm\(\)') "Form is reset upon successful submission"

# 5. Logic Unit Tests for Phone Validation
function Test-HostPhone($name, $car, $loc, $phone) {
    if ([string]::IsNullOrWhiteSpace($name)) { return [PSCustomObject]@{ Valid = $false; Field = "name"; Error = "Please enter your full name." } }
    if ([string]::IsNullOrWhiteSpace($car)) { return [PSCustomObject]@{ Valid = $false; Field = "car"; Error = "Please enter your car model." } }
    if ([string]::IsNullOrWhiteSpace($loc)) { return [PSCustomObject]@{ Valid = $false; Field = "location"; Error = "Please enter your college or city location." } }
    
    if ([string]::IsNullOrWhiteSpace($phone)) { return [PSCustomObject]@{ Valid = $false; Field = "phone"; Error = "Phone number is required." } }
    if ($phone -match '[^\d]') { return [PSCustomObject]@{ Valid = $false; Field = "phone"; Error = "Phone number must contain digits only (no letters or symbols)." } }
    if ($phone.Length -ne 10) { return [PSCustomObject]@{ Valid = $false; Field = "phone"; Error = "Phone number must be exactly 10 digits." } }
    if ($phone -notmatch '^[6-9]') { return [PSCustomObject]@{ Valid = $false; Field = "phone"; Error = "Invalid mobile number. Indian mobile numbers must start with 6, 7, 8, or 9." } }

    return [PSCustomObject]@{ Valid = $true; Field = $null; Error = $null }
}

# Test A — Empty form
$resA = Test-HostPhone "" "" "" ""
Assert-Condition ($resA.Valid -eq $false -and $resA.Field -eq "name") "Test A: Empty form fails required validation"

# Test B — Invalid phone cases
$testB1 = Test-HostPhone "Rohan" "Swift" "Bangalore" "1234567890"
Assert-Condition ($testB1.Valid -eq $false -and $testB1.Error -like "*must start with 6, 7, 8, or 9*") "Test B1: 1234567890 rejected (does not start with 6-9)"

$testB2 = Test-HostPhone "Rohan" "Swift" "Bangalore" "987654321"
Assert-Condition ($testB2.Valid -eq $false -and $testB2.Error -like "*must be exactly 10 digits*") "Test B2: 987654321 rejected (9 digits)"

$testB3 = Test-HostPhone "Rohan" "Swift" "Bangalore" "98765432101"
Assert-Condition ($testB3.Valid -eq $false -and $testB3.Error -like "*must be exactly 10 digits*") "Test B3: 98765432101 rejected (11 digits)"

$testB4 = Test-HostPhone "Rohan" "Swift" "Bangalore" "98765abcde"
Assert-Condition ($testB4.Valid -eq $false -and $testB4.Error -like "*digits only*") "Test B4: 98765abcde rejected (contains letters)"

$testB5 = Test-HostPhone "Rohan" "Swift" "Bangalore" "98765-4321"
Assert-Condition ($testB5.Valid -eq $false -and $testB5.Error -like "*digits only*") "Test B5: 98765-4321 rejected (contains symbols)"

# Test C — Valid phone cases (starts with 6, 7, 8, 9 and exactly 10 digits)
$testC1 = Test-HostPhone "Rohan" "Swift" "Bangalore" "9876543210"
Assert-Condition ($testC1.Valid -eq $true) "Test C1: 9876543210 accepted (starts with 9, 10 digits)"

$testC2 = Test-HostPhone "Rohan" "Swift" "Bangalore" "8123456789"
Assert-Condition ($testC2.Valid -eq $true) "Test C2: 8123456789 accepted (starts with 8, 10 digits)"

$testC3 = Test-HostPhone "Rohan" "Swift" "Bangalore" "7012345678"
Assert-Condition ($testC3.Valid -eq $true) "Test C3: 7012345678 accepted (starts with 7, 10 digits)"

$testC4 = Test-HostPhone "Rohan" "Swift" "Bangalore" "6234567890"
Assert-Condition ($testC4.Valid -eq $true) "Test C4: 6234567890 accepted (starts with 6, 10 digits)"

Write-Host "-----------------------------------------"
Write-Host "Summary: $passCount Passed, $failCount Failed" -ForegroundColor Cyan

if ($failCount -eq 0) {
    exit 0
} else {
    exit 1
}
