import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { RobotConfig } from '@/types/robot.types';
import { useRobotStore } from '@/store/robotStore';
import * as THREE from 'three';

interface RobotModelProps {
  robotConfig: RobotConfig;
}

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
  
  // Enhanced state management for realistic movements
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

  // Physics constants
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

  // Arm joint limits for realistic movement
  const ARM_LIMITS = {
    base: { min: -Math.PI, max: Math.PI },
    shoulder: { min: -Math.PI/2, max: Math.PI/4 },
    elbow: { min: 0, max: Math.PI*0.75 },
    wrist: { min: -Math.PI, max: Math.PI }
  };

  // Realistic physics and movement simulation
  useFrame((state, delta) => {
    if (!group.current || !robotState) return;
    
    // Enhanced position interpolation with momentum
    const targetPos = new THREE.Vector3(
      robotState.position.x,
      robotState.position.y,
      robotState.position.z
    );
    
    // Apply momentum and smooth movement
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
    
    // Smooth rotation with angular momentum
    const targetRot = robotState.rotation.y;
    const currentRot = group.current.rotation.y;
    const rotDiff = targetRot - currentRot;
    
    if (Math.abs(rotDiff) > 0.01) {
      angularVelocity.current += rotDiff * 0.05;
      angularVelocity.current *= 0.95; // Angular damping
      group.current.rotation.y += angularVelocity.current;
    }

    // Calculate distance traveled for wheel rotation
    const distance = group.current.position.distanceTo(prevPosition.current);
    wheelRotation.current += distance / PHYSICS.wheelRadius;
    prevPosition.current.copy(group.current.position);

    // Type-specific animations
    switch (robotConfig.type) {
      case 'mobile':
        // Realistic wheel physics
        if (leftWheelRef.current && rightWheelRef.current) {
          leftWheelRef.current.rotation.x = wheelRotation.current;
          rightWheelRef.current.rotation.x = wheelRotation.current;
        }
        break;

      case 'arm':
        // Realistic robotic arm joint control with constraints
        if (moveCommands) {
          const jointStep = delta * PHYSICS.armSpeed;
          
          // Base rotation - smooth and controlled
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
          
          // Shoulder joint
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
          
          // Elbow joint
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
          
          // Wrist rotation
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
        // Enhanced drone physics with realistic flight dynamics
        const time = state.clock.elapsedTime;
        
        // Apply altitude changes
        if (moveCommands?.joint === 'altitude') {
          const altitudeChange = moveCommands.direction === 'up' 
            ? PHYSICS.droneLiftAcceleration 
            : -PHYSICS.droneLiftAcceleration;
          droneAltitude.current = THREE.MathUtils.clamp(
            droneAltitude.current + altitudeChange,
            PHYSICS.droneMinAltitude,
            PHYSICS.droneMaxAltitude
          );
        }
        
        // Smooth hovering motion with multiple oscillations for realism
        const hoverY = Math.sin(time * PHYSICS.droneHoverSpeed) * PHYSICS.droneHoverAmplitude;
        const microHover = Math.sin(time * 8) * 0.003; // Micro oscillations
        group.current.position.y += (hoverY + microHover) * 0.5;
        
        // Advanced propeller physics with realistic counter-rotation
        propellersRef.current.forEach((propeller, index) => {
          if (propeller) {
            const baseSpeed = robotState.isMoving 
              ? PHYSICS.propellerSpeedActive 
              : PHYSICS.propellerSpeedIdle;
            
            // Counter-rotating pairs for stability
            const isClockwise = (index === 0 || index === 3);
            const direction = isClockwise ? 1 : -1;
            const rotationSpeed = baseSpeed + Math.sin(time * 2 + index) * 2;
            
            propeller.rotation.y += rotationSpeed * delta * direction;
            
            if (robotState.isMoving) {
              propeller.position.y = Math.sin(time * 25 + index * 1.5) * 0.001;
              propeller.rotation.x = Math.sin(time * 15 + index) * 0.005;
            } else {
              propeller.position.y = THREE.MathUtils.lerp(propeller.position.y, 0, delta * 5);
              propeller.rotation.x = THREE.MathUtils.lerp(propeller.rotation.x, 0, delta * 3);
            }
          }
        });
        
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
          
          const yawOscillation = Math.sin(time * 3) * 0.02;
          group.current.rotation.y += yawOscillation * delta;
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
        
        group.current.position.y = THREE.MathUtils.lerp(
          group.current.position.y,
          droneAltitude.current,
          delta * 2
        );
        
        if (Math.random() < 0.01) {
          const windStrength = 0.002;
          group.current.position.x += (Math.random() - 0.5) * windStrength;
          group.current.position.z += (Math.random() - 0.5) * windStrength;
          group.current.rotation.z += (Math.random() - 0.5) * 0.01;
        }
        
        if (droneAltitude.current <= 0.2 && !robotState.isMoving) {
          propellersRef.current.forEach((propeller, index) => {
            if (propeller) {
              const landingSpeed = 5;
              propeller.rotation.y += landingSpeed * delta * (index % 2 === 0 ? 1 : -1);
            }
          });
          
          group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, 0, delta * 8);
          group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, 0, delta * 8);
        }
        break;
    }
  });

  return (
    <group ref={group}>
      {robotConfig.type === 'mobile' && (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1, 0.5, 1.5]} />
          <meshStandardMaterial color="#666666" />
        </mesh>
      )}
      {robotConfig.type === 'arm' && (
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.5, 0.5, 1, 32]} />
          <meshStandardMaterial color="#444444" />
        </mesh>
      )}
      {robotConfig.type === 'drone' && (
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.2, 0.8]} />
          <meshStandardMaterial color="#555555" />
        </mesh>
      )}
    </group>
  );
};

export default RobotModel;