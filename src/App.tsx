import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import './App.css';

// The WebGL CRT Background Component
const CRTEffect = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = `
    varying vec2 vUv;
    uniform float time;
    void main() {
      // Basic CRT curvature and scanline logic
      vec2 uv = vUv;
      uv = uv * 2.0 - 1.0;
      vec2 offset = abs(uv.yx) / vec2(6.0, 4.0);
      uv = uv + uv * offset * offset;
      uv = uv * 0.5 + 0.5;

      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
      } else {
        float scanline = sin(uv.y * 800.0) * 0.04;
        vec3 color = vec3(0.0, 0.8, 0.2); // My glorious green hue
        color -= scanline;
        gl_FragColor = vec4(color * 0.3, 1.0); // Dimmed background
      }
    }
  `;

  useFrame(({ clock }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ time: { value: 0 } }}
      />
    </mesh>
  );
};

// The Terminal Overlay Component
export default function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('System Online. What do you want, kid?');

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (!input) {
        setOutput('Are you going to type something, you twit, or just stare at me?');
      } else {
         // Simulating the frantic "ticka, ticka, ticka" processing
        setOutput(`Processing your ridiculous query for: "${input}"...`);

        // Comedic delay mock-up
        setTimeout(() => {
          setOutput("I don't know. You're on your own, kid :)");
        }, 1500);
      }
      setInput('');
    }
  };

  return (
    <div className="terminal-container">
      {/* WebGL Layer for authentic 90s CRT distortion */}
      <div className="webgl-background">
        <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }}>
          <CRTEffect />
        </Canvas>
      </div>

      {/* React DOM Layer for Interactive Text */}
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
        </div>
      </div>
    </div>
  );
}