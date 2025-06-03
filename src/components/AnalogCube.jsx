import { useRef, useEffect, useState } from 'react';

export default function AnalogCube({ scrollProgress = 0 }) {
  const canvasRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 550, height: 650 });

  // Parabolic function that peaks at 0.5 and returns to 0 at both ends
  const parabolic = (x) => 4 * x * (1 - x);
  const p = parabolic(scrollProgress);

  useEffect(() => {
    const updateSize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        const size = Math.min(container.clientWidth, container.clientHeight) - 40;
        setDimensions({ width: size, height: size });
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
      // Clear the buffer
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 0;     // R
        data[i + 1] = 0; // G  
        data[i + 2] = 0; // B
        data[i + 3] = 255; // A
      }

      // Calculate various effects based on parabolic scroll position
      const baseSpeed = 0.2 + (p * 0.1); // Subtle speed change
      const chaosFactor = p * 3; // More intense chaos in the middle
      const colorShift = scrollProgress * 0.5; // Keep color shift linear
      const rotationSpeed = p * 0.004; // More rotation in the middle
      
      const t = time * 0.001 * baseSpeed;
      
      // Process each pixel
      for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
          const index = (y * w + x) * 4;
          
          // Translate coordinates to center
          const FC = { 
            x: (x - w/2) / (w/2), 
            y: (y - h/2) / (h/2)
          };
          
          // Add rotation based on scroll
          const angle = t * rotationSpeed;
          const rotatedX = FC.x * Math.cos(angle) - FC.y * Math.sin(angle);
          const rotatedY = FC.x * Math.sin(angle) + FC.y * Math.cos(angle);
          
          // Base pattern with increased complexity
          const hVal = 14.0 - rotatedY / 0.1;
          const c = Math.round(hVal);
          
          // Add chaos to the pattern - more intense in the middle
          const chaos = Math.sin(t * chaosFactor + c * c) * chaosFactor;
          const yVal = Math.sin(rotatedX / 0.06 + t * c + c * c + chaos) * (0.4 + chaosFactor * 0.3);
          
          const intensity = 1.0 - Math.abs(yVal - hVal + c) * (1 + chaosFactor);
          const clampedIntensity = Math.max(0, Math.min(1, intensity));
          
          // Color calculation with scroll-based shift
          const baseHue = 0.6 + colorShift; // Keep color shift linear
          const hueValue = (baseHue + Math.sin(t * 0.1 + c) * 0.1) % 1;
          
          // Convert HSL to RGB
          const hue = hueValue * 6;
          const c1 = clampedIntensity * 0.8;
          const x1 = c1 * (1 - Math.abs(hue % 2 - 1));
          
          let r, g, b;
          if (hue < 1) { r = c1; g = x1; b = 0; }
          else if (hue < 2) { r = x1; g = c1; b = 0; }
          else if (hue < 3) { r = 0; g = c1; b = x1; }
          else if (hue < 4) { r = 0; g = x1; b = c1; }
          else if (hue < 5) { r = x1; g = 0; b = c1; }
          else { r = c1; g = 0; b = x1; }
          
          // Add some noise based on parabolic scroll position
          const noise = (Math.random() - 0.5) * chaosFactor * 0.3;
          
          data[index] = Math.floor((r + noise) * 255);     // R
          data[index + 1] = Math.floor((g + noise) * 255); // G
          data[index + 2] = Math.floor((b + noise) * 255); // B
          data[index + 3] = 255;                           // A
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
  }, [dimensions, scrollProgress, p]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'transparent',
      minHeight: '500px',
      width: '100%'
    }}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          filter: `contrast(${1.2 + p * 0.4}) brightness(${1.1 + p * 0.3})`,
          background: 'transparent'
        }}
      />
    </div>
  );
}