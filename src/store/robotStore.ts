import { create } from 'zustand';
import { RobotConfig, RobotState, Vector3, Quaternion } from '@/types/robot.types';

interface EnvironmentConfig {
  id: string;
  name: string;
  description: string;
}

interface JointState {
  base: number;
  shoulder: number;
  elbow: number;
  wrist: number;
}

interface RobotStoreState {
  selectedRobot: RobotConfig | null;
  robotState: RobotState | null;
  environment: EnvironmentConfig | null;
  isMoving: boolean;
  moveCommands: { joint: string; direction: string; speed: number } | null;
  jointPositions: JointState;
  selectRobot: (config: RobotConfig) => void;
  moveRobot: (params: { direction: 'forward' | 'backward' | 'left' | 'right', speed: number, joint?: string }) => void;
  rotateRobot: (params: { direction: 'left' | 'right', speed: number }) => void;
  grabObject: () => void;
  releaseObject: () => void;
  stopRobot: () => void;
  setEnvironment: (config: EnvironmentConfig) => void;
  updateRobotPosition: (position: Vector3) => void;
  updateRobotRotation: (rotation: Quaternion) => void;
  updateJointPosition: (joint: keyof JointState, value: number) => void;
}

export const useRobotStore = create<RobotStoreState>((set, get) => ({
  selectedRobot: null,
  robotState: null,
  isMoving: false,
  moveCommands: null,
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
        currentJointCommand: null,
      },
      isMoving: false,
      moveCommands: null,
      jointPositions: {
        base: 0,
        shoulder: 0,
        elbow: 0,
        wrist: 0
      }
    });
  },
  
  moveRobot: (params) => {
    const { direction, speed, joint } = params;
    const state = get();
    
    if (!state.robotState) return;
    
    // Clear any existing movement intervals
    if ((window as any).robotMoveInterval) {
      clearInterval((window as any).robotMoveInterval);
    }
    
    // Set moving state and commands immediately
    set({ 
      isMoving: true,
      moveCommands: joint ? { joint, direction, speed } : null
    });
    
    // Regular movement for mobile robots, drones, spider, tank, humanoid
    if (state.selectedRobot?.type !== 'arm' || !joint) {
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
            },
            batteryLevel: Math.max(0, currentState.robotState.batteryLevel - 0.01)
          }
        });
      }, 16); // 60fps update rate
      
      // Store interval reference for cleanup
      (window as any).robotMoveInterval = moveInterval;
    } else if (joint) {
      // Handle joint movement
      const currentJointPos = state.jointPositions[joint as keyof JointState] || 0;
      const jointStep = direction === 'left' || direction === 'backward' ? -0.1 : 0.1;
      const newJointPos = currentJointPos + jointStep;
      
      // Update joint position
      set((state) => ({
        jointPositions: {
          ...state.jointPositions,
          [joint]: newJointPos
        }
      }));
    }
  },
  
  rotateRobot: (params) => {
    const { direction, speed } = params;
    const state = get();
    
    if (!state.robotState || state.selectedRobot?.type === 'arm') return;
    
    // Clear any existing rotation intervals
    if ((window as any).robotRotateInterval) {
      clearInterval((window as any).robotRotateInterval);
    }
    
    // Set moving state immediately
    set({ isMoving: true });
    
    const rotationStep = 0.02 * speed;
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
          },
          batteryLevel: Math.max(0, currentState.robotState.batteryLevel - 0.005)
        }
      });
    }, 16); // 60fps update rate
    
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
      moveCommands: null,
      robotState: {
        ...state.robotState,
        isMoving: false,
        currentJointCommand: null,
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
  
  updateJointPosition: (joint, value) => {
    set((state) => ({
      jointPositions: {
        ...state.jointPositions,
        [joint]: value
      }
    }));
  },
}));