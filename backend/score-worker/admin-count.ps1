param(
  [string]$ApiBaseUrl = "https://advancy-ai-score-api.advancy-ai-training.workers.dev"
)

$ErrorActionPreference = "Stop"
$tokenPath = Join-Path $PSScriptRoot ".admin-token"
if (-not (Test-Path -LiteralPath $tokenPath)) { throw "Missing admin token file: $tokenPath" }
$token = (Get-Content -Raw -LiteralPath $tokenPath).Trim()
$headers = @{ "X-Admin-Token" = $token }
$rows = [System.Collections.Generic.List[object]]::new()
$cursor = ""

do {
  $uri = "$ApiBaseUrl/admin/attempts?format=json&limit=500"
  if ($cursor) { $uri += "&cursor=$([uri]::EscapeDataString($cursor))" }
  $result = Invoke-RestMethod -Method Get -Uri $uri -Headers $headers
  foreach ($row in $result.rows) { $rows.Add($row) }
  $cursor = [string]$result.next_cursor
} while ($cursor)

$rows |
  Group-Object cohort_id, quiz_id |
  Select-Object @{ Name = "Cohort / test"; Expression = { $_.Name } }, @{ Name = "Attempts"; Expression = { $_.Count } } |
  Format-Table -AutoSize

Write-Host "Total attempts: $($rows.Count)"
