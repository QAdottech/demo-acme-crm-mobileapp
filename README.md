# ACME Signal CRM - Mobile App

A demo CRM mobile application built with Expo (React Native), featuring a sales pipeline dashboard with Kanban-style deal management, authentication, and light/dark mode support.

## Tech Stack

- **Expo SDK 54** (React Native 0.81, React 19)
- **expo-router** - File-based navigation with auth guards
- **NativeWind v4** - Tailwind CSS for React Native
- **EAS Build** - Cloud builds for iOS & Android
- **GitHub Actions** - CI/CD pipeline

## Prerequisites

- [Node.js](https://nodejs.org/) v22+
- [Expo CLI](https://docs.expo.dev/get-started/set-up-your-environment/) (`npm install -g expo-cli`)
- [EAS CLI](https://docs.expo.dev/build/setup/) (`npm install -g eas-cli`)
- iOS Simulator (macOS) and/or Android Emulator
- An [Expo account](https://expo.dev/signup) (for EAS builds)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/AcmeSignal/demo-acme-crm-mobileapp.git
cd demo-acme-crm-mobileapp
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npx expo start
```

Press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with the Expo Go app.

### 4. Demo credentials

- **Email:** `demo@acme.com`
- **Password:** `demo1234`

## Project Structure

```
src/
├── app/                    # Screens (file-based routing)
│   ├── _layout.tsx         # Root layout (providers + auth guard)
│   ├── sign-in.tsx         # Login screen
│   ├── +not-found.tsx      # 404 screen
│   └── (app)/              # Authenticated routes
│       ├── (tabs)/         # Bottom tab navigator
│       │   ├── index.tsx   # Pipeline Dashboard
│       │   └── settings.tsx # Settings & Logout
│       └── deal/
│           └── [id].tsx    # Deal detail screen
├── components/
│   ├── ui/                 # Button, Card, Badge, Input, Avatar
│   ├── pipeline/           # PipelineBoard, StageColumn, DealCard
│   └── layout/             # Header, Logo
├── context/
│   ├── AuthContext.tsx      # Authentication state
│   ├── PipelineContext.tsx  # Pipeline data & actions
│   └── ThemeContext.tsx     # Light/dark mode
├── data/                   # Mock data (deals, stages, users)
├── hooks/                  # Custom hooks
└── lib/                    # Types, utils, constants
```

## Features

- **Authentication** - Login screen with demo credentials, session persisted via `expo-secure-store`
- **Sales Pipeline** - Horizontal Kanban board with 6 stages (New, Lead, Qualified, Proposal, Negotiation, Customer)
- **Deal Management** - View deal details, contact info, activity timeline, and advance deals to the next stage
- **Light/Dark Mode** - Toggle in Settings, persisted via AsyncStorage, light mode by default
- **Modern UI** - NativeWind (Tailwind CSS) styling with smooth animations

## CI/CD: GitHub Actions + EAS Build

The CI/CD pipeline is defined in `.github/workflows/build-and-deploy.yml` and triggers on **pull requests to `main`**.

### Pipeline Jobs

| Job | Description | Depends On |
|---|---|---|
| `quality-check` | TypeScript check + ESLint | - |
| `build-android` | EAS Build (Android APK, preview profile) | quality-check |
| `build-ios` | EAS Build (iOS, production profile) | quality-check |
| `submit-testflight` | Submit iOS build to TestFlight | build-ios |
| `submit-google-play` | Submit Android build to Google Play (internal track) | build-android |
| `upload-qatech` | Upload builds to QA.tech (placeholder) | build-android, build-ios |

### Required GitHub Secrets

| Secret | Description |
|---|---|
| `EXPO_TOKEN` | Expo personal access token ([create one here](https://expo.dev/settings/access-tokens)) |
| `QATECH_API_TOKEN` | QA.tech API token (placeholder for future integration) |

### Setting Up Builds

#### 1. Create an Expo account and project

```bash
# Login to Expo
eas login

# Link the project (if not already linked)
eas init
```

#### 2. Add the EXPO_TOKEN secret to GitHub

1. Go to your repository on GitHub
2. Navigate to **Settings > Secrets and variables > Actions**
3. Click **New repository secret**
4. Name: `EXPO_TOKEN`, Value: your Expo personal access token

#### 3. Configure Apple credentials (iOS)

```bash
eas credentials --platform ios
```

Follow the interactive prompts to set up your Apple Developer account, provisioning profiles, and certificates. EAS manages these automatically.

Update `eas.json` with your actual values:
- `ascAppId` - Your App Store Connect app ID
- `appleTeamId` - Your Apple Developer Team ID

#### 4. Configure Google Play credentials (Android)

1. Create a Google Play service account and download the JSON key file
2. Place it at the project root as `google-service-account.json` (or update the path in `eas.json`)
3. Ensure the service account has permissions in the Google Play Console

See [EAS Submit docs](https://docs.expo.dev/submit/android/) for detailed instructions.

#### 5. Trigger a build

Create a pull request against `main` to trigger the full CI/CD pipeline:

```bash
git checkout -b my-feature
# make changes
git add .
git commit -m "My feature"
git push -u origin my-feature
# Create PR on GitHub
```

### EAS Build Profiles

| Profile | Platform | Description |
|---|---|---|
| `development` | Both | Development client, internal distribution |
| `preview` | Android | Internal distribution, outputs APK |
| `production` | Both | Auto-increment version, store submission |

### Building Locally

```bash
# Android APK (preview)
eas build --platform android --profile preview

# iOS (production)
eas build --platform ios --profile production

# Both platforms
eas build --platform all --profile production
```

## Scripts

| Command | Description |
|---|---|
| `npm start` | Start Expo dev server |
| `npm run ios` | Start on iOS simulator |
| `npm run android` | Start on Android emulator |
| `npm run lint` | Run ESLint |
| `npx tsc --noEmit` | TypeScript type check |

## License

Private - for demo purposes only.
