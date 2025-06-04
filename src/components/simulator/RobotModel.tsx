import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RobotConfig } from '@/types/robot.types';
import { useRobotStore } from '@/store/robotStore';
import * as THREE from 'three';

interface RobotModelProps {
  robotConfig: RobotConfig;
}

const MobileRobotGeometry: React.FC = () => {
  return (
    <group>
      {/* Robot Body */}
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.6, 0.3, 0.8]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>

      {/* Left Wheel */}
      <group position={[-0.35, 0.14, 0]} ref={leftWheelRef}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.1, 32]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      </group>

      {/* Right Wheel */}
      <group position={[0.35, 0.14, 0]} ref={rightWheelRef}>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.14, 0.14, 0.1, 32]} />
          <meshStandardMaterial color="#2a2a2a" />
        </mesh>
      </group>
    </group>
  );
};

const RoboticArmGeometry: React.FC = () => {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>

      {/* Rotating Base */}
      <group ref={armBaseRef} position={[0, 0.2, 0]}>
        <mesh>
          <cylinderGeometry args={[0.2, 0.2, 0.3, 32]} />
          <meshStandardMaterial color="#666666" />
        </mesh>

        {/* First Arm Segment */}
        <group ref={armSegment1Ref} position={[0, 0.3, 0]}>
          <mesh position={[0, 0.4, 0]}>
            <boxGeometry args={[0.15, 0.8, 0.15]} />
            <meshStandardMaterial color="#4a4a4a" />
          </mesh>

          {/* Second Arm Segment */}
          <group ref={armSegment2Ref} position={[0, 0.8, 0]}>
            <mesh position={[0, 0.3, 0]}>
              <boxGeometry args={[0.12, 0.6, 0.12]} />
              <meshStandardMaterial color="#666666" />
            </mesh>

            {/* Wrist */}
            <group ref={armWristRef} position={[0, 0.6, 0]}>
              <mesh>
                <boxGeometry args={[0.1, 0.2, 0.1]} />
                <meshStandardMaterial color="#4a4a4a" />
              </mesh>

              {/* Gripper */}
              <group ref={gripperRef}>
                <mesh position={[0.05, 0.1, 0]}>
                  <boxGeometry args={[0.02, 0.1, 0.02]} />
                  <meshStandardMaterial color="#2a2a2a" />
                </mesh>
                <mesh position={[-0.05, 0.1, 0]}>
                  <boxGeometry args={[0.02, 0.1, 0.02]} />
                  <meshStandardMaterial color="#2a2a2a" />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
};

