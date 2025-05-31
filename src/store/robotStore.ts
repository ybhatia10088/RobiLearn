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
  isMoving: boolean;
  selectRobot: (config: RobotConfig) => void;
  moveRobot: (params: { direction: 'forward' | 'backward', speed: number, joint?: string }) => void;
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
  isMoving: false,
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
        currentJointCommand: null, // Add this for arm control
      },
      isMoving: false
    });
  },
  
  moveRobot: (params) => {
    const { direction, speed, joint } = params;
    const state = get();
    
    if (!state.robotState) return;
    
    // Set moving state immediately
    set({ isMoving: true });
    
    // Store current joint movement for the robot model to read
    if (joint) {
      set({
        robotState: {
          ...state.robotState,
          isMoving: true,
          // Store the current joint movement command
          currentJointCommand: { joint, direction, speed }
        }
      });
    } else {
      // Regular movement for mobile robots
      const moveStep = 0.05 * speed;
      const angle = state.robotState.rotation.y;
      
      const deltaX = Math.sin(angle) * moveStep;
      const deltaZ = Math.cos(angle) * moveStep;
      
      const multiplier = direction === 'forward' ? 1 : -1;
      
      // Create movement interval for continuous movement
      const moveInterval = setInterval(() => {
        const currentState = get();
        if (!currentState.robotState || !currentState.isMoving) {
          clearInterval(moveInterval);
          return;
        }
        
        set({
          robotState: {
            ...currentState.robotState,
            isMoving: true,
            position: {
              x: currentState.robotState.position.x + (deltaX * multiplier),
              y: currentState.robotState.position.y,
              z: currentState.robotState.position.z + (deltaZ * multiplier),
            }
          }
        });
        
        // Simulate battery drain
        if (currentState.robotState.batteryLevel > 0) {
          set({
            robotState: {
              ...currentState.robotState,
              batteryLevel: Math.max(0, currentState.robotState.batteryLevel - 0.01),
            }
          });
        }
      }, 16);
      
      // Store interval reference for cleanup
      (window as any).robotMoveInterval = moveInterval;
    }
  },
  
  rotateRobot: (params) => {
    const { direction, speed } = params;
    const state = get();
    
    if (!state.robotState) return;
    
    // Set moving state immediately
    set({ isMoving: true });
    
    const rotationStep = 0.02 * speed; // Smaller steps for smoother rotation
    const delta = direction === 'left' ? rotationStep : -rotationStep;
    
    // Create rotation interval for continuous rotation
    const rotateInterval = setInterval(() => {
      const currentState = get();
      if (!currentState.robotState || !currentState.isMoving) {
        clearInterval(rotateInterval);
        return;
      }
      
      set({
        robotState: {
          ...currentState.robotState,
          isMoving: true,
          rotation: {
            ...currentState.robotState.rotation,
            y: (currentState.robotState.rotation.y + delta) % (Math.PI * 2),
          }
        }
      });
    }, 16); // ~60fps updates
    
    // Store interval reference for cleanup
    (window as any).robotRotateInterval = rotateInterval;
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
    // Clear any existing movement intervals
    if ((window as any).robotMoveInterval) {
      clearInterval((window as any).robotMoveInterval);
      (window as any).robotMoveInterval = null;
    }
    
    if ((window as any).robotRotateInterval) {
      clearInterval((window as any).robotRotateInterval);
      (window as any).robotRotateInterval = null;
    }
    
    const state = get();
    
    if (!state.robotState) return;
    
    set({
      isMoving: false,
      robotState: {
        ...state.robotState,
        isMoving: false,
        currentJointCommand: null, // Clear joint command
      }
    });
  },
  
  setEnvironment: (config) => {
    set({ environment: config });
  },
  
  updateRobotPosition: (position) => {
    const state = get();
    
    if (!state.robotState) return;
    
    set({
      robotState: {
        ...state.robotState,
        position,
      }
    });
  },
  
  updateRobotRotation: (rotation) => {
    const state = get();
    
    if (!state.robotState) return;
    
    set({
      robotState: {
        ...state.robotState,
        rotation,
      }
    });
  },
}));
