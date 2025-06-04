import { useState, useEffect, useRef } from 'react';
import videoFile from '../assets/media/street_walking.mp4';

const AsciiGradientMatrix = ({videoSrc = videoFile}) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const offscreenCanvasRef = useRef(null);
  const activeVideoRef = useRef(1); // Track which video is currently active
  const crossfadeTimeoutRef = useRef(null);

  const [mousePos, setMousePos] = useState({ x: 240, y: 360 });
  const [time, setTime] = useState(0);
  const lastLogTimeRef = useRef(0);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [crossfadeProgress, setCrossfadeProgress] = useState(0);
  const [isCrossfading, setIsCrossfading] = useState(false);

  // Character grid dimensions
  const cols = 128;
  const rows = 192;

  // Font properties for canvas drawing
  const fontSize = 15; // pixels
  const lineHeight = 2; // pixels
  const fontFamily = 'monospace';

  // Gradient: Green (HSL or RGB) from #0f2b0f to #90ff90
  const getGreenShade = (y, opacity = 1) => {
    // interpolate 0 (dark) ... 1 (light)
    const t = y / (rows - 1); // Use rows for calculation
    // HSL: hue=120, sat=60%, light=12% to 80%
    const light = 13 + (80 - 13) * t;
    return `hsla(150, 60%, ${light}%, ${opacity})`;
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

  // Add debug logging
  useEffect(() => {
    console.log("AsciiGradientMatrix mounted with video source:", videoSrc);
    return () => console.log("AsciiGradientMatrix unmounted");
  }, [videoSrc]);

  // Effect for setting up canvas size and mouse/animation listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    const video1 = videoRef1.current;
    const video2 = videoRef2.current;
    const offScreenCanvas = document.createElement('canvas');
    offscreenCanvasRef.current = offScreenCanvas;

    const handleVideoReady = (video) => {
      console.log("Video ready state:", video.readyState, "Video source:", video.src);
      if (video === video1) {
        setIsVideoReady(true);
        video.play().catch(e => {
          console.error("Video play failed:", e);
          setVideoError(e);
        });
      }
    };

    const handleVideoError = (e, video) => {
      console.error("Video error:", e);
      console.error("Video source attempted:", video.src);
      console.error("Video error code:", video.error?.code);
      console.error("Video error message:", video.error?.message);
      setVideoError(e);
    };

    const setupVideo = (video, isPrimary) => {
      if (video) {
        video.src = videoSrc;
        video.addEventListener('error', (e) => handleVideoError(e, video));
        
        if (video.readyState >= video.HAVE_METADATA) {
          handleVideoReady(video);
        } else {
          video.addEventListener('loadedmetadata', () => handleVideoReady(video));
        }

        // Set up loop handling
        video.addEventListener('timeupdate', () => {
          if (video.currentTime >= video.duration - 0.5) { // Start crossfade 0.5s before end
            if (!isCrossfading) {
              setIsCrossfading(true);
              const nextVideo = isPrimary ? video2 : video1;
              nextVideo.currentTime = 0;
              nextVideo.play().catch(console.error);
              
              // Start crossfade animation
              const startTime = performance.now();
              const crossfadeDuration = 500; // 500ms crossfade
              
              const animateCrossfade = () => {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / crossfadeDuration, 1);
                setCrossfadeProgress(progress);
                
                if (progress < 1) {
                  crossfadeTimeoutRef.current = requestAnimationFrame(animateCrossfade);
                } else {
                  setIsCrossfading(false);
                  setCrossfadeProgress(0);
                  activeVideoRef.current = isPrimary ? 2 : 1;
                  video.pause();
                  video.currentTime = 0;
                }
              };
              
              crossfadeTimeoutRef.current = requestAnimationFrame(animateCrossfade);
            }
          }
        });
      }
    };

    if (canvas) {
      canvas.width = cols * (fontSize / 1.5);
      canvas.height = rows * lineHeight;
      offScreenCanvas.width = cols;
      offScreenCanvas.height = rows;

      setupVideo(video1, true);
      setupVideo(video2, false);
    }

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
    const targetFPS = 24; // Reduced target FPS slightly for performance with video
    const frameInterval = 1000 / targetFPS;

    const animateTime = (rafTime) => {
      animationFrameId = requestAnimationFrame(animateTime);
      const currentTimestamp = performance.now();
      const deltaTime = currentTimestamp - lastFrameTime;

      if (deltaTime >= frameInterval) {
        const remainder = deltaTime % frameInterval;
        lastFrameTime = currentTimestamp - remainder;
        setTime(currentTimestamp);
      }
    };

    animationFrameId = requestAnimationFrame(animateTime);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (crossfadeTimeoutRef.current) {
        cancelAnimationFrame(crossfadeTimeoutRef.current);
      }
      if (video1) {
        video1.removeEventListener('loadedmetadata', () => handleVideoReady(video1));
        video1.removeEventListener('error', (e) => handleVideoError(e, video1));
        video1.src = '';
      }
      if (video2) {
        video2.removeEventListener('loadedmetadata', () => handleVideoReady(video2));
        video2.removeEventListener('error', (e) => handleVideoError(e, video2));
        video2.src = '';
      }
    };
  }, [cols, rows, fontSize, lineHeight, videoSrc]);

  // Effect for drawing on the canvas
  useEffect(() => {
    if (!isVideoReady) return;

    const canvas = canvasRef.current;
    const video1 = videoRef1.current;
    const video2 = videoRef2.current;
    const offscreenCanvas = offscreenCanvasRef.current;

    if (!canvas || !video1 || !video2 || !offscreenCanvas) return;

    const ctx = canvas.getContext('2d');
    const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx || !offscreenCtx) return;

    const startTime = performance.now();

    // Clear the offscreen canvas
    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

    // Draw both videos with crossfade
    if (isCrossfading) {
      offscreenCtx.globalAlpha = 1 - crossfadeProgress;
      offscreenCtx.drawImage(activeVideoRef.current === 1 ? video1 : video2, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
      offscreenCtx.globalAlpha = crossfadeProgress;
      offscreenCtx.drawImage(activeVideoRef.current === 1 ? video2 : video1, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
      offscreenCtx.globalAlpha = 1;
    } else {
      offscreenCtx.drawImage(activeVideoRef.current === 1 ? video1 : video2, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
    }

    // Get the pixel data from the offscreen canvas
    const videoFrameData = offscreenCtx.getImageData(0, 0, offscreenCanvas.width, offscreenCanvas.height);
    const videoPixels = videoFrameData.data;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'top';

    const chars = [' ', '·', ':', '-', '~', '*', '+', 'o', 'O', '@', '#', '█'];
    const gridCenterX = cols / 2;
    const gridCenterY = rows / 2;
    const charWidth = canvas.width / cols;
    const charHeight = canvas.height / rows;
    const effectTime = time / 1000; // Convert ms timestamp to seconds for effects

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const videoPixelIndex = (y * offscreenCanvas.width + x) * 4;
        const r = videoPixels[videoPixelIndex];
        const g = videoPixels[videoPixelIndex + 1];
        const b = videoPixels[videoPixelIndex + 2];

        const videoBrightness = (0.399 * r + 0.587 * g + 0.114 * b) / 255;

        const mouseX = (mousePos.x / 800) * cols;
        const mouseY = (mousePos.y / 900) * rows;

        // Tone down mouse-following effect
        const autoX = mouseX + Math.sin(effectTime * 0.2) * 0.5;
        const autoY = mouseY + Math.cos(effectTime * 0.1) * 0.5;
        const mouseDist = Math.hypot(x - autoX, y - autoY);
        const centerDist = Math.hypot(x - gridCenterX, y - gridCenterY);

        // Slightly reduce noise/center effect
        const floatEffect = noise(x, y, effectTime) * 1.2;
        
        let baseIntensity = Math.floor(
          3 +
          Math.sin(centerDist * 0.02 - effectTime * 1.5 + mouseDist * 0.1) * 1.5  +
          Math.sin(y * 0.25 + effectTime * 1.2) * 0.8  +
          floatEffect  
        );

        // Sharpen the video effect
        let intensity = baseIntensity + videoBrightness * 20;
        
        const edgeFalloff = getEdgeFalloff(x, y);
        intensity = intensity * edgeFalloff;
        intensity = Math.max(0, Math.min(intensity, chars.length - 1));

        let opacity = edgeFalloff;
        const randomFloat = Math.sin(x * 0.2 + y * 0.4 + effectTime * 0.8) * (0.3 * (1)) + 0.7;
        opacity = Math.min(opacity, randomFloat);
        opacity = Math.max(0, Math.min(opacity, 1));

        const charToDraw = chars[Math.floor(intensity)];
        const charColor = getGreenShade(y, opacity);

        ctx.fillStyle = charColor;
        const xPos = x * charWidth;
        const yPos = y * charHeight;
        ctx.fillText(charToDraw, xPos, yPos);
      }
    }

    const endTime = performance.now();
    const duration = endTime - startTime;

    if (time > lastLogTimeRef.current + 1500) {
      lastLogTimeRef.current = time;
    }

  }, [mousePos, time, isVideoReady, crossfadeProgress, isCrossfading, cols, rows, fontSize, lineHeight, fontFamily, getGreenShade, getEdgeFalloff, noise, lastLogTimeRef]);

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
        position: 'relative',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
      <video
        ref={videoRef1}
        loop={false}
        muted
        playsInline
        crossOrigin="anonymous"
        style={{ 
          position: 'absolute', 
          width: '200px',
          height: 'auto',
          opacity: 0,
          zIndex: 10,
        }}
      />
      <video
        ref={videoRef2}
        loop={false}
        muted
        playsInline
        crossOrigin="anonymous"
        style={{ 
          position: 'absolute', 
          width: '200px',
          height: 'auto',
          opacity: 0,
          zIndex: 10,
        }}
      />
      {videoError && (
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          background: 'rgba(255,0,0,0.1)', 
          color: 'red',
          padding: '10px',
          textAlign: 'center'
        }}>
          Video Error: {videoError.message || 'Failed to load video'}
          <br />
          <small>Source: {videoSrc}</small>
        </div>
      )}
    </div>
  );
};

export default AsciiGradientMatrix;
