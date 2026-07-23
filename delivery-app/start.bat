@echo off
echo 🚀 Iniciando Delivery App...
echo.
cd /d "%~dp0"
echo 📁 Diretorio: %CD%
echo.
echo 🔄 Liberando porta 3000 se ocupada...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do taskkill /F /PID %%a
echo.
echo 🚀 Iniciando servidor Next.js...
echo 📱 Acesse: http://localhost:3000
echo 🛑 Pressione Ctrl+C para parar
echo.
npm run dev
pause