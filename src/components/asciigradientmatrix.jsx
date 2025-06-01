import { useState, useEffect, useRef } from 'react';

const AsciiGradientMatrix = () => {
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 240, y: 360 }); // center of new size
  const [asciiArt, setAsciiArt] = useState([]);
  const [time, setTime] = useState(0);

  // Increased dimensions for wider/longer canvas
  const width = 128;   // cols (was 72)
  const height = 192;  // rows (was 128)

  // Gradient: Green (HSL or RGB) from #0f2b0f to #90ff90
  const getGreenShade = (y, opacity = 1) => {
    // interpolate 0 (dark) ... 1 (light)
    const t = y / (height - 1);
    // HSL: hue=120, sat=60%, light=12% to 80%
    const light = 12 + (80 - 12) * t;
    return `hsla(120, 60%, ${light}%, ${opacity})`;
  };

  // Edge falloff function for softer edges
  const getEdgeFalloff = (x, y) => {
    const edgeThreshold = 8; // pixels from edge where falloff starts
    const maxFalloff = 16; // maximum falloff distance
    
    const leftDist = x;
    const rightDist = width - 1 - x;
    const topDist = y;
    const bottomDist = height - 1 - y;
    
    const minDist = Math.min(leftDist, rightDist, topDist, bottomDist);
    
    if (minDist >= maxFalloff) return 1;
    if (minDist <= 0) return 0;
    
    // Smooth falloff curve
    return Math.pow(minDist / maxFalloff, 1.5);
  };

  // Simple noise function for floating effect
  const noise = (x, y, t) => {
    return Math.sin(x * 0.1 + t * 0.3) * Math.cos(y * 0.15 + t * 0.2) * 0.5;
  };

  // Center density boost function
  const getCenterDensity = (x, y) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(width, height) / 2;
    const distFromCenter = Math.hypot(x - centerX, y - centerY);
    
    // Create a smooth falloff from center (1.0) to edges (0.2)
    const normalizedDist = Math.min(distFromCenter / maxRadius, 1);
    return 0.2 + (1 - normalizedDist) * 0.8; // Range from 0.2 to 1.0
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    let animationFrameId = null;
    let lastFrameTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const animate = (currentTime) => {
      animationFrameId = requestAnimationFrame(animate);
      const deltaTime = currentTime - lastFrameTime;
      if (deltaTime >= frameInterval) {
        const remainder = deltaTime % frameInterval;
        lastFrameTime = currentTime - remainder;
        setTime((t) => t + 0.01);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  useEffect(() => {
    const chars = [' ', '·', ':', '-', '~', '*', '+', 'o', 'O', '@', '#', '█'];
    const art = [];
    const centerX = width / 2;
    const centerY = height / 2;

    for (let y = 0; y < height; y++) {
      let line = [];
      for (let x = 0; x < width; x++) {
        // Mouse and auto movement
        const mouseX = (mousePos.x / 480) * width; // adjusted for new canvas size
        const mouseY = (mousePos.y / 720) * height;
        const autoX = mouseX + Math.sin(time * 0.2) * 3;
        const autoY = mouseY + Math.cos(time * 0.1) * 3;
        const mouseDist = Math.hypot(x - autoX, y - autoY);
        const centerDist = Math.hypot(x - centerX, y - centerY);

        // Add floating/noise effect
        const floatEffect = noise(x, y, time) * 2;
        
        // Get center density multiplier
        const centerDensity = getCenterDensity(x, y);
        
        // Base intensity calculation with center-focused parameters
        let intensity = Math.floor(
          3 + // Lower base to let center density control more
          Math.sin(centerDist * 0.12 - time * 1.5 + mouseDist * 0.1) * 2.5 * centerDensity +
          Math.sin(y * 0.25 + time * 1.8) * 1.2 * centerDensity +
          floatEffect * centerDensity +
          centerDensity * 4 // Direct boost based on center proximity
        );
        
        // Get edge falloff
        const edgeFalloff = getEdgeFalloff(x, y);
        
        // Apply edge falloff to intensity
        intensity = intensity * edgeFalloff;
        intensity = Math.max(0, Math.min(intensity, chars.length - 1));

        // Calculate opacity based on edge distance and some randomness
        let opacity = edgeFalloff;
        
        // Add some randomness to opacity for floating effect, but less in center
        const randomFloat = Math.sin(x * 0.3 + y * 0.4 + time * 0.8) * (0.3 * (1 - centerDensity * 0.5)) + 0.7;
        opacity = Math.min(opacity, randomFloat);
        
        // Ensure opacity is between 0 and 1
        opacity = Math.max(0, Math.min(opacity, 1));

        line.push({ 
          char: chars[Math.floor(intensity)], 
          color: getGreenShade(y, opacity) 
        });
      }
      art.push(line);
    }
    setAsciiArt(art);
  }, [mousePos, time]);

  return (
    <div
      ref={containerRef}
      style={{
        width: 800,  // increased from 660
        height: 900, // increased from 740
        background: '#fffff8',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'monospace',
        fontSize: '12px',  // slightly smaller to fit more content
        lineHeight: '10px', // adjusted line height
        overflow: 'hidden',
        userSelect: 'none',
        cursor: 'none', // hide cursor for immersive effect
      }}
    >
      <pre style={{ margin: 0, padding: 0, display: 'flex', flexDirection: 'column' }}>
        {asciiArt.map((line, y) => (
          <div key={y} style={{ height: '10px', display: 'flex' }}>
            {line.map((cell, x) => (
              <span
                key={x}
                style={{
                  color: cell.color,
                  transition: 'color 0.3s, opacity 0.3s', // smoother transitions
                  fontWeight: 600,
                  textShadow: '0 0 2px rgba(144, 255, 144, 0.3)', // subtle glow
                }}
              >
                {cell.char}
              </span>
            ))}
          </div>
        ))}
      </pre>
    </div>
  );
};

export default AsciiGradientMatrix;
