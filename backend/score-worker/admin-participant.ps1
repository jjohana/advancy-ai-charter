param(
  [Parameter(Mandatory = $true)]
  [ValidateSet("revoke", "delete")]
  [string]$Action,
  [Parameter(Mandatory = $true)]
  [string]$ParticipantId,
  [string]$ApiBaseUrl = "https://advancy-ai-score-api.advancy-ai-training.workers.dev"
)

$ErrorActionPreference = "Stop"
$tokenPath = Join-Path $PSScriptRoot ".admin-token"
if (-not (Test-Path -LiteralPath $tokenPath)) { throw "Missing admin token file: $tokenPath" }
$headers = @{ "X-Admin-Token" = (Get-Content -Raw -LiteralPath $tokenPath).Trim() }

if ($Action -eq "revoke") {
  $result = Invoke-RestMethod -Method Post -Uri "$ApiBaseUrl/admin/participants/$ParticipantId/revoke" -Headers $headers
} else {
  $headers["X-Confirm-Participant"] = $ParticipantId
  $result = Invoke-RestMethod -Method Delete -Uri "$ApiBaseUrl/admin/participants/$ParticipantId" -Headers $headers
}

$result | ConvertTo-Json -Depth 4
