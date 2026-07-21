#!/usr/bin/env node
/* QA suite for the Thomson Reuters application page.
   Zero dependencies. Run: node scripts/qa.mjs [--live]
   --live also checks joseplatero.com/thomsonreuters and the GitHub Pages mirror. */

import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(join(root, 'index.html'), 'utf8');
const LIVE = process.argv.includes('--live');

let pass = 0, fail = 0;
const t = (name, ok, detail = '') => {
  if (ok) { pass++; console.log(`  ok  ${name}`); }
  else { fail++; console.log(`FAIL  ${name}${detail ? ' :: ' + detail : ''}`); }
};
const section = (s) => console.log(`\n== ${s}`);

/* ---------- not indexed: noindex-only, no robots.txt Disallow ----------
   Disallow blocks crawlers from ever reading the noindex tag, which can
   paradoxically produce a bare unlabeled result if the link leaks. Rely on
   the meta tag alone; do not add a root robots.txt Disallow for this path. */
section('not indexed (critical)');
t('meta robots noindex present', /<meta name="robots" content="[^"]*noindex[^"]*">/.test(html));
t('meta robots also nofollow', /<meta name="robots" content="[^"]*nofollow[^"]*">/.test(html));
t('no OG/social preview tags that would aid discovery beyond direct link', !/property="og:/.test(html));

/* ---------- document integrity ---------- */
section('document integrity');
t('doctype present', /^<!doctype html>/i.test(html.trim()));
t('lang attribute', /<html lang="en">/.test(html));
t('exactly one <h1>', (html.match(/<h1[\s>]/g) || []).length === 1);
const opens = (tag) => (html.match(new RegExp(`<${tag}[\\s>]`, 'g')) || []).length;
const closes = (tag) => (html.match(new RegExp(`</${tag}>`, 'g')) || []).length;
for (const tag of ['section', 'div', 'span', 'h2', 'h3', 'h4', 'p', 'a', 'button', 'figure', 'figcaption', 'blockquote']) {
  t(`balanced <${tag}> (${opens(tag)})`, opens(tag) === closes(tag), `${opens(tag)} open vs ${closes(tag)} close`);
}
const ids = [...html.matchAll(/ id="([^"]+)"/g)].map(m => m[1]);
t('all ids unique', new Set(ids).size === ids.length);

/* ---------- css integrity (the bug class that broke joseplatero.com once) ---------- */
section('css integrity');
{
  const css = (html.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || '';
  let depth = 0, balanced = true;
  for (const ch of css) { if (ch === '{') depth++; if (ch === '}') depth--; if (depth < 0) balanced = false; }
  t('style braces balanced', balanced && depth === 0);
  const orphans = [];
  let d = 0;
  for (const raw of css.split('\n')) {
    const l = raw.trim();
    if (d === 0 && l && !l.startsWith('/*') && !l.startsWith('@') && !l.startsWith('}') &&
        /^[a-z-]+\s*:/.test(l) && !/^[a-z-]+\s*:\w*\s*(hover|focus|active|before|after)/.test(l)) orphans.push(l.slice(0, 60));
    for (const ch of raw) { if (ch === '{') d++; if (ch === '}') d--; }
  }
  t('no orphaned top-level declarations', orphans.length === 0, orphans.join(' | '));
  for (const rule of ['.hero {', '.report {', '.scorecard {', '.stats {', 'nav {', '.runbtn {', '.uplift {', '.band {', '.more {']) {
    t(`rule present: ${rule.slice(0, -2)}`, css.includes(rule));
  }
}

/* ---------- design system (Thomson Reuters brand rules, each one testable) ---------- */
section('design system');
t('sharp corners, not pill-glass (radius token is 4px)', /--r:4px/.test(html));
t('real measured brand color present (#d64000)', /#d64000/i.test(html));
t('no indigo/affirm palette leaked in', !/#4a4af4|#a8a9fc/i.test(html));
t('hero has a single focal object (the eval report card)', (html.match(/class="report rv"/g) || []).length === 1);
t('no sticky-stack scrolling on content panels (nav sticky is fine)', !/\.(report|scorecard|srow|panelD|uplift) \{[^}]*position:sticky/.test(html));
t('mobile pill.ghost hide is scoped to nav (not a global rule that kills hero CTAs)', !/[^ ]\.pill\.ghost\{display:none\}/.test(html) && /nav \.pill\.ghost\{display:none\}/.test(html));
t('light/parchment page background end to end (no dark-mode-everywhere)', /--bg:#fff/.test(html));
t('live eval run demo present and wired to the scorecard', /id="runbtn"/.test(html) && /function runSuite/.test(html));
t('eval run triggers once on scroll into view, not on load', /IntersectionObserver[\s\S]{0,80}runSuite/.test(html));
t('reduced-motion respected in the eval run animation', /reduced \? 0 : 420/.test(html));

/* ---------- honesty framework ---------- */
section('honesty framework');
t('scorecard has exactly 6 rows', (html.match(/class="srow"/g) || []).length === 6);
t('scorecard has real Pass rows (4)', (html.match(/class="stat-chip pass"/g) || []).length === 4);
t('scorecard has an Adjacent row', (html.match(/class="stat-chip adj"/g) || []).length === 1);
t('scorecard has a disclosed gap row, undefended', (html.match(/class="stat-chip gap"/g) || []).length === 1);
t('hero report card totals match the full scorecard (4 pass / 1 adjacent / 1 disclosed)',
  /6 checks run/.test(html) && /4 pass/.test(html));
t('gap is not hedged away (no "just kidding" walkback)', !/but really this isn.t a gap|not a real gap/i.test(html));
t('does not name Air Canada\'s external consulting partners', !/\bBCG\b/.test(html) && !/\bThoughtworks\b/i.test(html));
t('repo link present and points at this exact repo', /github\.com\/thejoseplatero\/thomsonreuters/.test(html));

/* ---------- copy accuracy guards (carried forward from prior corrections) ---------- */
section('copy accuracy');
t('no commercial-model overclaim', !/commercial model included/i.test(html));
t('no "I put targeted co-brand" overclaim', !/I put targeted co-brand/i.test(html));
t('no years-of-experience bragging', !/15\+?\s*(yrs|years)|fifteen years/i.test(html));
t('no unqualified "AI-native product" claim (must say internal/adjacent)', !/AI-native product\.\s*(?!.*internal)/i.test(html));

/* ---------- letters ---------- */
section('letters');
t('two or more real letters present', (html.match(/class="letter"/g) || []).length >= 2);
t('letters are attributed with a real name', /Sarah Yeung/.test(html) && /Nauka Chokshi/.test(html));

/* ---------- joseplatero.com promotion ---------- */
section('joseplatero.com');
t('promoted as its own panel, not a footer link', /class="more rv"/.test(html) && /Watch the agents work/.test(html));

/* ---------- accessibility ---------- */
section('accessibility');
const extLinks = [...html.matchAll(/<a [^>]*href="https?:\/\/[^"]*"[^>]*>/g)].map(m => m[0]);
t(`external links use rel=noopener (${extLinks.length})`, extLinks.every(a => /rel="noopener"/.test(a)));
t('reduced-motion respected globally', /prefers-reduced-motion/.test(html));

/* ---------- responsive ---------- */
section('responsive');
t('hero grid breakpoint present', /@media \(max-width:900px\)\{ \.hero \.grid/.test(html));
t('scorecard row breakpoint present', /@media \(max-width:660px\)\{ \.srow/.test(html));
t('stats grid breakpoint present', /@media \(max-width:760px\)\{ \.stats/.test(html));

/* ---------- javascript ---------- */
section('javascript');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
t('inline script block found', scripts.length >= 1);
let syntaxOk = true, syntaxErr = '';
try {
  execSync(`node --check /dev/stdin`, { input: scripts.join('\n;\n'), stdio: ['pipe', 'pipe', 'pipe'] });
} catch (e) { syntaxOk = false; syntaxErr = String(e.stderr).slice(0, 120); }
t('all inline JS parses (node --check)', syntaxOk, syntaxErr);

/* ---------- brand rules ---------- */
section('brand rules');
t('zero em dashes', !html.includes('—'));
const emoji = [...html].filter(c => c.codePointAt(0) > 0x1F000);
t('zero emoji', emoji.length === 0);
t('no banned vague nouns (surface/leverage)', !/\bsurface[s]?\b|\bleverage\b/i.test(html));
t('disclaimer present (not affiliated)', /Not affiliated with or endorsed by Thomson Reuters/i.test(html));

/* ---------- content pipeline ---------- */
section('content pipeline');
t('no leftover content markers in built index.html', !/<!--content:/.test(html));

/* ---------- live parity ---------- */
if (LIVE) {
  section('live parity');
  for (const d of ['https://joseplatero.com/thomsonreuters/', 'https://thejoseplatero.github.io/thomsonreuters/']) {
    try {
      const res = await fetch(`${d}?qa=${Date.now()}`);
      const body = await res.text();
      t(`${d} responds 200`, res.status === 200);
      t(`${d} byte-matches repo (${body.length} vs ${html.length})`, body.length === html.length);
      t(`${d} still carries noindex`, /noindex/.test(body));
    } catch (e) {
      t(`${d} reachable`, false, String(e).slice(0, 80));
    }
  }
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
