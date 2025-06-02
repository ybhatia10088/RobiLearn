import { create } from 'zustand';
import { RobotConfig, RobotState, Vector3, Quaternion } from '@/types/robot.types';
import * as THREE from 'three';

interface EnvironmentConfig {
  id: string;
  name: string;
  description: string;
  temperature?: number;
  humidity?: number;
  bounds?: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
  };
  obstacles?: Array<{
    position: Vector3;
    dimensions: Vector3;
    type: 'box' | 'cylinder';
  }>;
}

interface JointState {
  base: number;
  shoulder: number;
  elbow: number;
  wrist: number;
}

interface PerformanceMetrics {
  distanceTraveled: number;
  rotations: number;
  tasksCompleted: number;
  batteryUsed: number;
}

interface CollisionBox {
  min: Vector3;
  max: Vector3;
}

// Physics constants
const PHYSICS = {
  maxSpeed: 2.0, // meters per second
  acceleration: 4.0, // meters per second squared
  deceleration: 6.0, // meters per second squared
  rotationSpeed: Math.PI, // radians per second
  collisionThreshold: 0.5, // meters
  groundFriction: 0.98,
  airResistance: 0.995,
  gravity: -9.81,
  droneHoverHeight: 1.5,
  droneMaxHeight: 10,
  batteryDrainRate: {
    moving: 0.02,
    rotating: 0.01,
    hovering: 0.005,
    idle: 0.001
  }
};

interface RobotStoreState {
  selectedRobot: RobotConfig | null;
  robotState: RobotState | null;
  environment: EnvironmentConfig | null;
  isMoving: boolean;
  jointPositions: JointState;
  performance: PerformanceMetrics;
  velocity: Vector3;
  angularVelocity: number;
  selectRobot: (config: RobotConfig) => void;
  moveRobot: (params: { direction: 'forward' | 'backward' | 'left' | 'right', speed: number, joint?: keyof JointState }) => void;
  rotateRobot: (params: { direction: 'left' | 'right', speed: number }) => void;
  grabObject: () => void;
  releaseObject: () => void;
  stopRobot: () => void;
  setEnvironment: (config: EnvironmentConfig) => void;
  updateRobotPosition: (position: Vector3) => void;
  updateRobotRotation: (rotation: Quaternion) => void;
  updateJointPosition: (joint: keyof JointState, value: number) => void;
  checkCollision: (newPosition: Vector3) => boolean;
  updatePhysics: (deltaTime: number) => void;
}

// Helper functions
const createVector3 = (x: number, y: number, z: number): Vector3 => ({ x, y, z });

const addVectors = (a: Vector3, b: Vector3): Vector3 => ({
  x: a.x + b.x,
  y: a.y + b.y,
  z: a.z + b.z
});

const multiplyVector = (v: Vector3, scalar: number): Vector3 => ({
  x: v.x * scalar,
  y: v.y * scalar,
  z: v.z * scalar
});

const vectorLength = (v: Vector3): number => 
  Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);

const normalizeVector = (v: Vector3): Vector3 => {
  const length = vectorLength(v);
  return length > 0 ? multiplyVector(v, 1 / length) : v;
};

const getForwardVector = (rotation: Quaternion): Vector3 => {
  const angle = rotation.y;
  return {
    x: Math.sin(angle),
    y: 0,
    z: Math.cos(angle)
  };
};

const getRightVector = (rotation: Quaternion): Vector3 => {
  const angle = rotation.y + Math.PI / 2;
  return {
    x: Math.sin(angle),
    y: 0,
    z: Math.cos(angle)
  };
};

