import React, { useEffect, useRef } from 'react';

export default function AnimatedBackground({ intensity = 1 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let W, H;

    const nodes = [];
    const ambientOrbs = [
      { x: 0.15, y: 0.2, radius: 480, color: 'rgba(220, 38, 38, 0.08)', vx: 0.0002, vy: 0.0003 },
      { x: 0.85, y: 0.4, radius: 560, color: 'rgba(37, 99, 235, 0.06)', vx: -0.0003, vy: 0.0002 },
      { x: 0.5, y: 0.8, radius: 520, color: 'rgba(220, 38, 38, 0.06)', vx: 0.0001, vy: -0.0002 },
    ];

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      initNodes();
    };

    const initNodes = () => {
      nodes.length = 0;
      const count = Math.min(Math.floor((W * H) / 22000 * intensity), 60);
      for (let i = 0; i < count; i++) {
        const rand = Math.random();
        let color = 'rgba(220, 38, 38, ';
        if (rand > 0.6) color = 'rgba(37, 99, 235, ';
        else if (rand > 0.85) color = 'rgba(245, 158, 11, ';

        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r: Math.random() * 2 + 1,
          color,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: 0.015 + Math.random() * 0.02,
        });
      }
    };

    const drawAmbientOrbs = () => {
      ambientOrbs.forEach(orb => {
        orb.x += orb.vx;
        orb.y += orb.vy;
        if (orb.x < 0.1 || orb.x > 0.9) orb.vx *= -1;
        if (orb.y < 0.1 || orb.y > 0.9) orb.vy *= -1;

        const cx = orb.x * W;
        const cy = orb.y * H;

        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, orb.radius);
        grad.addColorStop(0, orb.color);
        grad.addColorStop(1, 'transparent');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(cx, cy, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawGrid = () => {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.018)';
      ctx.lineWidth = 1;
      const gridSize = 80;
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
      const maxDist = 160;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.12;
            ctx.strokeStyle = `rgba(220, 38, 38, ${alpha})`;
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
        const alpha = 0.2 + glow * 0.4;
        ctx.fillStyle = `${n.color}${alpha})`;
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

    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      drawAmbientOrbs();
      drawGrid();
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
        opacity: 0.85,
      }}
    />
  );
}
