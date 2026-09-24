#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

npm ci

if [[ -n "${NPM_TOKEN:-}" ]]; then
  bash "$ROOT/scripts/cloud-agent-npm-auth.sh"
fi
