#!/bin/bash

# Praetor Wiki Uploader Script
# This script clones the GitHub wiki repository, copies the local markdown
# documentation into it, commits the changes, and pushes them online.

# Exit on any error
set -e

# Configuration
WIKI_REPO_URL="ssh://git@github.com-harery/Harery/Praetor.wiki.git"
TEMP_DIR=".wiki-temp-upload"

echo "==========================================="
echo "   PRAETOR WIKI UPLOADER"
echo "==========================================="

# Clean previous temp directories if any
if [ -d "$TEMP_DIR" ]; then
    echo "🧹 Cleaning old temp upload folder..."
    rm -rf "$TEMP_DIR"
fi

echo "📥 Cloning remote wiki repository..."
git clone "$WIKI_REPO_URL" "$TEMP_DIR"

echo "📤 Copying wiki pages..."
cp wiki/*.md "$TEMP_DIR/"

cd "$TEMP_DIR"

# Add and commit changes
if [ -n "$(git status --porcelain)" ]; then
    echo "📝 Committing wiki documentation..."
    git add .
    git commit -m "docs: sync and revamp Praetor wiki pages"
    
    echo "🚀 Pushing updates to GitHub..."
    git push origin master
    echo "✅ Wiki successfully synchronized!"
else
    echo "💡 No changes detected. Wiki is up to date."
fi

# Clean up
cd ..
rm -rf "$TEMP_DIR"
echo "🎉 Done!"
