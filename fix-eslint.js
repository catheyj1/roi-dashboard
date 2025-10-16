const fs = require('fs');

// Read the file
let content = fs.readFileSync('src/RoiDashboardV2.jsx', 'utf8');

// Remove unused imports
content = content.replace(/,\s*ComposedChart,?\s*/g, '');
content = content.replace(/,\s*Cell,?\s*/g, '');

// Remove unused component definitions
const unusedComponents = [
  'RevenueProtectionBreakdown',
  'UseCaseCard', 
  'PredictiveCallout',
  'ROITrendChart'
];

unusedComponents.forEach(component => {
  // Find the component definition and remove it
  const regex = new RegExp(`// ${component}[\\s\\S]*?^};$`, 'gm');
  content = content.replace(regex, '');
});

// Write back to file
fs.writeFileSync('src/RoiDashboardV2.jsx', content);

console.log('Fixed ESLint warnings by removing unused components');
