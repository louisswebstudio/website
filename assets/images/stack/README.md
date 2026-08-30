# Stack logos

Brand marks for the "Notre stack" grid on /creation-site-vitrine-maroc.

## How to add one

Drop the SVG in this folder using the filename from the table below, then tell
Claude. Pasting the file path (e.g. D:\C\Downloads\foo.svg) works too.

Folder: D:\Claude\louiss-web-studio\assets\images\stack\

## Still missing

Nothing. All 20 tools in the grid have their real mark.

## Wanted, to fix two cosmetic issues

| filename      | why                                                            |
|---------------|----------------------------------------------------------------|
| aws-light.svg | AWS light-on-dark variant. The dark #252F3E wordmark measures   |
|               | ~2.5:1 against the dark tile; every other mark is 3.0-4.8:1     |
| figma.svg     | Figma is the last PNG in the grid (48px, soft next to the SVGs) |

## Already wired

frontend      nextjs.svg*  react.svg  typescript.svg  tailwind.svg  framer.svg*
backend/cms   strapi.svg  wordpress.svg*  postgresql.svg  nodejs.svg  prisma.svg*
tools         figma.png  google-analytics.svg  google-tag-manager.svg
              search-console.svg  semrush.svg
infra         vercel.svg (inlined)  github.svg*  cloudflare.svg  aws.svg  docker.svg

* = dark mark, gets .stack-logo--invert so it flips to light in dark mode.

## Notes

- SVG preferred. PNG works at 2x the rendered size (the tile is 34px, the image
  20px, so 96px+ is safe).
- Square-ish artwork sits best. Wordmark lockups get fitted by width and come
  out tiny: the Sanity wordmark measured 4.88:1, which is 4px tall in the tile.
  If a brand ships a combined lockup, the icon half can usually be cropped out
  with a tighter viewBox, which is what strapi.svg does.
- Trim surrounding whitespace before saving.
- Check the dark theme after adding a dark or navy mark.
- Unused leftovers that can be deleted: nextjs.png, react.png, tailwind.png,
  typescript.png, sanity-wordmark.svg
