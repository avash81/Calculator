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
      
      // Fix duplicate props
      content = content.replace(/inputMode="decimal"\s+pattern="\[0-9\.\]\*"\s+inputMode="numeric"/g, 'inputMode="numeric" pattern="[0-9]*"');
      content = content.replace(/inputMode="decimal"\s+pattern="\[0-9\.\]\*"\s+inputMode="decimal"/g, 'inputMode="decimal" pattern="[0-9.]*"');

      // Fix known unescaped entities
      content = content.replace(/Newton's/g, 'Newton&apos;s');
      content = content.replace(/object's/g, 'object&apos;s');
      content = content.replace(/person's/g, 'person&apos;s');
      
      // Replace quotes in text blocks securely. 
      // Look for `"word"` and replace with `&quot;word&quot;` but avoid breaking JSX props that have `="something"`.
      // We know the errors are unescaped " inside text nodes.
      content = content.replace(/>([^<]*?)"([^"<]+)"([^<]*?)</g, (match, p1, p2, p3) => {
        return `>${p1}&quot;${p2}&quot;${p3}<`;
      });

      fs.writeFileSync(fullPath, content, 'utf8');
    }
  }
};

walk(path.join(__dirname, 'src/app/calculator'));
console.log("Lint fixes applied.");
