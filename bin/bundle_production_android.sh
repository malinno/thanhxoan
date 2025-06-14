#!/bin/bash

cd "$(dirname "$0")"

cd ..
npx react-native bundle \
--platform android \
--dev false \
--entry-file index.js \
--bundle-output android/app/src/main/assets/index.android.bundle

cd android
./gradlew app:bundleProductionRelease