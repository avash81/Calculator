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
      
      // Fix duplicate props safely
      content = content.replace(/inputMode="decimal"\s+pattern="([^"]*)"\s+inputMode="(numeric|decimal)"/g, 'inputMode="$2" pattern="$1"');
      content = content.replace(/inputMode="(numeric|decimal)"\s+pattern="([^"]*)"\s+inputMode="decimal"/g, 'inputMode="$1" pattern="$2"');

      // Fix known unescaped entities manually by checking strings from error logs
      if (fullPath.includes('base-converter')) content = content.replace(/"To base"/g, '&quot;To base&quot;');
      if (fullPath.includes('chemistry-molar')) content = content.replace(/"Molar Mass"/g, '&quot;Molar Mass&quot;');
      if (fullPath.includes('date-duration')) content = content.replace(/"duration"/g, '&quot;duration&quot;');
      if (fullPath.includes('linear-solver')) content = content.replace(/"2x \+ 3y = 5"/g, '&quot;2x + 3y = 5&quot;');
      if (fullPath.includes('physics-energy')) content = content.replace(/"Energy"/g, '&quot;Energy&quot;');
      if (fullPath.includes('physics-force')) {
        content = content.replace(/Newton's/g, 'Newton&apos;s');
        content = content.replace(/object's/g, 'object&apos;s');
        content = content.replace(/"Force"/g, '&quot;Force&quot;');
      }
      if (fullPath.includes('probability')) {
        content = content.replace(/"Probability of A"/g, '&quot;Probability of A&quot;');
        content = content.replace(/"Probability of B"/g, '&quot;Probability of B&quot;');
        content = content.replace(/"Conditional Probability"/g, '&quot;Conditional Probability&quot;');
        content = content.replace(/"Probability of A given B"/g, '&quot;Probability of A given B&quot;');
      }
      if (fullPath.includes('rounding')) content = content.replace(/"Rounding"/g, '&quot;Rounding&quot;');
      if (fullPath.includes('z-score')) {
        content = content.replace(/"above"/g, '&quot;above&quot;');
        content = content.replace(/"below"/g, '&quot;below&quot;');
      }

      if (content !== orig) {
        fs.writeFileSync(fullPath, content, 'utf8');
      }
    }
  }
};

walk(path.join(__dirname, 'src/app/calculator'));
console.log("Safe lint fixes applied.");
