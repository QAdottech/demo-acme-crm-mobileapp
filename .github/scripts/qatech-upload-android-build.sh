#!/usr/bin/env bash
# Upload an Android APK to QA.tech and emit GitHub Action outputs used by
# QAdottech/run-action/change-review. See https://docs.qa.tech/configuration/mobile-pr-testing
set -euo pipefail

if [ -z "${QATECH_API_TOKEN:-}" ]; then
  echo "::error::Missing secret QATECH_API_TOKEN. Add it at https://github.com/${GITHUB_REPOSITORY}/settings/secrets/actions"
  exit 1
fi

APK_PATH="${APK_PATH:-artifacts/app-debug.apk}"
if [ ! -f "$APK_PATH" ]; then
  echo "::error::APK not found at $APK_PATH"
  find . -name '*.apk' || true
  exit 1
fi
FILE_NAME=$(basename "$APK_PATH")
echo "Using APK $APK_PATH"

auth() {
  curl -sSf -H "Authorization: Bearer $QATECH_API_TOKEN" -H "Content-Type: application/json" "$@"
}

PROJECTS_JSON=$(auth "https://api.qa.tech/v1/projects")
echo "QA.tech projects:"
echo "$PROJECTS_JSON" | jq -r '.projects[] | "- \(.shortId) \(.name)"'
PROJECT_SHORT_ID="${QATECH_PROJECT_SHORT_ID:-}"
if [ -z "$PROJECT_SHORT_ID" ]; then
  PROJECT_SHORT_ID=$(echo "$PROJECTS_JSON" | jq -r '
    .projects
    | if length == 1 then .[0].shortId
      else
        (map(select(.name | test("ACME|Signal|CRM|mobile"; "i"))) | if length == 1 then .[0].shortId else empty end)
      end
  ')
fi
if [ -z "$PROJECT_SHORT_ID" ] || [ "$PROJECT_SHORT_ID" = "null" ]; then
  echo "::error::Could not resolve QATECH_PROJECT_SHORT_ID. Set it at https://github.com/${GITHUB_REPOSITORY}/settings/variables/actions"
  exit 1
fi
echo "Using project $PROJECT_SHORT_ID"
echo "project_short_id=$PROJECT_SHORT_ID" >> "$GITHUB_OUTPUT"

APPS_JSON=$(auth "https://api.qa.tech/v1/applications?projectShortId=${PROJECT_SHORT_ID}")
echo "QA.tech applications:"
echo "$APPS_JSON" | jq -r '.applications[] | "- \(.shortId) \(.kind) \(.name)"'

APP_ID="${QATECH_APP_SHORT_ID:-}"
if [ -z "$APP_ID" ]; then
  APP_ID=$(echo "$APPS_JSON" | jq -r '
    .applications
    | (map(select(.kind == "MOBILE_APPLICATION" or (.kind | test("MOBILE"; "i")))) ) as $mobile
    | if ($mobile | length) == 1 then $mobile[0].shortId
      elif length == 1 then .[0].shortId
      else
        (map(select(.name | test("ACME|Signal|CRM|mobile"; "i"))) | if length == 1 then .[0].shortId else empty end)
      end
  ')
fi
if [ -z "$APP_ID" ] || [ "$APP_ID" = "null" ] || [[ ! "$APP_ID" =~ ^app ]]; then
  echo "::error::Could not resolve a QA.tech mobile application short ID. Set repository variable QATECH_APP_SHORT_ID"
  exit 1
fi
echo "Using application $APP_ID"
echo "app_short_id=$APP_ID" >> "$GITHUB_OUTPUT"

echo "Mobile application environments:"
auth "https://api.qa.tech/v1/applications/${APP_ID}/environments?projectShortId=${PROJECT_SHORT_ID}" \
  | jq -r '.environments[]? | "- \(.shortId) \(.name) production=\(.isProduction)"'

UPLOAD_RESPONSE=$(jq -n --arg fileName "$FILE_NAME" --arg projectShortId "$PROJECT_SHORT_ID" \
  '{fileName: $fileName, projectShortId: $projectShortId}' \
  | auth -X POST "https://api.qa.tech/v1/applications/${APP_ID}/builds/upload-url" -d @-)
UPLOAD_URL=$(echo "$UPLOAD_RESPONSE" | jq -r '.uploadUrl')
BUILD_TOKEN=$(echo "$UPLOAD_RESPONSE" | jq -r '.buildToken')
if [ -z "$UPLOAD_URL" ] || [ "$UPLOAD_URL" = "null" ] || [ -z "$BUILD_TOKEN" ] || [ "$BUILD_TOKEN" = "null" ]; then
  echo "::error::Failed to get QA.tech upload URL"
  echo "$UPLOAD_RESPONSE" | jq .
  exit 1
fi

curl -sSf -X PUT "$UPLOAD_URL" --upload-file "$APK_PATH" -H "Content-Type: application/octet-stream"

BUILD_RESPONSE=$(jq -n --arg buildToken "$BUILD_TOKEN" --arg projectShortId "$PROJECT_SHORT_ID" \
  '{platform: "android", buildToken: $buildToken, projectShortId: $projectShortId}' \
  | auth -X POST "https://api.qa.tech/v1/applications/${APP_ID}/builds" -d @-)
echo "Create build response:"
echo "$BUILD_RESPONSE" | jq .
BUILD_SHORT_ID=$(echo "$BUILD_RESPONSE" | jq -r '.applicationBuildShortId')
if [ -z "$BUILD_SHORT_ID" ] || [ "$BUILD_SHORT_ID" = "null" ]; then
  echo "::error::Failed to create QA.tech application build"
  exit 1
fi
echo "Uploaded $BUILD_SHORT_ID"
echo "build_short_id=$BUILD_SHORT_ID" >> "$GITHUB_OUTPUT"

echo "Listed builds:"
auth "https://api.qa.tech/v1/applications/${APP_ID}/builds?projectShortId=${PROJECT_SHORT_ID}&perPage=5" \
  | jq -r '.builds[]? | "- \(.applicationBuildShortId) \(.platform) \(.fileName) bundle=\(.appBundleId)"'

# Pin the review to the PR binary. Other apps in the project keep their
# existing non-production environment so overrides can be resolved.
APPS_CONFIG=$(jq -n --arg app "$APP_ID" --arg build "$BUILD_SHORT_ID" \
  '{applications: {($app): {environment: {applicationBuildShortId: $build}}}}')
for OTHER_APP in $(echo "$APPS_JSON" | jq -r --arg mobile "$APP_ID" '.applications[] | select(.shortId != $mobile) | .shortId'); do
  ENVS_JSON=$(auth "https://api.qa.tech/v1/applications/${OTHER_APP}/environments?projectShortId=${PROJECT_SHORT_ID}")
  echo "Environments for $OTHER_APP:"
  echo "$ENVS_JSON" | jq -r '.environments[] | "- \(.shortId) \(.name) production=\(.isProduction) url=\(.url)"'
  ENV_OVERRIDE=$(echo "$ENVS_JSON" | jq -c '
    .environments
    | (map(select(.isProduction == false)) + .)
    | .[0]
    | if . == null then empty
      elif (.url != null and .url != "") then {environment: {url: .url, name: .name}}
      else {environment: {shortId: .shortId}}
      end
  ')
  if [ -z "$ENV_OVERRIDE" ] || [ "$ENV_OVERRIDE" = "null" ]; then
    echo "::warning::No environment found for $OTHER_APP; skipping override"
    continue
  fi
  APPS_CONFIG=$(echo "$APPS_CONFIG" | jq -c --arg app "$OTHER_APP" --argjson override "$ENV_OVERRIDE" \
    '.applications[$app] = $override')
done
APPS_CONFIG=$(echo "$APPS_CONFIG" | jq -c .)
echo "applications_config=$APPS_CONFIG"
echo "applications_config=$APPS_CONFIG" >> "$GITHUB_OUTPUT"
