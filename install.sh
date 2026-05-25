#!/usr/bin/env bash
set -e

echo "Building nullprobe..."
npm run build

echo "Installing nullprobe globally..."
npm install -g .

echo "✅ nullprobe installed successfully!"
echo "Run 'nullprobe init' in any project to deploy your procedural memory and skills."
