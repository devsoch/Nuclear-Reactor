import React, { useState, useEffect } from 'react';
import ReactorCore from './components/ReactorCore';
import ControlPanel from './components/ControlPanel';
import AtomShatteringAnimation from './components/AtomShatteringAnimation';
import WebAssemblyAnimation from './components/WebAssemblyAnimation';
import './App.css';

function App() {
  // Reactor state
  const [powerLevel, setPowerLevel] = useState(0);
  const [controlRodPositions, setControlRodPositions] = useState([0.2, 0.3, 0.1, 0.4, 0.2]);
  const [temperature, setTemperature] = useState(25);
  const [coolantFlow, setCoolantFlow] = useState(0.5);
  const [isReactionActive, setIsReactionActive] = useState(false);
  const [animationIntensity, setAnimationIntensity] = useState(0);
  const [useWasmAnimation, setUseWasmAnimation] = useState(true);
  
  // Reactor status
  const [isStable, setIsStable] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  // Simulate reactor physics
  useEffect(() => {
    if (!isReactionActive) {
      // Cooling down when inactive
      const coolingInterval = setInterval(() => {
        setTemperature(prev => Math.max(25, prev - 5 * coolantFlow));
        setAnimationIntensity(prev => Math.max(0, prev - 0.05));
        setIsStable(false);
        setIsCritical(false);
      }, 500);
      
      return () => clearInterval(coolingInterval);
    }
    
    // Active reactor simulation
    const simulationInterval = setInterval(() => {
      // Calculate average control rod insertion (0 = fully inserted, 1 = fully withdrawn)
      const avgRodPosition = controlRodPositions.reduce((sum, pos) => sum + pos, 0) / controlRodPositions.length;
      
      // Calculate reactivity based on control rod positions
      const reactivity = avgRodPosition * powerLevel;
      
      // Calculate heating effect (higher when rods are withdrawn and power is high)
      const heatingEffect = reactivity * 10;
      
      // Calculate cooling effect
      const coolingEffect = coolantFlow * 5;
      
      // Update temperature
      setTemperature(prev => {
        const newTemp = prev + heatingEffect - coolingEffect;
        return Math.max(25, Math.min(1500, newTemp)); // Clamp between 25°C and 1500°C
      });
      
      // Update animation intensity based on power and reactivity
      setAnimationIntensity(powerLevel * avgRodPosition);
      
      // Update reactor status
      setIsStable(temperature < 600 && coolantFlow > 0.4 && powerLevel > 0);
      setIsCritical(temperature > 900 || avgRodPosition > 0.8);
      
    }, 500);
    
    return () => clearInterval(simulationInterval);
  }, [isReactionActive, powerLevel, controlRodPositions, coolantFlow, temperature]);

  // Safety system - automatic SCRAM if temperature gets too high
  useEffect(() => {
    if (temperature > 1200) {
      setIsReactionActive(false);
      setPowerLevel(0);
      setControlRodPositions(controlRodPositions.map(() => 0));
      setIsCritical(true);
    }
  }, [temperature, controlRodPositions]);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Nuclear Reactor Simulation</h1>
        <p className="text-white opacity-80">Interactive simulation of a nuclear fission reactor</p>
        <div className="divider w-1/2 mx-auto my-4"></div>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative">
          <ReactorCore 
            powerLevel={powerLevel}
            controlRodPositions={controlRodPositions}
            temperature={temperature}
            isReactionActive={isReactionActive}
            isStable={isStable}
            isCritical={isCritical}
          />
          
          {/* Toggle between React-based animation and WebAssembly-based animation */}
          {useWasmAnimation ? (
            <WebAssemblyAnimation 
              isActive={isReactionActive && powerLevel > 0.1}
              intensity={animationIntensity}
            />
          ) : (
            <AtomShatteringAnimation 
              isActive={isReactionActive && powerLevel > 0.1}
              intensity={animationIntensity}
              isStable={isStable}
              isCritical={isCritical}
            />
          )}
        </div>
        
        <div>
          <ControlPanel 
            powerLevel={powerLevel}
            setPowerLevel={setPowerLevel}
            controlRodPositions={controlRodPositions}
            setControlRodPositions={setControlRodPositions}
            temperature={temperature}
            coolantFlow={coolantFlow}
            setCoolantFlow={setCoolantFlow}
            isReactionActive={isReactionActive}
            setIsReactionActive={setIsReactionActive}
            isStable={isStable}
            isCritical={isCritical}
          />
          
          <div className="mt-6 bg-black p-6 rounded-lg border border-white glass-panel">
            <h2 className="text-xl font-bold mb-4 text-white">Reactor Status</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Reactor State:</span>
                <span className={
                  isStable ? 'status-stable' : 
                  isCritical ? 'status-critical' : 
                  'status-warning'
                }>
                  {isReactionActive ? 
                    (isStable ? 'STABLE' : 
                     isCritical ? 'CRITICAL' : 
                     'ACTIVE') : 
                    'OFFLINE'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Power Output:</span>
                <span>{Math.round(powerLevel * 1000)} MW</span>
              </div>
              <div className="flex justify-between">
                <span>Core Temperature:</span>
                <span className={
                  isCritical ? 'status-critical' : 
                  isStable ? 'status-stable' : 
                  'status-warning'
                }>
                  {temperature}°C
                </span>
              </div>
              <div className="flex justify-between">
                <span>Coolant Flow Rate:</span>
                <span>{Math.round(coolantFlow * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Control Rod Avg. Position:</span>
                <span>
                  {Math.round(
                    (controlRodPositions.reduce((sum, pos) => sum + pos, 0) / 
                    controlRodPositions.length) * 100
                  )}% Withdrawn
                </span>
              </div>
            </div>
          </div>
          
          {/* Animation toggle */}
          <div className="mt-6 bg-black p-4 rounded-lg border border-white glass-panel">
            <div className="flex items-center justify-between">
              <span className="font-medium">Animation Engine:</span>
              <button 
                onClick={() => setUseWasmAnimation(!useWasmAnimation)}
                className="px-3 py-1 border border-white rounded text-sm btn"
              >
                {useWasmAnimation ? 'Using C++/C# (WebAssembly)' : 'Using React'}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-12 text-center text-white text-sm opacity-60">
        <p>Nuclear Reactor Simulation - Educational Purposes Only</p>
        <p className="mt-1">C++/C# animation code integrated via WebAssembly bridge</p>
      </footer>
    </div>
  );
}

export default App;
