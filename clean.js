const fs = require('fs');
const path = require('path');

const walk = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const orig = content;
      content = content.replace(/=&quot;/g, '="').replace(/&quot;\s*\/>/g, '" />').replace(/&quot;\s*>/g, '">').replace(/&quot;\s/g, '" ');
      if (content !== orig) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
};

walk(path.join(__dirname, 'src/app/calculator'));
console.log("Quotes cleaned");
