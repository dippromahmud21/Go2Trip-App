#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_BIN="$ROOT_DIR/.tools/node-v22.12.0-darwin-arm64/bin"

export PATH="$NODE_BIN:$PATH"
cd "$ROOT_DIR"

exec pnpm dev
