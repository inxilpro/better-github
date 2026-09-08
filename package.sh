#!/usr/bin/env bash
# Builds the zip to upload on the Chrome Web Store's Package tab.
# Only git-tracked files are included, so .idea/, .DS_Store, and other untracked files never end up in the package.
set -euo pipefail

cd "$(dirname "$0")"

version="$(sed -nE 's/^[[:space:]]*"version":[[:space:]]*"([^"]+)".*/\1/p' manifest.json)"

if [[ -z "$version" ]]; then
	echo "Could not read version from manifest.json" >&2
	exit 1
fi

untracked="$(git ls-files --others --exclude-standard manifest.json icons src)"

if [[ -n "$untracked" ]]; then
	echo "Warning: these files are untracked and will not be packaged:" >&2
	echo "$untracked" >&2
fi

mkdir -p dist
out="dist/better-github-${version}.zip"
rm -f "$out"

git ls-files manifest.json icons src | zip -q "$out" -@

echo "Wrote $out"
unzip -l "$out"
