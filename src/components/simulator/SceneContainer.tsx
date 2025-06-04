import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, ContactShadows, BakeShadows, SoftShadows } from '@react-three/drei';
import { useRobotStore } from '@/store/robotStore';
import RobotModel from './RobotModel';
import * as THREE from 'three';

// Unified camera management component
const CameraManager: React.FC<{ 
  resetTrigger: number, 
  robotRef: React.RefObject<THREE.Group> 
}> = ({ resetTrigger, robotRef }) => {
  const { camera, controls } = useThree();
  const orbitControls = controls as any;
  const initialOffset = useRef(new THREE.Vector3(5, 5, 5));
  const targetOffset = useRef(new THREE.Vector3());
  const resetInProgress = useRef(false);
  const _robotPosition = useRef(new THREE.Vector3());
  const _delta = useRef(new THREE.Vector3());

  // Handle view reset
  useEffect(() => {
    if (resetTrigger > 0 && robotRef.current) {
      resetInProgress.current = true;
      robotRef.current.getWorldPosition(_robotPosition.current);
      
      // Set new camera position relative to robot
      camera.position.copy(_robotPosition.current.clone().add(initialOffset.current));
      camera.lookAt(_robotPosition.current);
      
      if (orbitControls) {
        orbitControls.target.copy(_robotPosition.current);
        orbitControls.update();
      }
      
      // Reset after animation completes
      setTimeout(() => resetInProgress.current = false, 500);
    }
  }, [resetTrigger, camera, orbitControls, robotRef]);

  // Smooth follow logic
  useFrame((_, delta) => {
    if (!robotRef.current || !orbitControls || resetInProgress.current) return;
    
    robotRef.current.getWorldPosition(_robotPosition.current);
    
    // Update controls target to follow robot
    orbitControls.target.lerp(_robotPosition.current, 5 * delta);
    
    // Maintain camera distance while allowing orbital movement
    targetOffset.current.copy(camera.position).sub(orbitControls.target);
    const distance = targetOffset.current.length();
    targetOffset.current.normalize().multiplyScalar(Math.max(distance, 3));
    
    // Update camera position relative to robot
    camera.position.copy(orbitControls.target).add(targetOffset.current);
    orbitControls.update();
  });

  return null;
};

const SceneContainer: React.FC = () => {
  const { selectedRobot, environment } = useRobotStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const robotRef = useRef<THREE.Group>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);
  
  const environmentName = environment?.name || 'warehouse';
  
  const handleResetView = () => {
    setResetTrigger(prev => prev + 1);
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
        <CameraManager 
          resetTrigger={resetTrigger} 
          robotRef={robotRef} 
        />
        
        <SoftShadows size={25} samples={16} />
        <color attach="background" args={['#111827']} />
        
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadow 
          shadow-mapSize={[2048, 2048]}
        />
        
        <Environment preset={environmentName} background blur={0.8} />
        
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
        
        {selectedRobot && (
          <RobotModel 
            robotConfig={selectedRobot} 
            ref={robotRef} 
          />
        )}
        
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
