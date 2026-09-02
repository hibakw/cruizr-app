# CRUIZR - Split-Calculator Math Unit Tests

function Calculate-SplitCost {
    param(
        [int]$FriendsCount,
        [int]$DaysCount,
        [int]$DailyRent = 1799,
        [int]$DailyFuel = 800,
        [int]$DailyToll = 400
    )

    if ($FriendsCount -lt 1) { $FriendsCount = 1 }
    if ($DaysCount -lt 1) { $DaysCount = 1 }

    $total = ($DailyRent + $DailyFuel + $DailyToll) * $DaysCount
    $perPerson = [Math]::Ceiling($total / $FriendsCount)

    return @{
        Total = $total
        PerPerson = $perPerson
    }
}

$testCases = @(
    @{ Friends = 4; Days = 2; ExpectedTotal = 5998; ExpectedPerPerson = 1500 },
    @{ Friends = 1; Days = 1; ExpectedTotal = 2999; ExpectedPerPerson = 2999 },
    @{ Friends = 7; Days = 3; ExpectedTotal = 8997; ExpectedPerPerson = 1286 },
    @{ Friends = 5; Days = 4; ExpectedTotal = 11996; ExpectedPerPerson = 2400 },
    @{ Friends = 2; Days = 5; ExpectedTotal = 14995; ExpectedPerPerson = 7498 }
)

$passed = 0
$failed = 0

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host " Running CRUIZR Split-Calculator Math Tests " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

foreach ($tc in $testCases) {
    $res = Calculate-SplitCost -FriendsCount $tc.Friends -DaysCount $tc.Days
    $isTotalOk = ($res.Total -eq $tc.ExpectedTotal)
    $isPerPersonOk = ($res.PerPerson -eq $tc.ExpectedPerPerson)

    if ($isTotalOk -and $isPerPersonOk) {
        Write-Host " [PASS] Friends: $($tc.Friends), Days: $($tc.Days) -> Total: ₹$($res.Total), Per Person: ₹$($res.PerPerson)" -ForegroundColor Green
        $passed++
    } else {
        Write-Host " [FAIL] Friends: $($tc.Friends), Days: $($tc.Days) -> Got Total: ₹$($res.Total) (Expected: $($tc.ExpectedTotal)), Per Person: ₹$($res.PerPerson) (Expected: $($tc.ExpectedPerPerson))" -ForegroundColor Red
        $failed++
    }
}

Write-Host "-----------------------------------------"
Write-Host "Results: $passed Passed, $failed Failed" -ForegroundColor $(if ($failed -eq 0) { "Green" } else { "Red" })

if ($failed -gt 0) {
    exit 1
} else {
    exit 0
}
