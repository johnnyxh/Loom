import React from 'react';

import LoomCanvas from './components/LoomCanvas';
import Tools from './components/Tools';
import Controls from './components/Controls';

import { LoomContextProvider } from './context/LoomContext';

function App() {
    return (
    <LoomContextProvider>
        <div className="main-area">
            <Tools />
            <LoomCanvas />
            <Controls />
        </div>
    </LoomContextProvider>
  );
}

export default App;