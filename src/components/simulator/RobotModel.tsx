// src/components/simulator/RobotModel.tsx
import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RobotConfig } from '@/types/robot.types';
import { useRobotStore } from '@/store/robotStore';
import * as THREE from 'three';

interface RobotModelProps {
  robotConfig: RobotConfig;
}

const RobotModel: React.FC<RobotModelProps> = ({ robotConfig }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { robotState, isMoving } = useRobotStore();
  const [wheelRotation, setWheelRotation] = useState(0);
  const [sensorRotation, setSensorRotation] = useState(0);

  useEffect(() => {
    if (groupRef.current && robotState) {
      // Only move mobile robots, drones, and new robot types, NOT robot arms
      if (robotConfig.type !== 'arm') {
        // Smooth position interpolation
        const currentPos = groupRef.current.position;
        const targetPos = new THREE.Vector3(
          robotState.position.x,
          robotState.position.y,
          robotState.position.z
        );
        
        currentPos.lerp(targetPos, 0.1);
        
        // Smooth rotation interpolation
        const currentRot = groupRef.current.rotation.y;
        const targetRot = robotState.rotation.y;
        const rotDiff = targetRot - currentRot;
        
        // Handle rotation wrap-around
        const adjustedRotDiff = ((rotDiff + Math.PI) % (Math.PI * 2)) - Math.PI;
        groupRef.current.rotation.y = currentRot + adjustedRotDiff * 0.1;
      }
    }
  }, [robotState, robotConfig.type]);

  useFrame((state, delta) => {
    // Animate wheels/propellers when moving
    if ((isMoving || robotState?.isMoving) && robotConfig.type !== 'arm') {
      const speed = robotConfig.type === 'drone' ? 20 : 
                   robotConfig.type === 'spider' ? 8 : 
                   robotConfig.type === 'tank' ? 15 : 
                   robotConfig.type === 'humanoid' ? 6 : 12;
      setWheelRotation(prev => prev + delta * speed);
    }
    
    // Always rotate sensor for scanning effect
    setSensorRotation(prev => prev + delta * 2);
  });

  const renderRobotModel = () => {
    switch (robotConfig.type) {
      case 'arm':
        return <EnhancedRobotArm sensorRotation={sensorRotation} />;
      case 'drone':
        return <EnhancedRobotDrone wheelRotation={wheelRotation} sensorRotation={sensorRotation} />;
      case 'spider':
        return <EnhancedSpiderRobot wheelRotation={wheelRotation} sensorRotation={sensorRotation} />;
      case 'tank':
        return <EnhancedTankRobot wheelRotation={wheelRotation} sensorRotation={sensorRotation} />;
      case 'humanoid':
        return <EnhancedHumanoidRobot wheelRotation={wheelRotation} sensorRotation={sensorRotation} />;
      default:
        return <EnhancedRobotMobile wheelRotation={wheelRotation} sensorRotation={sensorRotation} />;
    }
  };

  return (
    <group ref={groupRef}>
      {renderRobotModel()}
    </group>
  );
};

