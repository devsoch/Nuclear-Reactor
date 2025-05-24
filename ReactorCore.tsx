import React from 'react';

interface ReactorCoreProps {
  powerLevel: number;
  controlRodPositions: number[];
  temperature: number;
  isReactionActive: boolean;
  isStable: boolean;
  isCritical: boolean;
}

const ReactorCore: React.FC<ReactorCoreProps> = ({
  powerLevel,
  controlRodPositions,
  temperature,
  isReactionActive,
  isStable,
  isCritical
}) => {
  
  // Calculate core glow color based on reactor status
  const getCoreColor = () => {
    if (isCritical) return 'var(--color-red)';
    if (isStable) return 'var(--color-green)';
    return 'var(--color-white)';
  };

  // Calculate animation class based on reactor status
  const getAnimationClass = () => {
    if (isCritical) return 'animate-critical';
    if (isStable) return 'animate-pulse';
    return '';
  };

  return (
    <div className={`relative w-full h-[500px] bg-black rounded-full overflow-hidden border-2 border-white shadow-lg ${getAnimationClass()}`}>
      {/* Reactor vessel */}
      <div className="absolute inset-4 rounded-full bg-black border border-white reactor-vessel">
        
        {/* Core glow */}
        <div 
          className="absolute inset-10 rounded-full transition-all duration-500 animate-pulse"
          style={{
            backgroundColor: getCoreColor(),
            opacity: 0.6 + (powerLevel * 0.4),
            boxShadow: `0 0 ${30 + (powerLevel * 70)}px ${getCoreColor()}`
          }}
        />
        
        {/* Control rod channels */}
        <div className="absolute inset-0 flex justify-around items-center">
          {controlRodPositions.map((position, index) => (
            <div key={index} className="relative h-full w-8">
              <div className="absolute inset-x-0 top-0 bottom-0 bg-black opacity-50" />
              <div 
                className="absolute inset-x-0 top-0 w-full transition-all duration-300"
                style={{ 
                  height: `${position * 100}%`,
                  backgroundColor: position > 0.7 ? 'var(--color-red)' : 'var(--color-white)'
                }}
              />
            </div>
          ))}
        </div>
        
        {/* Particles for atom visualization */}
        {isReactionActive && (
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(Math.floor(50 + (powerLevel * 150)))].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full animate-float"
                style={{
                  width: `${Math.random() * 6 + 2}px`,
                  height: `${Math.random() * 6 + 2}px`,
                  backgroundColor: isCritical ? 'var(--color-red)' : 
                                  isStable ? 'var(--color-green)' : 
                                  'var(--color-white)',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  opacity: Math.random() * 0.7 + 0.3,
                  animationDuration: `${Math.random() * 3 + 2}s`,
                  animationDelay: `${Math.random() * 2}s`,
                  boxShadow: isCritical ? '0 0 6px var(--color-red)' : 
                             isStable ? '0 0 6px var(--color-green)' : 
                             '0 0 6px var(--color-white)'
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Coolant indicators */}
      <div className="absolute bottom-4 left-4 right-4 h-2 bg-black rounded-full overflow-hidden border border-white">
        <div 
          className="h-full animate-flow"
          style={{ 
            width: '100%',
            backgroundColor: isStable ? 'var(--color-green)' : 'var(--color-white)'
          }}
        />
      </div>
      
      {/* Status indicator ring */}
      <div 
        className="absolute inset-0 rounded-full border-4 transition-all duration-300"
        style={{
          borderColor: isCritical ? 'var(--color-red)' : 
                      isStable ? 'var(--color-green)' : 
                      'var(--color-white)',
          opacity: 0.7
        }}
      />
    </div>
  );
};

export default ReactorCore;
