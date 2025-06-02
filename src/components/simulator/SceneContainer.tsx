import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, ContactShadows, BakeShadows, SoftShadows } from '@react-three/drei';
import { useRobotStore } from '@/store/robotStore';
import RobotModel from './RobotModel';

const SceneContainer: React.FC = () => {
  const { selectedRobot, environment } = useRobotStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<any>(null);
  const [showGrid, setShowGrid] = useState(true);
  
  const environmentName = environment?.name || 'warehouse';
  
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
  
  return (
    <div className="relative w-full h-full">
      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [5, 5, 5], fov: 50 }}
        className="w-full h-full bg-dark-900 rounded-lg"
        style={{ minHeight: '400px' }}
      >
        <SoftShadows size={25} samples={16} />
        <color attach="background" args={['#111827']} />
        
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
        />
        
        <Environment preset="warehouse" background blur={0.8} />
        
        {showGrid && (
          <Grid 
            infiniteGrid 
            cellSize={1}
            cellThickness={0.5}
            cellColor="#666"
            sectionSize={3}
            sectionThickness={1}
            sectionColor="#888"
            fadeDistance={30}
            fadeStrength={1}
            followCamera={false}
          />
        )}
        
        {selectedRobot && <RobotModel robotConfig={selectedRobot} />}
        
        <ContactShadows
          opacity={0.4}
          scale={10}
          blur={2}
          far={10}
          resolution={256}
          color="#000000"
        />
        
        <BakeShadows />
        
        <OrbitControls 
          ref={controlsRef}
          makeDefault 
          enableDamping
          dampingFactor={0.1}
          minDistance={2}
          maxDistance={20}
        />
      </Canvas>
      
      <div className="absolute top-4 left-4 bg-dark-800/80 backdrop-blur-sm px-3 py-2 rounded-md text-sm text-white border border-dark-600">
        Environment: {environmentName}
      </div>
      
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button 
          className="btn-primary text-sm px-3 py-1.5 hover:bg-primary-600 active:bg-primary-700 transition-colors"
          onClick={handleResetView}
        >
          Reset View
        </button>
        <button 
          className="btn bg-dark-700 hover:bg-dark-600 active:bg-dark-500 text-white text-sm px-3 py-1.5 transition-colors"
          onClick={handleToggleGrid}
        >
          {showGrid ? 'Hide Grid' : 'Show Grid'}
        </button>
      </div>
    </div>
  );
};

export default SceneContainer;