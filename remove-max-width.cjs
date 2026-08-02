const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk('c:/Users/mdont/OneDrive/Desktop/Projects/13.Litmus/frontend/src/pages/admin');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  if (content.includes('max-w-7xl')) {
    content = content.replace(/\s*max-w-7xl\s*/g, ' ');
    changed = true;
  }
  if (content.includes('max-w-6xl')) {
    content = content.replace(/\s*max-w-6xl\s*/g, ' ');
    changed = true;
  }
  
  // Clean up any double spaces that might have resulted
  if (changed) {
    content = content.replace(/  +/g, ' ');
    // Make sure we don't accidentally leave a trailing space before a closing quote
    content = content.replace(/ "/g, '"');
    content = content.replace(/" /g, '"');
    
    fs.writeFileSync(file, content, 'utf8');
    console.log('Removed max-width from:', file);
  }
});
