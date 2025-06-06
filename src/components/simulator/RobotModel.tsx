import React, { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { useRobotStore } from '@/store/robotStore';
import * as THREE from 'three';

const RobotModel = () => {
  const group = useRef<THREE.Group>(null);

  // Load models
  const spider = useGLTF('/models/spider-model/scene.glb');
  const drone = useGLTF('/models/drone.glb');

  // Global robot config/state from Zustand
  const robotState = useRobotStore((state) => state.robotState);
  const robotConfig = useRobotStore((state) => state.robotConfig);
  const setArmAngles = useRobotStore((state) => state.setArmAngles);

  // Physics/motion refs
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const angularVelocity = useRef(0);
  const prevPosition = useRef(new THREE.Vector3(0, 0, 0));
  const wheelRotation = useRef(0); // For spider
  const droneAltitude = useRef(1.5); // Drone hover height

  // Reset logic
  useEffect(() => {
    if (
      robotState &&
      robotState.position.x === 0 &&
      robotState.position.y === 0 &&
      robotState.position.z === 0 &&
      !robotState.isMoving
    ) {
      velocity.current.set(0, 0, 0);
      angularVelocity.current = 0;
      wheelRotation.current = 0;
      prevPosition.current.set(0, 0, 0);
      setArmAngles({ base: 0, shoulder: 0, elbow: 0, wrist: 0 });

      if (robotConfig.type === 'drone') {
        droneAltitude.current = 1.5;
      }

      if (group.current) {
        group.current.position.set(0, 0, 0);
        group.current.rotation.set(0, 0, 0);
      }
    }
  }, [robotState, robotConfig, setArmAngles]);

  // Animation & transform updates
  useFrame((state, delta) => {
    if (!group.current || !robotState || !robotConfig) return;

    // Position interpolation
    group.current.position.lerp(
      new THREE.Vector3(
        robotState.position.x,
        robotConfig.type === 'drone' ? droneAltitude.current : 0,
        robotState.position.z
      ),
      0.1
    );

    // Rotation interpolation
    const targetYRotation = robotState.rotation;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetYRotation,
      0.1
    );

    // Calculate velocity and angular velocity
    const currentPosition = group.current.position.clone();
    const displacement = new THREE.Vector3().subVectors(
      currentPosition,
      prevPosition.current
    );
    velocity.current.copy(displacement.divideScalar(delta));
    angularVelocity.current = (targetYRotation - group.current.rotation.y) / delta;
    prevPosition.current.copy(currentPosition);
  });

  // Render logic
  const renderSpider = () => <primitive object={spider.scene} scale={0.015} />;
  const renderDrone = () => <primitive object={drone.scene} scale={2.5} />;

  return (
    <group ref={group}>
      {robotConfig.type === 'spider' && renderSpider()}
      {robotConfig.type === 'drone' && renderDrone()}
    </group>
  );
};

export default RobotModel;
