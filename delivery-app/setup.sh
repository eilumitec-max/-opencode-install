#!/usr/bin/env bash

# Script de ajuda para executar o Delivery App
# Execute no terminal: bash setup.sh

cd "$(dirname "$0")"

if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js encontrado: $(node --version)"
else
    echo "❌ Node.js não encontrado!"
    echo "Instale Node.js de: https://nodejs.org/"
    exit 1
fi

if command -v npm >/dev/null 2>&1; then
    echo "✅ npm encontrado: $(npm --version)"
else
    echo "❌ npm não encontrado!"
    exit 1
fi

if [ ! -f "package-lock.json" ]; then
    echo "📦 Instalando dependências..."
    npm install
else
    echo "✅ Dependências já instaladas!"
fi

echo ""
echo "🚀 Iniciando o servidor Next.js..."
echo ""
echo "📱 Acesse: http://localhost:3000"
echo ""
echo "✨ O Delivery App está rodando!"
echo ""
echo "🛑 Pressione Ctrl+C para parar o servidor"
echo ""

npm run dev

echo ""
echo "Server encerrado!"
