/* build-partials.js — injects shared HTML partials into the static pages.
 *
 * The site has no bundler and no templating, so a "component" is a file in
 * partials/ plus a marker pair in each page that wants it:
 *
 *   <!-- PARTIAL:stack-section:START -->
 *   ...generated, do not hand-edit...
 *   <!-- PARTIAL:stack-section:END -->
 *
 * Edit partials/<name>.html, run `npm run build:partials`, and every page
 * carrying that marker pair is rewritten. Output is plain static HTML, so
 * there is no runtime cost and nothing depends on JavaScript for the content
 * to be in the DOM — unlike assets/city-testimonials.js, which fetches at
 * runtime because its content comes from the CMS.
 *
 * Same idea as the BLOG:START / BLOG:END block scripts/build-blog.js manages
 * in sitemap.xml.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const ROOT = process.cwd();
const PARTIALS_DIR = join(ROOT, 'partials');

if (!existsSync(PARTIALS_DIR)) {
  console.log('build-partials: no partials/ directory, nothing to do');
  process.exit(0);
}

// name -> body, with the partial's own header comment stripped
const partials = new Map();
for (const file of readdirSync(PARTIALS_DIR).filter(f => f.endsWith('.html'))) {
  const name = basename(file, '.html');
  let body = readFileSync(join(PARTIALS_DIR, file), 'utf8');
  // Drop the leading doc comment; it is for whoever edits the source, not
  // something the pages need to carry. Strip only a comment that opens at
  // byte 0, and cut at its own first close.
  if (body.startsWith('<!--')) {
    const close = body.indexOf('-->');
    if (close !== -1) body = body.slice(close + 3);
  }
  body = body.trim();

  // A partial that still mentions its own markers would inject a second
  // START/END pair and truncate the region on the next run.
  if (body.includes(`PARTIAL:${name}:`)) {
    console.error(`  ! partials/${file}: body still contains a PARTIAL:${name} marker, refusing`);
    continue;
  }
  partials.set(name, body);
}

if (!partials.size) {
  console.log('build-partials: partials/ is empty, nothing to do');
  process.exit(0);
}

const pages = readdirSync(ROOT).filter(f => f.endsWith('.html'));
let pagesChanged = 0;
let injections = 0;

for (const page of pages) {
  const path = join(ROOT, page);
  const original = readFileSync(path, 'utf8');
  let html = original;

  for (const [name, body] of partials) {
    const start = `<!-- PARTIAL:${name}:START -->`;
    const end = `<!-- PARTIAL:${name}:END -->`;
    const i = html.indexOf(start);
    if (i === -1) continue;

    const j = html.indexOf(end, i);
    if (j === -1) {
      console.error(`  ! ${page}: ${start} has no matching ${end}, skipped`);
      continue;
    }

    html = html.slice(0, i + start.length) + '\n' + body + '\n' + html.slice(j);
    injections++;
  }

  if (html !== original) {
    writeFileSync(path, html, 'utf8');
    pagesChanged++;
    console.log(`  updated ${page}`);
  }
}

console.log(
  `build-partials: ${partials.size} partial(s) [${[...partials.keys()].join(', ')}] ` +
  `-> ${injections} injection(s) across ${pagesChanged} page(s)`
);