// Enhanced Mobile Robot Component with complete details
const EnhancedRobotMobile: React.FC<{ wheelRotation: number; sensorRotation: number }> = ({ 
  wheelRotation, 
  sensorRotation 
}) => {
  return (
    <group>
      {/* Main chassis */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.4, 2]} />
        <meshStandardMaterial 
          color="#0EA5E9" 
          metalness={0.6} 
          roughness={0.3} 
        />
      </mesh>
      
      {/* Chassis details - side panels */}
      <mesh position={[-0.76, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.02, 0.35, 1.8]} />
        <meshStandardMaterial color="#0284C7" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.76, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.02, 0.35, 1.8]} />
        <meshStandardMaterial color="#0284C7" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Upper housing */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.4, 1.6]} />
        <meshStandardMaterial 
          color="#38BDF8" 
          metalness={0.4} 
          roughness={0.4} 
        />
      </mesh>
      
      {/* Front bumper */}
      <mesh position={[0, 0.15, 1.05]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.4, 16]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Rear bumper */}
      <mesh position={[0, 0.15, -1.05]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.08, 1.4, 16]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Sensor tower */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.4, 8]} />
        <meshStandardMaterial 
          color="#0284C7" 
          metalness={0.7} 
          roughness={0.2} 
        />
      </mesh>
      
      {/* Control panel */}
      <mesh position={[0, 0.9, 0.6]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.15, 0.05]} />
        <meshStandardMaterial 
          color="#1F2937" 
          metalness={0.9} 
          roughness={0.1} 
        />
      </mesh>
      
      {/* Status lights */}
      {[-0.2, -0.1, 0, 0.1, 0.2].map((x, index) => (
        <mesh key={index} position={[x, 0.95, 0.61]} castShadow receiveShadow>
          <cylinderGeometry args={[0.015, 0.015, 0.01, 8]} />
          <meshStandardMaterial 
            color={index % 2 === 0 ? "#22C55E" : "#EF4444"} 
            emissive={index % 2 === 0 ? "#22C55E" : "#EF4444"} 
            emissiveIntensity={0.5} 
          />
        </mesh>
      ))}
      
      {/* Wheels with enhanced details */}
      {[
        [-0.8, 0.25, -0.7],
        [0.8, 0.25, -0.7],
        [-0.8, 0.25, 0.7],
        [0.8, 0.25, 0.7]
      ].map((position, index) => (
        <group key={index}>
          {/* Main wheel */}
          <mesh position={position as [number, number, number]} rotation={[wheelRotation, 0, Math.PI / 2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
            <meshStandardMaterial color="#1E293B" metalness={0.2} roughness={0.8} />
          </mesh>
          
          {/* Wheel rim */}
          <mesh position={position as [number, number, number]} rotation={[wheelRotation, 0, Math.PI / 2]} castShadow receiveShadow>
            <torusGeometry args={[0.25, 0.03, 8, 16]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          
          {/* Wheel hub */}
          <mesh position={position as [number, number, number]} rotation={[wheelRotation, 0, Math.PI / 2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.16, 8]} />
            <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.2} />
          </mesh>
          
          {/* Wheel spokes */}
          {[0, Math.PI/2, Math.PI, 3*Math.PI/2].map((angle, spokeIndex) => (
            <mesh 
              key={spokeIndex}
              position={position as [number, number, number]} 
              rotation={[wheelRotation + angle, 0, Math.PI / 2]} 
              castShadow 
              receiveShadow
            >
              <boxGeometry args={[0.02, 0.2, 0.1]} />
              <meshStandardMaterial color="#6B7280" />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Rotating sensor */}
      <group position={[0, 1.3, 0.6]} rotation={[0, sensorRotation * 0.3, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.12, 0.15, 0.25, 16]} />
          <meshStandardMaterial 
            color="#F97316" 
            metalness={0.8} 
            roughness={0.1} 
          />
        </mesh>
        
        {/* Sensor eyes */}
        <mesh position={[0.08, 0, 0.1]} castShadow receiveShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.05, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[-0.08, 0, 0.1]} castShadow receiveShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.05, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        
        {/* Sensor array */}
        <mesh position={[0, 0.1, 0.1]} castShadow receiveShadow>
          <boxGeometry args={[0.15, 0.03, 0.03]} />
          <meshStandardMaterial 
            color="#DC2626" 
            emissive="#DC2626" 
            emissiveIntensity={0.3} 
          />
        </mesh>
      </group>
      
      {/* Antenna */}
      <mesh position={[0.4, 1.4, -0.3]} castShadow receiveShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
        <meshStandardMaterial color="#6B7280" />
      </mesh>
      <mesh position={[0.4, 1.55, -0.3]} castShadow receiveShadow>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial 
          color="#EF4444" 
          emissive="#EF4444" 
          emissiveIntensity={0.6} 
        />
      </mesh>
    </group>
  );
};

// Enhanced Robot Arm Component (Complete with missing details)
const EnhancedRobotArm: React.FC<{ sensorRotation: number }> = ({ sensorRotation }) => {
  const { robotState, isMoving } = useRobotStore();
  const [jointAngles, setJointAngles] = useState({ 
    base: 0, 
    wrist: 0 
  });
  const [gripperOpen, setGripperOpen] = useState(0.08);
  
  useFrame((state, delta) => {
    const jointCommand = (robotState as any)?.currentJointCommand;
    
    if (jointCommand && isMoving) {
      const { joint, direction, speed } = jointCommand;
      const moveSpeed = speed * delta * 2;
      
      setJointAngles(prev => {
        const newAngles = { ...prev };
        
        switch (joint) {
          case 'base':
            newAngles.base += direction === 'right' ? moveSpeed : -moveSpeed;
            newAngles.base = Math.max(-Math.PI * 1.5, Math.min(Math.PI * 1.5, newAngles.base));
            break;
          case 'wrist':
            newAngles.wrist += direction === 'right' ? moveSpeed : -moveSpeed;
            newAngles.wrist = Math.max(-Math.PI, Math.min(Math.PI, newAngles.wrist));
            break;
        }
        
        return newAngles;
      });
    }
    
    const targetGrip = robotState?.isGrabbing ? 0.02 : 0.08;
    setGripperOpen(prev => prev + (targetGrip - prev) * delta * 5);
  });

  return (
    <group>
      {/* Base platform with enhanced detail */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 1, 16]} />
        <meshStandardMaterial 
          color="#1E40AF" 
          metalness={0.7} 
          roughness={0.3} 
        />
      </mesh>
      
      {/* Base platform bolts */}
      {[0, Math.PI/2, Math.PI, 3*Math.PI/2].map((angle, index) => (
        <mesh key={index} position={[Math.cos(angle) * 0.6, 1, Math.sin(angle) * 0.6]} castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
      ))}
      
      {/* Control cabinet */}
      <mesh position={[1.2, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 1.5, 0.6]} />
        <meshStandardMaterial color="#1F2937" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Control panel */}
      <mesh position={[1.21, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.01, 0.6, 0.4]} />
        <meshStandardMaterial 
          color="#059669" 
          emissive="#059669" 
          emissiveIntensity={0.2} 
        />
      </mesh>
      
      {/* Emergency stop button */}
      <mesh position={[1.25, 1.4, 0.15]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.03, 16]} />
        <meshStandardMaterial 
          color="#DC2626" 
          emissive="#DC2626" 
          emissiveIntensity={0.4} 
        />
      </mesh>
      
      {/* Rotating base */}
      <group rotation={[0, jointAngles.base, 0]}>
        {/* Base connector */}
        <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
          <meshStandardMaterial color="#2563EB" metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Lower arm (fixed) */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.22, 1.5, 16]} />
          <meshStandardMaterial 
            color="#3B82F6" 
            metalness={0.8} 
            roughness={0.2} 
          />
        </mesh>
        
        {/* Arm joint covers */}
        {[1.3, 1.7].map((y, index) => (
          <mesh key={index} position={[0, y, 0]} castShadow receiveShadow>
            <torusGeometry args={[0.2, 0.05, 8, 16]} />
            <meshStandardMaterial color="#1D4ED8" />
          </mesh>
        ))}
        
        {/* Shoulder joint (visible but not movable) */}
        <mesh position={[0, 2.25, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial 
            color="#1D4ED8" 
            metalness={0.9} 
            roughness={0.1} 
          />
        </mesh>
        
        {/* Upper arm (fixed) */}
        <mesh position={[0, 2.25, 0.7]} castShadow receiveShadow>
          <boxGeometry args={[0.25, 0.35, 1.6]} />
          <meshStandardMaterial 
            color="#60A5FA" 
            metalness={0.6} 
            roughness={0.4} 
          />
        </mesh>
        
        {/* Hydraulic cylinders */}
        <mesh position={[0.15, 2.25, 0.4]} rotation={[0, 0, Math.PI/6]} castShadow receiveShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        <mesh position={[-0.15, 2.25, 0.4]} rotation={[0, 0, -Math.PI/6]} castShadow receiveShadow>
          <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
        
        {/* Cable conduits */}
        <mesh position={[0.12, 2.25, 1.2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.4, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[-0.12, 2.25, 1.2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.02, 0.02, 1.4, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        
        {/* Elbow joint (visible but not movable) */}
        <mesh position={[0, 2.25, 1.5]} castShadow receiveShadow>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial 
            color="#2563EB" 
            metalness={0.8} 
            roughness={0.2} 
          />
        </mesh>
        
        {/* Wrist with limited rotation */}
        <group position={[0, 2.25, 1.8]} rotation={[0, jointAngles.wrist, 0]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.12, 0.12, 0.15, 16]} />
            <meshStandardMaterial 
              color="#DC2626" 
              metalness={0.9} 
              roughness={0.1} 
            />
          </mesh>
          
          {/* Wrist sensors */}
          {[0, Math.PI/2, Math.PI, 3*Math.PI/2].map((angle, index) => (
            <mesh key={index} position={[Math.cos(angle) * 0.13, 0, Math.sin(angle) * 0.13]} castShadow receiveShadow>
              <cylinderGeometry args={[0.01, 0.01, 0.02, 8]} />
              <meshStandardMaterial 
                color="#22C55E" 
                emissive="#22C55E" 
                emissiveIntensity={0.5} 
              />
            </mesh>
          ))}
          
          {/* Gripper base */}
          <mesh position={[0, 0, 0.1]} castShadow receiveShadow>
            <boxGeometry args={[0.2, 0.15, 0.1]} />
            <meshStandardMaterial color="#991B1B" />
          </mesh>
          
          {/* Gripper fingers with detailed design */}
          <mesh position={[gripperOpen, 0, 0.18]} castShadow receiveShadow>
            <boxGeometry args={[0.04, 0.25, 0.08]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
          <mesh position={[-gripperOpen, 0, 0.18]} castShadow receiveShadow>
            <boxGeometry args={[0.04, 0.25, 0.08]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
          
          {/* Gripper tips */}
          <mesh position={[gripperOpen, 0, 0.22]} castShadow receiveShadow>
            <boxGeometry args={[0.02, 0.15, 0.02]} />
            <meshStandardMaterial color="#1F2937" />
          </mesh>
          <mesh position={[-gripperOpen, 0, 0.22]} castShadow receiveShadow>
            <boxGeometry args={[0.02, 0.15, 0.02]} />
            <meshStandardMaterial color="#1F2937" />
          </mesh>
          
          {/* Force sensors in gripper */}
          <mesh position={[gripperOpen * 0.5, 0, 0.2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.01, 8]} />
            <meshStandardMaterial 
              color="#F59E0B" 
              emissive="#F59E0B" 
              emissiveIntensity={0.4} 
            />
          </mesh>
          <mesh position={[-gripperOpen * 0.5, 0, 0.2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.01, 8]} />
            <meshStandardMaterial 
              color="#F59E0B" 
              emissive="#F59E0B" 
              emissiveIntensity={0.4} 
            />
          </mesh>
        </group>
      </group>
      
      {/* Base warning stripes */}
      {[0, Math.PI/4, Math.PI/2, 3*Math.PI/4, Math.PI, 5*Math.PI/4, 3*Math.PI/2, 7*Math.PI/4].map((angle, index) => (
        <mesh key={index} position={[Math.cos(angle) * 0.85, 0.02, Math.sin(angle) * 0.85]} rotation={[0, angle, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 0.01, 0.02]} />
          <meshStandardMaterial 
            color={index % 2 === 0 ? "#FCD34D" : "#1F2937"} 
          />
        </mesh>
      ))}
    </group>
  );
};

// Enhanced Drone Component with complete details
const EnhancedRobotDrone: React.FC<{ wheelRotation: number; sensorRotation: number }> = ({ 
  wheelRotation, 
  sensorRotation 
}) => {
  return (
    <group position={[0, 2, 0]}>
      {/* Main body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.15, 0.6]} />
        <meshStandardMaterial 
          color="#F97316" 
          metalness={0.8} 
          roughness={0.2} 
        />
      </mesh>
      
      {/* Body reinforcement */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.02, 0.5]} />
        <meshStandardMaterial color="#EA580C" />
      </mesh>
      <mesh position={[0, -0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.02, 0.5]} />
        <meshStandardMaterial color="#EA580C" />
      </mesh>
      
      {/* Central hub */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 16]} />
        <meshStandardMaterial color="#DC2626" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Arms connecting to propellers */}
      {[
        { pos: [-0.5, 0, -0.5], rot: Math.PI/4 },
        { pos: [0.5, 0, -0.5], rot: -Math.PI/4 },
        { pos: [-0.5, 0, 0.5], rot: -Math.PI/4 },
        { pos: [0.5, 0, 0.5], rot: Math.PI/4 }
      ].map((config, index) => (
        <group key={index}>
          {/* Arm */}
          <mesh position={[config.pos[0] * 0.6, 0, config.pos[2] * 0.6]} rotation={[0, config.rot, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
            <meshStandardMaterial color="#B45309" />
          </mesh>
          
          {/* Motor housing */}
          <mesh position={config.pos as [number, number, number]} castShadow receiveShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
            <meshStandardMaterial 
              color="#1F2937" 
              metalness={0.9} 
              roughness={0.1} 
            />
          </mesh>
          
          {/* Motor details */}
          <mesh position={[config.pos[0], config.pos[1] + 0.05, config.pos[2]]} castShadow receiveShadow>
            <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
          
          {/* Propeller hub */}
          <mesh position={[config.pos[0], config.pos[1] + 0.06, config.pos[2]]} castShadow receiveShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.01, 8]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          
          {/* Propellers with rotation */}
          <group 
            position={config.pos as [number, number, number]} 
            rotation={[0, wheelRotation * (index % 2 === 0 ? 1 : -1) * 2, 0]}
          >
            {/* Propeller blades */}
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.008, 0.5, 0.03]} />
              <meshStandardMaterial 
                color="#E5E7EB" 
                transparent 
                opacity={0.8} 
              />
            </mesh>
            <mesh rotation={[Math.PI / 2, Math.PI / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.008, 0.5, 0.03]} />
              <meshStandardMaterial 
                color="#E5E7EB" 
                transparent 
                opacity={0.8} 
              />
            </mesh>
          </group>
          
          {/* LED ring around motor */}
          <mesh position={config.pos as [number, number, number]} castShadow receiveShadow>
            <torusGeometry args={[0.07, 0.005, 8, 16]} />
            <meshStandardMaterial 
              color="#3B82F6" 
              emissive="#3B82F6" 
              emissiveIntensity={0.6} 
            />
          </mesh>
        </group>
      ))}
      
      {/* Camera gimbal */}
      <group position={[0, -0.1, 0.2]} rotation={[sensorRotation * 0.1, sensorRotation * 0.2, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#1F2937" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Camera lens */}
        <mesh position={[0, 0, 0.08]} castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        
        {/* Camera lens glass */}
        <mesh position={[0, 0, 0.09]} castShadow receiveShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.005, 16]} />
          <meshStandardMaterial 
            color="#1E40AF" 
            transparent 
            opacity={0.8} 
            metalness={0.1} 
            roughness={0.1} 
          />
        </mesh>
      </group>
      
      {/* Landing gear */}
      {[
        [-0.3, -0.15, -0.3],
        [0.3, -0.15, -0.3],
        [-0.3, -0.15, 0.3],
        [0.3, -0.15, 0.3]
      ].map((pos, index) => (
        <group key={index}>
          <mesh position={pos as [number, number, number]} castShadow receiveShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.25, 8]} />
            <meshStandardMaterial color="#6B7280" />
          </mesh>
          <mesh position={[pos[0], pos[1] - 0.125, pos[2]]} castShadow receiveShadow>
            <sphereGeometry args={[0.03, 8, 8]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
        </group>
      ))}
      
      {/* Status lights */}
      {[-0.15, 0, 0.15].map((x, index) => (
        <mesh key={index} position={[x, 0.08, 0.31]} castShadow receiveShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.005, 8]} />
          <meshStandardMaterial 
            color={index === 1 ? "#22C55E" : "#EF4444"} 
            emissive={index === 1 ? "#22C55E" : "#EF4444"} 
            emissiveIntensity={0.8} 
          />
        </mesh>
      ))}
      
      {/* Antenna */}
      <mesh position={[0, 0.1, -0.25]} castShadow receiveShadow>
        <cylinderGeometry args={[0.005, 0.005, 0.15, 8]} />
        <meshStandardMaterial color="#6B7280" />
      </mesh>
      <mesh position={[0, 0.175, -0.25]} castShadow receiveShadow>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshStandardMaterial 
          color="#DC2626" 
          emissive="#DC2626" 
          emissiveIntensity={0.7} 
        />
      </mesh>
    </group>
  );
};

