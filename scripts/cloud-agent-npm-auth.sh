#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${NPM_TOKEN:-}" ]]; then
  echo "NPM_TOKEN is not set. Add a Runtime Secret named NPM_TOKEN in Cursor Cloud Agents → Secrets (Personal)." >&2
  exit 1
fi

npm config set //registry.npmjs.org/:_authToken "${NPM_TOKEN}" --location=user
chmod 600 "${NPM_CONFIG_USERCONFIG:-$HOME/.npmrc}"

if ! npm whoami >/dev/null 2>&1; then
  echo "npm authentication failed. Check that NPM_TOKEN is a valid publish token for the guardz package." >&2
  exit 1
fi

echo "npm authenticated as $(npm whoami)"
