import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, Grid, ContactShadows, BakeShadows, SoftShadows } from '@react-three/drei';
import { useRobotStore } from '@/store/robotStore';
import RobotModel from './RobotModel';
import * as THREE from 'three';

// Global robot position and reference
const robotTracker = {
  position: new THREE.Vector3(0, 0, 0),
  ref: null as THREE.Object3D | null,
  hasRobot: false
};

// Robot Model wrapper that continuously tracks position
const TrackedRobotModel: React.FC<{ robotConfig: any }> = ({ robotConfig }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (groupRef.current) {
      robotTracker.ref = groupRef.current;
      robotTracker.hasRobot = true;
    }
    
    return () => {
      robotTracker.hasRobot = false;
      robotTracker.ref = null;
    };
  }, []);
  
  useFrame(() => {
    if (groupRef.current) {
      // Continuously update robot position
      groupRef.current.getWorldPosition(robotTracker.position);
    }
  });
  
  return (
    <group ref={groupRef}>
      <RobotModel robotConfig={robotConfig} />
    </group>
  );
};

// Camera that always follows the robot - no other mode
const AlwaysFollowCamera: React.FC<{ resetTrigger: number }> = ({ resetTrigger }) => {
  const { camera } = useThree();
  const cameraOffset = new THREE.Vector3(5, 4, 5); // Fixed offset behind and above robot
  const smoothingFactor = 0.08; // Smooth but responsive following
  
  useEffect(() => {
    if (resetTrigger > 0 && robotTracker.hasRobot) {
      // Reset camera to follow position
      const robotPos = robotTracker.position.clone();
      const initialCameraPos = robotPos.clone().add(cameraOffset);
      
      camera.position.copy(initialCameraPos);
      camera.lookAt(robotPos);
      camera.updateProjectionMatrix();
    }
  }, [resetTrigger, camera]);
  
  useFrame((state, delta) => {
    if (robotTracker.hasRobot && robotTracker.ref) {
      const currentRobotPos = robotTracker.position.clone();
      
      // Calculate desired camera position - always behind and above robot
      const desiredCameraPos = currentRobotPos.clone().add(cameraOffset);
      
      // Smoothly move camera to desired position
      const lerpSpeed = Math.min(delta * 4, 1); // Responsive but smooth
      camera.position.lerp(desiredCameraPos, lerpSpeed);
      
      // Always look at the robot
      const lookAtTarget = currentRobotPos.clone();
      // Smoothly update look-at target
      const currentTarget = new THREE.Vector3();
      camera.getWorldDirection(currentTarget);
      currentTarget.multiplyScalar(-1).add(camera.position);
      
      const smoothLookAt = currentTarget.lerp(lookAtTarget, lerpSpeed);
      camera.lookAt(smoothLookAt);
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
  
  // Auto-reset camera when robot changes
  useEffect(() => {
    if (selectedRobot) {
      setTimeout(() => {
        setResetTrigger(prev => prev + 1);
      }, 100);
    }
  }, [selectedRobot]);
  
  return (
    <div className="relative w-full h-full">
      <Canvas
        ref={canvasRef}
        shadows
        camera={{ position: [5, 4, 5], fov: 50 }}
        className="w-full h-full bg-dark-900 rounded-lg"
        style={{ minHeight: '400px' }}
      >
        <AlwaysFollowCamera resetTrigger={resetTrigger} />
        
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
            followCamera={true}
          />
        )}
        
        {selectedRobot && (
          <TrackedRobotModel robotConfig={selectedRobot} />
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
        
        {/* No OrbitControls - camera is always locked to robot */}
      </Canvas>
      
      <div className="absolute top-4 left-4 bg-dark-800/80 backdrop-blur-sm px-3 py-2 rounded-md text-sm text-white border border-dark-600">
        <div>Environment: {environmentName}</div>
        <div className="text-xs mt-1 text-green-400">
          🎥 Camera Following Robot
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