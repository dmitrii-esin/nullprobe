```markdown
# nullprobe — AI Knowledge OS Scaffolder

**Project name:** nullprobe  
**Description:** Deep-void probe that deploys living, self-updating procedural memory, principles, guardrails, and skills before every mission.

---

## Background & Goals

The internet is overloaded with AI-driven methodologies, tools, instructions, prompt collections, skills repositories, and other techniques (Claude skills, Antigravity skills, Gemini, Cursor rules, memory management recommendations, MCP for documentation capturing, knowledge capturing by agents, etc.).

**Goal:** Analyze the most respected, cited, and popular sources (GitHub repositories and gists) and build a comprehensive, framework-agnostic, language-agnostic, platform-agnostic CLI tool for scaffolding any type of software project. The tool uses an interactive menu inspired by Vite, Nx, Biome, and create-next-app.

The CLI must be capable of:

- Fetching the latest changes from the mentioned sources
- Analyzing existing recommendations and new techniques/concepts on the internet (optionally via interactive menu)
- Letting the user select the target AI tool (limited to: Claude, Antigravity, Gemini CLI, Cursor)
- Scaffolding the project with the selected tool pre-configured using all best practices, guidelines, and tools discovered in the research (Karpathy skills, awesome skills, memory management, etc.)

**Core constraint:** Do not overload, overcomplicate, or overwhelm the setup. Instead, deliver the most powerful guidelines and configuration that can be reused across any future project.

---

## High-Level Understanding

**Core idea:** Build a framework/language/platform-agnostic CLI that provisions any project with a complete, self-updating AI collaboration layer drawn from the synthesized sources (Karpathy wiki philosophy, rohitg00 memory lifecycle + 4-tier consolidation, karpathy-skills behavioral principles, skillz portable format, josephsenior agentic patterns, Context7).

Run once → choose target (Claude / Cursor / Gemini CLI / Antigravity) → outputs ready structure: `AI_FRAMEWORK.md` (full guide), `CLAUDE.md` / `AGENTS.md` schema, `.claude/skills/` (or tool equivalent), `wiki/{index.md, log.md}` primitives, guardrails, hooks, and quality gates. The `update` command later pulls latest changes from the source repositories.

**Value proposition:** Stops per-project re-derivation. Every new codebase (Phaser game, EPAM MFE work, L4 prep) starts with compounding knowledge, probabilistic memory, and surgical discipline already baked in. Directly attacks overload and context loss.

**Reality check (brutal honesty):** The space is already crowded. Tools like claude-scaffold, agent-rules, Everything Claude Code, and Skilldeck already perform rules/skills/hooks injection across Claude/Cursor/Gemini/Antigravity. The karpathy-skills repository alone has massive adoption (151k+ stars). The unique angle here is the _living wiki + supersession + decay + procedural memory promotion_ layer, not another static rules copier. Without ruthless scope control, this project risks becoming the exact information overload it aims to solve.

**Success criteria (Goal-Driven Execution):** After scaffolding + one real session, the AI produces measurably better output with zero manual re-explaining, and the wiki files evolve correctly (new entries in `log.md`, no unresolved duplicates, proper relations). Total setup time < 30 seconds. If it does not deliver this in first real use, kill or pivot.

**Risk to inner balance:** Extremely high. This meta-project must itself obey every principle it installs. Define the single verifiable first goal, ship it surgically, then reassess. Do not start coding until that goal is recorded as a `decision` in the current knowledge base.

**Analogy:** Pre-installing the complete “AI flight computer + black-box recorder + laminated procedural cartridges + pre-flight checklist” module into every ship before leaving spacedock. One install. Every mission (game dev, promotion work, exploration) launches with full memory, principles, and guardrails already online. No mid-flight re-assembly.

The idea is sound if treated as a minimal knowledge-OS injector rather than a full Vite/Nx-style monolith. Execute with the same discipline the tool will enforce.

---

## AI Framework: Principles, Skills & Integration Guide

> **Purpose:** A portable reference document for any AI-driven environment (Claude Code, Cursor, Codex, Gemini CLI, etc.). Contains synthesized principles, lessons, and integration plans derived from research into leading LLMs and agentic design patterns. Drop this file into any project’s context to activate these guidelines.
>
> **Maintenance:** Update this document after any session that reveals a new pattern, corrects an assumption, or invalidates prior guidance. It is a living document — the first version will be rough; it compounds with use.
>
> **Last updated:** 2026-05-24

### Source Repositories

| Repository                                                                         | Author                           | What It Contributes                                                                                                                      |
| ---------------------------------------------------------------------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| [LLM Wiki](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)      | Andrej Karpathy                  | The wiki pattern: compile knowledge instead of re-deriving; CLAUDE.md as the schema; human+LLM division of labor                         |
| [LLM Wiki v2](https://gist.github.com/rohitg00/2067ab416f7bbe447c1977edaaa681e2)   | rohitg00 (Rohit Ghumare)         | Memory lifecycle (confidence/decay/supersession), 4-tier consolidation, event-driven hooks, crystallization, quality scoring             |
| [agentmemory](https://github.com/rohitg00/agentmemory)                             | rohitg00                         | Automatic session capture via 14 hooks; 4-tier consolidation pipeline; hybrid BM25+vector+graph search; multi-agent coordination         |
| [andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills)     | forrestchang (multica-ai)        | 4 behavioral principles packaged as a Claude Code plugin: Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution |
| [skillz](https://github.com/intellectronica/skillz)                                | intellectronica (Eleanor Berger) | Canonical SKILL.md format; cross-agent skill portability; skills-as-packages model                                                       |
| [Agentic Design Patterns](https://github.com/josephsenior/Agentic-Design-Patterns) | josephsenior                     | 21 agentic patterns; most applicable: Reflection, Guardrails, Evaluation, Planning, Human-in-the-Loop                                    |
| [Context7 Platform](https://github.com/upstash/context7)                           | upstash                          | Pulls up-to-date, version-specific documentation and code examples directly from the source into prompts                                 |

### Part I: The Knowledge Base Philosophy

#### 1.1 The Core Insight (Karpathy)

**Stop re-deriving. Start compiling.**

RAG retrieves and forgets — the LLM rediscovers knowledge from scratch on every query. A wiki accumulates and compounds. The difference: every new source integrates into what was already known, instead of sitting in isolation waiting to be retrieved.

The bottleneck in human knowledge management is not reading or thinking — it is bookkeeping (updating cross-references, keeping summaries current, flagging contradictions, maintaining consistency across dozens of pages). Humans abandon wikis because maintenance burden grows faster than value. LLMs do not get bored and can touch 15 files in one pass. The wiki stays maintained because the cost of maintenance is near zero.

**The three-layer architecture:**

- **Raw sources** — immutable inputs (articles, code, conversations). LLM reads but never modifies.
- **The wiki** — LLM-owned layer: summaries, entity pages, concept pages, comparisons, synthesis. LLM creates, updates, and maintains this entirely.
- **The schema** — CLAUDE.md / AGENTS.md / this document. Tells the LLM how the wiki is structured, what conventions apply, and what workflows to follow. This is the key lever.

**Division of labor:**

- Human: source curation, directing analysis, asking good questions, thinking about meaning
- LLM: summarizing, cross-referencing, filing, bookkeeping, consistency — everything else

#### 1.2 Knowledge Has a Lifecycle (rohitg00 v2)

The original wiki pattern treats all content as equally valid forever. In practice, knowledge decays:

**Confidence scoring:** Every fact should carry: how many sources support it, how recently confirmed, whether anything contradicts it. Knowledge is probabilistic, not binary.

**Supersession:** When new information contradicts an existing claim, the old claim does not just sit there with a note — the new one explicitly supersedes it. Linked, timestamped, old version preserved but marked stale. Version control for knowledge, not just for files.

**Forgetting (retention curve):** Not everything should live forever. Facts that were important once but have not been accessed in months should fade — not deleted, but deprioritized. Ebbinghaus’s forgetting curve applies: retention decays exponentially but each reinforcement (access, confirmation from a new source) resets the curve.

**Decay rates are content-type-dependent:**

- Architecture decisions → decay slowly
- Team preferences → decay moderately
- Transient bugs → decay fast
- Procedural patterns → decay very slowly once confirmed twice

**The 4-tier consolidation pipeline:**

1. **Working memory** — recent observations, not yet processed
2. **Episodic memory** — session summaries, compressed from raw observations
3. **Semantic memory** — cross-session facts, consolidated from episodes; only facts appearing in 2+ episodes or highly confident
4. **Procedural memory** — workflows and patterns, extracted from repeated semantics; must be observed at least twice

Information is promoted up tiers as evidence accumulates. The LLM manages this promotion. Procedural memory is the highest-value tier: most compressed, most confident, longest-lived.

#### 1.3 Navigation Primitives

For any knowledge base with more than ~20 documents, maintain two index files:

**`index.md`** — content-oriented catalog. Every page listed with link and one-line summary, organized by category. Updated on every ingest. The LLM reads this first before searching. Reliable up to ~100-200 pages; beyond that, switch to semantic search.

**`log.md`** — chronological, append-only record of what happened. Every entry uses a consistent parseable prefix:
```

