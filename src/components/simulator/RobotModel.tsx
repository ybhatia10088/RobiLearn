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
                   robotConfig.type === 'tank' ? 15 : 12;
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
        return <EnhancedRobotDrone wheelRotation={wheelRotation} />;
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

// Enhanced Mobile Robot Component
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
      
      {/* Upper housing */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.4, 1.6]} />
        <meshStandardMaterial 
          color="#38BDF8" 
          metalness={0.4} 
          roughness={0.4} 
        />
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
      
      {/* Wheels with rotation */}
      {[
        [-0.8, 0.25, -0.7],
        [0.8, 0.25, -0.7],
        [-0.8, 0.25, 0.7],
        [0.8, 0.25, 0.7]
      ].map((position, index) => (
        <group key={index}>
          <mesh position={position as [number, number, number]} rotation={[wheelRotation, 0, Math.PI / 2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
            <meshStandardMaterial color="#1E293B" metalness={0.2} roughness={0.8} />
          </mesh>
          <mesh position={position as [number, number, number]} rotation={[wheelRotation, 0, Math.PI / 2]} castShadow receiveShadow>
            <torusGeometry args={[0.25, 0.03, 8, 16]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
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
        <mesh position={[0.08, 0, 0.1]} castShadow receiveShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.05, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[-0.08, 0, 0.1]} castShadow receiveShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.05, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>
    </group>
  );
};

// Enhanced Robot Arm Component (Fixed - Only Base and Wrist movement)
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
      {/* Base platform */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 1, 16]} />
        <meshStandardMaterial 
          color="#1E40AF" 
          metalness={0.7} 
          roughness={0.3} 
        />
      </mesh>
      
      {/* Rotating base */}
      <group rotation={[0, jointAngles.base, 0]}>
        {/* Lower arm (fixed) */}
        <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.22, 1.5, 16]} />
          <meshStandardMaterial 
            color="#3B82F6" 
            metalness={0.8} 
            roughness={0.2} 
          />
        </mesh>
        
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
          
          {/* Gripper */}
          <mesh position={[0, 0, 0.1]} castShadow receiveShadow>
            <boxGeometry args={[0.2, 0.15, 0.1]} />
            <meshStandardMaterial color="#991B1B" />
          </mesh>
          
          <mesh position={[gripperOpen, 0, 0.18]} castShadow receiveShadow>
            <boxGeometry args={[0.04, 0.25, 0.08]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
          <mesh position={[-gripperOpen, 0, 0.18]} castShadow receiveShadow>
            <boxGeometry args={[0.04, 0.25, 0.08]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
        </group>
      </group>
    </group>
  );
};

// Enhanced Drone Component
const EnhancedRobotDrone: React.FC<{ wheelRotation: number }> = ({ wheelRotation }) => {
  return (
    <group position={[0, 2, 0]}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.15, 0.6]} />
        <meshStandardMaterial 
          color="#F97316" 
          metalness={0.8} 
          roughness={0.2} 
        />
      </mesh>
      
      {/* Propellers */}
      {[
        { pos: [-0.5, 0, -0.5], rot: 1 },
        { pos: [0.5, 0, -0.5], rot: -1 },
        { pos: [-0.5, 0, 0.5], rot: -1 },
        { pos: [0.5, 0, 0.5], rot: 1 }
      ].map((config, index) => (
        <group key={index}>
          <mesh position={config.pos as [number, number, number]} castShadow receiveShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.08, 16]} />
            <meshStandardMaterial 
              color="#1F2937" 
              metalness={0.9} 
              roughness={0.1} 
            />
          </mesh>
          
          <group 
            position={config.pos as [number, number, number]} 
            rotation={[0, wheelRotation * config.rot * 2, 0]}
          >
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
        </group>
      ))}
    </group>
  );
};

// Enhanced Spider Robot Component
const EnhancedSpiderRobot: React.FC<{ wheelRotation: number; sensorRotation: number }> = ({ 
  wheelRotation, 
  sensorRotation 
}) => {
  return (
    <group>
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial 
          color="#8B5CF6" 
          metalness={0.7} 
          roughness={0.3} 
        />
      </mesh>
      
      {/* Six legs with walking animation */}
      {[0, 1, 2, 3, 4, 5].map((legIndex) => {
        const angle = (legIndex * Math.PI * 2) / 6;
        const legWalk = Math.sin(wheelRotation + legIndex * 1.2) * 0.2;
        
        return (
          <group key={legIndex} rotation={[0, angle, 0]}>
            <mesh 
              position={[0.6, 0.2 + legWalk, 0]} 
              rotation={[0, 0, Math.PI / 6 + legWalk]}
              castShadow 
              receiveShadow
            >
              <cylinderGeometry args={[0.03, 0.05, 0.6, 8]} />
              <meshStandardMaterial color="#7C3AED" />
            </mesh>
            
            <mesh 
              position={[0.9, -0.1 + legWalk, 0]} 
              rotation={[0, 0, -Math.PI / 4]}
              castShadow 
              receiveShadow
            >
              <cylinderGeometry args={[0.02, 0.03, 0.5, 8]} />
              <meshStandardMaterial color="#6D28D9" />
            </mesh>
            
            <mesh position={[1.1, -0.4 + legWalk * 0.5, 0]} castShadow receiveShadow>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial color="#4C1D95" />
            </mesh>
          </group>
        );
      })}
      
      {/* Eyes */}
      {[-0.15, 0.15].map((x, index) => (
        <mesh key={index} position={[x, 0.7, 0.4]} castShadow receiveShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial 
            color="#EF4444" 
            emissive="#EF4444" 
            emissiveIntensity={0.5} 
          />
        </mesh>
      ))}
    </group>
  );
};

