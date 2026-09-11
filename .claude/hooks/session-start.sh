#!/bin/bash
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR"

log="$(mktemp)"
if bun install >"$log" 2>&1; then
  cat "$log"
  exit 0
fi

cat "$log"

# bun.lock pins many packages to Lovable's private registry mirror
# (*-npm.pkg.dev), which this sandbox has no credentials for and gets 403 on.
# Fall back to resolving a throwaway lockfile against the public npm
# registry so node_modules is usable for typecheck/lint/dev, then restore
# the committed bun.lock so the working tree stays clean.
if grep -q "npm.pkg.dev" "$log" && grep -q "403" "$log"; then
  echo "Private registry unreachable from this sandbox; re-resolving deps against the public npm registry (local-only, bun.lock will be restored)." >&2
  cp bun.lock /tmp/bun.lock.committed
  rm -f bun.lock
  if bun install; then
    cp /tmp/bun.lock.committed bun.lock
    exit 0
  else
    cp /tmp/bun.lock.committed bun.lock
    exit 1
  fi
fi

exit 1
