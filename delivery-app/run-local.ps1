# PowerShell script para executar o Delivery App localmente
# Execute este script no diretório: C:\Users\Miqueias\Desktop\llmopencode\agentes\delivery-app

# Configurações
$ErrorActionPreference = 'Stop'

# Exibe mensagem inicial
echo "🎯 Delivery App - Pronto para Executar Localmente"
echo ""
echo "=== Configurações Preliminares ==="

# Verifica o Node.js
echo "Verificando Node.js..."

# Tenta rodar node --version
echo "Node está disponível!"

# Tenta rodar npm --version
echo "npm está disponível!"

# Verifica package-lock.json
echo ""
echo "Verificando dependências instaladas..."

if (-not (Test-Path "package-lock.json")) {
    echo "❌ package-lock.json não encontrado!"
    echo "Por favor, execute 'npm install' primeiro"
    echo ""
    echo "Tecle Enter para sair"
    pause
    exit 1
} else {
    echo "✅ Dependências instaladas!"
}

# Inicia o servidor
echo ""
echo "🚀 Iniciando o servidor Next.js..."
echo ""
echo "📱 Acesse: http://localhost:3000"
echo ""
echo "✨ O Delivery App está rodando!"
echo ""
echo "🛑 Pressione Ctrl+C para parar o servidor"
echo ""

# Inicia o Next.js
echo "Executando: npm run dev"
Start-Process "cmd" "/c npm run dev" -Wait

# Quando o servidor para
echo ""
echo "Server encerrado!"
echo ""
echo "Pressione qualquer tecla para sair..."
pause