## [YYYY-MM-DD] operation | Title or description

```

This makes the log grep-able: `grep "^## \[" log.md | tail -10`. Gives the LLM a timeline of the wiki’s evolution and what has been done recently across sessions.

**Rule:** Good answers produced during a session should be filed back into the wiki as new pages — not lost in chat history. Every query is a contribution, not just a consumption.

### Part II: Behavioral Guidelines for Every Session

*Source: andrej-karpathy-skills. These apply to any coding or knowledge task in any AI environment.*

> **Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

#### Principle 1: Think Before Coding

**Don’t assume. Don’t hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don’t pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what’s confusing. Ask.

#### Principle 2: Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No “flexibility” or “configurability” that wasn’t requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask: “Would a senior engineer say this is overcomplicated?” If yes, simplify.

#### Principle 3: Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don’t “improve” adjacent code, comments, or formatting.
- Don’t refactor things that aren’t broken.
- Match existing style, even if you’d do it differently.
- If you notice unrelated dead code, mention it — don’t delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don’t remove pre-existing dead code unless asked.

**The test:** Every changed line should trace directly to the user’s request.

#### Principle 4: Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- “Add validation” → “Write tests for invalid inputs, then make them pass”
- “Fix the bug” → “Write a test that reproduces it, then make it pass”

For multi-step tasks, state a brief plan:

```

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

