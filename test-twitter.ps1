# test-twitter.ps1
# Test para publicar un tweet usando el Bearer Token y Access Token

# Variables (se cargan desde tu .env normalmente, aquí las pongo directas para el test)
$bearer = "TU_TWITTER_BEARER"
$apiKey = "TU_TWITTER_API_KEY"
$apiSecret = "TU_TWITTER_API_SECRET"
$accessToken = "TU_TWITTER_ACCESS_TOKEN"
$accessSecret = "TU_TWITTER_ACCESS_SECRET"

# Mensaje de prueba
$mensaje = "✅ Test automático desde DOA Token V2 - " + (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")

# Endpoint de la API v2
$url = "https://api.x.com/2/tweets"

# Cuerpo de la petición
$body = @{ text = $mensaje } | ConvertTo-Json

# Llamada a la API
Invoke-RestMethod -Uri $url -Method Post -Headers @{ Authorization = "Bearer $bearer" } -Body $body -ContentType "application/json"

Write-Host "Tweet enviado: $mensaje"