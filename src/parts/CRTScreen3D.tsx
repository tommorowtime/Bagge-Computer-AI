import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type * as THREE from 'three';
import './CRTScreen3D.css';

const CRTShaderMesh = () => {
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
      vec2 uv = vUv;
      
      // CRT Screen Curvature distortion
      uv = uv * 2.0 - 1.0;
      vec2 offset = abs(uv.yx) / vec2(7.0, 5.0);
      uv = uv + uv * offset * offset;
      uv = uv * 0.5 + 0.5;

      // Dark bezel border around curved CRT boundary
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.08, 0.1, 0.08, 1.0);
      } else {
        // Animated Scanline effect
        float scanline = sin(uv.y * 600.0 + time * 5.0) * 0.06;
        float flicker = sin(time * 30.0) * 0.015 + 1.0;

        // Vintage CRT dull green phosphor glow base
        vec3 greenBg = vec3(0.18, 0.28, 0.18);
        
        // Vignette effect (darkened edges on screen)
        float vignette = uv.x * uv.y * (1.0 - uv.x) * (1.0 - uv.y);
        vignette = clamp(pow(16.0 * vignette, 0.3), 0.0, 1.0);

        vec3 color = (greenBg - scanline) * vignette * flicker;
        gl_FragColor = vec4(color, 1.0);
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

interface CRTScreen3DProps {
  aspectRatio: 'square' | 'wide';
  children: React.ReactNode;
}

export const CRTScreen3D = ({ aspectRatio, children }: CRTScreen3DProps) => {
  return (
    <div className={`crt-monitor-casing ${aspectRatio}`}>
      <div className="crt-screen-bezel">
        <div className="crt-glare-overlay" />
        <div className="crt-canvas-layer">
          <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }}>
            <CRTShaderMesh />
          </Canvas>
        </div>
        <div className="crt-content-layer">
          {children}
        </div>
      </div>
      <div className="crt-monitor-badge">COMPUTER 9000</div>
    </div>
  );
};
