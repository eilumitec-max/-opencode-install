# PowerShell script para o Delivery App
# Execute: powershell -File setup.ps1 (dentro do diretório delivery-app)

# Verifica se o Node.js está instalado
echo "=== Delivery App Setup ==="
echo ""

if (-not (Test-Path "node.exe")) {
    echo "❌ Node.js não encontrado!"
    echo "Instale Node.js de: https://nodejs.org/"
    pause
    exit 1
}

if (-not (Test-Path "npm.cmd")) {
    echo "❌ npm não encontrado!"
    pause
    exit 1
}

if (-not (Test-Path "package-lock.json")) {
    echo "📦 Instalando dependencias..."
    Start-Process "npm" "install" -NoNewWindow -Wait
    if ($LASTEXITCODE -ne 0) {
        echo "❌ Erro ao instalar dependencias!"
        pause
        exit 1
    }
    echo "✅ Dependencias instaladas com sucesso!"
} else {
    echo "✅ Dependencias ja instaladas!"
}

echo ""
echo "🌐 Iniciando o servidor..."
echo "👉 Acesse: http://localhost:3000"
echo ""
echo "✨ DELIVERY APP rodando!"
echo ""
echo "🛑 Pressione Ctrl+C para parar o servidor"
echo ""

Start-Process "npm" "run dev" -NoNewWindow -PassThru

$nodeProcess.WaitForExit()

echo "Server encerrado."
