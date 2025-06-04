import { useRef, useEffect, useState } from 'react';

export default function AnalogCube({ scrollProgress = 0 }) {
  const canvasRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 400, height: 900 });
  const currentProgressRef = useRef(0);
  const targetProgressRef = useRef(0);
  const lastRenderTimeRef = useRef(0);

  // Update scroll position directly without animation smoothing
  useEffect(() => {
    currentProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  // Parabolic function that peaks at 0.5 and returns to 0 at both ends
  const parabolic = (x) => 4 * x * (1 - x);

  useEffect(() => {
    const updateSize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        // Make it more rectangular and responsive
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        // Aspect ratio that's more portrait-like to match text flow
        const aspectRatio = 3/4; // 3:4 ratio (portrait)
        
        let width, height;
        if (containerWidth * aspectRatio < containerHeight) {
          width = Math.min(containerWidth - 40, 600);
          height = width / aspectRatio;
        } else {
          height = Math.min(containerHeight - 80, 900);
          width = height * aspectRatio;
        }
        
        setDimensions({ width: Math.floor(width), height: Math.floor(height) });
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    let animationId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { width: w, height: h } = dimensions;
    
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    function render(time) {
      // Get current parabolic value based on scroll position
      const p = parabolic(currentProgressRef.current);
      
      // Clear the buffer
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 0;     // R
        data[i + 1] = 0; // G  
        data[i + 2] = 0; // B
        data[i + 3] = 255; // A
      }

      // Effects based purely on scroll position, not time
      const baseSpeed = 0.15; // Constant base speed
      const chaosFactor = p * 1.9; // Chaos purely based on position
      const colorShift = currentProgressRef.current * 0.3; // Linear with position
      const rotationOffset = currentProgressRef.current * Math.PI * 0.5; // Rotation based on position
      
      const t = time * 0.001 * baseSpeed;
      
      // Process each pixel
      for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
          const index = (y * w + x) * 4;
          
          // Translate coordinates to center
          const FC = { 
            x: (x - w/7) / (w/4), 
            y: (y - h/7) / (h/4)
          };
          
          // Rotation based on scroll position, not time
          const angle = t * 0.01 + rotationOffset;
          const rotatedX = FC.x * Math.cos(angle) - FC.y * Math.sin(angle);
          const rotatedY = FC.x * Math.sin(angle) + FC.y * Math.cos(angle);
          
          // Base pattern
          const hVal = 17.0 - rotatedY / 0.1;
          const c = Math.round(hVal);
          
          // Chaos based on position, not changing with time
          const chaos = Math.sin(rotatedX * 10 + currentProgressRef.current * 20) * chaosFactor;
          const yVal = Math.sin(rotatedX / 0.06 + t * c + c * c + chaos) * (0.4 + chaosFactor * 0.2);
          
          const intensity = 1.0 - Math.abs(yVal - hVal + c) * (1 + chaosFactor * 0.8);
          const clampedIntensity = Math.max(0, Math.min(1, intensity));
          
          // Color based on position
          const baseHue = 0.6 + colorShift;
          const hueValue = (baseHue + Math.sin(t * 0.05 + c) * 0.05) % 1;
          
          // Convert HSL to RGB
          const hue = hueValue * 6;
          const saturation = 0.7 - (p * 0.2);
          const c1 = clampedIntensity * saturation;
          const x1 = c1 * (1 - Math.abs(hue % 2 - 1));
          
          let r, g, b;
          if (hue < 1) { r = c1; g = x1; b = 0; }
          else if (hue < 2) { r = x1; g = c1; b = 0; }
          else if (hue < 3) { r = 0; g = c1; b = x1; }
          else if (hue < 4) { r = 0; g = x1; b = c1; }
          else if (hue < 5) { r = x1; g = 0; b = c1; }
          else { r = c1; g = 0; b = x1; }
          
          // No random noise - keeps it stable
          data[index] = Math.floor(Math.max(0, Math.min(255, r * 255)));
          data[index + 1] = Math.floor(Math.max(0, Math.min(255, g * 255)));
          data[index + 2] = Math.floor(Math.max(0, Math.min(255, b * 255)));
          data[index + 3] = 255;
        }
      }
      
      ctx.putImageData(imageData, 0, 0);
      animationId = requestAnimationFrame(render);
    }
    
    animationId = requestAnimationFrame(render);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [dimensions]);

  const p = parabolic(currentProgressRef.current);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '500px',
      dropShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
      borderRadius: '10px',      
      width: '100%'
    }}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          filter: `contrast(${1.4 + p * 0.2}) brightness(${1.0 + p * 0.15})`, // More subtle filter changes
          background: 'transparent'
        }}
      />
    </div>
  );
}