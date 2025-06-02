import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, ContactShadows, BakeShadows, SoftShadows } from '@react-three/drei';
import { useRobotStore } from '@/store/robotStore';
import RobotModel from './RobotModel';

// Environment configurations
const environments = [
  {
    name: 'warehouse',
    preset: 'warehouse',
    description: 'Industrial warehouse setting',
    lighting: { intensity: 1, color: '#ffffff' },
    ground: { color: '#444444' }
  },
  {
    name: 'studio',
    preset: 'studio',
    description: 'Clean photography studio',
    lighting: { intensity: 1.2, color: '#ffffff' },
    ground: { color: '#f0f0f0' }
  },
  {
    name: 'sunset',
    preset: 'sunset',
    description: 'Warm golden hour lighting',
    lighting: { intensity: 0.8, color: '#ffa500' },
    ground: { color: '#8b4513' }
  },
  {
    name: 'dawn',
    preset: 'dawn',
    description: 'Cool morning atmosphere',
    lighting: { intensity: 0.9, color: '#87ceeb' },
    ground: { color: '#696969' }
  },
  {
    name: 'night',
    preset: 'night',
    description: 'Dark nighttime environment',
    lighting: { intensity: 0.3, color: '#191970' },
    ground: { color: '#2f2f2f' }
  },
  {
    name: 'forest',
    preset: 'forest',
    description: 'Natural forest setting',
    lighting: { intensity: 0.7, color: '#90ee90' },
    ground: { color: '#654321' }
  },
  {
    name: 'apartment',
    preset: 'apartment',
    description: 'Indoor apartment lighting',
    lighting: { intensity: 1.1, color: '#fff8dc' },
    ground: { color: '#deb887' }
  },
  {
    name: 'city',
    preset: 'city',
    description: 'Urban cityscape environment',
    lighting: { intensity: 0.9, color: '#b0c4de' },
    ground: { color: '#555555' }
  },
  {
    name: 'park',
    preset: 'park',
    description: 'Outdoor park setting',
    lighting: { intensity: 1.0, color: '#98fb98' },
    ground: { color: '#228b22' }
  },
  {
    name: 'lobby',
    preset: 'lobby',
    description: 'Corporate lobby atmosphere',
    lighting: { intensity: 1.1, color: '#f5f5f5' },
    ground: { color: '#d3d3d3' }
  }
];

const SceneContainer: React.FC = () => {
  const { selectedRobot, environment, setEnvironment } = useRobotStore();
  const canvasRef = useRef(null);
  const controlsRef = useRef(null);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedEnvIndex, setSelectedEnvIndex] = useState(0);

  const currentEnvironment = environments[selectedEnvIndex];
  const environmentName = environment?.name || currentEnvironment.name;

  const handleResetView = () => {
    if (controlsRef.current) {
      // Reset camera position
      controlsRef.current.object.position.set(5, 5, 5);
      // Reset target to origin
      controlsRef.current.target.set(0, 0, 0);
      // Update the controls
      controlsRef.current.update();
    }
  };

  const handleToggleGrid = () => {
    setShowGrid(prev => !prev);
  };

  const handleEnvironmentChange = (index: number) => {
    setSelectedEnvIndex(index);
    if (setEnvironment) {
      setEnvironment(environments[index]);
    }
  };

  // Custom Environment Component with enhanced lighting
  const CustomEnvironment = ({ config }: { config: typeof currentEnvironment }) => {
    return (
      <>
        <Environment preset={config.preset} />
        <ambientLight intensity={0.4} color="#ffffff" />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={config.lighting.intensity} 
          color={config.lighting.color}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight 
          position={[-10, -10, -5]} 
          intensity={0.3} 
          color={config.lighting.color}
        />
      </>
    );
  };

  return (
    <div className="relative w-full h-full bg-gray-900">
      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [5, 5, 5], fov: 50 }}
        className="w-full h-full"
      >
        <SoftShadows />
        
        <CustomEnvironment config={currentEnvironment} />
        
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          dampingFactor={0.05}
          screenSpacePanning={false}
          minDistance={2}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2}
        />
        
        {showGrid && (
          <Grid
            renderOrder={-1}
            position={[0, -0.01, 0]}
            infiniteGrid
            cellSize={1}
            cellThickness={0.5}
            sectionSize={10}
            sectionThickness={1}
            sectionColor={currentEnvironment.ground.color}
            cellColor="#666666"
            fadeDistance={30}
            fadeStrength={1}
          />
        )}
        
        {selectedRobot && <RobotModel />}
        
        <ContactShadows 
          position={[0, -0.005, 0]} 
          opacity={0.4} 
          scale={20} 
          blur={2.5} 
          far={4} 
          color={currentEnvironment.ground.color}
        />
        
        <BakeShadows />
      </Canvas>
      
      {/* Enhanced UI Controls */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white p-4 rounded-lg shadow-lg">
        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-semibold mb-2">Environment</h3>
            <select 
              value={selectedEnvIndex}
              onChange={(e) => handleEnvironmentChange(Number(e.target.value))}
              className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1 text-sm min-w-[150px]"
            >
              {environments.map((env, index) => (
                <option key={env.name} value={index}>
                  {env.name.charAt(0).toUpperCase() + env.name.slice(1)}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-300 mt-1">{currentEnvironment.description}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleResetView}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm transition-colors"
            >
              Reset View
            </button>
            <button
              onClick={handleToggleGrid}
              className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm transition-colors"
            >
              {showGrid ? 'Hide Grid' : 'Show Grid'}
            </button>
          </div>
        </div>
      </div>

      {/* Environment Info Panel */}
      <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm text-white p-3 rounded-lg shadow-lg">
        <div className="text-sm">
          <div className="font-semibold">{currentEnvironment.name.toUpperCase()}</div>
          <div className="text-xs text-gray-300">
            Lighting: {Math.round(currentEnvironment.lighting.intensity * 100)}%
          </div>
        </div>
      </div>

      {/* Quick Environment Switcher */}
      <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm text-white p-3 rounded-lg shadow-lg">
        <div className="text-xs font-semibold mb-2">Quick Switch</div>
        <div className="grid grid-cols-3 gap-1">
          {environments.slice(0, 9).map((env, index) => (
            <button
              key={env.name}
              onClick={() => handleEnvironmentChange(index)}
              className={`w-8 h-8 rounded text-xs font-bold transition-all ${
                selectedEnvIndex === index 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              }`}
              title={env.description}
            >
              {env.name.charAt(0).toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SceneContainer;