const DroneGeometry: React.FC = () => {
  const propellerRefs = useRef<THREE.Group[]>([]);

  useEffect(() => {
    propellersRef.current = propellerRefs.current;
  }, []);

  return (
    <group>
      {/* Main Body */}
      <mesh>
        <boxGeometry args={[0.4, 0.1, 0.4]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>

      {/* Arms */}
      {[[-0.3, -0.3], [0.3, -0.3], [-0.3, 0.3], [0.3, 0.3]].map((pos, index) => (
        <group key={index}>
          <mesh position={[pos[0], 0, pos[1]]}>
            <boxGeometry args={[0.1, 0.05, 0.1]} />
            <meshStandardMaterial color="#666666" />
          </mesh>

          {/* Propellers */}
          <group 
            ref={el => {
              if (el) propellerRefs.current[index] = el;
            }}
            position={[pos[0], 0.05, pos[1]]}
          >
            <mesh rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.2, 0.2, 0.01, 32]} />
              <meshStandardMaterial color="#2a2a2a" />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  );
};

const RobotModel: React.FC<RobotModelProps> = ({ robotConfig }) => {
  const group = useRef<THREE.Group>(null);
  const leftWheelRef = useRef<THREE.Group>(null);
  const rightWheelRef = useRef<THREE.Group>(null);
  const armBaseRef = useRef<THREE.Group>(null);
  const armSegment1Ref = useRef<THREE.Group>(null);
  const armSegment2Ref = useRef<THREE.Group>(null);
  const armWristRef = useRef<THREE.Group>(null);
  const gripperRef = useRef<THREE.Group>(null);
  const propellersRef = useRef<THREE.Group[]>([]);
  
  const { robotState, moveCommands } = useRobotStore();
  
  const [armAngles, setArmAngles] = useState({
    base: 0,
    shoulder: 0,
    elbow: 0,
    wrist: 0
  });
  
  const wheelRotation = useRef(0);
  const prevPosition = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());
  const angularVelocity = useRef(0);
  const droneAltitude = useRef(robotState?.position.y || 0);
  const isHovering = useRef(true);

  const PHYSICS = {
    acceleration: 0.02,
    deceleration: 0.95,
    maxSpeed: 0.05,
    wheelRadius: 0.14,
    armSpeed: 0.8,
    droneHoverAmplitude: 0.008,
    droneHoverSpeed: 2.5,
    propellerSpeedIdle: 15,
    propellerSpeedActive: 30,
    droneLiftAcceleration: 0.03,
    droneMaxAltitude: 4.0,
    droneMinAltitude: 0.15
  };

  const ARM_LIMITS = {
    base: { min: -Math.PI, max: Math.PI },
    shoulder: { min: -Math.PI/2, max: Math.PI/4 },
    elbow: { min: 0, max: Math.PI*0.75 },
    wrist: { min: -Math.PI, max: Math.PI }
  };

  useEffect(() => {
    if (robotState && 
        robotState.position.x === 0 && 
        robotState.position.y === 0 && 
        robotState.position.z === 0 && 
        !robotState.isMoving) {
      
      velocity.current.set(0, 0, 0);
      angularVelocity.current = 0;
      wheelRotation.current = 0;
      prevPosition.current.set(0, 0, 0);
      
      setArmAngles({
        base: 0,
        shoulder: 0,
        elbow: 0,
        wrist: 0
      });
      
      if (robotConfig.type === 'drone') {
        droneAltitude.current = 1.5;
        isHovering.current = true;
      }
      
      if (group.current) {
        group.current.position.set(0, 0, 0);
        group.current.rotation.set(0, 0, 0);
        
        if (robotConfig.type === 'drone') {
          group.current.position.y = 1.5;
        }
      }
    }
  }, [robotState?.position, robotState?.isMoving, robotConfig.type]);

  useFrame((state, delta) => {
    if (!group.current || !robotState) return;
    
    const targetPos = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );
    
    if (robotState.isMoving) {
      velocity.current.lerp(
        targetPos.clone().sub(group.current.position).multiplyScalar(PHYSICS.acceleration),
        0.1
      );
      velocity.current.clampLength(0, PHYSICS.maxSpeed);
    } else {
      velocity.current.multiplyScalar(PHYSICS.deceleration);
    }
    
    group.current.position.add(velocity.current);
    
    const targetRot = robotState.rotation.y;
    const currentRot = group.current.rotation.y;
    const rotDiff = targetRot - currentRot;
    
    if (Math.abs(rotDiff) > 0.01) {
      angularVelocity.current += rotDiff * 0.05;
      angularVelocity.current *= 0.95;
      group.current.rotation.y += angularVelocity.current;
    }

    const distance = group.current.position.distanceTo(prevPosition.current);
    wheelRotation.current += distance / PHYSICS.wheelRadius;
    prevPosition.current.copy(group.current.position);

    switch (robotConfig.type) {
      case 'mobile':
        if (leftWheelRef.current && rightWheelRef.current) {
          leftWheelRef.current.rotation.x = wheelRotation.current;
          rightWheelRef.current.rotation.x = wheelRotation.current;
        }
        break;

      case 'arm':
        if (moveCommands) {
          const jointStep = delta * PHYSICS.armSpeed;
          
          if (armBaseRef.current) {
            const baseTarget = moveCommands.joint === 'base' ? 
              (moveCommands.direction === 'left' ? -0.5 : 0.5) : 0;
            armAngles.base = THREE.MathUtils.clamp(
              THREE.MathUtils.lerp(armAngles.base, baseTarget, jointStep),
              ARM_LIMITS.base.min,
              ARM_LIMITS.base.max
            );
            armBaseRef.current.rotation.y = armAngles.base;
          }
          
          if (armSegment1Ref.current) {
            const shoulderTarget = moveCommands.joint === 'shoulder' ?
              (moveCommands.direction === 'forward' ? -0.3 : 0.3) : 0;
            armAngles.shoulder = THREE.MathUtils.clamp(
              THREE.MathUtils.lerp(armAngles.shoulder, shoulderTarget, jointStep),
              ARM_LIMITS.shoulder.min,
              ARM_LIMITS.shoulder.max
            );
            armSegment1Ref.current.rotation.x = armAngles.shoulder;
          }
          
          if (armSegment2Ref.current) {
            const elbowTarget = moveCommands.joint === 'elbow' ?
              (moveCommands.direction === 'forward' ? -0.8 : 0.2) : -0.2;
            armAngles.elbow = THREE.MathUtils.clamp(
              THREE.MathUtils.lerp(armAngles.elbow, elbowTarget, jointStep),
              ARM_LIMITS.elbow.min,
              ARM_LIMITS.elbow.max
            );
            armSegment2Ref.current.rotation.x = armAngles.elbow;
          }
          
          if (armWristRef.current) {
            const wristTarget = moveCommands.joint === 'wrist' ?
              (moveCommands.direction === 'left' ? -1.5 : 1.5) : 0;
            armAngles.wrist = THREE.MathUtils.clamp(
              THREE.MathUtils.lerp(armAngles.wrist, wristTarget, jointStep * 0.7),
              ARM_LIMITS.wrist.min,
              ARM_LIMITS.wrist.max
            );
            armWristRef.current.rotation.z = armAngles.wrist;
          }
        }
        break;

      case 'drone':
        const time = state.clock.elapsedTime;
        
        if (isHovering.current) {
          const hoverY = Math.sin(time * PHYSICS.droneHoverSpeed) * PHYSICS.droneHoverAmplitude;
          const microHover = Math.sin(time * 8) * 0.003;
          group.current.position.y = droneAltitude.current + (hoverY + microHover) * 0.5;
          
          if (robotState.isMoving) {
            const forwardTilt = -0.12;
            group.current.rotation.x = THREE.MathUtils.lerp(
              group.current.rotation.x,
              forwardTilt,
              delta * 3
            );
            
            const turnRate = angularVelocity.current;
            const bankAngle = THREE.MathUtils.clamp(turnRate * 4, -0.25, 0.25);
            group.current.rotation.z = THREE.MathUtils.lerp(
              group.current.rotation.z,
              bankAngle,
              delta * 4
            );
          } else {
            group.current.rotation.x = THREE.MathUtils.lerp(
              group.current.rotation.x,
              Math.sin(time * 1.5) * 0.01,
              delta * 5
            );
            group.current.rotation.z = THREE.MathUtils.lerp(
              group.current.rotation.z,
              Math.cos(time * 1.2) * 0.008,
              delta * 5
            );
          }
        } else {
          group.current.position.y = THREE.MathUtils.lerp(
            group.current.position.y,
            0,
            delta * 5
          );
          
          group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0, delta * 8);
          group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, delta * 8);
        }
        
        propellersRef.current.forEach((propeller, index) => {
          if (propeller) {
            const baseSpeed = isHovering.current 
              ? (robotState.isMoving ? PHYSICS.propellerSpeedActive : PHYSICS.propellerSpeedIdle)
              : 0;
            
            const isClockwise = (index === 0 || index === 3);
            const direction = isClockwise ? 1 : -1;
            const rotationSpeed = baseSpeed + (isHovering.current ? Math.sin(time * 2 + index) * 2 : 0);
            
            propeller.rotation.y += rotationSpeed * delta * direction;
            
            if (isHovering.current && robotState.isMoving) {
              propeller.position.y = Math.sin(time * 25 + index * 1.5) * 0.001;
              propeller.rotation.x = Math.sin(time * 15 + index) * 0.005;
            } else {
              propeller.position.y = THREE.MathUtils.lerp(propeller.position.y, 0, delta * 5);
              propeller.rotation.x = THREE.MathUtils.lerp(propeller.rotation.x, 0, delta * 3);
            }
          }
        });
        break;
    }
  });

  return (
    <group ref={group}>
      {robotConfig.type === 'mobile' && <MobileRobotGeometry />}
      {robotConfig.type === 'arm' && <RoboticArmGeometry />}
      {robotConfig.type === 'drone' && <DroneGeometry />}
    </group>
  );
};

export default RobotModel;