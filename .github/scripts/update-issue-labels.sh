#!/bin/bash

# Script to update labels on existing GitHub issues without recreating them
# This reads the ALL.md file and updates labels on matching issues

set -e

REPO="${1:-$GITHUB_REPOSITORY}"
GH_TOKEN="${2:-$GITHUB_TOKEN}"

if [ -z "$REPO" ] || [ -z "$GH_TOKEN" ]; then
  echo "Usage: $0 <repository> <github_token>"
  echo "Example: $0 rishabh3562/ToolBox ghp_xxxxx"
  echo ""
  echo "Or set environment variables:"
  echo "  GITHUB_REPOSITORY=rishabh3562/ToolBox"
  echo "  GITHUB_TOKEN=ghp_xxxxx"
  exit 1
fi

FILE_PATH=".github/hacktoberfest-issues/ALL.md"

if [ ! -f "$FILE_PATH" ]; then
  echo "Error: File $FILE_PATH not found"
  exit 1
fi

echo "🔍 Reading issues from $FILE_PATH"
echo "📦 Repository: $REPO"
echo ""

# Split the ALL.md file into temporary files
i=1
f=$(printf "issue_%03d.md" "$i")
while IFS= read -r line; do
  if [[ "$line" == "---" ]]; then
    i=$((i+1))
    f=$(printf "issue_%03d.md" "$i")
    continue
  fi
  echo "$line" >> "$f"
done < "$FILE_PATH"

# Function to determine labels based on content
get_labels() {
  local file=$1
  local category=""
  local labels='["hacktoberfest"]'

  # Determine category based on keywords (same logic as workflow)
  if grep -qi "test\|testing" "$file"; then
    category="testing"
  elif grep -qi "performance\|optimization\|optimize" "$file"; then
    category="performance"
  elif grep -qi "accessibility\|a11y" "$file"; then
    category="accessibility"
  elif grep -qi "security\|auth" "$file"; then
    category="security"
  elif grep -qi "documentation\|docs\|tutorial\|guide" "$file"; then
    category="documentation"
  elif grep -qi "api\|sdk" "$file"; then
    category="api"
  elif grep -qi "mobile\|ios\|android" "$file"; then
    category="mobile"
  elif grep -qi "database\|storage\|migration" "$file"; then
    category="database"
  elif grep -qi "plugin\|marketplace" "$file"; then
    category="enhancement"
  elif grep -qi "collaboration\|real-time" "$file"; then
    category="enhancement"
  elif grep -qi "analytics\|dashboard" "$file"; then
    category="enhancement"
  elif grep -qi "pwa\|offline" "$file"; then
    category="enhancement"
  elif grep -qi "import\|export\|backup" "$file"; then
    category="enhancement"
  elif grep -qi "notification" "$file"; then
    category="enhancement"
  elif grep -qi "social\|community" "$file"; then
    category="enhancement"
  elif grep -qi "ci/cd\|devops\|deployment" "$file"; then
    category="devops"
  elif grep -qi "ai\|machine learning" "$file"; then
    category="ai"
  elif grep -qi "admin\|moderation" "$file"; then
    category="enhancement"
  elif grep -q "## Bug" "$file"; then
    category="bug"
  else
    category="enhancement"
  fi

  # Add good first issue label
  if grep -qi "good first issue" "$file"; then
    labels=$(echo "$labels" | jq '. + ["good first issue"]')
  fi

  # Add help wanted label
  if grep -qi "help wanted" "$file"; then
    labels=$(echo "$labels" | jq '. + ["help wanted"]')
  fi

  # Add category label
  if [ -n "$category" ]; then
    labels=$(echo "$labels" | jq --arg cat "$category" '. + [$cat]')
  fi

  echo "$labels"
}

# Process each issue file
updated=0
skipped=0

for f in issue_*.md; do
  if [ ! -s "$f" ]; then
    continue
  fi

  # Extract title
  title=$(grep -m 1 '^#' "$f" | sed 's/^# \{0,1\}//')

  if [ -z "$title" ]; then
    echo "⚠️  Skipping $f - no title found"
    skipped=$((skipped+1))
    continue
  fi

  # Find existing issue by title
  echo "🔍 Looking for issue: $title"
  issue_number=$(curl -sS -H "Authorization: token $GH_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/$REPO/issues?state=all&per_page=100" | \
    jq --arg title "$title" '.[] | select(.title == $title) | .number' | head -n 1)

  if [ -z "$issue_number" ]; then
    echo "⚠️  Issue not found: $title"
    skipped=$((skipped+1))
    continue
  fi

  # Get new labels
  new_labels=$(get_labels "$f")

  echo "📝 Updating issue #$issue_number: $title"
  echo "   New labels: $new_labels"

  # Update labels via GitHub API
  response=$(curl -sS -X PATCH \
    -H "Authorization: token $GH_TOKEN" \
    -H "Accept: application/vnd.github+json" \
    "https://api.github.com/repos/$REPO/issues/$issue_number" \
    -d "{\"labels\": $new_labels}")

  if echo "$response" | jq -e '.number' > /dev/null 2>&1; then
    echo "✅ Successfully updated issue #$issue_number"
    updated=$((updated+1))
  else
    echo "❌ Failed to update issue #$issue_number"
    echo "   Response: $response"
  fi

  echo ""

  # Rate limiting - be nice to GitHub API
  sleep 1
done

# Cleanup temporary files
rm -f issue_*.md

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✨ Summary:"
echo "   Updated: $updated issues"
echo "   Skipped: $skipped issues"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
