# Dark Mode Implementation

This document describes the dark mode implementation for both V1 and V2 ROI Dashboards.

## Overview

Dark mode has been implemented across all dashboard versions with:
- CSS custom properties for consistent theming
- localStorage persistence for user preferences
- Smooth transitions between light and dark modes
- Context-based state management for React components

## Implementation Details

### V1 Dashboards (HTML/JavaScript)

#### Files Updated:
- `dashboard-inline.html` - Inline React dashboard with dark mode
- `roi-dashboard-standalone.html` - Standalone React dashboard with dark mode

#### Features:
- CSS custom properties for theme variables
- JavaScript toggle functionality
- localStorage persistence
- Fixed position toggle button (top-right corner)
- Sun/moon icons for visual feedback

#### CSS Variables:
```css
:root {
  --bg-primary: #f9fafb;
  --bg-secondary: #ffffff;
  --text-primary: #111827;
  --text-secondary: #6B7280;
  --text-tertiary: #9CA3AF;
  --border-color: #E5E7EB;
  --shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-hover: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
}

[data-theme="dark"] {
  --bg-primary: #111827;
  --bg-secondary: #1f2937;
  --text-primary: #f9fafb;
  --text-secondary: #d1d5db;
  --text-tertiary: #9ca3af;
  --border-color: #374151;
  --shadow: 0 1px 2px 0 rgb(0 0 0 / 0.3);
  --shadow-hover: 0 4px 6px -1px rgb(0 0 0 / 0.4), 0 2px 4px -2px rgb(0 0 0 / 0.4);
}
```

### V2 Dashboard (React)

#### Files Created:
- `src/contexts/DarkModeContext.jsx` - React context for dark mode state
- `src/components/DarkModeToggle.jsx` - Toggle button component
- `src/styles/darkMode.css` - Dark mode CSS styles
- `src/App.jsx` - Example app wrapper

#### Files Updated:
- `src/RoiDashboardV2.jsx` - Main dashboard component with dark mode support

#### Features:
- React Context API for state management
- Reusable DarkModeToggle component
- Conditional styling based on theme state
- Smooth transitions and hover effects
- Chart tooltip dark mode support

#### Usage:
```jsx
import { DarkModeProvider } from './contexts/DarkModeContext';
import RoiDashboardV2 from './RoiDashboardV2';

function App() {
  return (
    <DarkModeProvider>
      <RoiDashboardV2 />
    </DarkModeProvider>
  );
}
```

## Components Updated

### V1 Components:
- Main App container
- Header section
- Overview cards
- ROI breakdown charts
- Use case grids
- Policy optimization cards
- Custom tooltips
- Tables and expanded details

### V2 Components:
- Main dashboard container
- Header with controls
- Executive summary section
- Metric cards
- Timeline section
- Strategic insights
- All chart components

## Styling Approach

1. **CSS Custom Properties**: Used for consistent theming across all components
2. **Conditional Classes**: Applied based on `isDarkMode` state in React components
3. **Smooth Transitions**: Added to all color and background changes
4. **Chart Support**: Custom styles for Recharts tooltips and legends

## Browser Support

- Modern browsers with CSS custom properties support
- localStorage for preference persistence
- React 18+ for V2 dashboard

## Testing

To test dark mode:
1. Open any dashboard file in a browser
2. Click the dark mode toggle button (top-right corner)
3. Verify all components switch to dark theme
4. Refresh the page to confirm preference is saved
5. Toggle back to light mode to verify persistence

## Future Enhancements

- System preference detection (prefers-color-scheme)
- More granular theme customization
- Additional color schemes beyond light/dark
- Animation preferences for reduced motion
