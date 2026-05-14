#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NODE_BIN="$ROOT_DIR/.tools/node-v22.12.0-darwin-arm64/bin"
RUNTIME_DIR="$ROOT_DIR/.dev"
LOG_FILE="$RUNTIME_DIR/localhost.log"
PID_FILE="$RUNTIME_DIR/localhost.pid"
URL="http://127.0.0.1:3000"

export PATH="$NODE_BIN:$PATH"
cd "$ROOT_DIR"

mkdir -p "$RUNTIME_DIR"

if command -v curl >/dev/null 2>&1 && curl -fsS "$URL" >/dev/null 2>&1; then
  echo "Go2Trip is already running at $URL"
  exit 0
fi

if [[ -f "$PID_FILE" ]]; then
  OLD_PID="$(cat "$PID_FILE")"
  if [[ -n "$OLD_PID" ]] && kill -0 "$OLD_PID" >/dev/null 2>&1; then
    echo "Stopping stale Go2Trip dev server process $OLD_PID"
    kill "$OLD_PID" >/dev/null 2>&1 || true
  fi
fi

echo "Starting Go2Trip at $URL"
nohup pnpm dev >"$LOG_FILE" 2>&1 &
SERVER_PID="$!"
echo "$SERVER_PID" >"$PID_FILE"

for _ in {1..40}; do
  if curl -fsS "$URL" >/dev/null 2>&1; then
    echo "Go2Trip is running at $URL"
    echo "Logs: $LOG_FILE"
    exit 0
  fi

  if ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    echo "Go2Trip failed to start. Last logs:"
    tail -n 80 "$LOG_FILE" || true
    exit 1
  fi

  sleep 0.5
done

echo "Timed out waiting for Go2Trip at $URL. Last logs:"
tail -n 80 "$LOG_FILE" || true
exit 1
