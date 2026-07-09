param(
  [ValidateSet("json", "csv")]
  [string]$Format = "csv",
  [string]$TestId = "",
  [string]$CohortId = "",
  [string]$OutputPath = "",
  [string]$ApiBaseUrl = "https://advancy-ai-score-api.advancy-ai-training.workers.dev"
)

$ErrorActionPreference = "Stop"
$tokenPath = Join-Path $PSScriptRoot ".admin-token"
if (-not (Test-Path -LiteralPath $tokenPath)) { throw "Missing admin token file: $tokenPath" }
$token = (Get-Content -Raw -LiteralPath $tokenPath).Trim()
if (-not $token) { throw "The admin token file is empty." }

if (-not $OutputPath) {
  $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $OutputPath = Join-Path $PSScriptRoot "advancy-ai-results-$stamp.$Format"
}

$headers = @{ "X-Admin-Token" = $token }
$common = @("format=$Format", "limit=500")
if ($TestId) { $common += "test_id=$([uri]::EscapeDataString($TestId))" }
if ($CohortId) { $common += "cohort_id=$([uri]::EscapeDataString($CohortId))" }
$cursor = ""
$page = 0
$total = 0

if ($Format -eq "json") {
  $rows = [System.Collections.Generic.List[object]]::new()
  do {
    $query = $common + $(if ($cursor) { "cursor=$([uri]::EscapeDataString($cursor))" } else { @() })
    $result = Invoke-RestMethod -Method Get -Uri "$ApiBaseUrl/admin/attempts?$($query -join '&')" -Headers $headers
    foreach ($row in $result.rows) { $rows.Add($row) }
    $total += [int]$result.count
    $cursor = [string]$result.next_cursor
    $page += 1
  } while ($cursor)
  $document = [ordered]@{ exported_at = (Get-Date).ToUniversalTime().ToString("o"); count = $rows.Count; rows = $rows }
  $json = $document | ConvertTo-Json -Depth 8
  [System.IO.File]::WriteAllText($OutputPath, $json, [System.Text.UTF8Encoding]::new($false))
} else {
  $builder = [System.Text.StringBuilder]::new()
  do {
    $query = $common + $(if ($cursor) { "cursor=$([uri]::EscapeDataString($cursor))" } else { @() })
    $response = Invoke-WebRequest -Method Get -Uri "$ApiBaseUrl/admin/attempts?$($query -join '&')" -Headers $headers
    $content = [string]$response.Content
    if ($page -gt 0) {
      $content = $content.TrimStart([char]0xFEFF)
      $newline = $content.IndexOf("`n")
      $content = if ($newline -ge 0) { $content.Substring($newline + 1) } else { "" }
    }
    [void]$builder.Append($content)
    if ($content -and -not $content.EndsWith("`n")) { [void]$builder.Append("`r`n") }
    $cursor = [string]$response.Headers["X-Next-Cursor"]
    $page += 1
  } while ($cursor)
  [System.IO.File]::WriteAllText($OutputPath, $builder.ToString(), [System.Text.UTF8Encoding]::new($true))
}

Write-Host "Exported $page page(s) to $OutputPath"
