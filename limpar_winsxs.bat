@echo off
chcp 65001 >nul
title Limpeza WinSxS (DISM) - Requer Administrador

:: Verifica se é Admin
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo Solicitando elevacao de privilegio (UAC)...
    powershell -command "Start-Process '%~f0' -Verb RunAs"
    exit /b
)

echo ==========================================
echo  LIMPEZA WINSXS - DISM
echo ==========================================
echo.

echo [1/3] Analisando Component Store...
Dism.exe /Online /Cleanup-Image /AnalyzeComponentStore
echo.

echo [2/3] Limpando componentes supersedidos (StartComponentCleanup /ResetBase)...
echo Isto pode demorar 5-20 minutos. Nao feche esta janela.
Dism.exe /Online /Cleanup-Image /StartComponentCleanup /ResetBase
echo.

echo [3/3] Verificando espaco livre...
wmic logicaldisk where "DeviceID='C:'" get FreeSpace /value
echo.

echo ==========================================
echo  CONCLUIDO
echo ==========================================
echo.
echo Reinicie o computador se solicitado.
pause