// Enhanced Tank Robot Component
const EnhancedTankRobot: React.FC<{ wheelRotation: number; sensorRotation: number }> = ({ 
  wheelRotation, 
  sensorRotation 
}) => {
  return (
    <group>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.4, 3]} />
        <meshStandardMaterial 
          color="#15803D" 
          metalness={0.7} 
          roughness={0.3} 
        />
      </mesh>
      
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.8, 0.4, 16]} />
        <meshStandardMaterial 
          color="#166534" 
          metalness={0.8} 
          roughness={0.2} 
        />
      </mesh>
      
      {/* Tank tracks */}
      {[-1.2, 1.2].map((x, index) => (
        <group key={index}>
          <mesh position={[x, 0.15, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.3, 0.3, 3.2]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
          
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
        </group>
      ))}
      
      <mesh position={[0, 0.7, 1.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.08, 0.12, 2, 16]} />
        <meshStandardMaterial 
          color="#374151" 
          metalness={0.9} 
          roughness={0.1} 
        />
      </mesh>
      
      {/* Rotating radar */}
      <group position={[0, 1.2, -0.5]} rotation={[0, sensorRotation * 0.5, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.3, 0.15, 0.3]} />
          <meshStandardMaterial 
            color="#F59E0B" 
            metalness={0.8} 
            roughness={0.2} 
          />
        </mesh>
      </group>
    </group>
  );
};

// Enhanced Humanoid Robot Component
const EnhancedHumanoidRobot: React.FC<{ wheelRotation: number; sensorRotation: number }> = ({ 
  wheelRotation, 
  sensorRotation 
}) => {
  const walkCycle = Math.sin(wheelRotation * 2) * 0.3;
  
  return (
    <group>
      {/* Torso */}
      <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.8, 0.3]} />
        <meshStandardMaterial 
          color="#E5E7EB" 
          metalness={0.8} 
          roughness={0.2} 
        />
      </mesh>
      
      {/* Head */}
      <mesh position={[0, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.4, 0.3]} />
        <meshStandardMaterial 
          color="#F3F4F6" 
          metalness={0.7} 
          roughness={0.3} 
        />
      </mesh>
      
      {/* Face display */}
      <mesh position={[0, 1.8, 0.16]} castShadow receiveShadow>
        <boxGeometry args={[0.35, 0.25, 0.02]} />
        <meshStandardMaterial 
          color="#1E40AF" 
          emissive="#1E40AF" 
          emissiveIntensity={0.3} 
        />
      </mesh>
      
      {/* Eyes */}
      {[-0.08, 0.08].map((x, index) => (
        <mesh key={index} position={[x, 1.85, 0.17]} castShadow receiveShadow>
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshStandardMaterial 
            color="#22C55E" 
            emissive="#22C55E" 
            emissiveIntensity={0.8} 
          />
        </mesh>
      ))}
      
      {/* Arms */}
      {[-0.45, 0.45].map((x, index) => (
        <group key={index}>
          <mesh position={[x, 1.3, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.5, 16]} />
            <meshStandardMaterial color="#D1D5DB" />
          </mesh>
          
          <mesh position={[x, 0.7, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
            <meshStandardMaterial color="#9CA3AF" />
          </mesh>
          
          <mesh position={[x, 0.45, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.12, 0.06]} />
            <meshStandardMaterial color="#6B7280" />
          </mesh>
        </group>
      ))}
      
      {/* Legs with walking animation */}
      {[-0.15, 0.15].map((x, index) => {
        const legOffset = index === 0 ? walkCycle : -walkCycle;
        
        return (
          <group key={index}>
            <mesh 
              position={[x, 0.6, legOffset * 0.1]} 
              rotation={[legOffset * 0.5, 0, 0]}
              castShadow 
              receiveShadow
            >
              <cylinderGeometry args={[0.08, 0.08, 0.6, 16]} />
              <meshStandardMaterial color="#D1D5DB" />
            </mesh>
            
            <mesh 
              position={[x, 0.25, legOffset * 0.15]} 
              rotation={[Math.abs(legOffset) * 0.8, 0, 0]}
              castShadow 
              receiveShadow
            >
              <cylinderGeometry args={[0.06, 0.06, 0.4, 16]} />
              <meshStandardMaterial color="#9CA3AF" />
            </mesh>
            
            <mesh position={[x, 0.05, 0.1 + legOffset * 0.2]} castShadow receiveShadow>
              <boxGeometry args={[0.12, 0.06, 0.25]} />
              <meshStandardMaterial color="#374151" />
            </mesh>
          </group>
        );
      })}
      
      {/* Chest panel */}
      <mesh position={[0, 1.3, 0.16]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.3, 0.02]} />
        <meshStandardMaterial 
          color="#1F2937" 
          metalness={0.9} 
          roughness={0.1} 
        />
      </mesh>
      
      {/* Status indicators */}
      {[-0.1, 0, 0.1].map((x, index) => (
        <mesh key={index} position={[x, 1.4, 0.17]} castShadow receiveShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.01, 8]} />
          <meshStandardMaterial 
            color={index === 1 ? "#22C55E" : "#EF4444"} 
            emissive={index === 1 ? "#22C55E" : "#EF4444"} 
            emissiveIntensity={0.5} 
          />
        </mesh>
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
      </group>
    </group>
  );
};

export default RobotModel;
