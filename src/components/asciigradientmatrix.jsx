import { useState, useEffect, useRef } from 'react';
// Import all available videos
import aquariumVideo from '../assets/media/aquarium.mp4';
import cloudsVideo from '../assets/media/clouds.mp4';
import streetWalkingVideo from '../assets/media/street_walking.mp4';
import womanLaughingVideo from '../assets/media/womanlaughing.mp4';

const AsciiGradientMatrix = ({hoveredStory = null, accentHue = 155, hoverPoint = null}) => {
  // Array of available videos
  const availableVideos = [
    aquariumVideo,
    cloudsVideo,
    streetWalkingVideo,
    womanLaughingVideo
  ];
  
  // Randomly select a video on component mount
  const [selectedVideo] = useState(() => {
    const randomIndex = Math.floor(Math.random() * availableVideos.length);
    return availableVideos[randomIndex];
  });
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);
  const offscreenCanvasRef = useRef(null);
  const activeVideoRef = useRef(1); // Track which video is currently active
  const crossfadeTimeoutRef = useRef(null);

  // Convert animation state to refs to avoid React re-renders
  const mousePosRef = useRef({ x: 240, y: 360 });
  const timeRef = useRef(0);
  const lastLogTimeRef = useRef(0);
  const isVideoReadyRef = useRef(false);
  const crossfadeProgressRef = useRef(0);
  const isCrossfadingRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lastVideoTimeRef = useRef(-1);
  const lastDrawTimeRef = useRef(0);
  const isTabVisibleRef = useRef(true);
  
  // Store event handlers for proper cleanup
  const handlersRef = useRef({
    handleVideoReady1: null,
    handleVideoReady2: null,
    handleVideoError1: null,
    handleVideoError2: null,
    handleTimeUpdate1: null,
    handleTimeUpdate2: null,
    handleMouseMove: null,
    handleVisibilityChange: null
  });
  
  // Props as refs for animation loop access without re-renders
  const hoveredStoryRef = useRef(hoveredStory);
  const accentHueRef = useRef(accentHue);
  const hoverPointRef = useRef(hoverPoint);
  
  // Keep minimal state only for React lifecycle and errors
  const [videoError, setVideoError] = useState(null);

  // Dynamic grid dimensions based on container size
  const canvasDimensionsRef = useRef({ width: 0, height: 0, cols: 0, rows: 0, cellWidth: 0, cellHeight: 0 });
  
  // Performance caches - initialized once
  const cacheRef = useRef({
    sinTable: new Float32Array(1024),
    cosTable: new Float32Array(1024),
    // Flowing character progression - no dots for better continuity
    charTable: [' ', '░', '░', '▒', '▒', '▓', '▓', '■', '■', '█', '█', '▮', '▬', '▦', '▨', '█'],
    rowColors: [],
    lastRows: 0,
    lastHue: -1
  });
  
  // Font properties for canvas drawing
  const fontSize = 14;
  const fontFamily = 'JetBrains Mono, Monaco, Consolas, monospace';

  // Initialize sin/cos lookup tables
  useEffect(() => {
    const cache = cacheRef.current;
    for (let i = 0; i < 1024; i++) {
      const angle = (i / 1024) * Math.PI * 2;
      cache.sinTable[i] = Math.sin(angle);
      cache.cosTable[i] = Math.cos(angle);
    }
  }, []);

  // Fast trig lookups
  const fastSin = (x) => {
    const index = Math.floor(((x % (Math.PI * 2)) / (Math.PI * 2)) * 1024) & 1023;
    return cacheRef.current.sinTable[index];
  };
  
  const fastCos = (x) => {
    const index = Math.floor(((x % (Math.PI * 2)) / (Math.PI * 2)) * 1024) & 1023;
    return cacheRef.current.cosTable[index];
  };

  // Clean animation without liquid effects - just subtle video-driven variation
  const getVideoNoise = (x, y, t) => {
    return fastSin(x * 0.02 + t * 0.1) * 0.1; // Very subtle variation
  };

  // Precompute row colors when dimensions or hue changes
  const updateRowColors = (rows, hue) => {
    const cache = cacheRef.current;
    if (cache.lastRows === rows && cache.lastHue === hue) return;
    
    cache.rowColors = [];
    cache.lastRows = rows;
    cache.lastHue = hue;
    
    for (let y = 0; y < rows; y++) {
      const t = y / (rows - 1);
      const baseLight = 10 + (75 - 10) * t;
      const sat = 45 + (30) * t;
      
      // Pre-compute color variations with desaturated background
      cache.rowColors[y] = {
        base: `hsla(${hue}, ${sat}%, ${baseLight}%, 1)`,
        depth1: `hsla(${hue + 8}, ${sat - 3}%, ${Math.min(85, baseLight + 12)}%, 0.7)`,
        depth2: `hsla(${hue + 16}, ${sat - 6}%, ${Math.min(90, baseLight + 25)}%, 0.8)`,
        bright: `hsla(${hue + 5}, ${Math.min(100, sat + 10)}%, ${Math.min(95, baseLight + 35)}%, 0.9)`,
        dim: `hsla(${hue - 5}, ${Math.max(20, sat - 10)}%, ${Math.max(5, baseLight - 15)}%, 0.5)`,
        // Very desaturated colors for background/light areas
        background: `hsla(${hue}, ${Math.max(5, sat - 35)}%, ${baseLight}%, 0.3)`,
        lightBg: `hsla(${hue}, ${Math.max(8, sat - 25)}%, ${baseLight + 5}%, 0.4)`
      };
    }
  };

  // Clean character lookup from intensity
  const getCharFromIntensity = (intensity) => {
    const charTable = cacheRef.current.charTable;
    const maxIndex = charTable.length - 1;
    return charTable[Math.floor(Math.max(0, Math.min(intensity, maxIndex)))];
  };

  // Update refs when props change (no re-render of animation)
  useEffect(() => {
    hoveredStoryRef.current = hoveredStory;
  }, [hoveredStory]);
  
  useEffect(() => {
    accentHueRef.current = accentHue;
  }, [accentHue]);
  
  useEffect(() => {
    hoverPointRef.current = hoverPoint;
  }, [hoverPoint]);

  // Effect for setting up canvas size and mouse/animation listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    const video1 = videoRef1.current;
    const video2 = videoRef2.current;
    const offScreenCanvas = document.createElement('canvas');
    offscreenCanvasRef.current = offScreenCanvas;

    // Create bound handlers once and store them
    const createHandlers = () => {
      const handleVideoReady1 = () => {
        console.log("Video 1 ready state:", video1.readyState);
        isVideoReadyRef.current = true;
        video1.play().catch(e => {
          console.error("Video 1 play failed:", e);
          setVideoError(e);
        });
      };
      
      const handleVideoReady2 = () => {
        console.log("Video 2 ready state:", video2.readyState);
      };
      
      const handleVideoError1 = (e) => {
        console.error("Video 1 error:", e);
        setVideoError(e);
      };
      
      const handleVideoError2 = (e) => {
        console.error("Video 2 error:", e);
        setVideoError(e);
      };
      
      const handleTimeUpdate1 = () => {
        if (video1.currentTime >= video1.duration - 0.5) {
          if (!isCrossfadingRef.current) {
            isCrossfadingRef.current = true;
            video2.currentTime = 0;
            video2.play().catch(console.error);
            
            const startTime = performance.now();
            const crossfadeDuration = 500;
            
            const animateCrossfade = () => {
              const elapsed = performance.now() - startTime;
              const progress = Math.min(elapsed / crossfadeDuration, 1);
              crossfadeProgressRef.current = progress;
              
              if (progress < 1) {
                crossfadeTimeoutRef.current = requestAnimationFrame(animateCrossfade);
              } else {
                isCrossfadingRef.current = false;
                crossfadeProgressRef.current = 0;
                activeVideoRef.current = 2;
                video1.pause();
                video1.currentTime = 0;
              }
            };
            
            crossfadeTimeoutRef.current = requestAnimationFrame(animateCrossfade);
          }
        }
      };
      
      const handleTimeUpdate2 = () => {
        if (video2.currentTime >= video2.duration - 0.5) {
          if (!isCrossfadingRef.current) {
            isCrossfadingRef.current = true;
            video1.currentTime = 0;
            video1.play().catch(console.error);
            
            const startTime = performance.now();
            const crossfadeDuration = 500;
            
            const animateCrossfade = () => {
              const elapsed = performance.now() - startTime;
              const progress = Math.min(elapsed / crossfadeDuration, 1);
              crossfadeProgressRef.current = progress;
              
              if (progress < 1) {
                crossfadeTimeoutRef.current = requestAnimationFrame(animateCrossfade);
              } else {
                isCrossfadingRef.current = false;
                crossfadeProgressRef.current = 0;
                activeVideoRef.current = 1;
                video2.pause();
                video2.currentTime = 0;
              }
            };
            
            crossfadeTimeoutRef.current = requestAnimationFrame(animateCrossfade);
          }
        }
      };
      
      const handleMouseMove = (e) => {
        if (containerRef.current && canvasDimensionsRef.current.cols > 0) {
          const rect = containerRef.current.getBoundingClientRect();
          const relativeX = e.clientX - rect.left;
          const relativeY = e.clientY - rect.top;
          
          const { cellWidth, cellHeight } = canvasDimensionsRef.current;
          mousePosRef.current = {
            gridX: relativeX / cellWidth,
            gridY: relativeY / cellHeight,
            x: relativeX,
            y: relativeY
          };
        }
      };
      
      const handleVisibilityChange = () => {
        isTabVisibleRef.current = !document.hidden;
      };
      
      // Store handlers
      handlersRef.current = {
        handleVideoReady1,
        handleVideoReady2,
        handleVideoError1,
        handleVideoError2,
        handleTimeUpdate1,
        handleTimeUpdate2,
        handleMouseMove,
        handleVisibilityChange
      };
    };
    
    createHandlers();

    const setupVideo = (video, isPrimary) => {
      if (video) {
        video.src = selectedVideo;
        const handlers = handlersRef.current;
        
        if (isPrimary) {
          video.addEventListener('error', handlers.handleVideoError1);
          video.addEventListener('timeupdate', handlers.handleTimeUpdate1);
          
          if (video.readyState >= video.HAVE_METADATA) {
            handlers.handleVideoReady1();
          } else {
            video.addEventListener('loadedmetadata', handlers.handleVideoReady1);
          }
        } else {
          video.addEventListener('error', handlers.handleVideoError2);
          video.addEventListener('timeupdate', handlers.handleTimeUpdate2);
          
          if (video.readyState >= video.HAVE_METADATA) {
            handlers.handleVideoReady2();
          } else {
            video.addEventListener('loadedmetadata', handlers.handleVideoReady2);
          }
        }
      }
    };

    // Function to setup canvas dimensions
    const setupCanvasDimensions = () => {
      if (canvas && containerRef.current) {
        const dpr = window.devicePixelRatio || 1;
        
        // Get container dimensions
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        
        // Skip if container has no dimensions yet
        if (containerWidth === 0 || containerHeight === 0) {
          console.log('Container dimensions not ready, skipping setup');
          return false;
        }
        
        // Calculate grid dimensions based on container size
        const cellWidth = fontSize * 0.5; // Smaller character width for higher resolution
        const cellHeight = fontSize * 0.9; // Smaller character height for higher resolution
        const cols = Math.max(1, Math.floor(containerWidth / cellWidth));
        const rows = Math.max(1, Math.floor(containerHeight / cellHeight));
        
        // Store dimensions in ref for animation loop
        canvasDimensionsRef.current = {
          width: containerWidth,
          height: containerHeight,
          cols,
          rows,
          cellWidth,
          cellHeight
        };
        
        // Set canvas buffer size to container dimensions (scaled for device pixel ratio)
        canvas.width = containerWidth * dpr;
        canvas.height = containerHeight * dpr;
        
        // Scale the context to match device pixel ratio
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        // Set video sampling grid size
        offScreenCanvas.width = cols;
        offScreenCanvas.height = rows;
        
        console.log('Canvas dimensions set:', { containerWidth, containerHeight, cols, rows });
        return true;
      }
      return false;
    };

    // Initial setup - may fail if container not ready
    const initialSetup = setupCanvasDimensions();
    // Only setup videos if canvas dimensions are ready
    if (initialSetup || canvasDimensionsRef.current.cols > 0) {
      setupVideo(video1, true);
      setupVideo(video2, false);
    }

    // Mouse handler now created in createHandlers()

    // Add resize observer to handle container size changes
    let resizeObserver = null;
    if (containerRef.current) {
      resizeObserver = new ResizeObserver((entries) => {
        setupCanvasDimensions();
      });
      resizeObserver.observe(containerRef.current);
    }

    // If initial setup failed, try again after a short delay
    if (!initialSetup) {
      const retrySetup = () => {
        if (setupCanvasDimensions()) {
          console.log('Canvas setup successful on retry');
        } else {
          setTimeout(retrySetup, 100); // Try again in 100ms
        }
      };
      setTimeout(retrySetup, 50);
    }

    // Animation loop that directly draws to canvas without React state
    let lastFrameTime = 0;
    const targetFPS = 30; // Slightly higher FPS since we're not re-rendering React
    const frameInterval = 1000 / targetFPS;

    const drawFrame = (currentTime) => {
      animationFrameRef.current = requestAnimationFrame(drawFrame);
      
      // Short-circuit if tab is hidden
      if (!isTabVisibleRef.current) {
        return;
      }
      
      // Always update time for frame change detection
      timeRef.current = currentTime;
      
      // drawCanvas() now handles its own frame limiting
      drawCanvas();
    };

    animationFrameRef.current = requestAnimationFrame(drawFrame);
    window.addEventListener('mousemove', handlersRef.current.handleMouseMove);
    document.addEventListener('visibilitychange', handlersRef.current.handleVisibilityChange);

    return () => {
      const handlers = handlersRef.current;
      
      if (handlers.handleMouseMove) {
        window.removeEventListener('mousemove', handlers.handleMouseMove);
      }
      
      if (handlers.handleVisibilityChange) {
        document.removeEventListener('visibilitychange', handlers.handleVisibilityChange);
      }
      
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
      if (crossfadeTimeoutRef.current) {
        cancelAnimationFrame(crossfadeTimeoutRef.current);
      }
      
      if (video1) {
        if (handlers.handleVideoReady1) {
          video1.removeEventListener('loadedmetadata', handlers.handleVideoReady1);
        }
        if (handlers.handleVideoError1) {
          video1.removeEventListener('error', handlers.handleVideoError1);
        }
        if (handlers.handleTimeUpdate1) {
          video1.removeEventListener('timeupdate', handlers.handleTimeUpdate1);
        }
        video1.src = '';
      }
      
      if (video2) {
        if (handlers.handleVideoReady2) {
          video2.removeEventListener('loadedmetadata', handlers.handleVideoReady2);
        }
        if (handlers.handleVideoError2) {
          video2.removeEventListener('error', handlers.handleVideoError2);
        }
        if (handlers.handleTimeUpdate2) {
          video2.removeEventListener('timeupdate', handlers.handleTimeUpdate2);
        }
        video2.src = '';
      }
      
      // Clear handler references
      handlersRef.current = {
        handleVideoReady1: null,
        handleVideoReady2: null,
        handleVideoError1: null,
        handleVideoError2: null,
        handleTimeUpdate1: null,
        handleTimeUpdate2: null,
        handleMouseMove: null,
        handleVisibilityChange: null
      };
    };
  }, [fontSize, selectedVideo]);

  // Canvas drawing function - now separated from React render cycle
  const drawCanvas = () => {
    if (!isVideoReadyRef.current) return;

    const canvas = canvasRef.current;
    const video1 = videoRef1.current;
    const video2 = videoRef2.current;
    const offscreenCanvas = offscreenCanvasRef.current;

    if (!canvas || !video1 || !video2 || !offscreenCanvas) return;

    const ctx = canvas.getContext('2d');
    const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });
    if (!ctx || !offscreenCtx) return;

    // Check if offscreen canvas has valid dimensions
    if (offscreenCanvas.width === 0 || offscreenCanvas.height === 0) {
      return;
    }

    // Get current video time and check if frame changed
    const activeVideo = activeVideoRef.current === 1 ? video1 : video2;
    const currentVideoTime = activeVideo.currentTime;
    const currentTime = performance.now();
    
    // Only redraw if video frame changed or significant time passed (for subtle animation)
    const videoFrameChanged = Math.abs(currentVideoTime - lastVideoTimeRef.current) > 0.001;
    const timeForSubtleUpdate = currentTime - lastDrawTimeRef.current > 100; // 10fps for subtle effects
    
    if (!videoFrameChanged && !timeForSubtleUpdate) {
      return; // Skip expensive operations
    }
    
    lastVideoTimeRef.current = currentVideoTime;
    lastDrawTimeRef.current = currentTime;

    // Clear the offscreen canvas
    offscreenCtx.clearRect(0, 0, offscreenCanvas.width, offscreenCanvas.height);

    // Draw both videos with crossfade
    if (isCrossfadingRef.current) {
      offscreenCtx.globalAlpha = 1 - crossfadeProgressRef.current;
      offscreenCtx.drawImage(activeVideoRef.current === 1 ? video1 : video2, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
      offscreenCtx.globalAlpha = crossfadeProgressRef.current;
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

    const { cols, rows, cellWidth, cellHeight } = canvasDimensionsRef.current;
    
    // Early return if dimensions not calculated yet
    if (cols === 0 || rows === 0) return;
    
    // Update color cache if needed
    updateRowColors(rows, accentHueRef.current);
    
    // Render the ASCII grid
    renderAscii(ctx, videoPixels, offscreenCanvas, cols, rows, cellWidth, cellHeight);

  };

  // High-performance ASCII rendering function with aggressive caching
  const renderAscii = (ctx, videoPixels, offscreenCanvas, cols, rows, cellWidth, cellHeight) => {
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'top';
    
    const effectTime = timeRef.current / 1000;
    const isHovered = hoveredStoryRef.current;
    const mousePos = mousePosRef.current;
    
    const gridCenterX = cols / 2;
    const gridCenterY = rows / 2;
    const mouseX = mousePos.gridX || gridCenterX;
    const mouseY = mousePos.gridY || gridCenterY;
    
    // Pre-calculate constants for this frame - clean, no liquid effects
    const videoMultiplier = 24;
    const baseIntensity = 4.0;
    
    // Render two layers
    for (let layer = 0; layer < 2; layer++) {
      const layerAlpha = layer === 0 ? 1.0 : 0.6;
      const layerBoost = layer * 0.8;
      
      for (let y = 0; y < rows; y++) {
        const rowColors = cacheRef.current.rowColors[y];
        if (!rowColors) continue;
        
        // Clean row processing without wave effects
        
        for (let x = 0; x < cols; x++) {
          // Get video brightness
          const videoIndex = (y * offscreenCanvas.width + x) * 4;
          const videoBrightness = (0.299 * videoPixels[videoIndex] + 
                                  0.587 * videoPixels[videoIndex + 1] + 
                                  0.114 * videoPixels[videoIndex + 2]) / 255;
          
          // Clean distance-based effects
          const centerDist = Math.sqrt((x - gridCenterX) ** 2 + (y - gridCenterY) ** 2);
          const mouseDist = Math.sqrt((x - mouseX) ** 2 + (y - mouseY) ** 2);
          
          // Simple, clean animation - no liquid effects
          const subtleVariation = getVideoNoise(x, y, effectTime);
          const mouseInfluence = Math.exp(-mouseDist * 0.1) * 0.5;
          
          let intensity = baseIntensity + layerBoost + videoBrightness * videoMultiplier + 
                         subtleVariation + mouseInfluence;
          
          // Edge falloff (simplified)
          const edgeDistance = Math.min(x, cols - x, y, rows - y);
          const edgeFalloff = edgeDistance < 16 ? Math.pow(edgeDistance / 16, 1.5) : 1;
          intensity *= edgeFalloff;
          
          // Skip low intensity background layer
          if (layer === 1 && intensity < 4) continue;
          
          // Get character - no variation, clean ASCII
          const char = getCharFromIntensity(intensity);
          
          // More nuanced color selection with desaturated backgrounds
          let color;
          if (layer === 0) {
            if (intensity > 12) {
              color = rowColors.bright;
            } else if (intensity < 2) {
              // Very light areas get desaturated background colors
              color = rowColors.background;
            } else if (intensity < 4) {
              // Light areas get slightly desaturated colors
              color = rowColors.lightBg;
            } else {
              color = rowColors.base;
            }
          } else {
            // Background layer uses more muted colors
            if (intensity < 5) {
              color = rowColors.background;
            } else {
              color = intensity > 7 ? rowColors.depth2 : rowColors.depth1;
            }
          }
          
          // Clean positioning - no liquid offsets
          const xPos = x * cellWidth;
          const yPos = y * cellHeight;
          
          ctx.fillStyle = color;
          ctx.fillText(char, xPos, yPos);
          
          // Subtle glow for very bright characters
          if (intensity > 13 && layer === 0) {
            ctx.globalAlpha = 0.2;
            ctx.fillStyle = rowColors.bright;
            ctx.fillText(char, xPos, yPos);
            ctx.globalAlpha = 1;
          }
        }
      }
    }
  };

  // Removed - drawing now handled by animation loop with renderAscii function

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minWidth: '700px',
        minHeight: '700px',
        maxHeight: '900px',
        background: `linear-gradient(135deg, hsl(var(--background)) 0%, hsla(var(--background), 0.95) 50%, hsl(var(--background)) 100%)`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        userSelect: 'none',
        position: 'relative',
        borderRadius: '12px',
        boxShadow: 'none',
        border: '1px solid hsla(150, 60%, 80%, 0.08)',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
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
          <small>Source: {selectedVideo}</small>
        </div>
      )}
    </div>
  );
};

export default AsciiGradientMatrix;
