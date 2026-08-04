import { useState } from 'react';
import { CRTScreen3D } from './parts/CRTScreen3D';
import { TerminalOverlay } from './parts/TerminalOverlay';
import './App.css';

export default function App() {
  const [aspectRatio, setAspectRatio] = useState<'square' | 'wide'>('square');

  return (
    <div className="app-viewport">
      <div className="aspect-control-bar">
        <span className="control-label">CRT Display Mode:</span>
        <button 
          className={`mode-btn ${aspectRatio === 'square' ? 'active' : ''}`}
          onClick={() => setAspectRatio('square')}
        >
          📺 90s Square CRT (4:3)
        </button>
        <button 
          className={`mode-btn ${aspectRatio === 'wide' ? 'active' : ''}`}
          onClick={() => setAspectRatio('wide')}
        >
          🖥️ Widescreen CRT (Full)
        </button>
      </div>

      <div className="terminal-stage">
        <CRTScreen3D aspectRatio={aspectRatio}>
          <TerminalOverlay />
        </CRTScreen3D>
      </div>
    </div>
  );
}