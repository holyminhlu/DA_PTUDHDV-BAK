@echo off
echo ========================================
echo KIEM TRA CART APIs
echo ========================================
echo.

echo [1] Kiem tra API Gateway...
curl http://localhost:3000/health
echo.
echo.

echo [2] Kiem tra Auth Service...
curl http://localhost:3002/health
echo.
echo.

echo [3] Kiem tra Product Service...
curl http://localhost:3001/health
echo.
echo.

echo ========================================
echo NEU TAT CA DUNG THAY "status":"ok"
echo THI CAC SERVICE DANG HOAT DONG!
echo ========================================
echo.
echo Bay gio hay mo Swagger UI:
echo http://localhost:3000/api-docs
echo.
echo Ban se thay section "Cart" voi 4 endpoints:
echo  - POST /api/cart/add
echo  - GET /api/cart/{user_id}
echo  - PUT /api/cart/update
echo  - DELETE /api/cart/delete
echo.
pause