// Enhanced Spider Robot Component with complete details
const EnhancedSpiderRobot: React.FC<{ wheelRotation: number; sensorRotation: number }> = ({ 
  wheelRotation, 
  sensorRotation 
}) => {
  return (
    <group>
      {/* Main body */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial 
          color="#8B5CF6" 
          metalness={0.7} 
          roughness={0.3} 
        />
      </mesh>
      
      {/* Body segments */}
      <mesh position={[0, 0.4, 0.3]} castShadow receiveShadow>
        <sphereGeometry args={[0.3, 12, 12]} />
        <meshStandardMaterial color="#7C3AED" />
      </mesh>
      <mesh position={[0, 0.4, -0.3]} castShadow receiveShadow>
        <sphereGeometry args={[0.25, 10, 10]} />
        <meshStandardMaterial color="#6D28D9" />
      </mesh>
      
      {/* Body markings */}
      {[0, Math.PI/3, 2*Math.PI/3, Math.PI, 4*Math.PI/3, 5*Math.PI/3].map((angle, index) => (
        <mesh key={index} position={[Math.cos(angle) * 0.45, 0.5, Math.sin(angle) * 0.45]} rotation={[0, angle, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.03, 0.02, 0.1]} />
          <meshStandardMaterial color="#A855F7" emissive="#A855F7" emissiveIntensity={0.3} />
        </mesh>
      ))}
      
      {/* Six legs with enhanced walking animation */}
      {[0, 1, 2, 3, 4, 5].map((legIndex) => {
        const angle = (legIndex * Math.PI * 2) / 6;
        const legWalk = Math.sin(wheelRotation + legIndex * 1.2) * 0.2;
        const legPhase = Math.cos(wheelRotation * 0.5 + legIndex * 0.8) * 0.1;
        
        return (
          <group key={legIndex} rotation={[0, angle, 0]}>
            {/* Upper leg segment */}
            <mesh 
              position={[0.6, 0.2 + legWalk, 0]} 
              rotation={[0, 0, Math.PI / 6 + legWalk]}
              castShadow 
              receiveShadow
            >
              <cylinderGeometry args={[0.03, 0.05, 0.6, 8]} />
              <meshStandardMaterial color="#7C3AED" metalness={0.6} roughness={0.4} />
            </mesh>
            
            {/* Leg joint */}
            <mesh position={[0.8, 0.1 + legWalk * 0.5, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.04, 8, 8]} />
              <meshStandardMaterial color="#6D28D9" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Lower leg segment */}
            <mesh 
              position={[0.9, -0.1 + legWalk, 0]} 
              rotation={[0, 0, -Math.PI / 4 + legPhase]}
              castShadow 
              receiveShadow
            >
              <cylinderGeometry args={[0.02, 0.03, 0.5, 8]} />
              <meshStandardMaterial color="#6D28D9" metalness={0.7} roughness={0.3} />
            </mesh>
            
            {/* Foot */}
            <mesh position={[1.1, -0.4 + legWalk * 0.5, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color="#4C1D95" metalness={0.5} roughness={0.6} />
            </mesh>
            
            {/* Foot sensors */}
            <mesh position={[1.1, -0.45 + legWalk * 0.5, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.01, 0.01, 0.02, 8]} />
              <meshStandardMaterial 
                color="#F59E0B" 
                emissive="#F59E0B" 
                emissiveIntensity={0.5} 
              />
            </mesh>
            
            {/* Hydraulic pistons */}
            <mesh 
              position={[0.75, 0.05 + legWalk * 0.3, 0]} 
              rotation={[0, 0, Math.PI/8]}
              castShadow 
              receiveShadow
            >
              <cylinderGeometry args={[0.015, 0.015, 0.3, 6]} />
              <meshStandardMaterial color="#374151" />
            </mesh>
          </group>
        );
      })}
      
      {/* Head section */}
      <mesh position={[0, 0.6, 0.4]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.2, 0.2]} />
        <meshStandardMaterial color="#A855F7" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Multiple eyes with different sizes */}
      {[
        { pos: [-0.12, 0.7, 0.48], size: 0.08 },
        { pos: [0.12, 0.7, 0.48], size: 0.08 },
        { pos: [-0.08, 0.65, 0.5], size: 0.05 },
        { pos: [0.08, 0.65, 0.5], size: 0.05 },
        { pos: [-0.04, 0.75, 0.49], size: 0.04 },
        { pos: [0.04, 0.75, 0.49], size: 0.04 },
        { pos: [0, 0.72, 0.51], size: 0.06 },
        { pos: [0, 0.68, 0.52], size: 0.03 }
      ].map((eye, index) => (
        <mesh key={index} position={eye.pos as [number, number, number]} castShadow receiveShadow>
          <sphereGeometry args={[eye.size, 12, 12]} />
          <meshStandardMaterial 
            color="#EF4444" 
            emissive="#EF4444" 
            emissiveIntensity={0.7} 
            metalness={0.1}
            roughness={0.1}
          />
        </mesh>
      ))}
      
      {/* Chelicerae (fangs) */}
      <mesh position={[-0.08, 0.55, 0.52]} rotation={[Math.PI/6, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.01, 0.02, 0.08, 6]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>
      <mesh position={[0.08, 0.55, 0.52]} rotation={[Math.PI/6, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.01, 0.02, 0.08, 6]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>
      
      {/* Pedipalps */}
      <mesh position={[-0.15, 0.6, 0.45]} castShadow receiveShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
        <meshStandardMaterial color="#5B21B6" />
      </mesh>
      <mesh position={[0.15, 0.6, 0.45]} castShadow receiveShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.12, 8]} />
        <meshStandardMaterial color="#5B21B6" />
      </mesh>
      
      {/* Abdomen pattern */}
      <mesh position={[0, 0.45, -0.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.1, 0.05, 8]} />
        <meshStandardMaterial 
          color="#FCD34D" 
          emissive="#FCD34D" 
          emissiveIntensity={0.2} 
        />
      </mesh>
      
      {/* Spinning organs */}
      <mesh position={[0, 0.25, -0.45]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.03, 8]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      
      {/* Sensor array on back */}
      <group position={[0, 0.55, 0]} rotation={[0, sensorRotation * 0.3, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 8]} />
          <meshStandardMaterial 
            color="#DC2626" 
            metalness={0.8} 
            roughness={0.2} 
          />
        </mesh>
        
        {/* Sensor elements */}
        {[0, Math.PI/2, Math.PI, 3*Math.PI/2].map((angle, index) => (
          <mesh key={index} position={[Math.cos(angle) * 0.06, 0.03, Math.sin(angle) * 0.06]} castShadow receiveShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.01, 8]} />
            <meshStandardMaterial 
              color="#22C55E" 
              emissive="#22C55E" 
              emissiveIntensity={0.8} 
            />
          </mesh>
        ))}
      </group>
    </group>
  );
};

