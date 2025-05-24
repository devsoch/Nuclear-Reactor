import React from 'react';

interface AtomShatteringAnimationProps {
  isActive: boolean;
  intensity: number;
  isStable: boolean;
  isCritical: boolean;
}

const AtomShatteringAnimation: React.FC<AtomShatteringAnimationProps> = ({
  isActive,
  intensity,
  isStable,
  isCritical
}) => {
  if (!isActive) return null;
  
  // Number of particles scales with intensity
  const particleCount = Math.floor(20 + (intensity * 100));
  
  // Determine particle color based on reactor status
  const getParticleColor = (index: number) => {
    if (isCritical) return 'var(--color-red)';
    if (isStable) return 'var(--color-green)';
    return 'var(--color-white)';
  };
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Particles */}
      {[...Array(particleCount)].map((_, i) => (
        <div 
          key={i}
          className="absolute rounded-full animate-particle"
          style={{
            width: `${Math.random() * 8 + 2}px`,
            height: `${Math.random() * 8 + 2}px`,
            backgroundColor: getParticleColor(i),
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.8 + 0.2,
            animationDuration: `${Math.random() * 2 + 1}s`,
            animationDelay: `${Math.random() * 0.5}s`,
            boxShadow: `0 0 8px ${getParticleColor(i)}`,
            transform: `scale(${Math.random() * 0.5 + 0.5})`,
          }}
        />
      ))}
      
      {/* Central flash effect */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full ${isCritical ? 'animate-critical' : 'animate-pulse'}`}
        style={{
          width: `${50 + intensity * 50}px`,
          height: `${50 + intensity * 50}px`,
          backgroundColor: isCritical ? 'rgba(255, 59, 48, 0.3)' : 
                          isStable ? 'rgba(52, 199, 89, 0.3)' : 
                          'rgba(255, 255, 255, 0.3)',
          boxShadow: `0 0 ${20 + intensity * 30}px ${
            isCritical ? 'rgba(255, 59, 48, 0.6)' : 
            isStable ? 'rgba(52, 199, 89, 0.6)' : 
            'rgba(255, 255, 255, 0.6)'
          }`,
          animationDuration: isCritical ? '0.5s' : '1.5s'
        }}
      />
      
      {/* Rotating energy rings - only visible during active reactions */}
      {intensity > 0.3 && (
        <>
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 animate-rotate"
            style={{
              width: `${100 + intensity * 100}px`,
              height: `${100 + intensity * 100}px`,
              borderColor: isCritical ? 'var(--color-red)' : 
                          isStable ? 'var(--color-green)' : 
                          'var(--color-white)',
              borderStyle: 'dashed',
              opacity: 0.4,
              animationDuration: '8s'
            }}
          />
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border animate-rotate"
            style={{
              width: `${150 + intensity * 100}px`,
              height: `${150 + intensity * 100}px`,
              borderColor: isCritical ? 'var(--color-red)' : 
                          isStable ? 'var(--color-green)' : 
                          'var(--color-white)',
              borderWidth: '1px',
              opacity: 0.3,
              animationDuration: '12s',
              animationDirection: 'reverse'
            }}
          />
        </>
      )}
    </div>
  );
};

export default AtomShatteringAnimation;
