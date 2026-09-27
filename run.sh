#!/usr/bin/env bash
# Serve the repo locally and open the cinematic site.
#
# Usage:  ./run.sh [port]
#         default port: 8765
# Serves from the repo root so ImdadResume.pdf and the main portfolio resolve.
# Stop with Ctrl+C.
set -euo pipefail

PORT="${1:-8765}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
URL="http://127.0.0.1:${PORT}/cinematic/"

if lsof -ti "tcp:${PORT}" >/dev/null 2>&1; then
  echo "Port ${PORT} is already in use. Free it with: kill \$(lsof -ti tcp:${PORT})" >&2
  echo "or pick another port: $0 $((PORT + 1))" >&2
  exit 1
fi

cd "$ROOT"
echo "Serving ${ROOT}"
echo "→ ${URL}"
(sleep 1 && open "$URL") >/dev/null 2>&1 &
exec python3 -m http.server "$PORT" --bind 127.0.0.1
