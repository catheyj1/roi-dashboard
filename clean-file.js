const fs = require('fs');

// Read the file
let content = fs.readFileSync('src/RoiDashboardV2.jsx', 'utf8');

// Remove the entire RevenueProtectionBreakdown component (lines 366-610)
const startMarker = '// Revenue Protection Breakdown - Interactive (removed unused)';
const endMarker = '};';

let startIndex = content.indexOf(startMarker);
if (startIndex !== -1) {
  // Find the next }; after the start marker
  let braceCount = 0;
  let endIndex = startIndex;
  let inFunction = false;
  
  for (let i = startIndex; i < content.length; i++) {
    if (content[i] === '{') {
      braceCount++;
      inFunction = true;
    } else if (content[i] === '}') {
      braceCount--;
      if (inFunction && braceCount === 0) {
        endIndex = i + 1;
        break;
      }
    }
  }
  
  content = content.substring(0, startIndex) + content.substring(endIndex + 1);
}

// Remove UseCaseCard component
const useCaseCardStart = content.indexOf('// Use Case Card Component');
if (useCaseCardStart !== -1) {
  const useCaseCardEnd = content.indexOf('};', useCaseCardStart) + 2;
  content = content.substring(0, useCaseCardStart) + content.substring(useCaseCardEnd);
}

// Remove PredictiveCallout component
const predictiveStart = content.indexOf('// Predictive Analytics Callout');
if (predictiveStart !== -1) {
  const predictiveEnd = content.indexOf('};', predictiveStart) + 2;
  content = content.substring(0, predictiveStart) + content.substring(predictiveEnd);
}

// Remove ROITrendChart component
const roiTrendStart = content.indexOf('// ROI Trend Chart');
if (roiTrendStart !== -1) {
  const roiTrendEnd = content.indexOf('};', roiTrendStart) + 2;
  content = content.substring(0, roiTrendStart) + content.substring(roiTrendEnd);
}

// Write back to file
fs.writeFileSync('src/RoiDashboardV2.jsx', content);

console.log('Cleaned up unused components');