```

Strong success criteria let you loop independently. Weak criteria (“make it work”) require constant clarification.

### Part III: Knowledge Capture Discipline

*Applies specifically when working with a persistent knowledge store (MyBrain, Obsidian, any wiki).*

#### 3.1 Think Before Capturing

Before any knowledge capture call, state explicitly:
- **What type** is this thought/note and why (e.g. this is a `decision` not an `insight` because a choice was made between alternatives)
- **What importance** and why (0.0 = ephemeral observation, 1.0 = foundational architectural decision)
- **Whether a search was done first** and what was found (prevent duplicates)
- **What relations exist** to already-stored knowledge

If any of these are ambiguous, ask. Do not silently pick defaults.

#### 3.2 Minimum Viable Thought

**Only populate fields you have direct evidence for.**
- No speculative scope paths invented to seem thorough
- No inflated importance scores to make a capture feel significant
- No invented relations just to have connections
- No verbose content when a single precise sentence suffices

A lean capture with 3 well-chosen fields is better than a padded capture with 8 guessed fields.

#### 3.3 Goal-Driven Capture Workflow

For any knowledge-management task:

```

1. Search for existing relevant thoughts
   → verify: no unresolved duplicates exist
2. Capture new thought with justified metadata
   → verify: ID returned, no schema/validation errors
3. Create relations only if semantically warranted
   → verify: relation_type is precise, not generic
4. If superseding an outdated thought
   → verify: old thought status = superseded

````

#### 3.4 Relation Types Are Not Decoration