export const useRobotStore = create<RobotStoreState>((set, get) => ({
  selectedRobot: null,
  robotState: null,
  isMoving: false,
  jointPositions: {
    base: 0,
    shoulder: 0,
    elbow: 0,
    wrist: 0
  },
  environment: {
    id: 'warehouse',
    name: 'Warehouse',
    description: 'A warehouse environment with shelves, boxes, and robots.',
    temperature: 22,
    humidity: 45,
    bounds: {
      minX: -30,
      maxX: 30,
      minZ: -30,
      maxZ: 30
    },
    obstacles: [
      // Add environment-specific obstacles here
    ]
  },
  performance: {
    distanceTraveled: 0,
    rotations: 0,
    tasksCompleted: 0,
    batteryUsed: 0,
  },
  velocity: createVector3(0, 0, 0),
  angularVelocity: 0,

  selectRobot: (config) => {
    set({ 
      selectedRobot: config,
      robotState: {
        robotId: config.id,
        position: { ...config.basePosition },
        rotation: { ...config.baseRotation },
        jointPositions: {},
        sensorReadings: [],
        isMoving: false,
        isGrabbing: false,
        batteryLevel: 100,
        errors: [],
        currentJointCommand: null,
      },
      isMoving: false,
      jointPositions: {
        base: 0,
        shoulder: 0,
        elbow: 0,
        wrist: 0
      },
      velocity: createVector3(0, 0, 0),
      angularVelocity: 0,
      performance: {
        distanceTraveled: 0,
        rotations: 0,
        tasksCompleted: 0,
        batteryUsed: 0,
      }
    });
  },

  moveRobot: ({ direction, speed, joint }) => {
    const state = get();
    if (!state.robotState) return;

    const normalizedSpeed = Math.max(0.1, Math.min(1.0, speed));
    
    if (state.selectedRobot?.type === 'arm' && joint) {
      // Handle arm movement
      const currentPos = state.jointPositions[joint];
      const step = (direction === 'left' || direction === 'backward') ? -0.05 : 0.05;
      
      const limits: Record<keyof JointState, { min: number, max: number }> = {
        base: { min: -Math.PI, max: Math.PI },
        shoulder: { min: -Math.PI / 2, max: Math.PI / 4 },
        elbow: { min: -Math.PI / 2, max: Math.PI / 2 },
        wrist: { min: -Math.PI, max: Math.PI },
      };

      const newPos = Math.max(
        limits[joint].min,
        Math.min(currentPos + step, limits[joint].max)
      );

      set((state) => ({
        jointPositions: {
          ...state.jointPositions,
          [joint]: newPos,
        },
        isMoving: true
      }));
      
    } else {
      // Handle mobile robot movement
      const moveDirection = direction === 'forward' || direction === 'backward'
        ? getForwardVector(state.robotState.rotation)
        : getRightVector(state.robotState.rotation);
      
      const multiplier = (direction === 'forward' || direction === 'right') ? 1 : -1;
      const targetVelocity = multiplyVector(moveDirection, PHYSICS.maxSpeed * normalizedSpeed * multiplier);
      
      set((state) => ({
        velocity: targetVelocity,
        isMoving: true,
        robotState: {
          ...state.robotState!,
          isMoving: true
        }
      }));
    }
  },

  rotateRobot: ({ direction, speed }) => {
    const state = get();
    if (!state.robotState || state.selectedRobot?.type === 'arm') return;

    const normalizedSpeed = Math.max(0.1, Math.min(1.0, speed));
    const rotationDirection = direction === 'left' ? 1 : -1;
    const targetAngularVelocity = PHYSICS.rotationSpeed * normalizedSpeed * rotationDirection;

    set((state) => ({
      angularVelocity: targetAngularVelocity,
      isMoving: true,
      robotState: {
        ...state.robotState!,
        isMoving: true
      }
    }));
  },

  grabObject: () => {
    const state = get();
    if (!state.robotState) return;
    set({
      robotState: {
        ...state.robotState,
        isGrabbing: true,
      }
    });
  },

  releaseObject: () => {
    const state = get();
    if (!state.robotState) return;
    set({
      robotState: {
        ...state.robotState,
        isGrabbing: false,
      }
    });
  },

  stopRobot: () => {
    const state = get();
    if (!state.robotState) return;

    set({
      isMoving: false,
      velocity: createVector3(0, 0, 0),
      angularVelocity: 0,
      robotState: {
        ...state.robotState,
        isMoving: false,
        currentJointCommand: null,
      }
    });
  },

  setEnvironment: (config) => set({ environment: config }),

  updateRobotPosition: (position) => {
    const state = get();
    if (!state.robotState) return;
    set({ robotState: { ...state.robotState, position } });
  },

  updateRobotRotation: (rotation) => {
    const state = get();
    if (!state.robotState) return;
    set({ robotState: { ...state.robotState, rotation } });
  },

  updateJointPosition: (joint, value) => {
    set((state) => ({
      jointPositions: {
        ...state.jointPositions,
        [joint]: value,
      },
    }));
  },

  checkCollision: (newPosition: Vector3) => {
    const state = get();
    if (!state.environment || !state.robotState) return false;

    // Check environment bounds
    const bounds = state.environment.bounds;
    if (bounds) {
      if (
        newPosition.x < bounds.minX || newPosition.x > bounds.maxX ||
        newPosition.z < bounds.minZ || newPosition.z > bounds.maxZ
      ) {
        return true;
      }
    }

    // Check obstacle collisions
    const obstacles = state.environment.obstacles || [];
    const robotRadius = 0.5; // Approximate robot size

    for (const obstacle of obstacles) {
      if (obstacle.type === 'box') {
        const dx = Math.abs(newPosition.x - obstacle.position.x);
        const dz = Math.abs(newPosition.z - obstacle.position.z);
        
        if (
          dx < (obstacle.dimensions.x / 2 + robotRadius) &&
          dz < (obstacle.dimensions.z / 2 + robotRadius)
        ) {
          return true;
        }
      } else if (obstacle.type === 'cylinder') {
        const dx = newPosition.x - obstacle.position.x;
        const dz = newPosition.z - obstacle.position.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance < (obstacle.dimensions.x / 2 + robotRadius)) {
          return true;
        }
      }
    }

    return false;
  },

  updatePhysics: (deltaTime: number) => {
    const state = get();
    if (!state.robotState || !state.selectedRobot) return;

    const position = state.robotState.position;
    const rotation = state.robotState.rotation;
    let velocity = state.velocity;
    let angularVelocity = state.angularVelocity;

    // Apply robot type specific physics
    switch (state.selectedRobot.type) {
      case 'mobile':
        // Ground friction
        velocity = multiplyVector(velocity, Math.pow(PHYSICS.groundFriction, deltaTime));
        angularVelocity *= Math.pow(PHYSICS.groundFriction, deltaTime);
        break;

      case 'drone':
        // Air resistance and hover stability
        velocity = multiplyVector(velocity, Math.pow(PHYSICS.airResistance, deltaTime));
        angularVelocity *= Math.pow(PHYSICS.airResistance, deltaTime);
        
        // Hover height maintenance
        const targetY = PHYSICS.droneHoverHeight;
        const heightDiff = targetY - position.y;
        velocity.y += heightDiff * 5 * deltaTime; // Proportional control
        velocity.y *= 0.95; // Damping
        break;

      case 'spider':
        // Enhanced ground adherence and stability
        velocity = multiplyVector(velocity, Math.pow(PHYSICS.groundFriction * 1.2, deltaTime));
        angularVelocity *= Math.pow(PHYSICS.groundFriction * 1.2, deltaTime);
        position.y = 0.5; // Maintain constant height
        break;
    }

    // Calculate new position
    const newPosition = addVectors(position, multiplyVector(velocity, deltaTime));
    
    // Check for collisions
    if (!state.checkCollision(newPosition)) {
      // Update position if no collision
      position.x = newPosition.x;
      position.y = newPosition.y;
      position.z = newPosition.z;
      
      // Update rotation
      rotation.y += angularVelocity * deltaTime;
      
      // Normalize rotation
      rotation.y = rotation.y % (2 * Math.PI);
      
      // Update performance metrics
      const distanceMoved = vectorLength(multiplyVector(velocity, deltaTime));
      const batteryUsed = state.isMoving 
        ? PHYSICS.batteryDrainRate.moving 
        : PHYSICS.batteryDrainRate.idle;
      
      set((state) => ({
        robotState: {
          ...state.robotState!,
          position,
          rotation,
          batteryLevel: Math.max(0, state.robotState!.batteryLevel - batteryUsed)
        },
        performance: {
          ...state.performance,
          distanceTraveled: state.performance.distanceTraveled + distanceMoved,
          batteryUsed: state.performance.batteryUsed + batteryUsed
        }
      }));
    } else {
      // Stop movement on collision
      set((state) => ({
        velocity: createVector3(0, 0, 0),
        angularVelocity: 0,
        robotState: {
          ...state.robotState!,
          isMoving: false,
          errors: [...state.robotState!.errors, 'Collision detected']
        }
      }));
    }
  }
}));