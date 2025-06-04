import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, ContactShadows, BakeShadows, SoftShadows } from '@react-three/drei';
import { useRobotStore } from '@/store/robotStore';
import RobotModel from './RobotModel';
import * as THREE from 'three';

// Global robot position tracker
let globalRobotPosition = new THREE.Vector3(0, 0, 0);
let globalRobotRef: THREE.Object3D | null = null;

// Enhanced Robot Model wrapper that tracks position
const TrackedRobotModel: React.FC<{ robotConfig: any }> = ({ robotConfig }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      // Update global position reference
      groupRef.current.getWorldPosition(globalRobotPosition);
      globalRobotRef = groupRef.current;
    }
  });
  
  return (
    <group ref={groupRef}>
      <RobotModel robotConfig={robotConfig} />
    </group>
  );
};

// Camera controller that follows the robot
const RobotFollowCamera: React.FC<{ 
  resetTrigger: number;
  followMode: 'follow' | 'orbit';
  followDistance: number;
  followHeight: number;
}> = ({ resetTrigger, followMode, followDistance, followHeight }) => {
  const { camera, controls } = useThree();
  const lastRobotPosition = useRef(new THREE.Vector3(0, 0, 0));
  const cameraTarget = useRef(new THREE.Vector3(0, 0, 0));
  const idealCameraPosition = useRef(new THREE.Vector3(followDistance, followHeight, followDistance));
  
  useEffect(() => {
    if (resetTrigger > 0) {
      if (followMode === 'follow') {
        // Reset to follow position relative to current robot position
        const robotPos = globalRobotPosition.clone();
        const offset = new THREE.Vector3(followDistance, followHeight, followDistance);
        const newCameraPos = robotPos.clone().add(offset);
        
        camera.position.copy(newCameraPos);
        camera.lookAt(robotPos);
        cameraTarget.current.copy(robotPos);
        lastRobotPosition.current.copy(robotPos);
      } else {
        // Default free camera reset
        camera.position.set(5, 5, 5);
        camera.lookAt(0, 0, 0);
        cameraTarget.current.set(0, 0, 0);
      }
      
      camera.updateProjectionMatrix();
      
      if (controls) {
        controls.target.copy(cameraTarget.current);
        controls.update();
      }
    }
  }, [resetTrigger, camera, controls, followMode, followDistance, followHeight]);
  
  useFrame((state, delta) => {
    if (followMode === 'follow' && globalRobotRef) {
      const currentRobotPos = globalRobotPosition.clone();
      
      // Check if robot has moved significantly
      const robotMoved = currentRobotPos.distanceTo(lastRobotPosition.current) > 0.01;
      
      if (robotMoved || true) { // Always update for smooth following
        // Calculate ideal camera position relative to robot
        const robotDirection = new THREE.Vector3();
        if (globalRobotRef.rotation) {
          // Try to get robot's forward direction
          robotDirection.set(0, 0, 1).applyQuaternion(globalRobotRef.quaternion);
        }
        
        // Position camera behind and above the robot
        const offset = new THREE.Vector3(-followDistance, followHeight, followDistance);
        // Adjust offset based on robot's rotation if possible
        if (robotDirection.length() > 0) {
          const side = new THREE.Vector3().crossVectors(robotDirection, new THREE.Vector3(0, 1, 0)).normalize();
          const back = robotDirection.clone().negate();
          offset.copy(back.multiplyScalar(followDistance * 0.7).add(side.multiplyScalar(followDistance * 0.3)));
          offset.y = followHeight;
        }
        
        const idealPos = currentRobotPos.clone().add(offset);
        
        // Smooth camera movement
        const lerpFactor = Math.min(delta * 3, 1); // Responsive but smooth
        camera.position.lerp(idealPos, lerpFactor);
        
        // Always look at robot with smooth target following
        cameraTarget.current.lerp(currentRobotPos, lerpFactor);
        camera.lookAt(cameraTarget.current);
        
        // Update orbit controls target
        if (controls && controls.target) {
          controls.target.lerp(currentRobotPos, lerpFactor);
          controls.update();
        }
        
        lastRobotPosition.current.copy(currentRobotPos);
      }
    }
  });
  
  return null;
};

const SceneContainer: React.FC = () => {
  const { selectedRobot, environment } = useRobotStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showGrid, setShowGrid] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [followMode, setFollowMode] = useState<'follow' | 'orbit'>('follow');
  const [followDistance, setFollowDistance] = useState(6);
  const [followHeight, setFollowHeight] = useState(4);
  
  const environmentName = environment?.name || 'warehouse';
  
  const handleResetView = () => {
    setResetTrigger(prev => prev + 1);
  };
  
  const handleToggleGrid = () => {
    setShowGrid(prev => !prev);
  };
  
  const handleToggleFollowMode = () => {
    setFollowMode(prev => {
      const newMode = prev === 'follow' ? 'orbit' : 'follow';
      // Trigger a reset when switching to follow mode
      if (newMode === 'follow') {
        setTimeout(() => setResetTrigger(prev => prev + 1), 100);
      }
      return newMode;
    });
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
          followDistance={followDistance}
          followHeight={followHeight}
        />
        
        <SoftShadows size={25} samples={16} />
        <color attach="background" args={['#111827']} />
        
        <ambientLight intensity={0.5} />
        <directionalLight 
          position={[10, 10, 5]} 
          intensity={1} 
          castShadov 
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
        
        <OrbitControls 
          makeDefault 
          enableDamping
          dampingFactor={0.1}
          minDistance={2}
          maxDistance={20}
          enabled={followMode === 'orbit'}
          enableZoom={followMode === 'orbit'}
          enablePan={followMode === 'orbit'}
          enableRotate={followMode === 'orbit'}
        />
      </Canvas>
      
      <div className="absolute top-4 left-4 bg-dark-800/80 backdrop-blur-sm px-3 py-2 rounded-md text-sm text-white border border-dark-600">
        <div>Environment: {environmentName}</div>
        <div className="text-xs mt-1 text-gray-400">
          Mode: {followMode === 'follow' ? 'Robot Follow' : 'Free Orbit'}
        </div>
        {followMode === 'follow' && (
          <div className="text-xs text-blue-400">
            Distance: {followDistance}m | Height: {followHeight}m
          </div>
        )}
      </div>
      
      {followMode === 'follow' && (
        <div className="absolute top-4 right-4 bg-dark-800/80 backdrop-blur-sm px-3 py-2 rounded-md text-xs text-white border border-dark-600">
          <div className="mb-2">Follow Settings</div>
          <div className="flex items-center space-x-2 mb-1">
            <label>Distance:</label>
            <input 
              type="range" 
              min="3" 
              max="15" 
              step="0.5"
              value={followDistance}
              onChange={(e) => setFollowDistance(Number(e.target.value))}
              className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <span>{followDistance}m</span>
          </div>
          <div className="flex items-center space-x-2">
            <label>Height:</label>
            <input 
              type="range" 
              min="2" 
              max="10" 
              step="0.5"
              value={followHeight}
              onChange={(e) => setFollowHeight(Number(e.target.value))}
              className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <span>{followHeight}m</span>
          </div>
        </div>
      )}
      
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
              : 'bg-blue-600 hover:bg-blue-500 text-white'
          }`}
          onClick={handleToggleFollowMode}
        >
          {followMode === 'follow' ? '📹 Following' : '🎥 Free Cam'}
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