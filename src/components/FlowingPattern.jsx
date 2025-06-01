import React, { useEffect, useRef } from 'react';

const FlowingPattern = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 350;
    canvas.height = 650;

    let time = 0;
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    let lastMouseX = mouseX;
    let lastMouseY = mouseY;

    const flowPoints = [];
    const gridSize = 8;
    const totalCells = (canvas.width / gridSize) * (canvas.height / gridSize);

    for (let x = gridSize/2; x < canvas.width; x += gridSize) {
      for (let y = gridSize/2; y < canvas.height; y += gridSize) {
        flowPoints.push({
          x,
          y,
          vx: 0,
          vy: 0,
          angle: Math.random() * Math.PI * 2,
          phase: Math.random() * Math.PI * 2,
          noiseOffset: Math.random() * 1000
        });
      }
    }

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX = x;
      mouseY = y;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    function noise(x, y, t) {
      const sin1 = Math.sin(x * 0.01 + t);
      const sin2 = Math.sin(y * 0.01 + t * 0.8);
      const sin3 = Math.sin((x + y) * 0.005 + t * 1.2);
      return (sin1 + sin2 + sin3) / 3;
    }

    let animationFrameId;

    function animate() {
      ctx.fillStyle = 'rgba(240, 238, 230, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      time += 0.005;

      flowPoints.forEach(point => {
        const noiseValue = noise(point.x, point.y, time);
        const angle = noiseValue * Math.PI * 4;

        const dx = mouseX - point.x;
        const dy = mouseY - point.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 150) {
          const pushFactor = (1 - dist / 150) * 0.5;
          point.vx += dx / dist * pushFactor;
          point.vy += dy / dist * pushFactor;
        }

        point.vx += Math.cos(angle) * 0.1;
        point.vy += Math.sin(angle) * 0.1;

        point.vx *= 0.95;
        point.vy *= 0.95;

        const nextX = point.x + point.vx;
        const nextY = point.y + point.vy;

        ctx.beginPath();
        ctx.moveTo(point.x, point.y);
        ctx.lineTo(nextX, nextY);

        const speed = Math.sqrt(point.vx * point.vx + point.vy * point.vy);
        const alpha = Math.min(0.6, speed * 5);

        ctx.strokeStyle = `rgba(61, 100, 67, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(point.x, point.y, 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(61, 100, 67, ${alpha * 0.5})`;
        ctx.fill();

        if (nextX < 0) point.x = canvas.width;
        if (nextX > canvas.width) point.x = 0;
        if (nextY < 0) point.y = canvas.height;
        if (nextY > canvas.height) point.y = 0;

        point.x += (point.x % gridSize === gridSize/2 ? 0 : (gridSize/2 - point.x % gridSize) * 0.01);
        point.y += (point.y % gridSize === gridSize/2 ? 0 : (gridSize/2 - point.y % gridSize) * 0.01);
      });

      animationFrameId = requestAnimationFrame(animate);
    }

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
      flowPoints.length = 0;
    };
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#F0EEE6'
    }}>
      <div style={{
        width: '350px',
        height: '650px',
        backgroundColor: '#F0EEE6'
      }}>
        <canvas
          ref={canvasRef}
          style={{ display: 'block' }}
        />
      </div>
    </div>
  );
};

export default FlowingPattern;