param(
  [string]$RPC_URL = "http://127.0.0.1:8545",
  [string]$AUTOMATION_ADDR = "0xYourAutomationAddress",
  [string]$ABI_PATH = "D:\doa-token\artifacts\contracts\AutomationCampaign.sol\AutomationCampaign.json",
  [string]$CALENDAR_DIR = "D:\doa-token\marketing\calendar",
  [string]$PUBLISH_SCRIPT = "D:\doa-token\scripts\publicar.ps1",
  [string]$REWARDS_SCRIPT = "D:\doa-token\scripts\recompensas.ps1"
)

$abiJson = Get-Content $ABI_PATH | ConvertFrom-Json
Write-Host "👂 Escuchando CampaignExecuted en $AUTOMATION_ADDR..."

$lastBlock = 0

while ($true) {
  try {
    $latest = Invoke-RestMethod -Uri $RPC_URL -Method Post -Body (@{
      jsonrpc="2.0"; id=1; method="eth_blockNumber"; params=@()
    } | ConvertTo-Json)

    $blockHex = $latest.result
    $blockNum = [int]([System.Convert]::ToInt32($blockHex,16))

    if ($lastBlock -eq 0) { $lastBlock = $blockNum }

    if ($blockNum -gt $lastBlock) {
      Write-Host "Procesando bloque $blockNum..."
      # Aquí deberías consultar logs con eth_getLogs y decodificar con keccak256 del evento
      # Demo: simulamos día 1
      $metadata = Join-Path $CALENDAR_DIR "day-1.json"
      if (Test-Path $metadata) {
        Write-Host "Detectado CampaignExecuted → Publicando con $metadata"
        & $PUBLISH_SCRIPT -MetadataPath $metadata
        & $REWARDS_SCRIPT -MetadataPath $metadata
      }
      $lastBlock = $blockNum
    }

    Start-Sleep -Seconds 10
  } catch {
    Write-Host "❌ Error en listener: $($_.Exception.Message)"
    Add-Content -Path "listener.log" -Value "[{0}] {1}" -f (Get-Date), $_.Exception.Message
    Start-Sleep -Seconds 5
  }
}