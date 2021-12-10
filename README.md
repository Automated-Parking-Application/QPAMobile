You have to install Android Studio with AVD export ANDROID_SDK=/path/to/android/sdk export PATH=/path/to/android/sdk/platform-tools:$PATH export JAVA_HOME=/path/to/java/home

Clone repo
CMD: npm install
Go to /android, create file local.properties and add sdk.dir = /path/to/sdk. You can easily find path to SDK by following: Open Android studio, go to Android Studio > Preferences, Search for sdk
Vào folder android copy folder .gradle và gradle\wrapper\gradle-wrapper.jar qua repo mới clone
CMD: npx react-native run-android ( Run AVD manualy before running project)
