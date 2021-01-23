import React from 'react';

import LoomCanvas from './components/LoomCanvas';
import Tools from './components/Tools';
import Controls from './components/Controls';
import GlobalControls from './components/GlobalControls';

// Get rid of this when you package this later
import Typist from 'react-typist';

import { LoomContextProvider } from './context/LoomContext';

function App() {
    return (
    <LoomContextProvider>
      <div className="center">
          <div style={{
            display: 'flex',
            fontWeight: 'bold',
            fontSize: 32,
            marginBottom: '50px'
          }}>>>
            <Typist startDelay={500}>Eat the beans</Typist>
          </div>
        <div className="main-area">
            <Tools />
            <LoomCanvas />
            <Controls />
            <GlobalControls />
        </div>
      </div>
    </LoomContextProvider>
  );
}

export default App;