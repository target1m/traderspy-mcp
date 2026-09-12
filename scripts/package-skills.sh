#!/usr/bin/env bash
# Package every skill under skills/ as its own ZIP for the ChatGPT plugin portal
# ("Skills → Drop a skill ZIP or folder"). Each ZIP contains the skill folder at
# its root (skill-name/SKILL.md, references/, agents/openai.yaml), which is the
# layout the Agent Skills spec and OpenAI's validator expect. Output: dist/skills/.
set -euo pipefail
cd "$(dirname "$0")/.."
out="dist/skills"
rm -rf "$out" && mkdir -p "$out"
for dir in skills/*/; do
  name="$(basename "$dir")"
  [ -f "$dir/SKILL.md" ] || { echo "skip $name: no SKILL.md"; continue; }
  ( cd skills && zip -qr "../$out/$name.zip" "$name" -x '*.DS_Store' '__MACOSX/*' )
  printf '%-20s %6s bytes\n' "$name.zip" "$(stat -f%z "$out/$name.zip")"
done
echo "→ $out/"