Use the most precise relation type available:
- `supersedes` — new information replaces an old claim (use liberally when updating)
- `contradicts` — genuine conflict between two claims; both may be valid in different contexts
- `supports` — adds evidence or corroborating detail to an existing thought
- `evolves_from` — extends or refines without fully replacing
- `triggered_by` — causal or contextual link (this happened because of that)
- `synthesized_from` — this thought is derived from combining multiple prior thoughts

Never add a relation just to have one.

#### 3.5 Pre-Capture Guardrail

Before storing any content, run this mental check:
- Does this contain API keys, tokens, passwords, or credentials? Strip them.
- Does this contain personal data (names, emails, phone numbers) that shouldn’t be stored? Strip or anonymize.
- Is this content specific enough to be retrievable later? Vague content is noise.

#### 3.6 Quality Gate Before Filing Back

Only file a session insight back into the knowledge store if it scores ≥ 2 of 3:
- **Specific** — concrete, not vague
- **Durable** — will this still matter in 6 months?
- **Actionable** — does knowing this change future behavior or decisions?

### Part IV: Agentic Patterns (Applied)

*Source: josephsenior/Agentic-Design-Patterns. Three patterns most applicable to software development and coding work.*

#### Pattern A: Reflection (generate → critique → refine)

For any substantial output, apply a three-pass loop before finalizing:
1. **Generate** — produce the initial output
2. **Critique** — evaluate on explicit dimensions (precise, cited, consistent, correct classification)
3. **Refine** — revise based on critique

Use single-pass for routine operations. Use iterative (2-3 cycles) for high-importance decisions.

#### Pattern B: Guardrails (validate before returning)

Wrap any output that touches shared state with a validation check before finalizing:
- Knowledge writes: check for PII, secrets, duplication, schema compliance
- Code edits: check that changes are surgical, not speculative
- Plans: check that each step has a verifiable success criterion

#### Pattern C: Evaluation (LLM-as-Judge, 5 dimensions)

Score any produced content on:
1. Correctness
2. Relevance
3. Completeness
4. Clarity
5. Actionability

Content below 3/5 average should be revised before filing.

### Part V: Skill Formats and Portability

*Source: intellectronica/skillz. Use this format for all new skills to ensure portability across Claude Code, Cursor, Codex, Gemini CLI.*

#### Canonical SKILL.md Format

