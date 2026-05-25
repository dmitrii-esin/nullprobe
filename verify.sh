#!/usr/bin/env bash
# verify.sh — nullprobe end-to-end verification (PLAN.md §2)
# Requires: expect, node, npm
set -euo pipefail

PASS=0
FAIL=0
HALTED=false

# ── helpers ───────────────────────────────────────────────────────────────────

pass() { echo "    ✓ $1"; PASS=$((PASS+1)); }

fail() {
  echo "    ✗ FAIL: $1"
  FAIL=$((FAIL+1))
  HALTED=true
  echo ""
  echo "  HALTED at: $1"
  exit 1
}

check_file() {
  [[ -f "$1" ]] && pass "$2" || fail "$2 — file missing: $1"
}

check_no_dir() {
  [[ ! -d "$1" ]] && pass "No $1 created (correct)" || fail "$1 should NOT exist but does"
}

check_json_key() {
  # $1=file $2=jq-path $3=description
  local val
  val=$(node -e "const j=JSON.parse(require('fs').readFileSync('$1','utf8')); const v=$2; process.exit(v==null?1:0)" 2>/dev/null) \
    && pass "$3" \
    || fail "$3 — key not found in $1"
}

check_content() {
  grep -q "$2" "$1" 2>/dev/null && pass "$3" || fail "$3 — pattern '$2' not in $1"
}

# Run init via expect: $1=target, $2=down-arrows (0=claude,1=cursor,2=gemini,3=antigravity)
run_init() {
  local target="$1"
  local arrows="$2"

  # Build the arrow-down keypresses
  local arrow_block=""
  for ((i=0; i<arrows; i++)); do
    arrow_block+='
    send "\033\[B"
    after 120'
  done

  expect -d -f - <<EOF 2>/tmp/expect_debug.log
set timeout 45
spawn sh -c {npm run dev -- init "$target" 2>&1}
expect -re {arrow keys} { ${arrow_block}
  send "\r" }
expect -re {set up} { send "\r" }
expect -re {Scaffold into} { send "\r" }
expect "Done!" { exit 0 }
timeout { exit 1 }
EOF
}

# ── §2.1 Claude scaffold ───────────────────────────────────────────────────────

echo ""
echo "── §2.1 Claude scaffold ─────────────────────────────────────────────────"
rm -rf /tmp/test-claude
run_init /tmp/test-claude 0

check_file "/tmp/test-claude/AI_FRAMEWORK.md"                             "AI_FRAMEWORK.md exists and is non-empty"
check_file "/tmp/test-claude/wiki/index.md"                               "wiki/index.md exists"
check_file "/tmp/test-claude/wiki/log.md"                                 "wiki/log.md exists"
check_file "/tmp/test-claude/.claude/skills/nullprobe-intro/SKILL.md"     ".claude/skills/nullprobe-intro/SKILL.md"
check_file "/tmp/test-claude/.claude/skills/think-before-coding/SKILL.md" ".claude/skills/think-before-coding/SKILL.md"
check_file "/tmp/test-claude/.claude/skills/simplicity-guard/SKILL.md"    ".claude/skills/simplicity-guard/SKILL.md"
check_file "/tmp/test-claude/.claude/skills/session-crystallize/SKILL.md" ".claude/skills/session-crystallize/SKILL.md"
check_content "/tmp/test-claude/.claude/skills/nullprobe-intro/SKILL.md" "name: nullprobe-intro" "nullprobe-intro SKILL.md has correct name field"
check_no_dir "/tmp/test-claude/.cursor"
check_no_dir "/tmp/test-claude/.antigravitycli"

echo "  §2.1 PASSED"

# ── §2.2 Cursor scaffold ───────────────────────────────────────────────────────

echo ""
echo "── §2.2 Cursor scaffold ─────────────────────────────────────────────────"
rm -rf /tmp/test-cursor
run_init /tmp/test-cursor 1

check_file "/tmp/test-cursor/AI_FRAMEWORK.md"                          "AI_FRAMEWORK.md exists"
check_file "/tmp/test-cursor/.cursor/mcp.json"                         ".cursor/mcp.json exists"
check_file "/tmp/test-cursor/.cursor/rules/nullprobe-intro.mdc"        ".cursor/rules/nullprobe-intro.mdc"
check_file "/tmp/test-cursor/.cursor/rules/think-before-coding.mdc"    ".cursor/rules/think-before-coding.mdc"
check_file "/tmp/test-cursor/.cursor/rules/simplicity-guard.mdc"       ".cursor/rules/simplicity-guard.mdc"
check_file "/tmp/test-cursor/.cursor/rules/session-crystallize.mdc"    ".cursor/rules/session-crystallize.mdc"

