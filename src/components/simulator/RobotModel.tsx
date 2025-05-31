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
  const { robotState } = useRobotStore();
  const [wheelRotation, setWheelRotation] = useState(0);
  const [sensorRotation, setSensorRotation] = useState(0);

  useEffect(() => {
    if (groupRef.current && robotState) {
      groupRef.current.position.set(
        robotState.position.x,
        robotState.position.y,
        robotState.position.z
      );
      
      groupRef.current.rotation.y = robotState.rotation.y;
    }
  }, [robotState]);

  useFrame((state, delta) => {
    if (robotState?.isMoving) {
      setWheelRotation(prev => prev + delta * 8);
    }
    setSensorRotation(prev => prev + delta * 1.5);
  });

  return (
    <group ref={groupRef}>
      {robotConfig.type === 'arm' ? (
        <EnhancedRobotArm sensorRotation={sensorRotation} />
      ) : robotConfig.type === 'drone' ? (
        <EnhancedRobotDrone wheelRotation={wheelRotation} />
      ) : (
        <EnhancedRobotMobile wheelRotation={wheelRotation} sensorRotation={sensorRotation} />
      )}
    </group>
  );
};

const EnhancedRobotMobile: React.FC<{ wheelRotation: number; sensorRotation: number }> = ({ 
  wheelRotation, 
  sensorRotation 
}) => {
  return (
    <group>
      {/* Main chassis with better materials */}
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
      
      {/* Wheels with animated rotation */}
      <mesh position={[-0.8, 0.25, -0.7]} rotation={[wheelRotation, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
        <meshStandardMaterial color="#1E293B" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0.8, 0.25, -0.7]} rotation={[wheelRotation, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
        <meshStandardMaterial color="#1E293B" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[-0.8, 0.25, 0.7]} rotation={[wheelRotation, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
        <meshStandardMaterial color="#1E293B" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0.8, 0.25, 0.7]} rotation={[wheelRotation, 0, Math.PI / 2]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
        <meshStandardMaterial color="#1E293B" metalness={0.2} roughness={0.8} />
      </mesh>
      
      {/* Wheel treads */}
      <mesh position={[-0.8, 0.25, -0.7]} rotation={[wheelRotation, 0, Math.PI / 2]} castShadow receiveShadow>
        <torusGeometry args={[0.25, 0.03, 8, 16]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>
      <mesh position={[0.8, 0.25, -0.7]} rotation={[wheelRotation, 0, Math.PI / 2]} castShadow receiveShadow>
        <torusGeometry args={[0.25, 0.03, 8, 16]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>
      <mesh position={[-0.8, 0.25, 0.7]} rotation={[wheelRotation, 0, Math.PI / 2]} castShadow receiveShadow>
        <torusGeometry args={[0.25, 0.03, 8, 16]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>
      <mesh position={[0.8, 0.25, 0.7]} rotation={[wheelRotation, 0, Math.PI / 2]} castShadow receiveShadow>
        <torusGeometry args={[0.25, 0.03, 8, 16]} />
        <meshStandardMaterial color="#0F172A" />
      </mesh>
      
      {/* Front bumper */}
      <mesh position={[0, 0.15, 1.1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.04, 0.04, 1.2, 8]} />
        <meshStandardMaterial color="#FCD34D" />
      </mesh>
      
      {/* Rotating ultrasonic sensor */}
      <group position={[0, 1.3, 0.6]} rotation={[0, sensorRotation * 0.3, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.12, 0.15, 0.25, 16]} />
          <meshStandardMaterial 
            color="#F97316" 
            metalness={0.8} 
            roughness={0.1} 
          />
        </mesh>
        {/* Sensor "eyes" */}
        <mesh position={[0.08, 0, 0.1]} castShadow receiveShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.05, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[-0.08, 0, 0.1]} castShadow receiveShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.05, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>
      
      {/* Camera */}
      <mesh position={[0, 0.9, 0.8]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.12, 0.08]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>
      
      {/* Camera lens */}
      <mesh position={[0, 0.9, 0.84]} castShadow receiveShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
        <meshStandardMaterial color="#1E3A8A" />
      </mesh>
      
      {/* Status LEDs */}
      <mesh position={[0.3, 0.8, 0.8]} castShadow receiveShadow>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial 
          color="#22C55E" 
          emissive="#22C55E" 
          emissiveIntensity={0.3} 
        />
      </mesh>
      <mesh position={[0.15, 0.8, 0.8]} castShadow receiveShadow>
        <sphereGeometry args={[0.025, 8, 8]} />
        <meshStandardMaterial 
          color="#EF4444" 
          emissive="#EF4444" 
          emissiveIntensity={0.1} 
        />
      </mesh>
      
      {/* Antenna */}
      <mesh position={[0, 1.5, -0.3]} castShadow receiveShadow>
        <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
        <meshStandardMaterial color="#6B7280" />
      </mesh>
      
      {/* Antenna tip */}
      <mesh position={[0, 1.65, -0.3]} castShadow receiveShadow>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial 
          color="#EF4444" 
          emissive="#EF4444" 
          emissiveIntensity={0.2} 
        />
      </mesh>
    </group>
  );
};

const EnhancedRobotArm: React.FC<{ sensorRotation: number }> = ({ sensorRotation }) => {
  const [jointAngles, setJointAngles] = useState({ base: 0, shoulder: 0, elbow: 0 });
  
  useFrame((state) => {
    setJointAngles({
      base: Math.sin(state.clock.elapsedTime * 0.3) * 0.1,
      shoulder: Math.sin(state.clock.elapsedTime * 0.4) * 0.2,
      elbow: Math.sin(state.clock.elapsedTime * 0.5) * 0.3
    });
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
      
      {/* Base joint indicators */}
      <mesh position={[0, 1.0, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.9, 0.05, 8, 16]} />
        <meshStandardMaterial color="#3B82F6" />
      </mesh>
      
      {/* Rotating base */}
      <group rotation={[0, jointAngles.base, 0]}>
        {/* Lower arm segment */}
        <mesh position={[0, 1.5, 0]} rotation={[0, 0, jointAngles.shoulder]} castShadow receiveShadow>
          <cylinderGeometry args={[0.18, 0.22, 1.5, 16]} />
          <meshStandardMaterial 
            color="#3B82F6" 
            metalness={0.8} 
            roughness={0.2} 
          />
        </mesh>
        
        {/* Joint connector */}
        <mesh position={[0, 2.25, 0]} rotation={[0, 0, jointAngles.shoulder]} castShadow receiveShadow>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial 
            color="#1D4ED8" 
            metalness={0.9} 
            roughness={0.1} 
          />
        </mesh>
        
        {/* Upper arm segment */}
        <group position={[0, 2.25, 0]} rotation={[0, 0, jointAngles.shoulder]}>
          <mesh position={[0, 0, 0.7]} rotation={[jointAngles.elbow, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.25, 0.35, 1.6]} />
            <meshStandardMaterial 
              color="#60A5FA" 
              metalness={0.6} 
              roughness={0.4} 
            />
          </mesh>
          
          {/* Elbow joint */}
          <mesh position={[0, 0, 1.5]} rotation={[jointAngles.elbow, 0, 0]} castShadow receiveShadow>
            <sphereGeometry args={[0.18, 16, 16]} />
            <meshStandardMaterial 
              color="#2563EB" 
              metalness={0.8} 
              roughness={0.2} 
            />
          </mesh>
          
          {/* End effector */}
          <group position={[0, 0, 1.8]} rotation={[jointAngles.elbow, 0, 0]}>
            {/* Wrist */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.15, 16]} />
              <meshStandardMaterial 
                color="#DC2626" 
                metalness={0.9} 
                roughness={0.1} 
              />
            </mesh>
            
            {/* Gripper base */}
            <mesh position={[0, 0, 0.1]} castShadow receiveShadow>
              <boxGeometry args={[0.2, 0.15, 0.1]} />
              <meshStandardMaterial color="#991B1B" />
            </mesh>
            
            {/* Gripper fingers */}
            <mesh position={[0.08, 0, 0.18]} castShadow receiveShadow>
              <boxGeometry args={[0.04, 0.25, 0.08]} />
              <meshStandardMaterial color="#374151" />
            </mesh>
            <mesh position={[-0.08, 0, 0.18]} castShadow receiveShadow>
              <boxGeometry args={[0.04, 0.25, 0.08]} />
              <meshStandardMaterial color="#374151" />
            </mesh>
            
            {/* Gripper tips */}
            <mesh position={[0.08, 0, 0.22]} castShadow receiveShadow>
              <boxGeometry args={[0.02, 0.08, 0.02]} />
              <meshStandardMaterial color="#FCD34D" />
            </mesh>
            <mesh position={[-0.08, 0, 0.22]} castShadow receiveShadow>
              <boxGeometry args={[0.02, 0.08, 0.02]} />
              <meshStandardMaterial color="#FCD34D" />
            </mesh>
          </group>
        </group>
      </group>
      
      {/* Control panel */}
      <mesh position={[1.2, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.4, 0.1]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>
      
      {/* Control buttons */}
      <mesh position={[1.25, 1.1, 0.06]} castShadow receiveShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
        <meshStandardMaterial 
          color="#22C55E" 
          emissive="#22C55E" 
          emissiveIntensity={0.2} 
        />
      </mesh>
      <mesh position={[1.25, 0.9, 0.06]} castShadow receiveShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 8]} />
        <meshStandardMaterial 
          color="#EF4444" 
          emissive="#EF4444" 
          emissiveIntensity={0.2} 
        />
      </mesh>
    </group>
  );
};

const EnhancedRobotDrone: React.FC<{ wheelRotation: number }> = ({ wheelRotation }) => {
  return (
    <group position={[0, 2, 0]}>
      {/* Main body frame */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.6, 0.15, 0.6]} />
        <meshStandardMaterial 
          color="#F97316" 
          metalness={0.8} 
          roughness={0.2} 
        />
      </mesh>
      
      {/* Body details */}
      <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.05, 0.4]} />
        <meshStandardMaterial color="#EA580C" />
      </mesh>
      
      {/* Arms and motors */}
      {[
        { pos: [-0.5, 0, -0.5], rot: 1 },
        { pos: [0.5, 0, -0.5], rot: -1 },
        { pos: [-0.5, 0, 0.5], rot: -1 },
        { pos: [0.5, 0, 0.5], rot: 1 }
      ].map((config, index) => (
        <group key={index}>
          {/* Arm */}
          <mesh 
            position={[config.pos[0] / 2, 0, config.pos[2] / 2]} 
            rotation={[0, Math.atan2(config.pos[2], config.pos[0]), 0]}
            castShadow 
            receiveShadow
          >
            <cylinderGeometry args={[0.015, 0.015, 0.7, 8]} />
            <meshStandardMaterial color="#DC2626" />
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
          
          {/* Propeller hub */}
          <mesh position={config.pos as [number, number, number]} castShadow receiveShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.01, 8]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
          
          {/* Spinning propeller blades */}
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
      
      {/* Camera gimbal */}
      <group position={[0, -0.15, 0]}>
        {/* Gimbal ring */}
        <mesh castShadow receiveShadow>
          <torusGeometry args={[0.1, 0.015, 8, 16]} />
          <meshStandardMaterial color="#6B7280" />
        </mesh>
        
        {/* Camera body */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.08, 0.06, 0.12]} />
          <meshStandardMaterial 
            color="#000000" 
            metalness={0.8} 
            roughness={0.2} 
          />
        </mesh>
        
        {/* Camera lens */}
        <mesh position={[0, 0, 0.08]} castShadow receiveShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.04, 16]} />
          <meshStandardMaterial color="#1E3A8A" />
        </mesh>
        
        {/* Lens glass */}
        <mesh position={[0, 0, 0.1]} castShadow receiveShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.01, 16]} />
          <meshStandardMaterial 
            color="#000040" 
            transparent 
            opacity={0.8} 
          />
        </mesh>
      </group>
      
      {/* Landing gear */}
      {[
        [-0.25, -0.15, -0.25],
        [0.25, -0.15, -0.25],
        [-0.25, -0.15, 0.25],
        [0.25, -0.15, 0.25]
      ].map((position, index) => (
        <group key={index}>
          {/* Landing leg */}
          <mesh position={position as [number, number, number]} castShadow receiveShadow>
            <cylinderGeometry args={[0.008, 0.008, 0.15, 8]} />
            <meshStandardMaterial color="#6B7280" />
          </mesh>
          
          {/* Landing pad */}
          <mesh position={[position[0], position[1] - 0.075, position[2]]} castShadow receiveShadow>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
        </group>
      ))}
      
      {/* Status LED */}
      <mesh position={[0, 0.1, 0.3]} castShadow receiveShadow>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial 
          color="#22C55E" 
          emissive="#22C55E" 
          emissiveIntensity={0.4} 
        />
      </mesh>
    </group>
  );
};

export default RobotModel;
