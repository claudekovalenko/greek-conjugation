#!/usr/bin/env node
/* build.js — inline the stylesheet and every script into one file.
   Produces two things from the same source:
     dist/koine-drill.html   a complete standalone page you can email or
                             open offline with no other files
     dist/embed.html         the same page as a head+body fragment, for hosts
                             that supply their own <!doctype> wrapper */
const fs = require('fs');
const path = require('path');

const root = __dirname;
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
const scripts = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
if (!scripts.length) throw new Error('no <script src> tags found in index.html');

const js = scripts
  .map(src => `/* ===== ${src} ===== */\n` + fs.readFileSync(path.join(root, src), 'utf8'))
  .join('\n');

// Guard against the one thing that would silently break an inlined bundle.
if (/<\/script>/i.test(js)) throw new Error('a source file contains </script>; escape it before inlining');

let out = html
  .replace(/[ \t]*<link rel="stylesheet" href="styles\.css">\n/, `<style>\n${css}</style>\n`)
  .replace(/[ \t]*<script src="[^"]+"><\/script>\n/g, '')
  .replace('</body>', `<script>\n${js}</script>\n</body>`);

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist', 'koine-drill.html'), out);

// Fragment form: no document wrapper, no local favicon link.
const embed = out
  .replace(/^<!doctype html>\s*<html lang="en">\s*<head>\s*/i, '')
  .replace(/<\/head>\s*<body>\s*/i, '\n')
  .replace(/\s*<\/body>\s*<\/html>\s*$/i, '\n')
  .replace(/[ \t]*<link rel="icon"[^>]*>\n/, '')
  .replace(/[ \t]*<meta charset="utf-8">\n/, '')
  .replace(/[ \t]*<meta name="viewport"[^>]*>\n/, '');
fs.writeFileSync(path.join(root, 'dist', 'embed.html'), embed);

const kb = n => (n / 1024).toFixed(0) + ' KB';
console.log('dist/koine-drill.html  ' + kb(out.length));
console.log('dist/embed.html        ' + kb(embed.length));
