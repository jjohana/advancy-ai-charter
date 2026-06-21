$ErrorActionPreference = "Stop"

$baseUrl = "https://advancy-ai-score-api.advancy-ai-training.workers.dev/admin/scores"
$tokenPath = Join-Path $PSScriptRoot ".admin-token"

if (-not (Test-Path -LiteralPath $tokenPath)) {
  throw "Missing admin token file: $tokenPath"
}

$token = (Get-Content -Raw -LiteralPath $tokenPath).Trim()
$result = Invoke-RestMethod -Method Get -Uri $baseUrl -Headers @{ "X-Admin-Token" = $token }

$result.rows |
  Group-Object test_id |
  Select-Object @{ Name = "Test"; Expression = { $_.Name } }, @{ Name = "Responses"; Expression = { $_.Count } } |
  Format-Table -AutoSize

Write-Host "Total responses: $($result.count)"
