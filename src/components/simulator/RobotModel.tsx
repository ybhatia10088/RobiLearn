import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, Line } from '@react-three/drei';
import { RobotConfig } from '@/types/robot.types';
import { useRobotStore } from '@/store/robotStore';
import * as THREE from 'three';

interface RobotModelProps {
  robotConfig: RobotConfig;
}

const RobotModel: React.FC<RobotModelProps> = ({ robotConfig }) => {
  const groupRef = useRef<THREE.Group>(null);
  const { robotState } = useRobotStore();
  const { scene } = useThree();
  
  // Animation states
  const [wheelRotation, setWheelRotation] = useState(0);
  const [sensorRotation, setSensorRotation] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(100);
  
  // Sensor visualization
  const [sensorReadings, setSensorReadings] = useState({
    ultrasonic: 5.0,
    lidarPoints: [] as Array<{ angle: number; distance: number; point: THREE.Vector3 }>
  });

  useEffect(() => {
    if (groupRef.current && robotState) {
      // Smooth position updates
      const targetPos = new THREE.Vector3(
        robotState.position.x,
        robotState.position.y,
        robotState.position.z
      );
      
      groupRef.current.position.lerp(targetPos, 0.1);
      
      // Smooth rotation updates
      const targetRot = new THREE.Euler(0, robotState.rotation.y, 0);
      groupRef.current.rotation.setFromVector3(targetRot.toVector3());
    }
  }, [robotState]);

  // Animation loop for moving parts
  useFrame((state, delta) => {
    if (robotState?.isMoving) {
      setWheelRotation(prev => prev + delta * 10);
      setBatteryLevel(prev => Math.max(0, prev - delta * 0.5));
    }
    
    // Rotating sensor
    setSensorRotation(prev => prev + delta * 2);
    
    // Simulate sensor readings
    if (groupRef.current) {
      simulateSensors();
    }
  });

  const simulateSensors = () => {
    if (!groupRef.current) return;
    
    const robotPos = groupRef.current.position;
    const robotRot = groupRef.current.rotation;
    
    // Simulate ultrasonic sensor with raycasting
    const raycaster = new THREE.Raycaster();
    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyEuler(robotRot);
    
    raycaster.set(
      new THREE.Vector3(robotPos.x, robotPos.y + 0.75, robotPos.z),
      forward
    );
    
    // Check for intersections with scene objects
    const intersects = raycaster.intersectObjects(scene.children, true);
    const distance = intersects.length > 0 ? intersects[0].distance : 10;
    
    // Simulate LIDAR
    const lidarPoints: Array<{ angle: number; distance: number; point: THREE.Vector3 }> = [];
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 16) {
      const direction = new THREE.Vector3(
        Math.sin(angle),
        0,
        Math.cos(angle)
      );
      direction.applyEuler(robotRot);
      
      raycaster.set(robotPos, direction);
      const lidarIntersects = raycaster.intersectObjects(scene.children, true);
      const lidarDistance = lidarIntersects.length > 0 ? lidarIntersects[0].distance : 8;
      
      const point = robotPos.clone().add(direction.multiplyScalar(lidarDistance));
      lidarPoints.push({ angle, distance: lidarDistance, point });
    }
    
    setSensorReadings({
      ultrasonic: distance,
      lidarPoints
    });
  };

  const renderRobotType = () => {
    switch (robotConfig.type) {
      case 'arm':
        return <RobotArm wheelRotation={wheelRotation} sensorRotation={sensorRotation} />;
      case 'drone':
        return <RobotDrone wheelRotation={wheelRotation} sensorRotation={sensorRotation} />;
      default:
        return <RobotMobile wheelRotation={wheelRotation} sensorRotation={sensorRotation} />;
    }
  };

  return (
    <group ref={groupRef}>
      {renderRobotType()}
      
      {/* Sensor visualizations */}
      <SensorVisualization 
        sensorReadings={sensorReadings} 
        robotPosition={groupRef.current?.position || new THREE.Vector3()} 
        robotRotation={groupRef.current?.rotation || new THREE.Euler()}
      />
      
      {/* Robot status display */}
      <StatusDisplay 
        batteryLevel={batteryLevel}
        isMoving={robotState?.isMoving || false}
        position={[0, 2, 0]}
      />
    </group>
  );
};

