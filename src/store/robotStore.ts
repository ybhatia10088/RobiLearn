import { create } from 'zustand';
import { RobotConfig, RobotState, Vector3, Quaternion } from '@/types/robot.types';

interface EnvironmentConfig {
  id: string;
  name: string;
  description: string;
  temperature?: number;
  humidity?: number;
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

interface RobotStoreState {
  selectedRobot: RobotConfig | null;
  robotState: RobotState | null;
  environment: EnvironmentConfig | null;
  isMoving: boolean;
  jointPositions: JointState;
  performance: PerformanceMetrics;
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
  resetRobotState: () => void;
  resetRobotStateByType: () => void;
  landDrone: () => void;
  startHover: () => void;
}

const INITIAL_ROBOT_STATE = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  isMoving: false,
  isGrabbing: false,
  batteryLevel: 100,
};

export const useRobotStore = create<RobotStoreState>((set, get) => ({
  selectedRobot: null,
  robotState: null,
  isMoving: false,
  jointPositions: {
    base: 0,
    shoulder: 0,
    elbow: 0,
    wrist: 0,
  },
  environment: {
    id: 'warehouse',
    name: 'warehouse',
    description: 'A warehouse environment with shelves, boxes, and robots.',
    temperature: 22,
    humidity: 45,
  },
  performance: {
    distanceTraveled: 0,
    rotations: 0,
    tasksCompleted: 0,
    batteryUsed: 0,
  },

  selectRobot: (config) => {
    // Add extensive debugging
    console.log('🏪 STORE: selectRobot called with config:', config);
    console.log('🏪 STORE: config.type:', config?.type);
    console.log('🏪 STORE: config.id:', config?.id);
    
    const initialPosition = { x: 0, y: 0, z: 0 };
    
    const newRobotState = {
      robotId: config.id,
      type: config.type, // Make sure this is preserved
      position: initialPosition,
      rotation: { x: 0, y: 0, z: 0 },
      jointPositions: {},
      sensorReadings: [],
      isMoving: false,
      isGrabbing: false,
      batteryLevel: 100,
      errors: [],
      currentJointCommand: null,
    };
    
    console.log('🏪 STORE: Created robotState:', newRobotState);
    console.log('🏪 STORE: robotState.type:', newRobotState.type);
    
    set({
      selectedRobot: config,
      robotState: newRobotState,
      isMoving: false,
    });
    
    // Debug the state after setting
    const newState = get();
    console.log('🏪 STORE: After setting - selectedRobot:', newState.selectedRobot);
    console.log('🏪 STORE: After setting - selectedRobot.type:', newState.selectedRobot?.type);
    console.log('🏪 STORE: After setting - robotState:', newState.robotState);
    console.log('🏪 STORE: After setting - robotState.type:', newState.robotState?.type);
  },

  moveRobot: ({ direction, speed, joint }) => {
    const state = get();
    if (!state.robotState) return;

    // Clear any existing intervals
    if ((window as any).robotMoveInterval) {
      clearInterval((window as any).robotMoveInterval);
    }

    // EXPLORER FIX: Set isMoving immediately for better responsiveness
    console.log(`🚀 STORE: Starting movement for ${state.selectedRobot?.type} - Direction: ${direction}, Speed: ${speed}`);
    set({ isMoving: true });

    if (state.selectedRobot?.type === 'arm' && joint) {
      // Handle arm movement
      const currentPos = state.jointPositions[joint];
      const step = (direction === 'left' || direction === 'backward') ? -0.05 : 0.05;
      const limits = {
        base: { min: -Math.PI, max: Math.PI },
        shoulder: { min: -Math.PI / 2, max: Math.PI / 4 },
        elbow: { min: -Math.PI / 2, max: Math.PI / 2 },
        wrist: { min: -Math.PI, max: Math.PI },
      };

      const newPos = currentPos + step;
      const clampedPos = Math.max(limits[joint].min, Math.min(newPos, limits[joint].max));

      set((state) => ({
        jointPositions: {
          ...state.jointPositions,
          [joint]: clampedPos,
        },
      }));
      return;
    }

    // EXPLORER FIX: Enhanced movement parameters based on robot type
    const isExplorer = state.selectedRobot?.type?.toLowerCase() === 'explorer';
    const baseMoveStep = isExplorer ? 0.15 : 0.1; // Faster movement for explorer
    const moveStep = baseMoveStep * speed;
    
    // EXPLORER FIX: Immediate position update for better responsiveness
    const angle = state.robotState.rotation.y;
    const deltaX = Math.sin(angle) * moveStep;
    const deltaZ = Math.cos(angle) * moveStep;
    const multiplier = direction === 'forward' ? 1 : -1;

    // EXPLORER FIX: Update position immediately for instant feedback
    const immediatePosition = {
      x: state.robotState.position.x + deltaX * multiplier * 0.1, // Small immediate step
      y: state.robotState.position.y,
      z: state.robotState.position.z + deltaZ * multiplier * 0.1,
    };

    set({
      robotState: {
        ...state.robotState,
        position: immediatePosition,
        isMoving: true,
      },
    });

    // EXPLORER FIX: Shorter interval for smoother movement (especially for sphere)
    const intervalDuration = isExplorer ? 12 : 16; // Faster updates for explorer
    
    const moveInterval = setInterval(() => {
      const currentState = get();
      if (!currentState.robotState || !currentState.isMoving) {
        clearInterval(moveInterval);
        console.log(`🛑 STORE: Movement stopped for ${currentState.selectedRobot?.type}`);
        return;
      }

      const newPosition = {
        x: currentState.robotState.position.x + deltaX * multiplier,
        y: currentState.robotState.position.y,
        z: currentState.robotState.position.z + deltaZ * multiplier,
      };

      // EXPLORER FIX: Extra logging for explorer movement
      if (isExplorer) {
        console.log(`🌐 STORE: Explorer position update:`, {
          from: currentState.robotState.position,
          to: newPosition,
          delta: { x: deltaX * multiplier, z: deltaZ * multiplier }
        });
      }

      set({
        robotState: {
          ...currentState.robotState,
          position: newPosition,
          isMoving: true,
        },
      });
    }, intervalDuration);

    (window as any).robotMoveInterval = moveInterval;
  },

  rotateRobot: ({ direction, speed }) => {
    const state = get();
    if (!state.robotState) return;

    if ((window as any).robotRotateInterval) {
      clearInterval((window as any).robotRotateInterval);
    }

    console.log(`🔄 STORE: Starting rotation for ${state.selectedRobot?.type} - Direction: ${direction}, Speed: ${speed}`);
    set({ isMoving: true });

    // EXPLORER FIX: Enhanced rotation parameters
    const isExplorer = state.selectedRobot?.type?.toLowerCase() === 'explorer';
    const baseRotateStep = isExplorer ? 0.08 : 0.05; // Faster rotation for explorer
    const rotateStep = baseRotateStep * speed;
    const delta = direction === 'left' ? rotateStep : -rotateStep;

    // EXPLORER FIX: Immediate rotation update
    const immediateRotation = {
      ...state.robotState.rotation,
      y: (state.robotState.rotation.y + delta * 0.2) % (Math.PI * 2), // Small immediate rotation
    };

    set({
      robotState: {
        ...state.robotState,
        rotation: immediateRotation,
        isMoving: true,
      },
    });

    // EXPLORER FIX: Shorter interval for smoother rotation
    const intervalDuration = isExplorer ? 12 : 16;

    const rotateInterval = setInterval(() => {
      const currentState = get();
      if (!currentState.robotState || !currentState.isMoving) {
        clearInterval(rotateInterval);
        console.log(`🛑 STORE: Rotation stopped for ${currentState.selectedRobot?.type}`);
        return;
      }

      const newRotation = {
        ...currentState.robotState.rotation,
        y: (currentState.robotState.rotation.y + delta) % (Math.PI * 2),
      };

      // EXPLORER FIX: Extra logging for explorer rotation
      if (isExplorer) {
        console.log(`🌐 STORE: Explorer rotation update:`, {
          from: currentState.robotState.rotation.y,
          to: newRotation.y,
          delta: delta
        });
      }

      set({
        robotState: {
          ...currentState.robotState,
          rotation: newRotation,
          isMoving: true,
        },
      });
    }, intervalDuration);

    (window as any).robotRotateInterval = rotateInterval;
  },

  stopRobot: () => {
    console.log('🛑 STORE: stopRobot called');
    
    if ((window as any).robotMoveInterval) {
      clearInterval((window as any).robotMoveInterval);
      (window as any).robotMoveInterval = null;
    }

    if ((window as any).robotRotateInterval) {
      clearInterval((window as any).robotRotateInterval);
      (window as any).robotRotateInterval = null;
    }

    set((state) => ({
      isMoving: false,
      robotState: state.robotState ? {
        ...state.robotState,
        isMoving: false,
      } : null,
    }));

    // EXPLORER FIX: Extra logging for debugging
    const state = get();
    console.log(`🛑 STORE: Robot stopped - Type: ${state.selectedRobot?.type}, isMoving: ${state.isMoving}`);
  },

  grabObject: () => {
    set((state) => ({
      robotState: state.robotState ? {
        ...state.robotState,
        isGrabbing: true,
      } : null,
    }));
  },

  releaseObject: () => {
    set((state) => ({
      robotState: state.robotState ? {
        ...state.robotState,
        isGrabbing: false,
      } : null,
    }));
  },

  setEnvironment: (config) => set({ environment: config }),
  updateRobotPosition: (position) => set((state) => ({
    robotState: state.robotState ? { ...state.robotState, position } : null,
  })),
  updateRobotRotation: (rotation) => set((state) => ({
    robotState: state.robotState ? { ...state.robotState, rotation } : null,
  })),
  updateJointPosition: (joint, value) => set((state) => ({
    jointPositions: { ...state.jointPositions, [joint]: value },
  })),

  resetRobotState: () => set((state) => ({
    robotState: state.robotState ? {
      ...state.robotState,
      ...INITIAL_ROBOT_STATE,
    } : null,
    isMoving: false,
  })),

  resetRobotStateByType: () => set((state) => ({
    robotState: state.robotState ? {
      ...state.robotState,
      ...INITIAL_ROBOT_STATE,
    } : null,
    isMoving: false,
  })),

  startHover: () => {
    const state = get();
    if (!state.robotState || state.selectedRobot?.type !== 'drone') return;
    
    set((state) => ({
      robotState: state.robotState ? {
        ...state.robotState,
        position: { ...state.robotState.position, y: 1.5 },
        isMoving: true,
      } : null,
      isMoving: true,
    }));
  },

  landDrone: () => {
    const state = get();
    if (!state.robotState || state.selectedRobot?.type !== 'drone') return;
    
    set((state) => ({
      robotState: state.robotState ? {
        ...state.robotState,
        position: { ...state.robotState.position, y: 0 },
        isMoving: false,
      } : null,
      isMoving: false,
    }));
  },
}));