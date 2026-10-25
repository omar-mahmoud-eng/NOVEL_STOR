const fs = require('fs');
const path = require('path');

const baseDir = path.resolve('stitch_export/stitch_storyverse_arabic_platform_ui');
const dirs = fs.readdirSync(baseDir, { withFileTypes: true })
  .filter(d => d.isDirectory() && d.name.endsWith('_1440'))
  .map(d => d.name)
  .sort();

console.log('INDEX OF STITCH SCREENS (1440px):');
console.log('--------------------------------------------------');

dirs.forEach(name => {
  const file = path.join(baseDir, name, 'code.html');
  if (fs.existsSync(file)) {
    const html = fs.readFileSync(file, 'utf8');
    const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '';
    const h2 = (html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i) || [])[1] || '';
    const clean = (h1 || h2).replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
    console.log(`${name.padEnd(22)} : ${clean.slice(0, 80)}`);
  }
});
