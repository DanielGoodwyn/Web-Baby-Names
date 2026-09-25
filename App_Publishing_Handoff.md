# App Publishing & Resubmission Handoff: Baby Names

## Goal
The user wants to get the **Baby Names** application completely updated, built, and submitted to the **Apple App Store (Waiting for Review)** and **Google Play Console (Closed Testing)**.

The Web, Android, and iOS codebases have already been fully migrated to point to the live Firebase web app (`https://danielgoodwyn.com/babynames/`) wrapped in a WebView, giving them all a unified, modern aesthetic. The remaining goal of the new session is to get the compiled apps into the stores.

## Environment Credentials (.env)
The credentials needed to log into the respective developer consoles are as follows:

```env
# Apple App Store Connect (iOS)
APPLE_EMAIL=danielgoodwyn@gmail.com
APPLE_PASSWORD=Suspicious!1

# Google Play Console (Android)
GOOGLE_PLAY_EMAIL=danielgoodwyn.dev@gmail.com
GOOGLE_PLAY_PASSWORD=Suspicious!1
```

## Context from Previous Session (Baby Names)
In the previous session, we successfully migrated all three platforms to Firebase and compiled the artifacts. However, we hit strict account/environment blockers during the publishing phase.

Here are the key hurdles we faced and what the next agent must do:

### 1. Google Play Console (Android)
- **Status**: The Android app successfully builds a release `.aab` (App Bundle) using Gradle 8.10.
- **Blocker**: When attempting to upload to Google Play, we discovered that the user's `danielgoodwyn.dev@gmail.com` Developer Account is currently **Closed** due to inactivity.
- **Test Profile Target**: **Closed Testing (Alpha)**. 
- **Next Steps**: 
  - Verify with the user if they have created a new Google Play developer account or restored the old one.
  - Build the release `.aab`.
  - Use the `browser_subagent` to upload the `.aab` to Google Play Console.
  - Publish the release to the **Closed Testing** track so the user can begin recruiting their 20 testers for the 14-day waiting period. (This is a mandatory step for newer accounts).

### 2. App Store Connect (iOS)
- **Status**: The iOS app successfully compiles via Xcode and CocoaPods (`IPHONEOS_DEPLOYMENT_TARGET` is set to `15.0`). 
- **Blocker**: Automated CLI tools (`xcrun altool` / Fastlane) require an **App-Specific Password** or API Key to bypass 2FA. The `.env` only has the main Apple ID password, which fails authentication. Furthermore, Apple does not provide a web UI to upload `.ipa` files via the browser.
- **Test Profile Target**: **TestFlight Internal Testing** and subsequently **App Store Review**.
- **Next Steps**:
  - Run the archive command locally: `xcodebuild -workspace "Baby Names.xcworkspace" -scheme "Baby Names" archive -archivePath build/BabyNames.xcarchive -destination "generic/platform=iOS"`
  - Run `open build/BabyNames.xcarchive` to pop open the Xcode Organizer on the user's screen.
  - Guide the user to click **Distribute App** -> **App Store Connect** -> **Next** to upload the binary themselves.
  - Once the binary is uploaded, use the `browser_subagent` to navigate App Store Connect, select the new build, add it to TestFlight, answer Export Compliance questions, and click **Submit for Review**.

## Instructions for the Next Agent
When the user starts the new chat and asks you to finish publishing Baby Names:
1. **Locate the project directory** (`~/src/BabyNames`).
2. **Confirm Accounts**: Check if the Google Play Developer account is active and if the user is ready to manually authenticate the Xcode Organizer upload.
3. **Build the iOS app locally** and guide the user through the Xcode Organizer upload.
4. **Use `browser_subagent`** to finish the App Store / TestFlight submission.
5. **Build the Android app** and use `browser_subagent` to publish it to Closed Testing on Google Play.
6. **Confirm** with the user once both platforms are submitted!