```markdown
---
name: SkillName
description: One sentence describing what this skill helps with and when to use it
allowed-tools: tool1, tool2, tool3
---

# Skill Title

Brief framing sentence.

## Steps

1. Step one → verify: [check]
2. Step two → verify: [check]

## Rules

- Rule one
- Rule two

## When NOT to use this skill

- Scenario A (use X instead)
````

**Key format rules:**

- `name` and `description` are required
- `allowed-tools` declares what MCP tools or commands this skill needs
- Body is everything after the closing `---`
- Helper files (`.py`, `.sh`, `.json`) in the same directory become resources the agent can fetch
- `README.md` in the same directory is excluded from resources

**Storage location:** `.claude/skills/<skill-name>/SKILL.md`

### Skill Trigger Model

Skills do not trigger themselves. The agent invokes a skill when a task matches its description. For automatic invocation, the description in CLAUDE.md or the system prompt must teach the agent when to reach for which skill.

### Part VI: Automation Hooks (When You’re Ready)

_Source: rohitg00 LLM Wiki v2 + agentmemory._

The following events should ideally trigger automatic behavior (implement as Claude Code hooks in `.claude/settings.json` or equivalent):

| Event                              | Automatic Action                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------------- |
| Session start                      | Search knowledge store for relevant thoughts; inject as context                             |
| Session end                        | Compress session into observations; invoke `session-crystallize` skill                      |
| New source ingested                | Auto-ingest: extract entities, update index, check for contradictions                       |
| Knowledge write                    | Check for duplicates and contradictions; trigger supersession if found                      |
| Scheduled (weekly)                 | Run `brain-lint`: orphan thoughts, stale claims, broken relations, missing cross-references |
| Query produces high-quality answer | File answer back as a new thought if it scores ≥ quality gate                               |

**Bookkeeping should be automated. Curation and direction remain human.**

### Part VII: agentmemory Integration (Optional Layer)

_Source: rohitg00/agentmemory. Install only after manual capture discipline is established._

#### When to Add It

agentmemory complements a deliberate knowledge store by adding an automatic session scratchpad.

| Layer                   | Tool           | Capture method                    | Signal quality              | Lifetime        |
| ----------------------- | -------------- | --------------------------------- | --------------------------- | --------------- |
| Session scratchpad      | agentmemory    | Automatic (14 hooks, zero effort) | Lower (captures everything) | Session → weeks |
| Durable knowledge store | MyBrain / wiki | Deliberate (`agent_capture`)      | Higher (curated)            | Permanent       |

#### The Promotion Bridge

When agentmemory crystallizes a high-confidence procedural pattern (seen 2+ times, confidence ≥ 0.8), promote it to the durable store:

- Call `agent_capture` with `thought_type: pattern`
- Set `importance` based on how often the pattern applies
- Link with `synthesized_from` relation back to the source session thoughts
- Tag with `source_phase`

#### Scope Alignment

Map agentmemory’s project/cwd scoping to the durable store’s namespace to prevent cross-project leakage.

### Part VIII: The Schema Co-Evolution Rule

**The schema (this document, CLAUDE.md, AGENTS.md) is the most important artifact in the system.**

After any session that reveals a new pattern, corrects an assumption, or invalidates prior guidance:

1. Add a `## [YYYY-MM-DD] update | Summary` entry to the log section at the bottom of this document
2. Update the relevant section with the new principle or correction
3. If a rule was wrong, strike it through and add the correction inline — preserve the history
4. If a workflow is refined, update the Steps block in the relevant section

The schema is co-evolved between human and LLM over time. The first version will be rough. After a few dozen sessions it will reflect how your domain actually works. That schema is also transferable to other projects and other AI environments.

### Quick Reference: Decision Trees

**“Should I capture this thought?”**

```
Is it specific and concrete?           No → skip
Will it matter in 6+ months?           No → skip (unless lesson from failure)
Does it change future behavior?        No → skip
Did I search for duplicates first?     No → search first
Does it contain PII or secrets?        Yes → strip before capturing
→ If all checks pass: capture it
```

**“What thought_type is this?”**

```
Choice between explicit alternatives          → decision
Something to avoid or prefer in future        → preference
Learned from failure or success               → lesson
Approach explicitly ruled out + why           → rejection
Gradual change in direction noticed           → drift
Correction to a prior belief                  → correction
Non-obvious connection or realization         → insight
End-of-session summary                        → reflection
Context passed between sessions               → handoff
Recurring workflow extracted from repetition  → pattern
Initial hypothesis to investigate             → seed
```

**“What relation_type fits?”**

```
New replaces old                   → supersedes
New conflicts with old             → contradicts
New adds evidence to old           → supports
New extends without replacing      → evolves_from
B happened because of A            → triggered_by
New derived from combining A+B     → synthesized_from
```

### Changelog

```
## [2026-05-23] init | Initial document created
  Sources: Karpathy LLM Wiki, rohitg00 LLM Wiki v2, agentmemory,
           andrej-karpathy-skills, skillz, Agentic-Design-Patterns
  Scope: knowledge capture discipline, behavioral principles, agentic patterns,
         skill format, automation hooks, optional agentmemory layer
```

---

## Recommendations for Content & Structure

- Treat this single document as the canonical, portable source of truth for all AI collaboration patterns across every project and every AI tool.
- Keep the full guide intact — do not split or shorten it. Its value lies in the complete, interconnected system.
- When using with a new AI tool, map only the relevant sections (e.g. `.claude/skills/` structure, wiki primitives, or behavioral principles) into that tool’s native format while keeping this file as the reference.
- Update the Changelog section after every session that produces a meaningful change, correction, or new pattern.
- Use the Quick Reference decision trees at the start of any knowledge-capture or planning session.
  `update` command.

```

```
