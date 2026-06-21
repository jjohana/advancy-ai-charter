param(
  [ValidateSet("json", "csv")]
  [string]$Format = "csv",
  [string]$TestId = "",
  [string]$OutputPath = ""
)

$ErrorActionPreference = "Stop"

$baseUrl = "https://advancy-ai-score-api.advancy-ai-training.workers.dev/admin/scores"
$tokenPath = Join-Path $PSScriptRoot ".admin-token"

if (-not (Test-Path -LiteralPath $tokenPath)) {
  throw "Missing admin token file: $tokenPath"
}

$token = (Get-Content -Raw -LiteralPath $tokenPath).Trim()
$query = "?format=$Format"
if ($TestId) {
  $query += "&test_id=$([uri]::EscapeDataString($TestId))"
}

if (-not $OutputPath) {
  $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $OutputPath = Join-Path $PSScriptRoot "advancy-ai-results-$stamp.$Format"
}

Invoke-WebRequest `
  -Method Get `
  -Uri "$baseUrl$query" `
  -Headers @{ "X-Admin-Token" = $token } `
  -OutFile $OutputPath

Write-Host "Exported results to $OutputPath"
