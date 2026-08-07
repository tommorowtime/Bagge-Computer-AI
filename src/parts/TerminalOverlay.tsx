`
The computer's face. AKA the terminal screen.
This is where everything shows and changes, computer outputs, courage/user inputs
`

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
  const [output, setOutput] = useState('System Online. Searching...');
  const [frameIndex, setFrameIndex] = useState(0);
  const [apiMessage, setApiMessage] = useState<string | null>(null);

  // Courage animation change every 200ms
  useEffect(function setupFrameAnimation() {
    const timer = setInterval(function advanceAnimationFrame() {
      setFrameIndex(getNextFrameIndex);
    }, 200);

    return function cleanupAnimationTimer() {
      clearInterval(timer);
    };
  }, []);

  function fetchApiData() {
    return fetch('http://127.0.0.1:8000/brain')
      .then(function parseResponse(response) {
        return response.json();
      });
  }

  useEffect(function checkInitialApiConnection() {
    fetchApiData().then(
        function handleInitialSuccess(data) {
          if (data) {
          setApiMessage(data);
          setOutput(`What do you want, kid?`);
          }
        }
      ).catch(function handleInitialError() {
          setOutput('Error... Nasty!');
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
          setOutput(`You want me to say ${apiMessage}? What a loser.`);
        } else {
          setOutput('Searching... |http://127.0.0.1:8000/hello-world|');
          fetchApiData()
            .then(function handleManualFetchSuccess(data) {
              setApiMessage(data.message);
              setOutput(`You really want me to say ${apiMessage}? What a loser.`);
            })
            .catch(function handleManualFetchError() {
              setOutput("API? I Don't know you're on your own kid ;)");
            });
        }
      } else if (!input) {
        setOutput('Are you going to type something, you twit, or just stare at me?');
      } else {
        setOutput(`Processing your ridiculous query for: "${input}"...`);
        setTimeout(function delayedResponse() {
          setOutput("I don't know. You're on your own, kid ;)");
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

