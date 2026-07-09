param(
  [Parameter(Mandatory = $true)]
  [string]$CsvPath,
  [Parameter(Mandatory = $true)]
  [string]$CohortId,
  [Parameter(Mandatory = $true)]
  [string]$CohortName,
  [string]$StartsAt = (Get-Date).ToUniversalTime().AddMinutes(-5).ToString("o"),
  [string]$ExpiresAt = (Get-Date).ToUniversalTime().AddDays(90).ToString("o"),
  [ValidateRange(0, 100000)]
  [int]$ExpectedCount = 0,
  [ValidateRange(1, 365)]
  [int]$RetentionDays = 365,
  [ValidateRange(0, 20)]
  [int]$MaxAttempts = 0,
  [switch]$RotateExistingTokens,
  [string]$OutputPath = "",
  [string]$CanonicalSiteUrl = "https://jjohana.github.io/advancy-ai-charter/",
  [string]$ApiBaseUrl = "https://advancy-ai-score-api.advancy-ai-training.workers.dev"
)

$ErrorActionPreference = "Stop"
$tokenPath = Join-Path $PSScriptRoot ".admin-token"
if (-not (Test-Path -LiteralPath $tokenPath)) { throw "Missing admin token file: $tokenPath" }
$adminToken = (Get-Content -Raw -LiteralPath $tokenPath).Trim()
$canonicalUri = $null
if (-not [uri]::TryCreate($CanonicalSiteUrl, [System.UriKind]::Absolute, [ref]$canonicalUri) -or
    $canonicalUri.Scheme -ne 'https' -or $canonicalUri.Query -or $canonicalUri.Fragment) {
  throw "CanonicalSiteUrl must be an absolute HTTPS URL without a query or fragment."
}
$canonicalBase = $canonicalUri.AbsoluteUri.TrimEnd('/')
$source = @(Import-Csv -LiteralPath $CsvPath)
if ($source.Count -eq 0) { throw "The CSV has no participant rows." }
if ($ExpectedCount -gt 0 -and $source.Count -ne $ExpectedCount) {
  throw "Expected $ExpectedCount CSV rows but found $($source.Count). No network request was made."
}

$headersInFile = @((Get-Content -LiteralPath $CsvPath -TotalCount 1) -split ',' | ForEach-Object { $_.Trim().Trim('"') })
$requiredHeaders = @("FirstName", "LastName", "Email")
$missingHeaders = @($requiredHeaders | Where-Object { $_ -cnotin $headersInFile })
$unexpectedHeaders = @($headersInFile | Where-Object { $_ -cnotin $requiredHeaders })
if ($headersInFile.Count -ne 3 -or $missingHeaders.Count -gt 0 -or $unexpectedHeaders.Count -gt 0) {
  throw "CSV headers must be exactly FirstName,LastName,Email. No network request was made."
}

foreach ($row in $source) {
  if (-not $row.FirstName -or -not $row.LastName -or -not $row.Email) {
    throw "Every CSV row must contain FirstName, LastName and Email."
  }
}

if (-not $OutputPath) {
  $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  $OutputPath = Join-Path $PSScriptRoot "invite-links-$CohortId-$stamp.csv"
}

$headers = @{ "X-Admin-Token" = $adminToken; "Content-Type" = "application/json" }
$results = [System.Collections.Generic.List[object]]::new()

function Protect-SpreadsheetCell([string]$Value) {
  if ($Value -match "^[\t\r]" -or $Value -match "^\s*[=+\-@]") { return "'$Value" }
  return $Value
}

for ($offset = 0; $offset -lt $source.Count; $offset += 50) {
  $end = [Math]::Min($offset + 49, $source.Count - 1)
  $chunk = @($source[$offset..$end])
  $participants = @($chunk | ForEach-Object {
    $item = [ordered]@{
      first_name = $_.FirstName.Trim()
      last_name = $_.LastName.Trim()
      email = $_.Email.Trim().ToLowerInvariant()
    }
    if ($MaxAttempts -gt 0) { $item.max_attempts = $MaxAttempts }
    $item
  })
  $payload = [ordered]@{
    cohort = [ordered]@{
      id = $CohortId
      name = $CohortName
      starts_at = $StartsAt
      expires_at = $ExpiresAt
      retention_days = $RetentionDays
    }
    participants = $participants
    rotate_existing_tokens = [bool]$RotateExistingTokens
  }
  $body = $payload | ConvertTo-Json -Depth 6
  $response = Invoke-RestMethod -Method Post -Uri "$ApiBaseUrl/admin/participants/import" -Headers $headers -Body $body
  foreach ($participant in $response.participants) {
    $sourceRow = $chunk | Where-Object { $_.Email.Trim().ToLowerInvariant() -eq $participant.email } | Select-Object -First 1
    $invite = [string]$participant.token
    $results.Add([pscustomobject][ordered]@{
      CohortId = $CohortId
      ParticipantId = $participant.participant_id
      FirstName = Protect-SpreadsheetCell $sourceRow.FirstName
      LastName = Protect-SpreadsheetCell $sourceRow.LastName
      Email = Protect-SpreadsheetCell $participant.email
      TokenStatus = $participant.token_status
      ExpiresAt = $participant.expires_at
      AssessmentInvite = $(if ($invite) { "$canonicalBase/#invite=$invite" } else { "" })
    })
  }
  # Checkpoint after every API batch. If a later batch fails, newly issued tokens
  # from completed batches remain recoverable in this protected output file.
  $results | Export-Csv -LiteralPath $OutputPath -NoTypeInformation -Encoding UTF8
}

$unchanged = @($results | Where-Object { $_.TokenStatus -eq "unchanged" }).Count
Write-Host "Imported $($results.Count) participants; wrote one-time invitation links to $OutputPath"
if ($unchanged -gt 0) {
  Write-Warning "$unchanged existing participant(s) kept their prior token, which cannot be recovered. Re-run with -RotateExistingTokens only if new links are required."
}
Write-Warning "The output contains bearer credentials. Share links individually, store the file securely, and delete it after distribution."
