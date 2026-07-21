# Content pipeline

Every `.md` file here is a raw HTML fragment (not markdown prose) that gets
spliced into `template.html` at its matching `<!--content:token-->` marker by
`scripts/build.mjs`.

Edit a file, then:

    node scripts/build.mjs
    node scripts/qa.mjs

Commit only when qa.mjs is green.