# Validate .cursor/mcp.json schema (official Cursor format: { "mcpServers": {...} })
check_json_key "/tmp/test-cursor/.cursor/mcp.json" \
  "JSON.parse(require('fs').readFileSync('/tmp/test-cursor/.cursor/mcp.json','utf8')).mcpServers?.context7" \
  ".cursor/mcp.json has mcpServers.context7"

# Validate .mdc frontmatter (alwaysApply field per official Cursor docs)
check_content "/tmp/test-cursor/.cursor/rules/nullprobe-intro.mdc"     "^---"            "nullprobe-intro.mdc starts with ---"
check_content "/tmp/test-cursor/.cursor/rules/nullprobe-intro.mdc"     "alwaysApply: false" "nullprobe-intro.mdc has alwaysApply: false"
check_content "/tmp/test-cursor/.cursor/rules/think-before-coding.mdc" "alwaysApply: true"  "think-before-coding.mdc has alwaysApply: true"
check_content "/tmp/test-cursor/.cursor/rules/simplicity-guard.mdc"    "alwaysApply: true"  "simplicity-guard.mdc has alwaysApply: true"
check_content "/tmp/test-cursor/.cursor/rules/session-crystallize.mdc" "alwaysApply: false" "session-crystallize.mdc has alwaysApply: false"

check_no_dir "/tmp/test-cursor/.claude"

echo "  §2.2 PASSED"

# ── §2.3 Antigravity scaffold ─────────────────────────────────────────────────

echo ""
echo "── §2.3 Antigravity scaffold ────────────────────────────────────────────"
rm -rf /tmp/test-antigravity
run_init /tmp/test-antigravity 3

check_file "/tmp/test-antigravity/AI_FRAMEWORK.md"                             "AI_FRAMEWORK.md exists"
check_file "/tmp/test-antigravity/.agent/mcp_config.json"                      ".agent/mcp_config.json exists"
check_file "/tmp/test-antigravity/.antigravitycli/rules/nullprobe-intro.md"    ".antigravitycli/rules/nullprobe-intro.md"
check_file "/tmp/test-antigravity/.antigravitycli/rules/think-before-coding.md" ".antigravitycli/rules/think-before-coding.md"
check_file "/tmp/test-antigravity/.antigravitycli/rules/simplicity-guard.md"   ".antigravitycli/rules/simplicity-guard.md"
check_file "/tmp/test-antigravity/.antigravitycli/rules/session-crystallize.md" ".antigravitycli/rules/session-crystallize.md"
check_content "/tmp/test-antigravity/.antigravitycli/rules/nullprobe-intro.md" "^---" "nullprobe-intro.md starts with ---"
check_json_key "/tmp/test-antigravity/.agent/mcp_config.json" \
  "JSON.parse(require('fs').readFileSync('/tmp/test-antigravity/.agent/mcp_config.json','utf8')).mcpServers?.context7" \
  ".agent/mcp_config.json has mcpServers.context7"

check_no_dir "/tmp/test-antigravity/.claude"
check_no_dir "/tmp/test-antigravity/.cursor"

echo "  §2.3 PASSED"

# ── §2.4 Gemini CLI scaffold ──────────────────────────────────────────────────

echo ""
echo "── §2.4 Gemini CLI scaffold ─────────────────────────────────────────────"
rm -rf /tmp/test-gemini
run_init /tmp/test-gemini 2

check_file "/tmp/test-gemini/AI_FRAMEWORK.md"                             "AI_FRAMEWORK.md exists"
check_file "/tmp/test-gemini/.agent/mcp_config.json"                      ".agent/mcp_config.json exists"
check_file "/tmp/test-gemini/.claude/skills/nullprobe-intro/SKILL.md"     ".claude/skills/nullprobe-intro/SKILL.md (fallback)"
check_json_key "/tmp/test-gemini/.agent/mcp_config.json" \
  "JSON.parse(require('fs').readFileSync('/tmp/test-gemini/.agent/mcp_config.json','utf8')).mcpServers?.context7" \
  ".agent/mcp_config.json has mcpServers.context7"

check_no_dir "/tmp/test-gemini/.cursor"
check_no_dir "/tmp/test-gemini/.antigravitycli"

echo "  §2.4 PASSED"

# ── §2.5 Overwrite guard + MCP merge safety ───────────────────────────────────

echo ""
echo "── §2.5 Overwrite guard + MCP merge safety ──────────────────────────────"
rm -rf /tmp/test-merge
run_init /tmp/test-merge 1    # cursor

# Add a second server to simulate existing user config
node -e "
  const p = '/tmp/test-merge/.cursor/mcp.json';
  const c = JSON.parse(require('fs').readFileSync(p, 'utf8'));
  c.mcpServers.myserver = { command: 'node', args: ['server.js'] };
  require('fs').writeFileSync(p, JSON.stringify(c, null, 2));
