# Jose Platero → Thomson Reuters

A standalone, unsolicited application page for the VP, Product Transformation
role at Thomson Reuters, built as an eval report: every fit claim against the
JD is scored pass / adjacent / disclosed with a citation.

Live: https://joseplatero.com/thomsonreuters/ (mirrored on GitHub Pages)

Not affiliated with or endorsed by Thomson Reuters. Personal, unsolicited
pitch for one specific application, built in Thomson Reuters' visual style
as a gesture of care, not a claim of association. Deliberately `noindex,
nofollow` — this page is for direct sharing only, not search.

## Editing content

Prose lives in `content/*.md` as raw HTML fragments, spliced into
`template.html` at matching `<!--content:token-->` markers.

    node scripts/build.mjs   # rebuilds index.html
    node scripts/qa.mjs      # 67 automated checks, zero dependencies
    node scripts/qa.mjs --live   # also checks both deployed destinations

Commit only when `qa.mjs` is green.
