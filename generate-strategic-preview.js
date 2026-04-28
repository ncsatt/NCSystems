const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, 'server.js'), 'utf8');
const startMarker = 'function buildStrategicPage()';
const start = code.indexOf(startMarker);
if (start === -1) { console.error('buildStrategicPage not found'); process.exit(1); }
let i = start + startMarker.length;
while (code[i] !== '{') i++;
i++;
let depth = 1;
while (depth > 0 && i < code.length) {
  if (code[i] === '{') depth++;
  else if (code[i] === '}') depth--;
  i++;
}
const fnSrc = code.slice(start, i);
const Module = new Function(fnSrc + '\nreturn buildStrategicPage();');
const html = Module();

const outPath = path.join(__dirname, 'previews', 'strategic.html');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, html);
console.log('Wrote', outPath, html.length, 'bytes');
