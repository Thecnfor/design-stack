#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"

mkdir -p "$TARGET"

echo "Installing skills from $ROOT to $TARGET"

for skill in "$ROOT"/skills/*; do
  [ -d "$skill" ] || continue
  name="$(basename "$skill")"
  if [ -e "$TARGET/$name" ] && [ ! -L "$TARGET/$name" ]; then
    echo "  skip $name (exists and is not a symlink)"
    continue
  fi
  ln -sfn "$skill" "$TARGET/$name"
  echo "  linked $name"
done

cat <<'EOF'

External tools (install manually):

  ascii.rest          npx ascii.rest list
  React Bits          npx shadcn@latest add @react-bits/GradientASCII-TS-TW
  shadcn validate     npx shadcn@latest registry validate
  AntiSlop            brew install skew202/tap/antislop
  ASCII Magic MCP     claude mcp add --transport http ascii-magic https://www.ascii-magic.com/mcp

Start a new agent session after installing skills.
EOF
