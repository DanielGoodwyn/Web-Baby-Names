# Project Handoff: Baby Names

## Goal
The goal for this project is to update the Web, iOS, and Android apps to replace the deprecated Parse backend with **Firebase** and successfully republish the apps to the Google Play Store and Apple App Store.

## Specific Requirements for Baby Names
- **Platforms:** Web, Android, iOS all need to be updated.
- **Backend:** All three platforms must work together in **one shared Firebase project** (using `FIRAuth`, `FIRFirestore`, etc.) instead of Parse.
- **Web App:** Once migrated, the web app must be deployed/published to `danielgoodwyn.com/babynames/about.html` (or the equivalent subfolder on the site).

## Republishing Instructions
### 1. Apple App Store (iOS)
- **Account:** Use `danielgoodwyn@gmail.com`
- **Xcode Configuration:**
  - Set the iOS Deployment Target to `15.0`.
  - Use Automatic Code Signing. The Apple Development Team ID is `3YH5RQ572Q`.
  - You can use the `configure_signing.rb` script from previous projects to inject the Team ID automatically.
  - Increment the `CFBundleVersion` in `Info.plist` before submission.
- **App Store Connect Submission:**
  - Complete the App Privacy and Age Ratings questionnaires, as Apple has added these as mandatory steps.

### 2. Google Play Store (Android)
- **Account:** Use `danielgoodwyn.dev@gmail.com`
- **Android Studio / Gradle Configuration:**
  - Update `compileSdkVersion` and `targetSdkVersion` to `36`.
  - Increment the `versionCode` in `build.gradle`.
  - Add the `google-services.json` file for Firebase to the `app/` directory.
- **Play Console Submission:**
  - Submit the app to the Internal Testing track first.

## Next Steps for the Agent
1. Verify the repositories for Web, iOS, and Android inside this folder.
2. Begin the migration of backend calls from Parse to Firebase for all three platforms.
3. Apply the necessary Xcode and Gradle configuration changes for iOS and Android.
4. Republish Android (Google Play), iOS (App Store), and Web (danielgoodwyn.com subfolder).
