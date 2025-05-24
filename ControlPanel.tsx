import React from 'react';

interface ControlPanelProps {
  powerLevel: number;
  setPowerLevel: (value: number) => void;
  controlRodPositions: number[];
  setControlRodPositions: (positions: number[]) => void;
  temperature: number;
  coolantFlow: number;
  setCoolantFlow: (value: number) => void;
  isReactionActive: boolean;
  setIsReactionActive: (value: boolean) => void;
  isStable: boolean;
  isCritical: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  powerLevel,
  setPowerLevel,
  controlRodPositions,
  setControlRodPositions,
  temperature,
  coolantFlow,
  setCoolantFlow,
  isReactionActive,
  setIsReactionActive,
  isStable,
  isCritical
}) => {
  
  const handleControlRodChange = (index: number, value: number) => {
    const newPositions = [...controlRodPositions];
    newPositions[index] = value;
    setControlRodPositions(newPositions);
  };

  const emergencyShutdown = () => {
    setIsReactionActive(false);
    setPowerLevel(0);
    const allRodsDown = controlRodPositions.map(() => 0);
    setControlRodPositions(allRodsDown);
  };

  return (
    <div className="bg-black p-6 rounded-lg border border-white shadow-lg text-white glass-panel">
      <div className="flex justify-between items-center mb-6 panel-header pb-4">
        <h2 className="text-2xl font-bold text-white">Reactor Control Panel</h2>
        <div className="flex items-center space-x-4">
          <div className={`h-4 w-4 rounded-full ${isStable ? 'bg-green' : isCritical ? 'bg-red' : 'bg-white'}`}></div>
          <span className={isStable ? 'text-green' : isCritical ? 'text-red' : 'text-white'}>
            {isReactionActive ? (isStable ? 'STABLE' : isCritical ? 'CRITICAL' : 'ACTIVE') : 'INACTIVE'}
          </span>
          <button 
            onClick={() => setIsReactionActive(!isReactionActive)}
            className={`px-4 py-2 rounded-md font-bold ${
              isReactionActive 
                ? 'btn-red' 
                : 'btn-green'
            }`}
          >
            {isReactionActive ? 'SHUTDOWN' : 'START'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-6">
          {/* Power Level Control */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="font-medium">Power Level</label>
              <span className="text-white font-mono">{Math.round(powerLevel * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={powerLevel}
              onChange={(e) => setPowerLevel(parseFloat(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-white">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Temperature Display */}
          <div className="p-4 bg-black rounded-md border border-white">
            <div className="flex justify-between items-center">
              <span className="font-medium">Core Temperature</span>
              <span className={`font-mono text-xl ${
                isCritical ? 'text-red' : 
                isStable ? 'text-green' : 
                'text-white'
              }`}>
                {temperature}°C
              </span>
            </div>
            <div className="mt-2 w-full bg-black rounded-full h-2.5 border border-white">
              <div 
                className="h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min((temperature / 1500) * 100, 100)}%`,
                  backgroundColor: isCritical ? 'var(--color-red)' : 
                                   isStable ? 'var(--color-green)' : 
                                   'var(--color-white)'
                }}
              ></div>
            </div>
          </div>

          {/* Coolant Flow Control */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="font-medium">Coolant Flow</label>
              <span className="text-white font-mono">{Math.round(coolantFlow * 100)}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.01" 
              value={coolantFlow}
              onChange={(e) => setCoolantFlow(parseFloat(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* Right column */}
        <div>
          <h3 className="font-medium mb-3">Control Rod Positions</h3>
          <div className="space-y-4">
            {controlRodPositions.map((position, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-sm">Rod {index + 1}</label>
                  <span className={`text-sm font-mono ${position > 0.7 ? 'text-red' : 'text-white'}`}>
                    {Math.round(position * 100)}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="1" 
                  step="0.01" 
                  value={position}
                  onChange={(e) => handleControlRodChange(index, parseFloat(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Controls */}
      <div className="mt-6 pt-4 border-t border-white panel-section">
        <button 
          onClick={emergencyShutdown}
          className="w-full py-3 bg-red hover:bg-red rounded-md font-bold text-lg flex items-center justify-center space-x-2 btn-red"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>EMERGENCY SHUTDOWN</span>
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
