#!/usr/bin/env bash
# Turn the Higgsfield clips into scroll-scrub frame sequences.
#
#   cinematic/clips/hero.mp4     -> cinematic/frames/hero/0001.webp ... + manifest.json
#   cinematic/clips/builder.mp4  -> cinematic/frames/builder/...
#   cinematic/clips/creator.mp4  -> cinematic/frames/creator/...
#   cinematic/clips/closer.mp4   -> cinematic/frames/closer/...
#
# Usage:  cinematic/scripts/extract-frames.sh [fps] [width] [quality]
#         defaults: 16 fps, 1600px wide, webp quality 82
# Only clips present in cinematic/clips are processed; the site falls back to a
# procedural stand-in for any clip that has no frames yet.
set -euo pipefail

FPS="${1:-16}"
WIDTH="${2:-1600}"
Q="${3:-82}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLIPS="$ROOT/clips"
FRAMES="$ROOT/frames"

command -v ffmpeg >/dev/null || { echo "ffmpeg is required (brew install ffmpeg)"; exit 1; }

found=0
for name in hero builder creator closer; do
  src=""
  for ext in mp4 mov webm; do
    [ -f "$CLIPS/$name.$ext" ] && src="$CLIPS/$name.$ext" && break
  done
  [ -z "$src" ] && continue
  found=1
  out="$FRAMES/$name"
  rm -rf "$out"; mkdir -p "$out"
  echo "→ $name: $(basename "$src") @ ${FPS}fps, ${WIDTH}px"
  ffmpeg -loglevel error -y -i "$src" \
    -vf "fps=${FPS},scale=${WIDTH}:-2:flags=lanczos" \
    -c:v libwebp -quality "$Q" -compression_level 6 -pix_fmt yuv420p \
    "$out/%04d.webp"
  count=$(ls "$out"/*.webp | wc -l | tr -d ' ')
  dims=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0:s=x "$out/0001.webp" 2>/dev/null || echo "")
  w="${dims%x*}"; h="${dims#*x}"
  printf '{"count":%s,"pad":4,"ext":"webp","fps":%s,"width":%s,"height":%s}\n' \
    "$count" "$FPS" "${w:-0}" "${h:-0}" > "$out/manifest.json"
  echo "   $count frames → $out"
done

[ "$found" = 1 ] || echo "No clips found in $CLIPS (expected hero/builder/creator/closer .mp4)."
