@echo off
echo ================================================
echo   金融岛BIM网站启动器
echo ================================================
echo.
echo 正在检测环境，请稍候...
echo.

:: 强制暂停，防止秒退
timeout /t 1 /nobreak >nul

:: 检查 node
echo 步骤1：检查 Node.js...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [失败] 没有找到 Node.js
    echo.
    echo 请先安装 Node.js: https://nodejs.org/
    echo.
    goto END
)
echo [成功] Node.js 已安装
echo.

:: 检查 npm
echo 步骤2：检查 npm...
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [失败] 没有找到 npm
    echo.
    echo 请重新安装 Node.js
    echo.
    goto END
)
echo [成功] npm 已安装
echo.

:: 检查依赖
echo 步骤3：检查项目依赖...
if not exist "node_modules" (
    echo 需要安装依赖，这可能需要几分钟...
    echo.
    npm.cmd install
    if %errorlevel% neq 0 (
        echo [失败] 依赖安装失败
        echo 请检查网络连接
        echo.
        goto END
    )
    echo [成功] 依赖安装完成
    echo.
)

:: 启动服务
echo 步骤4：启动网站服务器...
echo.
echo ================================================
echo   等待出现: Local: http://localhost:3000
echo   然后在浏览器打开该地址
echo ================================================
echo.

npm.cmd run dev

:END
echo.
echo ================================================
echo   按任意键关闭窗口
echo ================================================
pause >nul
