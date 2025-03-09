@echo off
echo ===== Building Android APK for expo-app =====
echo.

rem Check if android directory exists
if not exist android\ (
    echo Android directory not found. Running prebuild first...
    echo.
    call npx expo prebuild
    if %ERRORLEVEL% NEQ 0 (
        echo Prebuild failed! Exiting...
        exit /b %ERRORLEVEL%
    )
)

echo Navigating to Android directory...
cd android

echo.
echo Building debug APK...
call gradlew.bat assembleDebug
if %ERRORLEVEL% NEQ 0 (
    echo Build failed! See errors above.
    cd ..
    exit /b %ERRORLEVEL%
)

echo.
echo ===== Build completed successfully! =====
echo.
echo Your APK is located at:
echo android\app\build\outputs\apk\debug\app-debug.apk
echo.
echo To build a release (signed) APK, configure your keystore in
echo android\app\build.gradle and run: gradlew.bat assembleRelease
echo.

cd ..
