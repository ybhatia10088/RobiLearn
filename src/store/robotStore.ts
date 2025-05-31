import { create } from 'zustand';
import { RobotConfig, RobotState, Vector3, Quaternion } from '@/types/robot.types';

interface EnvironmentConfig {
  id: string;
  name: string;
  description: string;
}

interface RobotStoreState {
  selectedRobot: RobotConfig | null;
  robotState: RobotState | null;
  environment: EnvironmentConfig | null;
  selectRobot: (config: RobotConfig) => void;
  moveRobot: (params: { direction: 'forward' | 'backward', speed: number }) => void;
  rotateRobot: (params: { direction: 'left' | 'right', speed: number }) => void;
  grabObject: () => void;
  releaseObject: () => void;
  stopRobot: () => void;
  setEnvironment: (config: EnvironmentConfig) => void;
  updateRobotPosition: (position: Vector3) => void;
  updateRobotRotation: (rotation: Quaternion) => void;
}

export const useRobotStore = create<RobotStoreState>((set, get) => ({
  selectedRobot: null,
  robotState: null,
  environment: {
    id: 'warehouse',
    name: 'Warehouse',
    description: 'A warehouse environment with shelves, boxes, and robots.',
  },
  
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
      }
    });
  },
  
  moveRobot: (params) => {
    const { direction, speed } = params;
    const { robotState } = get();
    
    if (!robotState) return;
    
    const moveStep = 0.1 * speed;
    const angle = robotState.rotation.y;
    
    // Calculate movement based on robot's rotation
    const deltaX = Math.sin(angle) * moveStep;
    const deltaZ = Math.cos(angle) * moveStep;
    
    const multiplier = direction === 'forward' ? 1 : -1;
    
    set({
      robotState: {
        ...robotState,
        isMoving: true,
        position: {
          x: robotState.position.x + (deltaX * multiplier),
          y: robotState.position.y,
          z: robotState.position.z + (deltaZ * multiplier),
        }
      }
    });
    
    // Simulate battery drain
    setTimeout(() => {
      const currentState = get().robotState;
      if (currentState) {
        set({
          robotState: {
            ...currentState,
            batteryLevel: Math.max(0, currentState.batteryLevel - 0.1),
          }
        });
      }
    }, 100);
  },
  
  rotateRobot: (params) => {
    const { direction, speed } = params;
    const { robotState } = get();
    
    if (!robotState) return;
    
    const rotationStep = 0.1 * speed;
    const delta = direction === 'left' ? rotationStep : -rotationStep;
    
    set({
      robotState: {
        ...robotState,
        isMoving: true,
        rotation: {
          ...robotState.rotation,
          y: (robotState.rotation.y + delta) % (Math.PI * 2),
        }
      }
    });
  },
  
  grabObject: () => {
    const { robotState } = get();
    
    if (!robotState) return;
    
    set({
      robotState: {
        ...robotState,
        isGrabbing: true,
      }
    });
  },
  
  releaseObject: () => {
    const { robotState } = get();
    
    if (!robotState) return;
    
    set({
      robotState: {
        ...robotState,
        isGrabbing: false,
      }
    });
  },
  
  stopRobot: () => {
    const { robotState } = get();
    
    if (!robotState) return;
    
    set({
      robotState: {
        ...robotState,
        isMoving: false,
      }
    });
  },
  
  setEnvironment: (config) => {
    set({ environment: config });
  },
  
  updateRobotPosition: (position) => {
    const { robotState } = get();
    
    if (!robotState) return;
    
    set({
      robotState: {
        ...robotState,
        position,
      }
    });
  },
  
  updateRobotRotation: (rotation) => {
    const { robotState } = get();
    
    if (!robotState) return;
    
    set({
      robotState: {
        ...robotState,
        rotation,
      }
    });
  },
}));
