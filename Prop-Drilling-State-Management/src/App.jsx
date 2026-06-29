import React, { useState, useEffect } from 'react';
import './App.css';
import C1 from './components/C1';
import StateC1 from './components/StateC1';
import StateC2 from './components/StateC2';
import EffectDemo from './components/EffectDemo';

function App() {
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('activeTab') || 'prop-drilling';
  });

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);


  return (
    <div className="container">
      <div className="tab-navigation">
        <button
          className={`tab-btn ${activeTab === 'prop-drilling' ? 'active' : ''}`}
          onClick={() => setActiveTab('prop-drilling')}
        >
          Prop Drilling Flow
        </button>
        <button
          className={`tab-btn ${activeTab === 'state-management' ? 'active' : ''}`}
          onClick={() => setActiveTab('state-management')}
        >
          State Management (useState)
        </button>
        <button
          className={`tab-btn ${activeTab === 'use-effect' ? 'active' : ''}`}
          onClick={() => setActiveTab('use-effect')}
        >
          Side Effects (useEffect)
        </button>
      </div>

      <div className="flow-container">
        {activeTab === 'prop-drilling' && <C1 />}
        {activeTab === 'state-management' && (
          <div className="state-components-container">
            <StateC1 />
            <StateC2 />
          </div>
        )}
        {activeTab === 'use-effect' && <EffectDemo />}
      </div>
    </div>
  );
}


export default App;

