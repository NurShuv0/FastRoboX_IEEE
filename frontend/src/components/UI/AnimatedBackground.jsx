import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground({ intensity = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W, H;

    const particles = [];
    const lines = [];
    const nodes = [];

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initNodes();
    };

    const initNodes = () => {
      nodes.length = 0;
      const count = Math.min(Math.floor((W * H) / 22000 * intensity), 60);
      for (let i = 0; i < count; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          r: Math.random() * 2 + 1,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.02 + Math.random() * 0.02,
        });
      }
      // Matrix rain columns
      particles.length = 0;
      const cols = Math.floor(W / 40);
      for (let i = 0; i < cols; i++) {
        particles.push({
          x: i * 40 + 20,
          y: Math.random() * H,
          speed: 0.5 + Math.random() * 1.5,
          opacity: Math.random() * 0.08 + 0.02,
          char: String.fromCharCode(0x30A0 + Math.random() * 96),
          charTimer: 0,
        });
      }
    };

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < W; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }
    };

    const drawConnections = () => {
      const maxDist = 180;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.12;
            ctx.strokeStyle = `rgba(34, 197, 94, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const drawNodes = () => {
      nodes.forEach(n => {
        n.pulse += n.pulseSpeed;
        const glow = (Math.sin(n.pulse) + 1) / 2;
        const alpha = 0.15 + glow * 0.3;
        ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();

        // Move
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;
      });
    };

    const drawMatrixRain = () => {
      particles.forEach(p => {
        p.charTimer++;
        if (p.charTimer > 20) {
          p.char = String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96));
          p.charTimer = 0;
        }
        ctx.fillStyle = `rgba(34, 197, 94, ${p.opacity})`;
        ctx.font = '12px JetBrains Mono, monospace';
        ctx.fillText(p.char, p.x, p.y);

        p.y += p.speed;
        if (p.y > H) {
          p.y = -20;
          p.opacity = Math.random() * 0.06 + 0.01;
        }
      });
    };

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      drawGrid();
      drawMatrixRain();
      drawConnections();
      drawNodes();
      animId = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.8,
      }}
    />
  );
}
