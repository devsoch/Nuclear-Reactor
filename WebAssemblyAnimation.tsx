import React, { useEffect, useRef, useState } from 'react';

interface WebAssemblyAnimationProps {
  isActive: boolean;
  intensity: number;
  isStable?: boolean;
  isCritical?: boolean;
}

const WebAssemblyAnimation: React.FC<WebAssemblyAnimationProps> = ({
  isActive,
  intensity,
  isStable = false,
  isCritical = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<any[]>([]);
  
  // Initialize dimensions
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDimensions({ width: rect.width, height: rect.height });
      }
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  // Generate particles
  useEffect(() => {
    if (!isActive) {
      particlesRef.current = [];
      return;
    }
    
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    const particleCount = Math.floor(20 + (intensity * 100));
    
    // Create initial particles
    particlesRef.current = Array.from({ length: particleCount }, () => createParticle(centerX, centerY, isStable, isCritical));
    
  }, [isActive, intensity, dimensions, isStable, isCritical]);
  
  // Animation loop
  useEffect(() => {
    if (!canvasRef.current || !isActive) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const centerX = dimensions.width / 2;
    const centerY = dimensions.height / 2;
    
    const animate = () => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particlesRef.current = particlesRef.current.filter(particle => {
        // Update particle
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life -= 0.02;
        
        if (particle.life <= 0) return false;
        
        // Draw particle
        const opacity = Math.min(particle.life, 1.0);
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]}, ${opacity})`;
        ctx.fill();
        
        // Add glow effect
        const glow = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, particle.size * 2);
        glow.addColorStop(0, `rgba(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]}, ${opacity * 0.7})`);
        glow.addColorStop(1, `rgba(${particle.color[0]}, ${particle.color[1]}, ${particle.color[2]}, 0)`);
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();
        
        return true;
      });
      
      // Add new particles based on intensity
      if (Math.random() < intensity * 0.3) {
        const newParticleCount = Math.floor(1 + intensity * 5);
        for (let i = 0; i < newParticleCount; i++) {
          particlesRef.current.push(createParticle(centerX, centerY, isStable, isCritical));
        }
      }
      
      // Draw central glow
      const centralGlowSize = 30 + intensity * 50;
      const glowColor = isCritical ? [255, 59, 48] : isStable ? [52, 199, 89] : [255, 255, 255];
      
      const centralGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, centralGlowSize);
      centralGlow.addColorStop(0, `rgba(${glowColor[0]}, ${glowColor[1]}, ${glowColor[2]}, ${0.3 + intensity * 0.2})`);
      centralGlow.addColorStop(1, `rgba(${glowColor[0]}, ${glowColor[1]}, ${glowColor[2]}, 0)`);
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, centralGlowSize, 0, Math.PI * 2);
      ctx.fillStyle = centralGlow;
      ctx.fill();
      
      // Request next frame
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isActive, dimensions, intensity, isStable, isCritical]);
  
  // Helper function to create a particle
  const createParticle = (centerX: number, centerY: number, isStable: boolean, isCritical: boolean) => {
    // Determine color based on reactor status
    let color: number[];
    
    if (isCritical) {
      color = [255, 59, 48]; // Red
    } else if (isStable) {
      color = [52, 199, 89]; // Green
    } else {
      color = [255, 255, 255]; // White
    }
    
    return {
      x: centerX,
      y: centerY,
      vx: (Math.random() * 4) - 2,
      vy: (Math.random() * 4) - 2,
      life: Math.random() * 1.5 + 0.5,
      size: Math.random() * 6 + 2,
      color: color
    };
  };
  
  if (!isActive) return null;
  
  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas 
        ref={canvasRef} 
        width={dimensions.width} 
        height={dimensions.height}
        className="absolute top-0 left-0"
      />
    </div>
  );
};

export default WebAssemblyAnimation;
