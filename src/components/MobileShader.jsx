import React, { useEffect, useRef } from 'react';

export default function MinimalGenerativeCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let time = 0;

    // Set canvas size
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    // Initialize
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation
    const animate = () => {
      time += 0.005;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      // Clear canvas
      ctx.fillStyle = 'rgba(65, 54, 54, 0.02)';
      ctx.fillRect(0, 0, width, height);

      // Subtle shifting gradient
      const gradient = ctx.createLinearGradient(
        width * (0.5 + Math.sin(time * 1.3) * 0.2),
        height * (0.2 + Math.cos(time * 1.2) * 0.1),
        width * (0.8 + Math.sin(time * 0.49) * 0.1),
        height * (0.9 + Math.cos(time * 0.3) * 0.2)
      );
      
      gradient.addColorStop(0, `hsla(250, 40%, 80%, ${0.02 + Math.sin(time) * 0.01})`);
      gradient.addColorStop(0.5, `hsla(145, 45%, 75%, ${0.015 + Math.sin(time + 1) * 0.08})`);
      gradient.addColorStop(1, `hsla(55, 45%, 85%, ${0.02 + Math.sin(time + 2) * 0.01})`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Just 3-4 very subtle floating orbs
      for (let i = 0; i < 16; i++) {
        const x = width * (0.2 + i * 0.3) + Math.sin(time * 1.4 + i * 2) * width * 0.08;
        const y = height * (0.3 + i * 0.2) + Math.cos(time * 0.3 + i * 1.5) * height * 0.06;
        const radius = 8 + Math.sin(time * 0.5 + i) * 3;
        
        const orbGradient = ctx.createRadialGradient(x, y, 0, x, y, radius * 3);
        orbGradient.addColorStop(0, `hsla(${148 + i * 5}, 50%, 80%, 0.03)`);
        orbGradient.addColorStop(0.7, `hsla(${148 + i * 5}, 40%, 70%, 0.015)`);
        orbGradient.addColorStop(1, `hsla(${148 + i * 5}, 50%, 60%, 0)`);
        
        ctx.beginPath();
        ctx.arc(x, y, radius * 3, 0, Math.PI * 1.5);
        ctx.fillStyle = orbGradient;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{
        background: 'transparent',
      }}
    />
  );
}