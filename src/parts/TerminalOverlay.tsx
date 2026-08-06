`Here is the terminal screen. basically computer's face
This is where everything shows and changes, computer outputs, courage/user inputs `

// react imports
import { useState, useEffect } from 'react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import './TerminalOverlay.css';

// courage icons for animation
import courageMouthClosed from '../assets/courage_mouth_closed.png';
import courageMouthOpen from '../assets/courage_mouth_open.png';
import courageMouthHalfOpen from '../assets/courage_mouth_half_open.png';

const courageFrames = [
  courageMouthClosed,
  courageMouthOpen,
  courageMouthHalfOpen,
];

function getNextFrameIndex(prevIndex: number): number {
  return (prevIndex + 1) % courageFrames.length;
}

export function TerminalOverlay() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('System Online. Connecting to API...');
  const [frameIndex, setFrameIndex] = useState(0);
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  useEffect(function setupFrameAnimation() {
    const timer = setInterval(function advanceAnimationFrame() {
      setFrameIndex(getNextFrameIndex);
    }, 200);

    return function cleanupAnimationTimer() {
      clearInterval(timer);
    };
  }, []);

  function fetchApiData() {
    return fetch('http://127.0.0.1:8000/hello-world')
      .then(function parseResponse(res) {
        return res.json();
      });
  }

  useEffect(function checkInitialApiConnection() {
    fetchApiData().then(
        function handleInitialSuccess(data) {
          if (data.message) {
          setApiMessage(data.message);
          setOutput(`API Connected: "${data.message}" | What do you want, kid?`);
          }
        }
      ).catch(function handleInitialError() {
          setOutput('System Online (API Offline). Run TestAPI.py to connect backend!');
        }
      )
  }, []
  );

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function handleSearch(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      const trimmedInput = input.trim().toLowerCase();
      if (trimmedInput === 'api' || trimmedInput === 'hello') {
        if (apiMessage) {
          setOutput(`[API Response]: ${apiMessage}`);
        } else {
          setOutput('Attempting to contact API at http://127.0.0.1:8000/hello-world...');
          fetchApiData()
            .then(function handleManualFetchSuccess(data) {
              setApiMessage(data.message);
              setOutput(`[API Response]: ${data.message}`);
            })
            .catch(function handleManualFetchError() {
              setOutput('[API Error]: Backend is offline. Run TestAPI.py first!');
            });
        }
      } else if (!input) {
        setOutput('Are you going to type something, you twit, or just stare at me?');
      } else {
        setOutput(`Processing your ridiculous query for: "${input}"...`);
        setTimeout(function delayedResponse() {
          setOutput("I don't know. You're on your own, kid :)");
        }, 1500);
      }
      setInput('');
    }
  }

  // Screen
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
          onChange={handleInputChange}
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
}

