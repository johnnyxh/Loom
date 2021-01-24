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
            fontSize: 24,
            marginBottom: '10px'
          }}>>>
            <Typist startDelay={500}>Feel free to @Horobol on <a target="_blank" rel="noopener noreferrer" href="https://twitter.com/horobol">TWITTER</a> or <a target="_blank" rel="noopener noreferrer" href="https://discord.gg/bqKMBf5">DISCORD</a> whatever you draw or bugs you find.</Typist>
          </div>
        <img alt="" src="./favicon-192.png" />
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