// Enhanced Robot Arm with articulated joints
const RobotArm: React.FC<{ wheelRotation: number; sensorRotation: number }> = ({ sensorRotation }) => {
  const [jointAngles, setJointAngles] = useState({ base: 0, shoulder: 0, elbow: 0, wrist: 0 });
  
  useFrame((state) => {
    // Animate joints slightly for realism
    setJointAngles({
      base: Math.sin(state.clock.elapsedTime * 0.5) * 0.2,
      shoulder: Math.sin(state.clock.elapsedTime * 0.3) * 0.3,
      elbow: Math.sin(state.clock.elapsedTime * 0.4) * 0.4,
      wrist: Math.sin(state.clock.elapsedTime * 0.6) * 0.2
    });
  });

  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 0.8, 1, 16]} />
        <meshStandardMaterial color="#1E40AF" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Rotating base */}
      <group rotation={[0, jointAngles.base, 0]}>
        {/* Lower arm */}
        <mesh position={[0, 1.5, 0]} rotation={[0, 0, jointAngles.shoulder]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.25, 1.5, 16]} />
          <meshStandardMaterial color="#3B82F6" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Upper arm */}
        <group position={[0, 2.25, 0]} rotation={[0, 0, jointAngles.shoulder]}>
          <mesh position={[0, 0, 0.7]} rotation={[jointAngles.elbow, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.3, 0.4, 1.8]} />
            <meshStandardMaterial color="#60A5FA" metalness={0.6} roughness={0.4} />
          </mesh>
          
          {/* End effector */}
          <group position={[0, 0, 1.8]} rotation={[jointAngles.elbow, 0, 0]}>
            <mesh rotation={[0, 0, jointAngles.wrist]} castShadow receiveShadow>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#EF4444" metalness={0.9} roughness={0.1} />
            </mesh>
            
            {/* Gripper fingers */}
            <mesh position={[0.1, 0, 0.2]} castShadow receiveShadow>
              <boxGeometry args={[0.05, 0.3, 0.1]} />
              <meshStandardMaterial color="#374151" />
            </mesh>
            <mesh position={[-0.1, 0, 0.2]} castShadow receiveShadow>
              <boxGeometry args={[0.05, 0.3, 0.1]} />
              <meshStandardMaterial color="#374151" />
            </mesh>
          </group>
        </group>
      </group>
      
      {/* Joint indicators */}
      {Object.entries(jointAngles).map(([joint, angle], index) => (
        <Text
          key={joint}
          position={[2, 2 - index * 0.3, 0]}
          fontSize={0.2}
          color="white"
          anchorX="left"
        >
          {joint}: {(angle * 180 / Math.PI).toFixed(1)}°
        </Text>
      ))}
    </group>
  );
};

// Enhanced Mobile Robot with detailed components
const RobotMobile: React.FC<{ wheelRotation: number; sensorRotation: number }> = ({ wheelRotation, sensorRotation }) => {
  return (
    <group>
      {/* Main chassis */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.4, 2]} />
        <meshStandardMaterial color="#0EA5E9" metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Upper housing */}
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.2, 0.4, 1.6]} />
        <meshStandardMaterial color="#38BDF8" metalness={0.5} roughness={0.4} />
      </mesh>
      
      {/* Sensor tower */}
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.4, 0.4, 8]} />
        <meshStandardMaterial color="#0284C7" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Wheels with rotation */}
      {[
        [-0.8, 0.25, -0.7],
        [0.8, 0.25, -0.7],
        [-0.8, 0.25, 0.7],
        [0.8, 0.25, 0.7]
      ].map((position, index) => (
        <group key={index} position={position as [number, number, number]}>
          <mesh rotation={[wheelRotation, 0, Math.PI / 2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.25, 0.25, 0.15, 16]} />
            <meshStandardMaterial color="#1E293B" metalness={0.3} roughness={0.8} />
          </mesh>
          {/* Wheel treads */}
          <mesh rotation={[wheelRotation, 0, Math.PI / 2]} castShadow receiveShadow>
            <torusGeometry args={[0.25, 0.05, 8, 16]} />
            <meshStandardMaterial color="#0F172A" />
          </mesh>
        </group>
      ))}
      
      {/* Front bumper */}
      <mesh position={[0, 0.15, 1.1]} castShadow receiveShadow>
        <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} />
        <meshStandardMaterial color="#FCD34D" />
      </mesh>
      
      {/* Ultrasonic sensor with rotation */}
      <group position={[0, 1.3, 0.6]} rotation={[0, sensorRotation * 0.5, 0]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.12, 0.15, 0.25, 16]} />
          <meshStandardMaterial color="#F97316" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Sensor "eyes" */}
        <mesh position={[0.08, 0, 0.1]} castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
        <mesh position={[-0.08, 0, 0.1]} castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.05, 8]} />
          <meshStandardMaterial color="#000000" />
        </mesh>
      </group>
      
      {/* Camera */}
      <mesh position={[0, 0.9, 0.8]} castShadow receiveShadow>
        <boxGeometry args={[0.2, 0.15, 0.1]} />
        <meshStandardMaterial color="#1F2937" />
      </mesh>
      
      {/* Status LEDs */}
      <mesh position={[0.3, 0.8, 0.8]} castShadow receiveShadow>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#22C55E" emissive="#22C55E" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.15, 0.8, 0.8]} castShadow receiveShadow>
        <sphereGeometry args={[0.03, 8, 8]} />
        <meshStandardMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.2} />
      </mesh>
    </group>
  );
};

