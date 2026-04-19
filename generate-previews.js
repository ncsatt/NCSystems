// Standalone preview generator — run: node generate-previews.js
const fs = require('fs');
const path = require('path');

// Pull NICHES and buildNichePage out of server.js without running Express
const src = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');

// Stub out require so the file can be loaded safely
const Module = require('module');
const originalLoad = Module._resolveFilename;
const vm = require('vm');

// Build a context that has require stubbed for express/path
const ctx = vm.createContext({
  require: (mod) => {
    if (mod === 'express') {
      const stub = () => ({ use: ()=>{}, post: ()=>{}, get: ()=>{}, listen: ()=>{} });
      stub.json = () => {};
      stub.static = () => {};
      return stub;
    }
    if (mod === 'path') return path;
    return require(mod);
  },
  console,
  process,
  __dirname,
  __filename: path.join(__dirname, 'server.js'),
  module: { exports: {} },
  exports: {},
});

// Wrap server.js so app.listen never fires
const wrapped = `
(function(require, console, process, __dirname, __filename, module, exports) {
  const express = require('express');
  const app = { use:()=>{}, post:()=>{}, get:()=>{}, listen:()=>{} };
  ${src
    .replace(/const express = require\('express'\);/, '')
    .replace(/const app = express\(\);/, '')
    .replace(/app\.use\(.*?\);/g, '')
    .replace(/app\.post\([\s\S]*?^\}\);/mg, '')
    .replace(/Object\.keys\(NICHES\)[\s\S]*?^\}\);/mg, '')
    .replace(/app\.get\([\s\S]*?^\}\)\);/mg, '')
    .replace(/app\.listen[\s\S]*?^\}\);/mg, '')
  }
  this.NICHES = NICHES;
  this.buildNichePage = buildNichePage;
})
`;

const fn = vm.runInContext(wrapped, ctx);
const exports = {};
fn.call(exports, ctx.require, console, process, __dirname, path.join(__dirname, 'server.js'), {exports}, exports);

const { NICHES, buildNichePage } = exports;

const outDir = path.join(__dirname, 'previews');
fs.mkdirSync(outDir, { recursive: true });

let count = 0;
for (const [slug, niche] of Object.entries(NICHES)) {
  const html = buildNichePage(niche);
  fs.writeFileSync(path.join(outDir, `${slug}.html`), html, 'utf8');
  console.log(`✓  ${slug}`);
  count++;
}
console.log(`\nDone — ${count} preview files regenerated in /previews/`);
