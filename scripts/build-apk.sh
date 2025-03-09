#!/bin/bash

echo "===== Building Android APK for expo-app ====="
echo

# Check if android directory exists
if [ ! -d "android" ]; then
    echo "Android directory not found. Running prebuild first..."
    echo
    npx expo prebuild
    if [ $? -ne 0 ]; then
        echo "Prebuild failed! Exiting..."
        exit 1
    fi
fi

echo "Navigating to Android directory..."
cd android

# Make gradlew executable
chmod +x gradlew

echo
echo "Building debug APK..."
./gradlew assembleDebug
if [ $? -ne 0 ]; then
    echo "Build failed! See errors above."
    cd ..
    exit 1
fi

echo
echo "===== Build completed successfully! ====="
echo
echo "Your APK is located at:"
echo "android/app/build/outputs/apk/debug/app-debug.apk"
echo
echo "To build a release (signed) APK, configure your keystore in"
echo "android/app/build.gradle and run: ./gradlew assembleRelease"
echo

cd ..