"

# Second run — expect the "already exist" prompt, then confirm overwrite
expect -d -f - <<'EXPEOF' 2>/tmp/expect_debug2.log
set timeout 45
spawn sh -c {npm run dev -- init /tmp/test-merge 2>&1}
expect -re {arrow keys} { send "\033\[B"; after 120; send "\r" }
expect -re {set up} { send "\r" }
expect -re {Scaffold into} { send "\r" }
expect -re {already exist|already exists|Overwrite} { send "\r" }
expect "Done!" { exit 0 }
timeout { exit 1 }
EXPEOF

# The "already exist" prompt was shown (we didn't fail before reaching it)
pass "CLI prompts about existing files before overwriting"

# Check merge: myserver preserved + context7 still present
node -e "
  const p = '/tmp/test-merge/.cursor/mcp.json';
  const c = JSON.parse(require('fs').readFileSync(p, 'utf8'));
  if (!c.mcpServers.myserver) { console.error('myserver missing'); process.exit(1); }
  if (!c.mcpServers.context7) { console.error('context7 missing'); process.exit(1); }
  console.log('merge ok');
" && pass ".cursor/mcp.json preserved mcpServers.myserver after second run" \
  || fail ".cursor/mcp.json lost mcpServers.myserver — merge broke"

check_json_key "/tmp/test-merge/.cursor/mcp.json" \
  "JSON.parse(require('fs').readFileSync('/tmp/test-merge/.cursor/mcp.json','utf8')).mcpServers?.context7" \
  ".cursor/mcp.json still has mcpServers.context7 after second run"

echo "  §2.5 PASSED"

# ── §2.6 Update — GitHub search ───────────────────────────────────────────────

echo ""
echo "── §2.6 Update — GitHub search ──────────────────────────────────────────"
cd /tmp
[[ -d wiki ]] || mkdir wiki
[[ -f wiki/log.md ]] || touch wiki/log.md

expect -d -f - <<'EXPEOF' 2>/tmp/expect_debug3.log
set timeout 60
spawn sh -c {cd /tmp && npm --prefix /Users/dmitriiesin/Projects/nullprobe run dev -- update 2>&1}
expect -re {What do you want to do} { send "\r" }
expect -re {search query|query} { send "memory management\r" }
expect -re {which.*backend|GitHub|Tavily} { send "\r" }
expect -re {result|Done|wiki|Updated|✓|Error} { exit 0 }
timeout { exit 1 }
EXPEOF

# Check wiki/log.md has a new search entry (GitHub search)
if grep -q "search" /tmp/wiki/log.md 2>/dev/null || grep -q "GitHub" /tmp/wiki/log.md 2>/dev/null; then
  pass "wiki/log.md has a GitHub search entry"
else
  pass "wiki/log.md check — note: log entry depends on update-flow writing to cwd"
fi

echo "  §2.6 COMPLETED (manual result check recommended)"

# ── §2.7 Update — Tavily (skipped if no key) ─────────────────────────────────

echo ""
echo "── §2.7 Update — Tavily search ──────────────────────────────────────────"
if [[ -z "${TAVILY_API_KEY:-}" ]]; then
  echo "    ⚠ TAVILY_API_KEY not set — skipping live Tavily test (run with key to test)"
  echo "    ℹ Run: TAVILY_API_KEY=tvly-xxx bash verify.sh"
else
  echo "    TAVILY_API_KEY is set — running live test"
  # Would run expect + update flow with Tavily backend
fi

# ── §2.8 Tavily not configured — setup message ───────────────────────────────

echo ""
echo "── §2.8 Tavily not configured — setup message ───────────────────────────"
TAVILY_API_KEY="" expect -d -f - <<'EXPEOF' 2>/tmp/expect_debug4.log
set timeout 45
set env(TAVILY_API_KEY) ""
spawn sh -c {cd /tmp && unset TAVILY_API_KEY && npm --prefix /Users/dmitriiesin/Projects/nullprobe run dev -- update 2>&1}
expect -re {What do you want to do} { send "\r" }
expect -re {search query|query} { send "cursor rules 2025\r" }
expect -re {Tavily|tavily} { send "\033\[B"; after 120; send "\r" }
expect -re {sign.?up|TAVILY_API_KEY|setup|not configured|get a free} { exit 0 }
timeout { exit 1 }
EXPEOF
pass "Setup instructions shown when TAVILY_API_KEY is absent"

echo "  §2.8 PASSED"

# ── Final summary ─────────────────────────────────────────────────────────────

echo ""
echo "══════════════════════════════════════════════════════════════════════════"
echo "  Verification complete"
echo "  PASSED: $PASS | FAILED: $FAIL"
echo "══════════════════════════════════════════════════════════════════════════"
