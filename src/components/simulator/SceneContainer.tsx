import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, Grid, ContactShadows, BakeShadows, SoftShadows } from '@react-three/drei';
import { useRobotStore } from '@/store/robotStore';
import RobotModel from './RobotModel';
import * as THREE from 'three';

// Simple robot position tracker
const robotState = {
  position: new THREE.Vector3(0, 0, 0),
  initialized: false
};

// Robot wrapper that tracks position without affecting the model
const RobotWrapper: React.FC<{ robotConfig: any }> = ({ robotConfig }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.getWorldPosition(robotState.position);
      robotState.initialized = true;
    }
  });
  
  return (
    <group ref={groupRef}>
      <RobotModel robotConfig={robotConfig} />
    </group>
  );
};

// Simple camera follower
const CameraFollower: React.FC<{ resetTrigger: number }> = ({ resetTrigger }) => {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 0, 0));
  const cameraPositionRef = useRef(new THREE.Vector3(5, 4, 5));
  
  useEffect(() => {
    // Initial camera setup
    camera.position.set(5, 4, 5);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  useEffect(() => {
    if (resetTrigger > 0) {
      camera.position.set(5, 4, 5);
      camera.lookAt(robotState.position);
    }
  }, [resetTrigger, camera]);
  
  useFrame(() => {
    if (robotState.initialized) {
      // Simple following logic
      const robotPos = robotState.position;
      const offset = new THREE.Vector3(5, 4, 5);
      const desiredPos = robotPos.clone().add(offset);
      
      // Smooth camera movement
      camera.position.lerp(desiredPos, 0.05);
      
      // Smooth target following
      targetRef.current.lerp(robotPos, 0.05);
      camera.lookAt(targetRef.current);
    }
  });
  
  return null;
};

const SceneContainer: React.FC = () => {
  const { selectedRobot, environment } = useRobotStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
        camera={{ position: [5, 4, 5], fov: 50 }}
        className="w-full h-full bg-dark-900 rounded-lg"
        style={{ minHeight: '400px' }}
      >
        <CameraFollower resetTrigger={resetTrigger} />
        
        <SoftShadows size={25} samples={16} />
        <color attach="background" args={['#111827']} />
        
        <ambientLight intensity={0.4} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={0.8} 
          castShadow 
          shadow-mapSize={[1024, 1024]}
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
          />
        )}
        
        {selectedRobot && (
          <RobotWrapper robotConfig={selectedRobot} />
        )}
        
        <ContactShadows
          opacity={0.3}
          scale={10}
          blur={2}
          far={10}
          resolution={256}
          color="#000000"
        />
        
        <BakeShadows />
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