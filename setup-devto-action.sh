#!/bin/bash
# setup-devto-action.sh
#
# This script helps set up the DEV.to GitHub Action in your profile repository.
# Run this in your personal profile repository (username/username on GitHub).
#
# Usage: ./setup-devto-action.sh YOUR_DEVTO_USERNAME
#
# Example: ./setup-devto-action.sh anurag

if [ -z "$1" ]; then
  echo "Usage: $0 YOUR_DEVTO_USERNAME"
  echo ""
  echo "Example: $0 anurag"
  exit 1
fi

DEVTO_USERNAME="$1"

echo "🔧 Setting up DEV.to GitHub Action..."
echo ""

# Check if .github/workflows directory exists
if [ ! -d ".github/workflows" ]; then
  echo "📁 Creating .github/workflows directory..."
  mkdir -p .github/workflows
fi

# Check if README.md exists and has markers
if [ ! -f "README.md" ]; then
  echo "⚠️  README.md not found. Creating one..."
  cat > README.md << 'EOF'
# Hi, I'm [Your Name] 👋

Welcome to my GitHub profile!

### 📝 Latest DEV.to Articles

<!-- DEVTO:START -->
<!-- DEVTO:END -->

---

<p align="center"><i>⭐️ From <a href="https://github.com/[your-username]">your-username</a></i></p>
EOF
  echo "✅ Created README.md with DEV.to markers"
else
  if ! grep -q "<!-- DEVTO:START -->" README.md; then
    echo "⚠️  README.md missing DEV.to markers. Adding them..."
    # Add markers before the footer if it exists, or at the end
    if grep -q "^---" README.md; then
      sed -i '/^---/i\### 📝 Latest DEV.to Articles\n\n<!-- DEVTO:START -->\n<!-- DEVTO:END -->\n' README.md
    else
      echo ""                           >> README.md
      echo "### 📝 Latest DEV.to Articles" >> README.md
      echo ""                           >> README.md
      echo "<!-- DEVTO:START -->"      >> README.md
      echo "<!-- DEVTO:END -->"        >> README.md
    fi
    echo "✅ Added DEV.to markers to README.md"
  else
    echo "✅ README.md already has DEV.to markers"
  fi
fi

# Store DEV.to username in git config
echo ""
echo "💾 Storing DEV.to username in git config..."
git config --local devto.username "$DEVTO_USERNAME"
echo "✅ Stored username: $DEVTO_USERNAME"

# Display next steps
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo ""
echo "1. Copy the GitHub Action workflow to .github/workflows/"
echo "   (The devto-readme.yml file from Profile Studio)"
echo ""
echo "2. Commit your changes:"
echo "   git add ."
echo "   git commit -m 'chore: set up DEV.to automatic updates'"
echo ""
echo "3. Push to GitHub:"
echo "   git push"
echo ""
echo "4. The action will run:"
echo "   - Daily at 9 AM UTC (automatic)"
echo "   - Or manually: Go to Actions tab → Update DEV.to Articles → Run workflow"
echo ""
echo "5. (Optional) Change your DEV.to username anytime:"
echo "   git config --local devto.username NEW_USERNAME"
echo "   git push"
echo ""
