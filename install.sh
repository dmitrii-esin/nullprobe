#!/usr/bin/env bash
# nullprobe standalone installer
# Downloads the correct prebuilt binary for your platform from GitHub Releases,
# verifies the checksum, and installs it to a location in your PATH.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/dmitrii-esin/nullprobe/main/install.sh | sh
#
# Environment:
#   NULLPROBE_VERSION  (optional) — pin to a specific version (e.g. v0.3.0)
#   NULLPROBE_INSTALL_DIR (optional) — override install location

set -euo pipefail

REPO="dmitrii-esin/nullprobe"
VERSION="${NULLPROBE_VERSION:-latest}"
INSTALL_DIR="${NULLPROBE_INSTALL_DIR:-}"

# Detect platform
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

case "$OS" in
  darwin) OS="darwin" ;;
  linux)  OS="linux" ;;
  *) echo "❌ Unsupported OS: $OS"; exit 1 ;;
esac

case "$ARCH" in
  x86_64|amd64) ARCH="x64" ;;
  arm64|aarch64) ARCH="arm64" ;;
  *) echo "❌ Unsupported architecture: $ARCH"; exit 1 ;;
esac

# musl vs glibc is hard to detect reliably in a tiny script.
# For now we prefer glibc builds; advanced users can download musl manually.
BINARY_NAME="nullprobe-${OS}-${ARCH}"
CHECKSUM_FILE="checksums.txt"

if [ "$VERSION" = "latest" ]; then
  DOWNLOAD_URL="https://github.com/${REPO}/releases/latest/download/${BINARY_NAME}"
  CHECKSUM_URL="https://github.com/${REPO}/releases/latest/download/${CHECKSUM_FILE}"
else
  DOWNLOAD_URL="https://github.com/${REPO}/releases/download/${VERSION}/${BINARY_NAME}"
  CHECKSUM_URL="https://github.com/${REPO}/releases/download/${VERSION}/${CHECKSUM_FILE}"
fi

echo "→ Installing nullprobe (${VERSION}) for ${OS}-${ARCH}..."

# Choose install directory (prefer user-local, no sudo)
if [ -z "$INSTALL_DIR" ]; then
  if [ -w "/usr/local/bin" ]; then
    INSTALL_DIR="/usr/local/bin"
  else
    INSTALL_DIR="$HOME/.local/bin"
    mkdir -p "$INSTALL_DIR"
  fi
fi

TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

echo "   Downloading binary..."
curl -fsSL "$DOWNLOAD_URL" -o "$TMPDIR/nullprobe" || {
  echo "❌ Download failed."
  echo "   Binaries are not yet published. For now, install from source:"
  echo "   git clone https://github.com/dmitrii-esin/nullprobe.git"
  echo "   cd nullprobe && npm install && npm run build && npm link"
  exit 1
}

echo "   Downloading checksums..."
curl -fsSL "$CHECKSUM_URL" -o "$TMPDIR/checksums.txt" 2>/dev/null || true

if [ -s "$TMPDIR/checksums.txt" ]; then
  echo "   Verifying checksum..."
  (cd "$TMPDIR" && grep " ${BINARY_NAME}\$" checksums.txt | sha256sum -c -) || {
    echo "❌ Checksum verification failed!"
    exit 1
  }
else
  echo "   (no checksum file found — skipping verification for this release)"
fi

chmod +x "$TMPDIR/nullprobe"
mv "$TMPDIR/nullprobe" "$INSTALL_DIR/nullprobe"

echo ""
echo "✅ nullprobe installed to $INSTALL_DIR/nullprobe"
echo ""
echo "   Make sure $INSTALL_DIR is in your PATH, then run:"
echo "     nullprobe init"
echo ""
echo "   To update later: re-run this installer or use your package manager."
