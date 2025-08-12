import { useRef, useEffect, useState } from 'react';

export default function EmotionalDepth({ scrollProgress = 0 }) {
  const canvasRef = useRef();
  const [dimensions, setDimensions] = useState({ width: 400, height: 900 });
  const currentProgressRef = useRef(0);

  // Update scroll position
  useEffect(() => {
    currentProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const updateSize = () => {
      const container = canvasRef.current?.parentElement;
      if (container) {
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        const aspectRatio = 3/4; // portrait
        
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

  // Noise function
  const noise = (x, y) => {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
  };

  // Smooth noise using interpolation
  const smoothNoise = (x, y) => {
    const intX = Math.floor(x);
    const intY = Math.floor(y);
    const fracX = x - intX;
    const fracY = y - intY;

    const a = noise(intX, intY);
    const b = noise(intX + 1, intY);
    const c = noise(intX, intY + 1);
    const d = noise(intX + 1, intY + 1);

    const i1 = a + fracX * (b - a);
    const i2 = c + fracX * (d - c);

    return i1 + fracY * (i2 - i1);
  };

  // Fractional Brownian Motion
  const fbm = (x, y, octaves = 4) => {
    let value = 0;
    let amplitude = 0.5;
    
    for (let i = 0; i < octaves; i++) {
      value += amplitude * smoothNoise(x, y);
      x *= 2;
      y *= 2;
      amplitude *= 0.5;
    }
    return value;
  };

  // Color palette function
  const getEmotionalColor = (t) => {
    // Normalize t to 0-1 range
    t = Math.max(0, Math.min(1, t));
    
    if (t < 0.33) {
      // Warm golden to muted purple
      const factor = t * 3;
      return {
        r: Math.floor(255 * (0.9 * (1 - factor) + 0.6 * factor)),
        g: Math.floor(255 * (0.7 * (1 - factor) + 0.5 * factor)),
        b: Math.floor(255 * (0.4 * (1 - factor) + 0.7 * factor))
      };
    } else if (t < 0.66) {
      // Muted purple to cool blue
      const factor = (t - 0.33) * 3;
      return {
        r: Math.floor(255 * (0.6 * (1 - factor) + 0.3 * factor)),
        g: Math.floor(255 * (0.5 * (1 - factor) + 0.6 * factor)),
        b: Math.floor(255 * (0.7 * (1 - factor) + 0.8 * factor))
      };
    } else {
      // Cool blue to transcendent violet
      const factor = (t - 0.66) * 3;
      return {
        r: Math.floor(255 * (0.3 * (1 - factor) + 0.8 * factor)),
        g: Math.floor(255 * (0.6 * (1 - factor) + 0.4 * factor)),
        b: Math.floor(255 * (0.8 * (1 - factor) + 0.9 * factor))
      };
    }
  };

  useEffect(() => {
    let animationId;
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const { width: w, height: h } = dimensions;
    
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    function render(time) {
      const t = time * 0.001;
      const scroll = currentProgressRef.current;
      
      // Clear buffer
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 0;
        data[i + 1] = 0;
        data[i + 2] = 0;
        data[i + 3] = 255;
      }

      // Process each pixel
      for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
          const index = (y * w + x) * 4;
          
          // Normalize coordinates
          const nx = x / w;
          const ny = y / h;
          
          // Create layers of emotional complexity
          const baseNoise = fbm(nx * 3 + t * 0.1, ny * 3 + t * 0.1, 3);
          const memoryLayer = fbm(nx * 1.5 + t * 0.05, ny * 1.5 + t * 0.05, 4);
          const futureLayer = fbm(nx * 6 + t * 0.2, ny * 6 + t * 0.2, 2);
          
          // Scroll-influenced transformation
          const scrollInfluence = scroll;
          
          // Blend layers based on scroll (past to future)
          const emotionalDepth = baseNoise * (1 - scrollInfluence * 0.6) + 
                                memoryLayer * 0.6 * (1 - scrollInfluence) +
                                futureLayer * scrollInfluence;
          
          // Create emotional intensity mapping
          let intensity = emotionalDepth + scrollInfluence * 0.5;
          
          // Add turbulence for "new emotions"
          const turbulence = fbm(nx * 8 + t * 0.3, ny * 8 + t * 0.3, 2) * scrollInfluence;
          intensity += turbulence * 0.3;
          
          // Add detail noise
          const detailNoise = smoothNoise(nx * 12 + t * 0.15, ny * 12 + t * 0.15);
          intensity += detailNoise * 0.1;
          
          // Add shimmer effect
          const shimmer = Math.sin(t * 2 + intensity * 10) * 0.05 * scrollInfluence;
          intensity += shimmer;
          
          // Vignette effect
          const centerX = nx - 0.5;
          const centerY = ny - 0.5;
          const vignette = 1.0 - Math.sqrt(centerX * centerX + centerY * centerY) * 0.8;
          intensity *= vignette;
          
          // Get color
          const color = getEmotionalColor(intensity);
          
          // Apply alpha based on intensity
          const alpha = Math.max(0, Math.min(1, (intensity - 0.2) / 0.6)) * 255;
          
          data[index] = color.r;
          data[index + 1] = color.g;
          data[index + 2] = color.b;
          data[index + 3] = alpha;
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

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '500px',
      borderRadius: '10px',      
      width: '100%'
    }}>
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{
          filter: `contrast(${1.2 + scrollProgress * 0.3}) brightness(${1.0 + scrollProgress * 0.2}) blur(${scrollProgress * 0.5}px)`,
          background: 'transparent'
        }}
      />
    </div>
  );
}