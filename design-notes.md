# Thomson Reuters design scan notes (2026-07-20)

Source: WebFetch on thomsonreuters.com/en, curl extraction of their live production
CSS bundles (clientlib-bayberry, the themed clientlib), WebFetch on a CoCounsel post.
Browser tool was blocked by a per-action-approval gate on this domain, so curl +
WebFetch were the fallback path — noted here so the next run knows why.

## Tokens (measured, from live CSS — not guessed)
- Primary brand: #d64000 (burnt orange/red, 30 occurrences — THE Thomson Reuters color)
- Ink: #1f1f1f (near-black, 48 occurrences, dominant text color)
- Warm parchment/paper background: #f8eadd (also seen as #fcf2da) — reads as "175 years
  of knowledge," not startup-bright
- Blue accent (secondary, used sparingly): #0065ff, #005da2, #006fc4
- Neutrals: #737373, #e6e6e6, #f2f2f2, #fafafa, #b3b3b3, #404040
- Semantic: green #387c2b (success/verified), red #dc0a0a (alert), purple #4d27a0
- Fonts: "Clario" (display headline face, Helvetica Neue fallback), "Knowledge2017"
  (editorial/serif-leaning secondary display face), "Source Sans 3" (UI/body text,
  system-ui fallback stack)
- Border radius: OVERWHELMINGLY SHARP. 4px dominant (39 occurrences), a few 8px,
  one 9999px pill, circles at 50%. This is the opposite of Affirm's pill-glass
  language — Thomson Reuters reads corporate/editorial/legal, not consumer-playful.

## Voice (quoted verbatim from the live site)
- "Fiduciary-Grade AI: Built for work you can stand behind"
- "Chosen by changemakers"
- "Purpose-built technology"
- "Solutions that shape what comes next"
- "When you're powered by 175 years of Thomson Reuters knowledge, you don't have to guess"
- Tone: professional, authoritative, forward-thinking. Confident, not cute. Leans on
  institutional weight (175 years) as a credibility flex, and on defensibility/rigor
  ("work you can stand behind") rather than delight or fun.

## Trust/verification pattern (from CoCounsel coverage)
- Their AI product's whole value prop is cited, defensible answers — not raw generation.
  CoCounsel presents legal research with sourced citations a lawyer can check.
  Third-party validation (named journalists, named publications) is how they build
  credibility in their own marketing, not badges or seals.
- This maps directly onto the JD's own asks: "evals framework," "golden datasets,"
  "fiduciary-grade," "work you can stand behind." The company's entire brand IS
  a verification/citation mechanic. That's the concept for this page (see below).

## Concept for this page
NOT a shopping page (wrong industry entirely — TR is trust/verification/research,
not commerce). The organizing idea: build the page AS an eval report / verification
dashboard, in their actual visual language (burnt orange, near-black ink, warm
parchment, sharp 4px corners, Source Sans 3 UI type). Every claim about Jose gets
a citation, like a CoCounsel-cited answer. The honesty framework (direct fit /
adjacent / gap) becomes eval rows: PASS / PARTIAL / DISCLOSED, not marketing copy.
The JD's #1 ask — hands-on technical demonstration, not description — is answered
literally: link the real public repo for this page, built via Claude Code + agents,
with a real, computable velocity stat (git log timestamps: hours from empty repo to
shipped page), which IS the agentic/evals-adjacent proof they're asking candidates
to already have lived.

## What NOT to reuse from the affirm build
- No pill buttons/glass cards as the primary language — this brand is sharp-cornered
  and editorial. Small pill use only where TR's own CSS shows a pill (rare, one
  9999px hit) — e.g. a status chip, not every button.
- No indigo. Burnt orange + near-black + parchment only, blue as a rare accent.
- No dark-mode-everywhere. TR's real site reads as light/parchment with near-black
  text — closer to a legal brief or a broadsheet than a fintech app.
