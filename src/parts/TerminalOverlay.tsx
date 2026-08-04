import { useState, useEffect } from 'react';
import type { KeyboardEvent } from 'react';
import './TerminalOverlay.css';

import courageMouthClosed from '../assets/courage_mouth_closed.png';
import courageMouthOpen from '../assets/courage_mouth_open.png';
import courageMouthHalfOpen from '../assets/courage_mouth_half_open.png';

const courageFrames = [
  courageMouthClosed,
  courageMouthOpen,
  courageMouthHalfOpen,
];

export const TerminalOverlay = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('System Online. What do you want, kid?');
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prevIndex) => (prevIndex + 1) % courageFrames.length);
    }, 200);

    return () => clearInterval(timer);
  }, []);

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!input) {
        setOutput('Are you going to type something, you twit, or just stare at me?');
      } else {
        setOutput(`Processing your ridiculous query for: "${input}"...`);
        setTimeout(() => {
          setOutput("I don't know. You're on your own, kid :)");
        }, 1500);
      }
      setInput('');
    }
  };

  return (
    <div className="ui-overlay">
      <div className="output-screen">
        <p>{output}</p>
      </div>
      <div className="input-line">
        <span>&gt;</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Ticka, ticka, ticka..."
          autoFocus
        />
        <img 
          src={courageFrames[frameIndex]} 
          alt="Courage the Cowardly Dog" 
          className="courage-head" 
        />
      </div>
    </div>
  );
};

