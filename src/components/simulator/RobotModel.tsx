import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { RobotConfig } from '@/types/robot.types';
import { useRobotStore } from '@/store/robotStore';
import * as THREE from 'three';

interface RobotModelProps {
  robotConfig: RobotConfig;
}

const RobotModel: React.FC<RobotModelProps> = ({ robotConfig }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { robotState } = useRobotStore();
  
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

  return (
    <group ref={groupRef}>
      {robotConfig.type === 'arm' ? (
        <RobotArm />
      ) : robotConfig.type === 'drone' ? (
        <RobotDrone />
      ) : (
        <RobotMobile />
      )}
    </group>
  );
};

const RobotArm: React.FC = () => {
  return (
    <group>
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#3B82F6" />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.2, 0.2, 1, 16]} />
        <meshStandardMaterial color="#60A5FA" />
      </mesh>
      <mesh position={[0, 2.25, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.5, 1.5]} />
        <meshStandardMaterial color="#93C5FD" />
      </mesh>
      <mesh position={[0, 2.25, 1.5]} castShadow receiveShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color="#EF4444" />
      </mesh>
    </group>
  );
};

const RobotMobile: React.FC = () => {
  return (
    <group>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.5, 2]} />
        <meshStandardMaterial color="#0EA5E9" />
      </mesh>
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.5, 1.5]} />
        <meshStandardMaterial color="#38BDF8" />
      </mesh>
      {/* Wheels */}
      <mesh position={[-0.8, 0.25, -0.7]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#1E293B" />
      </mesh>
      <mesh position={[0.8, 0.25, -0.7]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#1E293B" />
      </mesh>
      <mesh position={[-0.8, 0.25, 0.7]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#1E293B" />
      </mesh>
      <mesh position={[0.8, 0.25, 0.7]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.2, 16]} />
        <meshStandardMaterial color="#1E293B" />
      </mesh>
      {/* Sensor */}
      <mesh position={[0, 1.25, 0.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.3, 16]} />
        <meshStandardMaterial color="#F97316" />
      </mesh>
    </group>
  );
};

const RobotDrone: React.FC = () => {
  return (
    <group>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.2, 0.8]} />
        <meshStandardMaterial color="#F97316" />
      </mesh>
      {/* Rotors */}
      <mesh position={[-0.5, 0.1, -0.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
        <meshStandardMaterial color="#BFDBFE" />
      </mesh>
      <mesh position={[0.5, 0.1, -0.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
        <meshStandardMaterial color="#BFDBFE" />
      </mesh>
      <mesh position={[-0.5, 0.1, 0.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
        <meshStandardMaterial color="#BFDBFE" />
      </mesh>
      <mesh position={[0.5, 0.1, 0.5]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
        <meshStandardMaterial color="#BFDBFE" />
      </mesh>
      {/* Camera */}
      <mesh position={[0, -0.1, 0.4]} castShadow receiveShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
};

export default RobotModel;
