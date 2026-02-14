@echo off
echo ========================================
echo   ARAM Education Platform - Quick Setup
echo ========================================
echo.

echo [1/5] Installing dependencies...
npm install
if errorlevel 1 goto error
echo ✓ Dependencies installed
echo.

echo [2/5] Generating Prisma client...
node node_modules/prisma/build/index.js generate
if errorlevel 1 goto error
echo ✓ Prisma client generated
echo.

echo [3/5] Creating database...
node node_modules/prisma/build/index.js db push
if errorlevel 1 goto error
echo ✓ Database created
echo.

echo [4/5] Adding MCQ questions...
node seed-mcqs.js
if errorlevel 1 goto error
echo ✓ MCQ questions added
echo.

echo [5/5] Creating user accounts...
node setup-government-user.js
node setup-test-teacher.js
echo ✓ User accounts created
echo.

echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo.
echo Login Credentials:
echo ----------------------------------------
echo Government Portal:
echo   Email: govoff123@gmail.com
echo   Password: admin123
echo.
echo Teacher Portal:
echo   Email: teacher@test.com
echo   Password: teacher123
echo ----------------------------------------
echo.
echo To start the app, run:
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo.
pause
goto end

:error
echo.
echo ❌ Error occurred! Check the error message above.
echo.

:end
