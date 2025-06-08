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
    const initialPosition = { x: 0, y: 0, z: 0 };
    set({
      selectedRobot: config,
      robotState: {
        robotId: config.id,
        type: config.type,
        position: initialPosition,
        rotation: { x: 0, y: 0, z: 0 },
        jointPositions: {},
        sensorReadings: [],
        isMoving: false,
        isGrabbing: false,
        batteryLevel: 100,
        errors: [],
        currentJointCommand: null,
      },
      isMoving: false,
    });
  },

  moveRobot: ({ direction, speed, joint }) => {
    const state = get();
    if (!state.robotState) return;

    // Clear any existing intervals
    if ((window as any).robotMoveInterval) {
      clearInterval((window as any).robotMoveInterval);
    }
    if ((window as any).robotRotateInterval) {
      clearInterval((window as any).robotRotateInterval);
    }

    console.log('🎮 Move robot triggered:', { direction, speed, robotType: state.selectedRobot?.type });

    // Set moving state immediately for animation
    set({ 
      isMoving: true,
      robotState: {
        ...state.robotState,
        isMoving: true,
      }
    });

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

    // Handle movement for spider, humanoid, and other robot types
    const moveStep = 0.1 * speed;
    let deltaX = 0;
    let deltaZ = 0;

    // Calculate movement delta based on direction
    if (direction === 'forward' || direction === 'backward') {
      const angle = state.robotState.rotation.y;
      deltaX = Math.sin(angle) * moveStep;
      deltaZ = Math.cos(angle) * moveStep;
      const multiplier = direction === 'forward' ? 1 : -1;
      deltaX *= multiplier;
      deltaZ *= multiplier;
    } else if (direction === 'left' || direction === 'right') {
      // Strafe movement
      const angle = state.robotState.rotation.y + (Math.PI / 2); // Perpendicular to facing direction
      deltaX = Math.sin(angle) * moveStep;
      deltaZ = Math.cos(angle) * moveStep;
      const multiplier = direction === 'right' ? 1 : -1;
      deltaX *= multiplier;
      deltaZ *= multiplier;
    }

    const moveInterval = setInterval(() => {
      const currentState = get();
      if (!currentState.robotState || !currentState.isMoving) {
        clearInterval(moveInterval);
        (window as any).robotMoveInterval = null;
        return;
      }

      const newPosition = {
        x: currentState.robotState.position.x + deltaX,
        y: currentState.robotState.position.y,
        z: currentState.robotState.position.z + deltaZ,
      };

      set({
        robotState: {
          ...currentState.robotState,
          position: newPosition,
          isMoving: true,
        },
        isMoving: true,
      });
    }, 16);

    (window as any).robotMoveInterval = moveInterval;
  },

  rotateRobot: ({ direction, speed }) => {
    const state = get();
    if (!state.robotState) return;

    // Clear any existing intervals
    if ((window as any).robotRotateInterval) {
      clearInterval((window as any).robotRotateInterval);
    }
    if ((window as any).robotMoveInterval) {
      clearInterval((window as any).robotMoveInterval);
    }

    console.log('🔄 Rotate robot triggered:', { direction, speed, robotType: state.selectedRobot?.type });

    // Set moving state immediately for animation
    set({ 
      isMoving: true,
      robotState: {
        ...state.robotState,
        isMoving: true,
      }
    });

    const rotateStep = 0.05 * speed;
    const delta = direction === 'left' ? rotateStep : -rotateStep;

    const rotateInterval = setInterval(() => {
      const currentState = get();
      if (!currentState.robotState || !currentState.isMoving) {
        clearInterval(rotateInterval);
        (window as any).robotRotateInterval = null;
        return;
      }

      const newRotation = {
        ...currentState.robotState.rotation,
        y: (currentState.robotState.rotation.y + delta) % (Math.PI * 2),
      };

      set({
        robotState: {
          ...currentState.robotState,
          rotation: newRotation,
          isMoving: true,
        },
        isMoving: true,
      });
    }, 16);

    (window as any).robotRotateInterval = rotateInterval;
  },

  stopRobot: () => {
    console.log('⏹️ Stop robot triggered');

    // Clear all movement intervals
    if ((window as any).robotMoveInterval) {
      clearInterval((window as any).robotMoveInterval);
      (window as any).robotMoveInterval = null;
    }

    if ((window as any).robotRotateInterval) {
      clearInterval((window as any).robotRotateInterval);
      (window as any).robotRotateInterval = null;
    }

    // Set moving state to false immediately for animation
    set((state) => ({
      isMoving: false,
      robotState: state.robotState ? {
        ...state.robotState,
        isMoving: false,
      } : null,
    }));
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

  resetRobotState: () => {
    // Clear any intervals when resetting
    if ((window as any).robotMoveInterval) {
      clearInterval((window as any).robotMoveInterval);
      (window as any).robotMoveInterval = null;
    }
    if ((window as any).robotRotateInterval) {
      clearInterval((window as any).robotRotateInterval);
      (window as any).robotRotateInterval = null;
    }

    set((state) => ({
      robotState: state.robotState ? {
        ...state.robotState,
        ...INITIAL_ROBOT_STATE,
      } : null,
      isMoving: false,
    }));
  },

  resetRobotStateByType: () => {
    // Clear any intervals when resetting
    if ((window as any).robotMoveInterval) {
      clearInterval((window as any).robotMoveInterval);
      (window as any).robotMoveInterval = null;
    }
    if ((window as any).robotRotateInterval) {
      clearInterval((window as any).robotRotateInterval);
      (window as any).robotRotateInterval = null;
    }

    set((state) => ({
      robotState: state.robotState ? {
        ...state.robotState,
        ...INITIAL_ROBOT_STATE,
      } : null,
      isMoving: false,
    }));
  },

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
