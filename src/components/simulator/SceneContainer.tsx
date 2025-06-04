import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, ContactShadows, BakeShadows, SoftShadows } from '@react-three/drei';
import { useRobotStore } from '@/store/robotStore';
import RobotModel from './RobotModel';
import * as THREE from 'three';

// Component to handle robot-following camera
const RobotFollowCamera: React.FC<{ 
  resetTrigger: number;
  followMode: 'follow' | 'orbit';
  robotPosition?: THREE.Vector3;
}> = ({ resetTrigger, followMode, robotPosition }) => {
  const { camera, controls } = useThree();
  const targetPosition = useRef(new THREE.Vector3(0, 0, 0));
  const cameraOffset = useRef(new THREE.Vector3(5, 4, 5));
  const smoothingFactor = 0.05;
  
  useEffect(() => {
    if (resetTrigger > 0) {
      if (followMode === 'follow' && robotPosition) {
        // Reset to follow the robot
        const newCameraPos = robotPosition.clone().add(cameraOffset.current);
        camera.position.copy(newCameraPos);
        camera.lookAt(robotPosition);
        targetPosition.current.copy(robotPosition);
      } else {
        // Default reset position
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);
        targetPosition.current.set(0, 0, 0);
      }
      
      camera.updateProjectionMatrix();
      
      if (controls) {
        controls.target.copy(targetPosition.current);
        controls.update();
      }
    }
  }, [resetTrigger, camera, controls, followMode, robotPosition]);
  
  useFrame(() => {
    if (followMode === 'follow' && robotPosition) {
      // Smoothly update target position to robot position
      targetPosition.current.lerp(robotPosition, smoothingFactor);
      
      // Calculate desired camera position relative to robot
      const desiredCameraPos = robotPosition.clone().add(cameraOffset.current);
      
      // Smoothly move camera to follow robot
      camera.position.lerp(desiredCameraPos, smoothingFactor);
      
      // Always look at the robot
      camera.lookAt(targetPosition.current);
      
      // Update orbit controls target if available
      if (controls && controls.target) {
        controls.target.lerp(robotPosition, smoothingFactor);
        controls.update();
      }
    }
  });
  
  return null;
};

// Component to track robot position and pass it to camera controller
const RobotTracker: React.FC<{ 
  robotConfig: any;
  onPositionUpdate: (position: THREE.Vector3) => void;
}> = ({ robotConfig, onPositionUpdate }) => {
  const robotRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (robotRef.current) {
      const position = new THREE.Vector3();
      robotRef.current.getWorldPosition(position);
      onPositionUpdate(position);
    }
  });
  
  return (
    <group ref={robotRef}>
      <RobotModel robotConfig={robotConfig} />
    </group>
  );
};

const SceneContainer: React.FC = () => {
  const { selectedRobot, environment } = useRobotStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [followMode, setFollowMode] = useState<'follow' | 'orbit'>('follow');
  const [robotPosition, setRobotPosition] = useState<THREE.Vector3>();
  
  const environmentName = environment?.name || 'warehouse';
  
  const handleResetView = () => {
    setResetTrigger(prev => prev + 1);
  };
  
  const handleToggleGrid = () => {
    setShowGrid(prev => !prev);
  };
  
  const handleToggleFollowMode = () => {
    setFollowMode(prev => prev === 'follow' ? 'orbit' : 'follow');
  };
  
  const handleRobotPositionUpdate = (position: THREE.Vector3) => {
    setRobotPosition(position);
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
        <RobotFollowCamera 
          resetTrigger={resetTrigger} 
          followMode={followMode}
          robotPosition={robotPosition}
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
            followCamera={followMode === 'follow'}
          />
        )}
        
        {selectedRobot && (
          <RobotTracker 
            robotConfig={selectedRobot} 
            onPositionUpdate={handleRobotPositionUpdate}
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
          enabled={followMode === 'orbit'}
        />
      </Canvas>
      
      <div className="absolute top-4 left-4 bg-dark-800/80 backdrop-blur-sm px-3 py-2 rounded-md text-sm text-white border border-dark-600">
        Environment: {environmentName}
        <div className="text-xs mt-1 text-gray-400">
          Mode: {followMode === 'follow' ? 'Robot Follow' : 'Free Orbit'}
        </div>
      </div>
      
      <div className="absolute bottom-4 right-4 flex space-x-2">
        <button 
          className="btn-primary text-sm px-3 py-1.5 hover:bg-primary-600 active:bg-primary-700 transition-colors"
          onClick={handleResetView}
        >
          Reset View
        </button>
        <button 
          className={`btn text-sm px-3 py-1.5 transition-colors ${
            followMode === 'follow' 
              ? 'bg-green-600 hover:bg-green-500 text-white' 
              : 'bg-dark-700 hover:bg-dark-600 text-white'
          }`}
          onClick={handleToggleFollowMode}
        >
          {followMode === 'follow' ? 'Following Robot' : 'Free Camera'}
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