// Enhanced Tank Robot Component with complete details
const EnhancedTankRobot: React.FC<{ wheelRotation: number; sensorRotation: number }> = ({ 
  wheelRotation, 
  sensorRotation 
}) => {
  return (
    <group>
      {/* Main hull */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.4, 3]} />
        <meshStandardMaterial 
          color="#15803D" 
          metalness={0.7} 
          roughness={0.3} 
        />
      </mesh>
      
      {/* Hull reinforcement plates */}
      <mesh position={[0, 0.51, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.02, 2.8]} />
        <meshStandardMaterial color="#166534" />
      </mesh>
      <mesh position={[0, 0.09, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.02, 2.8]} />
        <meshStandardMaterial color="#166534" />
      </mesh>
      
      {/* Front armor sloping */}
      <mesh position={[0, 0.4, 1.6]} rotation={[Math.PI/6, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.3, 0.2]} />
        <meshStandardMaterial color="#14532D" />
      </mesh>
      
      {/* Rear armor */}
      <mesh position={[0, 0.35, -1.6]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.3, 0.2]} />
        <meshStandardMaterial color="#14532D" />
      </mesh>
      
      {/* Side skirts */}
      <mesh position={[-1.1, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.25, 3.2]} />
        <meshStandardMaterial color="#052E16" />
      </mesh>
      <mesh position={[1.1, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.05, 0.25, 3.2]} />
        <meshStandardMaterial color="#052E16" />
      </mesh>
      
      {/* Turret base */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.8, 0.4, 16]} />
        <meshStandardMaterial 
          color="#166534" 
          metalness={0.8} 
          roughness={0.2} 
        />
      </mesh>
      
      {/* Turret armor */}
      <mesh position={[0, 0.75, 0.2]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.3, 0.8]} />
        <meshStandardMaterial color="#15803D" />
      </mesh>
      
      {/* Commander's cupola */}
      <mesh position={[0.3, 0.95, -0.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.1, 12]} />
        <meshStandardMaterial color="#14532D" />
      </mesh>
      
      {/* Periscopes */}
      {[-0.1, 0, 0.1].map((x, index) => (
        <mesh key={index} position={[x, 0.98, 0.1]} castShadow receiveShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.05, 8]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
      ))}
      
      {/* Tank tracks with enhanced detail */}
      {[-1.2, 1.2].map((x, index) => (
        <group key={index}>
          {/* Track housing */}
          <mesh position={[x, 0.15, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.3, 0.3, 3.2]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          
          {/* Track links */}
          {Array.from({length: 16}, (_, i) => {
            const z = -1.6 + (i * 0.2);
            return (
              <mesh key={i} position={[x, 0.05, z]} castShadow receiveShadow>
                <boxGeometry args={[0.35, 0.05, 0.15]} />
                <meshStandardMaterial color="#1E293B" />
              </mesh>
            );
          })}
          
          {/* Road wheels */}
          {[-1.4, -0.7, 0, 0.7, 1.4].map((z, wheelIndex) => (
            <mesh 
              key={wheelIndex}
              position={[x, 0.15, z]} 
              rotation={[wheelRotation, 0, 0]}
              castShadow 
              receiveShadow
            >
              <cylinderGeometry args={[0.15, 0.15, 0.2, 8]} />
              <meshStandardMaterial color="#1E293B" />
            </mesh>
          ))}
          
          {/* Drive sprocket */}
          <mesh position={[x, 0.2, 1.6]} rotation={[wheelRotation, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.15, 12]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
          
          {/* Idler wheel */}
          <mesh position={[x, 0.25, -1.6]} rotation={[wheelRotation, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.18, 0.18, 0.15, 12]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
          
          {/* Support rollers */}
          {[-0.8, 0, 0.8].map((z, rollerIndex) => (
            <mesh key={rollerIndex} position={[x, 0.35, z]} rotation={[wheelRotation * 0.5, 0, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.05, 0.05, 0.15, 8]} />
              <meshStandardMaterial color="#6B7280" />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Main gun */}
      <mesh position={[0, 0.7, 1.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.12, 2, 16]} />
        <meshStandardMaterial 
          color="#374151" 
          metalness={0.9} 
          roughness={0.1} 
        />
      </mesh>
      
      {/* Gun mantlet */}
      <mesh position={[0, 0.7, 0.6]} castShadow receiveShadow>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial color="#14532D" />
      </mesh>
      
      {/* Muzzle brake */}
      <mesh position={[0, 0.7, 2.45]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.08, 0.1, 12]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>
      
      {/* Coaxial machine gun */}
      <mesh position={[0.15, 0.68, 1.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* External fuel tanks */}
      <mesh position={[-0.9, 0.45, -1.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 12]} />
        <meshStandardMaterial color="#7C2D12" />
      </mesh>
      <mesh position={[0.9, 0.45, -1.2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.1, 0.1, 0.5, 12]} />
        <meshStandardMaterial color="#7C2D12" />
      </mesh>
      
      {/* Spare parts boxes */}
      <mesh position={[-0.6, 0.55, -1.3]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.15, 0.2]} />
        <meshStandardMaterial color="#92400E" />
      </mesh>
      <mesh position={[0.6, 0.55, -1.3]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.15, 0.2]} />
        <meshStandardMaterial color="#92400E" />
      </mesh>
      
      {/* Communication equipment */}
      <mesh position={[0, 0.95, -0.4]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.1, 0.15]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>
      
      {/* Rotating radar/sensor array */}
      <group position={[0, 1.2, -0.5]} rotation={[0, sensorRotation * 0.5, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.3, 0.15, 0.3]} />
          <meshStandardMaterial 
            color="#F59E0B" 
            metalness={0.8} 
            roughness={0.2} 
          />
        </mesh>
        
        {/* Radar dish */}
        <mesh position={[0, 0.1, 0]} rotation={[Math.PI/6, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.12, 0.1, 0.02, 16]} />
          <meshStandardMaterial color="#EAB308" />
        </mesh>
        
        {/* Sensor arrays */}
        {[-0.1, 0.1].map((x, index) => (
          <mesh key={index} position={[x, 0, 0.16]} castShadow receiveShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.05, 8]} />
            <meshStandardMaterial 
              color="#DC2626" 
              emissive="#DC2626" 
              emissiveIntensity={0.6} 
            />
          </mesh>
        ))}
      </group>
      
      {/* Exhaust pipes */}
      <mesh position={[-0.8, 0.4, -1.4]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>
      <mesh position={[0.8, 0.4, -1.4]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.3, 8]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>
      
      {/* Warning lights */}
      {[
        [-0.9, 0.6, 1.4],
        [0.9, 0.6, 1.4],
        [-0.9, 0.6, -1.4],
        [0.9, 0.6, -1.4]
      ].map((pos, index) => (
        <mesh key={index} position={pos as [number, number, number]} castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
          <meshStandardMaterial 
            color="#F59E0B" 
            emissive="#F59E0B" 
            emissiveIntensity={0.5} 
          />
        </mesh>
      ))}
    </group>
  );
};

// Enhanced Humanoid Robot Component with complete details and gesture system
const EnhancedHumanoidRobot: React.FC<{ wheelRotation: number; sensorRotation: number }> = ({ 
  wheelRotation, 
  sensorRotation 
}) => {
  const walkCycle = Math.sin(wheelRotation * 2) * 0.3;
  const armCycle = Math.cos(wheelRotation * 1.5) * 0.2;
  
  return (
    <group>
      {/* Enhanced torso with details */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.8, 0.3]} />
        <meshStandardMaterial 
          color="#E5E7EB" 
          metalness={0.8} 
          roughness={0.2} 
        />
      </mesh>
      
      {/* Torso panel lines */}
      <mesh position={[0, 1.2, 0.16]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 0.7, 0.01]} />
        <meshStandardMaterial color="#D1D5DB" />
      </mesh>
      
      {/* Shoulder joints */}
      <mesh position={[-0.35, 1.5, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#9CA3AF" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0.35, 1.5, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#9CA3AF" metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Enhanced head with more detail */}
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.4, 0.3]} />
        <meshStandardMaterial 
          color="#F3F4F6" 
          metalness={0.7} 
          roughness={0.3} 
        />
      </mesh>
      
      {/* Head details */}
      <mesh position={[0, 1.85, 0.16]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 0.35, 0.01]} />
        <meshStandardMaterial color="#E5E7EB" />
      </mesh>
      
      {/* Face display with enhanced detail */}
      <mesh position={[0, 1.8, 0.16]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 0.25, 0.02]} />
        <meshStandardMaterial 
          color="#1E40AF" 
          emissive="#1E40AF" 
          emissiveIntensity={0.3} 
        />
      </mesh>
      
      {/* Enhanced eyes with pupils */}
      {[-0.08, 0.08].map((x, index) => (
        <group key={index}>
          <mesh position={[x, 1.85, 0.17]} castShadow receiveShadow>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshStandardMaterial 
              color="#22C55E" 
              emissive="#22C55E" 
              emissiveIntensity={0.8} 
            />
          </mesh>
          <mesh position={[x, 1.85, 0.18]} castShadow receiveShadow>
            <sphereGeometry args={[0.015, 8, 8]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </group>
      ))}
      
      {/* Mouth/speaker grille */}
      <mesh position={[0, 1.75, 0.17]} castShadow receiveShadow>
        <boxGeometry args={[0.15, 0.03, 0.01]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      
      {/* Speaker holes */}
      {[-0.05, -0.025, 0, 0.025, 0.05].map((x, index) => (
        <mesh key={index} position={[x, 1.75, 0.175]} castShadow receiveShadow>
          <cylinderGeometry args={[0.005, 0.005, 0.005, 6]} />
          <meshStandardMaterial color="#1F2937" />
        </mesh>
      ))}
      
      {/* Neck joint */}
      <mesh position={[0, 1.6, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.1, 12]} />
        <meshStandardMaterial color="#9CA3AF" />
      </mesh>
      
      {/* Enhanced arms with gesture capability */}
      {[-0.45, 0.45].map((x, index) => {
        const armWave = index === 0 ? armCycle : -armCycle;
        return (
          <group key={index}>
            {/* Upper arm */}
            <mesh 
              position={[x, 1.3, 0]} 
              rotation={[armWave * 0.5, 0, armWave * 0.3]}
              castShadow 
              receiveShadow
            >
              <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
              <meshStandardMaterial color="#D1D5DB" metalness={0.6} roughness={0.4} />
            </mesh>
            
            {/* Elbow joint */}
            <mesh position={[x, 1.0, armWave * 0.1]} castShadow receiveShadow>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial color="#9CA3AF" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Forearm */}
            <mesh 
              position={[x, 0.7, armWave * 0.15]} 
              rotation={[armWave * 0.3, 0, 0]}
              castShadow 
              receiveShadow
            >
              <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
              <meshStandardMaterial color="#9CA3AF" metalness={0.7} roughness={0.3} />
            </mesh>
            
            {/* Wrist */}
            <mesh position={[x, 0.5, armWave * 0.2]} castShadow receiveShadow>
              <sphereGeometry args={[0.05, 10, 10]} />
              <meshStandardMaterial color="#6B7280" />
            </mesh>
            
            {/* Enhanced hand */}
            <mesh 
              position={[x, 0.45, armWave * 0.25]} 
              rotation={[0, armWave * 0.5, 0]}
              castShadow 
              receiveShadow
            >
              <boxGeometry args={[0.08, 0.12, 0.06]} />
              <meshStandardMaterial color="#6B7280" metalness={0.5} roughness={0.5} />
            </mesh>
            
            {/* Fingers */}
            {[-0.02, -0.007, 0.007, 0.02].map((fingerX, fingerIndex) => (
              <mesh 
                key={fingerIndex}
                position={[x + fingerX, 0.38, armWave * 0.25]} 
                rotation={[armWave * 0.2, 0, 0]}
                castShadow 
                receiveShadow
              >
                <cylinderGeometry args={[0.008, 0.008, 0.06, 8]} />
                <meshStandardMaterial color="#374151" />
              </mesh>
            ))}
            
            {/* Thumb */}
            <mesh 
              position={[x + (index === 0 ? -0.05 : 0.05), 0.42, armWave * 0.25]} 
              rotation={[0, (index === 0 ? -1 : 1) * Math.PI/4, armWave * 0.1]}
              castShadow 
              receiveShadow
            >
              <cylinderGeometry args={[0.01, 0.01, 0.05, 8]} />
              <meshStandardMaterial color="#374151" />
            </mesh>
            
            {/* Arm cables/conduits */}
            <mesh position={[x * 0.8, 1.15, 0.05]} castShadow receiveShadow>
              <cylinderGeometry args={[0.01, 0.01, 0.4, 6]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            <mesh position={[x * 0.8, 0.85, armWave * 0.05]} castShadow receiveShadow>
              <cylinderGeometry args={[0.008, 0.008, 0.3, 6]} />
              <meshStandardMaterial color="#1F2937" />
            </mesh>
          </group>
        );
      })}
      
      {/* Enhanced legs with walking animation */}
      {[-0.15, 0.15].map((x, index) => {
        const legOffset = index === 0 ? walkCycle : -walkCycle;
        
        return (
          <group key={index}>
            {/* Hip joint */}
            <mesh position={[x, 0.9, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.07, 12, 12]} />
              <meshStandardMaterial color="#9CA3AF" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Upper leg/thigh */}
            <mesh 
              position={[x, 0.6, legOffset * 0.1]} 
              rotation={[legOffset * 0.5, 0, 0]}
              castShadow 
              receiveShadow
            >
              <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
              <meshStandardMaterial color="#D1D5DB" metalness={0.6} roughness={0.4} />
            </mesh>
            
            {/* Knee joint */}
            <mesh position={[x, 0.3, legOffset * 0.15]} castShadow receiveShadow>
              <sphereGeometry args={[0.06, 12, 12]} />
              <meshStandardMaterial color="#9CA3AF" metalness={0.8} roughness={0.2} />
            </mesh>
            
            {/* Lower leg/shin */}
            <mesh 
              position={[x, 0.25, legOffset * 0.15]} 
              rotation={[Math.abs(legOffset) * 0.8, 0, 0]}
              castShadow 
              receiveShadow
            >
              <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
              <meshStandardMaterial color="#9CA3AF" metalness={0.7} roughness={0.3} />
            </mesh>
            
            {/* Ankle joint */}
            <mesh position={[x, 0.08, 0.05 + legOffset * 0.15]} castShadow receiveShadow>
              <sphereGeometry args={[0.04, 10, 10]} />
              <meshStandardMaterial color="#6B7280" />
            </mesh>
            
            {/* Enhanced foot */}
            <mesh position={[x, 0.05, 0.1 + legOffset * 0.2]} castShadow receiveShadow>
              <boxGeometry args={[0.12, 0.06, 0.25]} />
              <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.6} />
            </mesh>
            
            {/* Foot sensors */}
            {[-0.04, 0, 0.04].map((sensorX, sensorIndex) => (
              <mesh key={sensorIndex} position={[x + sensorX, 0.02, 0.18 + legOffset * 0.2]} castShadow receiveShadow>
                <cylinderGeometry args={[0.008, 0.008, 0.01, 8]} />
                <meshStandardMaterial 
                  color="#F59E0B" 
                  emissive="#F59E0B" 
                  emissiveIntensity={0.5} 
                />
              </mesh>
            ))}
            
            {/* Leg hydraulics */}
            <mesh 
              position={[x * 0.7, 0.45, legOffset * 0.05]} 
              rotation={[legOffset * 0.3, 0, 0]}
              castShadow 
              receiveShadow
            >
              <cylinderGeometry args={[0.02, 0.02, 0.35, 8]} />
              <meshStandardMaterial color="#374151" />
            </mesh>
          </group>
        );
      })}
      
      {/* Enhanced chest panel with more detail */}
      <mesh position={[0, 1.3, 0.16]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.3, 0.02]} />
        <meshStandardMaterial 
          color="#1F2937" 
          metalness={0.9} 
          roughness={0.1} 
        />
      </mesh>
      
      {/* Chest display screen */}
      <mesh position={[0, 1.35, 0.17]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 0.15, 0.005]} />
        <meshStandardMaterial 
          color="#0F172A" 
          emissive="#1E40AF" 
          emissiveIntensity={0.2} 
        />
      </mesh>
      
      {/* Status indicators on chest */}
      {[-0.1, -0.05, 0, 0.05, 0.1].map((x, index) => (
        <mesh key={index} position={[x, 1.4, 0.17]} castShadow receiveShadow>
          <cylinderGeometry args={[0.008, 0.008, 0.008, 8]} />
          <meshStandardMaterial 
            color={index === 2 ? "#22C55E" : index % 2 === 0 ? "#EF4444" : "#F59E0B"} 
            emissive={index === 2 ? "#22C55E" : index % 2 === 0 ? "#EF4444" : "#F59E0B"} 
            emissiveIntensity={0.7} 
          />
        </mesh>
      ))}
      
      {/* Power indicator */}
      <mesh position={[0, 1.25, 0.17]} castShadow receiveShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.01, 8]} />
        <meshStandardMaterial 
          color="#22C55E" 
          emissive="#22C55E" 
          emissiveIntensity={0.8} 
        />
      </mesh>
      
      {/* Ventilation grilles */}
      {[0.15, -0.15].map((x, index) => (
        <mesh key={index} position={[x, 1.1, 0.16]} castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.2, 0.01]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
      ))}
      
      {/* Ventilation slots */}
      {[0.15, -0.15].map((x, index) => (
        <group key={index}>
          {[-0.05, -0.025, 0, 0.025, 0.05].map((slotY, slotIndex) => (
            <mesh key={slotIndex} position={[x, 1.1 + slotY, 0.165]} castShadow receiveShadow>
              <boxGeometry args={[0.06, 0.008, 0.005]} />
              <meshStandardMaterial color="#1F2937" />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Back power pack */}
      <mesh position={[0, 1.2, -0.2]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.5, 0.15]} />
        <meshStandardMaterial color="#374151" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Power cables */}
      <mesh position={[0.1, 1.3, -0.18]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[-0.1, 1.3, -0.18]} castShadow receiveShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
        <meshStandardMaterial color="#DC2626" />
      </mesh>
      
      {/* Cooling fans */}
      {[0.08, -0.08].map((x, index) => (
        <group key={index} position={[x, 1.35, -0.27]} rotation={[0, 0, sensorRotation * (index === 0 ? 1 : -1)]}>
          <mesh castShadow receiveShadow>
            <cylinderGeometry args={[0.04, 0.04, 0.01, 8]} />
            <meshStandardMaterial color="#6B7280" />
          </mesh>
          {[0, Math.PI/2, Math.PI, 3*Math.PI/2].map((angle, bladeIndex) => (
            <mesh key={bladeIndex} position={[Math.cos(angle) * 0.025, Math.sin(angle) * 0.025, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.02, 0.008, 0.005]} />
              <meshStandardMaterial color="#9CA3AF" />
            </mesh>
          ))}
        </group>
      ))}
      
      {/* Rotating sensor on head */}
      <group position={[0, 2.05, 0]} rotation={[0, sensorRotation, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.03, 16]} />
          <meshStandardMaterial 
            color="#DC2626" 
            metalness={0.8} 
            roughness={0.2} 
          />
        </mesh>
        
        {/* Sensor array */}
        {[0, Math.PI/2, Math.PI, 3*Math.PI/2].map((angle, index) => (
          <mesh key={index} position={[Math.cos(angle) * 0.04, 0, Math.sin(angle) * 0.04]} castShadow receiveShadow>
            <cylinderGeometry args={[0.005, 0.005, 0.02, 6]} />
            <meshStandardMaterial 
              color="#22C55E" 
              emissive="#22C55E" 
              emissiveIntensity={0.7} 
            />
          </mesh>
        ))}
      </group>
      
      {/* Communication antenna */}
      <mesh position={[-0.15, 2.1, -0.1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.005, 0.005, 0.2, 8]} />
        <meshStandardMaterial color="#6B7280" />
      </mesh>
      <mesh position={[-0.15, 2.2, -0.1]} castShadow receiveShadow>
        <sphereGeometry args={[0.01, 8, 8]} />
        <meshStandardMaterial 
          color="#3B82F6" 
          emissive="#3B82F6" 
          emissiveIntensity={0.6} 
        />
      </mesh>
      
      {/* Emergency stop button */}
      <mesh position={[0.25, 1.4, 0.17]} castShadow receiveShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.01, 12]} />
        <meshStandardMaterial 
          color="#DC2626" 
          emissive="#DC2626" 
          emissiveIntensity={0.4} 
        />
      </mesh>
      
      {/* Name plate */}
      <mesh position={[0, 0.9, 0.16]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.05, 0.005]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>
      
      {/* Hip actuators */}
      {[-0.15, 0.15].map((x, index) => (
        <mesh key={index} position={[x, 0.75, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.15, 8]} />
          <meshStandardMaterial color="#374151" />
        </mesh>
      ))}
    </group>
  );
};

export default RobotModel;
