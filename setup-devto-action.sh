#!/bin/bash
# setup-devto-action.sh
#
# Enable automatic DEV.to → GitHub README synchronization.
#
# Usage:
#   ./setup-devto-action.sh YOUR_DEVTO_USERNAME
#
# Example:
#   ./setup-devto-action.sh CloudFay

set -e

if [ -z "$1" ]; then
  echo "Usage: $0 YOUR_DEVTO_USERNAME"
  echo ""
  echo "Example: $0 CloudFay"
  exit 1
fi

DEVTO_USERNAME="$1"
POST_COUNT="${2:-5}"

echo ""
echo "🔧 Profile Studio — DEV.to Auto-Refresh Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ─────────────────────────────────────────────
# Validate repository
# ─────────────────────────────────────────────

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "❌ This directory is not a Git repository."
  echo "   Run this script from your GitHub profile repository."
  exit 1
fi

echo "✓ Git repository detected"

# ─────────────────────────────────────────────
# Create directories
# ─────────────────────────────────────────────

mkdir -p .github/workflows
mkdir -p .github/scripts

echo "✓ GitHub Actions directories ready"

# ─────────────────────────────────────────────
# README
# ─────────────────────────────────────────────

if [ ! -f "README.md" ]; then
  echo "⚠️ README.md not found. Creating one..."

  cat > README.md << 'EOF'
# Hi, I'm [Your Name] 👋

Welcome to my GitHub profile!

### 📝 Latest DEV.to Articles

<!-- DEVTO:START -->
<!-- DEVTO:END -->

---

<p align="center">
  <i>⭐️ From <a href="https://github.com/[your-username]">your-username</a></i>
</p>
EOF

  echo "✓ README.md created"
else
  echo "✓ README.md detected"
fi

# ─────────────────────────────────────────────
# README markers
# ─────────────────────────────────────────────

if ! grep -q "<!-- DEVTO:START -->" README.md || \
   ! grep -q "<!-- DEVTO:END -->" README.md; then

  echo "⚠️ DEV.to markers missing. Adding them..."

  cat >> README.md << 'EOF'

### 📝 Latest DEV.to Articles

<!-- DEVTO:START -->
<!-- DEVTO:END -->
EOF

  echo "✓ DEV.to markers added"
else
  echo "✓ DEV.to markers detected"
fi

# ─────────────────────────────────────────────
# Profile Studio configuration
# ─────────────────────────────────────────────

cat > .github/profile-studio.yml << EOF
devto:
  enabled: true
  username: "$DEVTO_USERNAME"
  post_count: $POST_COUNT
EOF

echo "✓ DEV.to configuration created"

# ─────────────────────────────────────────────
# GitHub Action
# ─────────────────────────────────────────────

cat > .github/workflows/devto-readme.yml << 'EOF'
name: Update DEV.to Articles

on:
  schedule:
    # Every day at 9 AM UTC
    - cron: "0 9 * * *"

  workflow_dispatch:

permissions:
  contents: write

jobs:
  update-devto:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Update DEV.to articles
        run: node .github/scripts/update-devto.js

      - name: Commit README changes
        run: |
          git config user.name "Profile Studio"
          git config user.email "41898282+github-actions[bot]@users.noreply.github.com"

          if git diff --quiet -- README.md; then
            echo "No README changes detected."
            exit 0
          fi

          git add README.md
          git commit -m "chore: update DEV.to articles"
          git push
EOF

echo "✓ GitHub Action installed"

# ─────────────────────────────────────────────
# Finish
# ─────────────────────────────────────────────

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 DEV.to auto-refresh is ready!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Configuration:"
echo "  DEV.to username : $DEVTO_USERNAME"
echo "  Posts displayed : $POST_COUNT"
echo "  Schedule        : Daily at 9 AM UTC"
echo ""
echo "Files created:"
echo "  .github/profile-studio.yml"
echo "  .github/workflows/devto-readme.yml"
echo "  .github/scripts/update-devto.js"
echo ""
echo "Next steps:"
echo ""
echo "  git add ."
echo "  git commit -m \"chore: enable DEV.to auto-refresh\""
echo "  git push"
echo ""