// Enhanced Drone with rotating propellers
const RobotDrone: React.FC<{ wheelRotation: number; sensorRotation: number }> = ({ wheelRotation }) => {
  return (
    <group position={[0, 2, 0]}>
      {/* Main body */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.2, 0.8]} />
        <meshStandardMaterial color="#F97316" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Arms */}
      {[
        [-0.6, 0, -0.6],
        [0.6, 0, -0.6],
        [-0.6, 0, 0.6],
        [0.6, 0, 0.6]
      ].map((position, index) => (
        <group key={index}>
          {/* Arm */}
          <mesh position={[(position[0] as number) / 2, 0, (position[2] as number) / 2]} castShadow receiveShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.6, 8]} />
            <meshStandardMaterial color="#DC2626" />
          </mesh>
          
          {/* Motor */}
          <mesh position={position as [number, number, number]} castShadow receiveShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
            <meshStandardMaterial color="#1F2937" metalness={0.9} roughness={0.1} />
          </mesh>
          
          {/* Propeller */}
          <group position={position as [number, number, number]} rotation={[0, wheelRotation * (index % 2 === 0 ? 1 : -1), 0]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.01, 0.6, 0.05]} />
              <meshStandardMaterial color="#E5E7EB" transparent opacity={0.7} />
            </mesh>
            <mesh rotation={[Math.PI / 2, Math.PI / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.01, 0.6, 0.05]} />
              <meshStandardMaterial color="#E5E7EB" transparent opacity={0.7} />
            </mesh>
          </group>
        </group>
      ))}
      
      {/* Camera gimbal */}
      <group position={[0, -0.15, 0]}>
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#000000" metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Camera lens */}
        <mesh position={[0, 0, 0.08]} castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
          <meshStandardMaterial color="#1E3A8A" />
        </mesh>
      </group>
      
      {/* Landing gear */}
      {[
        [-0.3, -0.2, -0.3],
        [0.3, -0.2, -0.3],
        [-0.3, -0.2, 0.3],
        [0.3, -0.2, 0.3]
      ].map((position, index) => (
        <mesh key={index} position={position as [number, number, number]} castShadow receiveShadow>
          <cylinderGeometry args={[0.01, 0.01, 0.2, 8]} />
          <meshStandardMaterial color="#6B7280" />
        </mesh>
      ))}
    </group>
  );
};

// Sensor visualization component
const SensorVisualization: React.FC<{
  sensorReadings: { ultrasonic: number; lidarPoints: Array<{ angle: number; distance: number; point: THREE.Vector3 }> };
  robotPosition: THREE.Vector3;
  robotRotation: THREE.Euler;
}> = ({ sensorReadings, robotPosition, robotRotation }) => {
  // Ultrasonic sensor cone
  const ultrasonicCone = React.useMemo(() => {
    const points = [];
    const sensorPos = robotPosition.clone().add(new THREE.Vector3(0, 0.75, 0.6));
    const distance = Math.min(sensorReadings.ultrasonic, 3);
    
    for (let i = 0; i <= 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const x = Math.sin(angle) * distance * 0.3;
      const y = Math.cos(angle) * distance * 0.3;
      points.push(sensorPos.x + x, sensorPos.y, sensorPos.z + distance + y);
    }
    
    return new Float32Array(points);
  }, [sensorReadings.ultrasonic, robotPosition]);

  // LIDAR points
  const lidarPoints = React.useMemo(() => {
    return sensorReadings.lidarPoints.map(point => [
      point.point.x,
      point.point.y + 0.1,
      point.point.z
    ]);
  }, [sensorReadings.lidarPoints]);

  return (
    <group>
      {/* Ultrasonic sensor cone */}
      <mesh position={[0, 0.75, 0.6]}>
        <coneGeometry args={[sensorReadings.ultrasonic * 0.3, sensorReadings.ultrasonic, 16]} />
        <meshBasicMaterial 
          color="#60A5FA" 
          transparent 
          opacity={0.2} 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Obstacle detection indicator */}
      {sensorReadings.ultrasonic < 1 && (
        <mesh position={[0, 0.75, sensorReadings.ultrasonic]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#EF4444" emissive="#EF4444" emissiveIntensity={0.5} />
        </mesh>
      )}
      
      {/* LIDAR points */}
      {lidarPoints.map((point, index) => (
        <mesh key={index} position={point as [number, number, number]}>
          <sphereGeometry args={[0.02, 4, 4]} />
          <meshBasicMaterial color="#22C55E" />
        </mesh>
      ))}
      
      {/* LIDAR scan lines */}
      {sensorReadings.lidarPoints.length > 0 && (
        <Line
          points={lidarPoints}
          color="#22C55E"
          lineWidth={1}
          transparent
          opacity={0.6}
        />
      )}
    </group>
  );
};

// Status display component
const StatusDisplay: React.FC<{ 
  batteryLevel: number; 
  isMoving: boolean; 
  position: [number, number, number] 
}> = ({ batteryLevel, isMoving, position }) => {
  return (
    <group position={position}>
      <Text
        fontSize={0.2}
        color={batteryLevel > 20 ? "#22C55E" : "#EF4444"}
        anchorX="center"
        anchorY="bottom"
      >
        Battery: {batteryLevel.toFixed(1)}%
      </Text>
      <Text
        position={[0, -0.3, 0]}
        fontSize={0.15}
        color={isMoving ? "#F97316" : "#6B7280"}
        anchorX="center"
        anchorY="bottom"
      >
        {isMoving ? "MOVING" : "IDLE"}
      </Text>
    </group>
  );
};

export default RobotModel;
