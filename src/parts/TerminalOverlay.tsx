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
  const [output, setOutput] = useState('System Online. Connecting to API...');
  const [frameIndex, setFrameIndex] = useState(0);
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prevIndex) => (prevIndex + 1) % courageFrames.length);
    }, 200);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/hello-world')
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setApiMessage(data.message);
          setOutput(`API Connected: "${data.message}" | What do you want, kid?`);
        }
      })
      .catch(() => {
        setOutput('System Online (API Offline). Run TestAPI.py to connect backend!');
      });
  }, []);

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (input.trim().toLowerCase() === 'api' || input.trim().toLowerCase() === 'hello') {
        if (apiMessage) {
          setOutput(`[API Response]: ${apiMessage}`);
        } else {
          setOutput('Attempting to contact API at http://127.0.0.1:8000/hello-world...');
          fetch('http://127.0.0.1:8000/hello-world')
            .then((res) => res.json())
            .then((data) => {
              setApiMessage(data.message);
              setOutput(`[API Response]: ${data.message}`);
            })
            .catch(() => {
              setOutput('[API Error]: Backend is offline. Run TestAPI.py first!');
            });
        }
      } else if (!input) {
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

