@echo off
echo ============================================
echo CAI DAT SWAGGER CHO TECHSTORE API
echo ============================================
echo.

echo [1/4] Cai dat dependencies cho API Gateway...
cd server\api-gateway
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo Loi: Khong the cai dat dependencies cho API Gateway
    pause
    exit /b 1
)
cd ..\..
echo API Gateway: OK
echo.

echo [2/4] Kiem tra Auth Service...
cd server\auth-service
if not exist node_modules (
    echo Cai dat dependencies cho Auth Service...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo Loi: Khong the cai dat dependencies cho Auth Service
        pause
        exit /b 1
    )
)
cd ..\..
echo Auth Service: OK
echo.

echo [3/4] Kiem tra Product Service...
cd server\product-service
if not exist node_modules (
    echo Cai dat dependencies cho Product Service...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo Loi: Khong the cai dat dependencies cho Product Service
        pause
        exit /b 1
    )
)
cd ..\..
echo Product Service: OK
echo.

echo ============================================
echo CAI DAT THANH CONG!
echo ============================================
echo.
echo Swagger da duoc cai dat thanh cong!
echo.
echo De chay cac services, mo 3 terminal rieng biet:
echo.
echo Terminal 1: cd server\auth-service ^&^& npm start
echo Terminal 2: cd server\product-service ^&^& npm start
echo Terminal 3: cd server\api-gateway ^&^& npm start
echo.
echo Sau do truy cap Swagger UI tai:
echo http://localhost:3000/api-docs
echo.
pause


