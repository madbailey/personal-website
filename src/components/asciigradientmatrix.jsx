import { useState, useEffect, useRef } from 'react';

const AsciiGradientMatrix = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null); // Ref for the canvas element
  const [mousePos, setMousePos] = useState({ x: 240, y: 360 }); // center of new size
  const [time, setTime] = useState(0); // Will store performance.now() timestamp
  const lastLogTimeRef = useRef(0); // For periodic logging

  // Character grid dimensions
  const cols = 128;
  const rows = 192;

  // Font properties for canvas drawing
  const fontSize = 12; // pixels
  const lineHeight = 10; // pixels
  const fontFamily = 'monospace';

  // Gradient: Green (HSL or RGB) from #0f2b0f to #90ff90
  const getGreenShade = (y, opacity = 1) => {
    // interpolate 0 (dark) ... 1 (light)
    const t = y / (rows - 1); // Use rows for calculation
    // HSL: hue=120, sat=60%, light=12% to 80%
    const light = 12 + (80 - 12) * t;
    return `hsla(120, 60%, ${light}%, ${opacity})`;
  };

  // Edge falloff function for softer edges
  const getEdgeFalloff = (x, y) => {
    const edgeThreshold = 8; // pixels from edge where falloff starts
    const maxFalloff = 16; // maximum falloff distance

    const leftDist = x;
    const rightDist = cols - 1 - x; // Use cols
    const topDist = y;
    const bottomDist = rows - 1 - y; // Use rows

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
    const centerX = cols / 2; // Use cols
    const centerY = rows / 2; // Use rows
    const maxRadius = Math.min(cols, rows) / 2; // Use cols, rows
    const distFromCenter = Math.hypot(x - centerX, y - centerY);

    // Create a smooth falloff from center (1.0) to edges (0.2)
    const normalizedDist = Math.min(distFromCenter / maxRadius, 1);
    return 0.2 + (1 - normalizedDist) * 0.8; // Range from 0.2 to 1.0
  };

  // Effect for setting up canvas size and mouse/animation listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set internal canvas resolution
      canvas.width = cols * (fontSize / 1.5); // Approximate character width
      canvas.height = rows * lineHeight;

      // The styled size can be different, e.g., to fill container
      // This is handled by the style prop on the canvas element itself
    }

    const handleMouseMove = (e) => {
      if (containerRef.current) { // Use containerRef for mouse relative positioning
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    };

    let animationFrameId = null;
    let lastFrameTime = 0;
    const targetFPS = 60; // Target FPS for time updates
    const frameInterval = 1000 / targetFPS;

    const animateTime = (rafTime) => { // rafTime is the timestamp from requestAnimationFrame
      animationFrameId = requestAnimationFrame(animateTime);
      const currentTimestamp = performance.now(); // Use performance.now() for consistent time source
      const deltaTime = currentTimestamp - lastFrameTime;

      if (deltaTime >= frameInterval) {
        const remainder = deltaTime % frameInterval;
        lastFrameTime = currentTimestamp - remainder;
        // setTime((t) => t + 0.01); // Old way: Update time state with an increment
        setTime(currentTimestamp); // New way: Store current timestamp
      }
    };

    animationFrameId = requestAnimationFrame(animateTime);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [cols, rows, fontSize, lineHeight]); // Re-run if canvas/grid dimensions change

  // Effect for drawing on the canvas when mousePos or time changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const startTime = performance.now();

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set font style
    // Note: fontWeight is not directly part of ctx.font, but can be part of the string.
    // However, standard canvas text might not render it as boldly as CSS fontWeight: 600.
    // For simplicity, sticking to standard font properties.
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'top'; // Align text from the top

    const chars = [' ', '·', ':', '-', '~', '*', '+', 'o', 'O', '@', '#', '█'];
    const gridCenterX = cols / 2;
    const gridCenterY = rows / 2;

    // Calculate character width for positioning.
    // This is an approximation; for perfect alignment, measureText could be used,
    // but it's often okay for monospace fonts.
    const charWidth = canvas.width / cols;
    const charHeight = canvas.height / rows;


    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        // Mouse and auto movement
        // Adjust mousePos mapping to container dimensions (800x900)
        const mouseX = (mousePos.x / 800) * cols;
        const mouseY = (mousePos.y / 900) * rows;

        // Use a consistent time value for calculations within this frame
        // The 'time' state variable is now a timestamp, so we might need to scale it
        // or use a separate incrementing counter if the visual effect depends on small increments.
        // For noise and movement, a scaled timestamp should be fine.
        const effectTime = time / 1000; // Convert ms timestamp to a smaller, incrementing value for effects

        const autoX = mouseX + Math.sin(effectTime * 0.2) * 3;
        const autoY = mouseY + Math.cos(effectTime * 0.1) * 3;
        const mouseDist = Math.hypot(x - autoX, y - autoY);
        const centerDist = Math.hypot(x - gridCenterX, y - gridCenterY);

        // Add floating/noise effect
        const floatEffect = noise(x, y, effectTime) * 2;
        
        // Get center density multiplier
        const centerDensity = getCenterDensity(x, y);
        
        // Base intensity calculation
        let intensity = Math.floor(
          3 +
          Math.sin(centerDist * 0.12 - effectTime * 1.5 + mouseDist * 0.1) * 2.5 * centerDensity +
          Math.sin(y * 0.25 + effectTime * 1.8) * 1.2 * centerDensity +
          floatEffect * centerDensity +
          centerDensity * 4
        );
        
        const edgeFalloff = getEdgeFalloff(x, y);
        intensity = intensity * edgeFalloff;
        intensity = Math.max(0, Math.min(intensity, chars.length - 1));

        let opacity = edgeFalloff;
        const randomFloat = Math.sin(x * 0.3 + y * 0.4 + effectTime * 0.8) * (0.3 * (1 - centerDensity * 0.5)) + 0.7;
        opacity = Math.min(opacity, randomFloat);
        opacity = Math.max(0, Math.min(opacity, 1));

        const charToDraw = chars[Math.floor(intensity)];
        const charColor = getGreenShade(y, opacity);

        ctx.fillStyle = charColor;

        // Calculate position for each character
        const xPos = x * charWidth;
        const yPos = y * charHeight;

        ctx.fillText(charToDraw, xPos, yPos);
      }
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    // Log performance periodically
    // 'time' state variable now holds the timestamp from performance.now() via animateTime
    if (time > lastLogTimeRef.current + 1000) { // Log approx every 1000ms
      console.log(`AsciiGradientMatrix frame render time: ${duration.toFixed(2)}ms`);
      lastLogTimeRef.current = time;
    }

  }, [mousePos, time, cols, rows, fontSize, lineHeight, fontFamily, getGreenShade, getCenterDensity, getEdgeFalloff, noise, lastLogTimeRef]); // Added lastLogTimeRef to dependencies

  return (
    <div
      ref={containerRef}
      style={{
        width: 800,
        height: 900,
        background: '#fffff8',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        userSelect: 'none',
        cursor: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%', // Make canvas display size fill the container
          height: '100%',
          // background: 'rgba(0,0,0,0.1)', // For debugging canvas size
        }}
      />
    </div>
  );
};
export default AsciiGradientMatrix;
