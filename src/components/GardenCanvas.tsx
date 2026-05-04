import React, { useEffect, useRef } from 'react';
import { useGameStore, Plant } from '../store/gameStore';

export const GardenCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const plants = useGameStore(state => state.plants);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{x: number, y: number, vx: number, vy: number, life: number, color: string}> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const drawPlant = (plant: Plant, time: number) => {
      const age = (time - plant.createdAt) / 1000; // age in seconds
      const growthFactor = Math.min(1, age / 10); // Fully grown in 10s
      
      const baseX = plant.x;
      const baseY = plant.y;
      const height = 150 * growthFactor;

      ctx.save();
      
      // Determine colors based on element
      let stemColor = '#34d399';
      let bloomColor = '#a7f3d0';
      if (plant.elements.includes('starlight')) bloomColor = '#fef08a';
      if (plant.elements.includes('moondew')) bloomColor = '#93c5fd';
      if (plant.elements.includes('emberheart')) bloomColor = '#fca5a5';
      if (plant.elements.includes('whisperwind')) bloomColor = '#d8b4fe';

      // Draw STEM with sway
      const sway = Math.sin(time / 1000 + plant.createdAt) * 15 * growthFactor;
      
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.quadraticCurveTo(
        baseX + sway, baseY - height / 2,
        baseX + sway * 2, baseY - height
      );
      ctx.strokeStyle = stemColor;
      ctx.lineWidth = 4 * growthFactor;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Draw Bloom (if growing or bloomed)
      if (growthFactor > 0.5) {
        ctx.beginPath();
        ctx.arc(baseX + sway * 2, baseY - height, 10 * growthFactor, 0, Math.PI * 2);
        ctx.fillStyle = bloomColor;
        ctx.shadowBlur = 15;
        ctx.shadowColor = bloomColor;
        ctx.fill();
        
        // Emit particles
        if (Math.random() > 0.9) {
          particles.push({
            x: baseX + sway * 2,
            y: baseY - height,
            vx: (Math.random() - 0.5) * 2,
            vy: -Math.random() * 2,
            life: 1,
            color: bloomColor
          });
        }
      }

      ctx.restore();
    };

    const drawParticles = () => {
      ctx.save();
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        
        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      }
      ctx.restore();
    };

    const drawEarth = () => {
      // Very basic floor for intuition
      ctx.save();
      const gradient = ctx.createLinearGradient(0, canvas.height - 80, 0, canvas.height);
      gradient.addColorStop(0, '#1e293b');
      gradient.addColorStop(1, '#0f172a');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      ctx.lineTo(0, canvas.height - 50);
      ctx.quadraticCurveTo(canvas.width / 2, canvas.height - 90, canvas.width, canvas.height - 50);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.fill();
      ctx.restore();
    };

    const render = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawEarth();
      
      plants.forEach(p => drawPlant(p, time));
      drawParticles();

      animationFrameId = requestAnimationFrame(render);
    };

    render(performance.now());

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [plants]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
};
