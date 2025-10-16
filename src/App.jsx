import React, { useState } from 'react';
import { DarkModeProvider } from './contexts/DarkModeContext';
import RoiDashboardV2 from './RoiDashboardV2';
import './styles/darkMode.css';

function App() {
  const [dashboardVersion, setDashboardVersion] = useState('v2');

  return (
    <DarkModeProvider>
      <div className="min-h-screen">
        <RoiDashboardV2 
          dashboardVersion={dashboardVersion} 
          setDashboardVersion={setDashboardVersion} 
        />
      </div>
    </DarkModeProvider>
  );
}

export default App;
