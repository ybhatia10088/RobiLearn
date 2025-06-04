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

  resetRobotState: () => {
    set((state) => ({
      ...state,
      robotState: {
        ...INITIAL_ROBOT_STATE,
        type: state.robotState?.type || 'mobile',
        robotId: state.robotState?.robotId || '',
        jointPositions: {},
        sensorReadings: [],
        errors: [],
        currentJointCommand: null,
      },
      isMoving: false,
    }));
  },

  resetRobotStateByType: () => {
    set((state) => {
      const { selectedRobot } = state;
      return {
        ...state,
        robotState: {
          ...INITIAL_ROBOT_STATE,
          position: { x: 0, y: 0, z: 0 }, // Always start at ground level
          type: selectedRobot?.type || 'mobile',
          robotId: state.robotState?.robotId || '',
          jointPositions: {},
          sensorReadings: [],
          errors: [],
          currentJointCommand: null,
        },
        isMoving: false,
      };
    });
  },

  startHover: () => {
    const state = get();
    if (!state.robotState || state.selectedRobot?.type !== 'drone') return;

    // Start hover sequence
    const hoverInterval = setInterval(() => {
      const currentState = get();
      if (!currentState.robotState) {
        clearInterval(hoverInterval);
        return;
      }

      const currentHeight = currentState.robotState.position.y;
      const targetHeight = 1.5; // Target hover height

      if (currentHeight >= targetHeight) {
        // Reached hover height
        set((state) => ({
          robotState: {
            ...state.robotState!,
            position: {
              ...state.robotState!.position,
              y: targetHeight
            },
            isMoving: true
          },
          isMoving: true
        }));
        clearInterval(hoverInterval);
      } else {
        // Continue ascending
        set((state) => ({
          robotState: {
            ...state.robotState!,
            position: {
              ...state.robotState!.position,
              y: Math.min(targetHeight, currentHeight + 0.05)
            },
            isMoving: true
          },
          isMoving: true
        }));
      }
    }, 16);
  },

  landDrone: () => {
    const state = get();
    if (!state.robotState || state.selectedRobot?.type !== 'drone') return;

    // Start landing sequence
    const landingInterval = setInterval(() => {
      const currentState = get();
      if (!currentState.robotState) {
        clearInterval(landingInterval);
        return;
      }

      const currentHeight = currentState.robotState.position.y;
      if (currentHeight <= 0.1) {
        // Drone has landed
        set((state) => ({
          robotState: {
            ...state.robotState!,
            position: {
              ...state.robotState!.position,
              y: 0
            },
            isMoving: false
          },
          isMoving: false
        }));
        clearInterval(landingInterval);
      } else {
        // Continue descent
        set((state) => ({
          robotState: {
            ...state.robotState!,
            position: {
              ...state.robotState!.position,
              y: Math.max(0, currentHeight - 0.05)
            },
            isMoving: true
          },
          isMoving: true
        }));
      }
    }, 16);
  },

  selectRobot: (config) => {
    // Always start robots at ground level
    const initialPosition = { x: 0, y: 0, z: 0 };

    set({
      selectedRobot: config,
      robotState: {
        robotId: config.id,
        position: initialPosition,
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
        wrist: 0,
      },
      performance: {
        distanceTraveled: 0,
        rotations: 0,
        tasksCompleted: 0,
        batteryUsed: 0,
      },
    });
  },

  moveRobot: ({ direction, speed, joint }) => {
    const state = get();
    if (!state.robotState) return;

    if ((window as any).robotMoveInterval) {
      clearInterval((window as any).robotMoveInterval);
    }

    set({ isMoving: true });

    if (state.selectedRobot?.type === 'arm' && joint) {
      const currentPos = state.jointPositions[joint];
      const step = (direction === 'left' || direction === 'backward') ? -0.05 : 0.05;

      const limits: Record<keyof JointState, { min: number, max: number }> = {
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

    if (state.selectedRobot?.type !== 'arm') {
      const moveStep = 0.05 * speed;
      const angle = state.robotState.rotation.y;
      const deltaX = Math.sin(angle) * moveStep;
      const deltaZ = Math.cos(angle) * moveStep;
      const multiplier = direction === 'forward' ? 1 : -1;

      const moveInterval = setInterval(() => {
        const currentState = get();
        if (!currentState.robotState || !currentState.isMoving) {
          clearInterval(moveInterval);
          return;
        }

        const newPosition = {
          x: currentState.robotState.position.x + deltaX * multiplier,
          y: currentState.robotState.position.y,
          z: currentState.robotState.position.z + deltaZ * multiplier,
        };

        const distance = Math.sqrt(deltaX ** 2 + deltaZ ** 2);

        set({
          robotState: {
            ...currentState.robotState,
            isMoving: true,
            position: newPosition,
            batteryLevel: Math.max(0, currentState.robotState.batteryLevel - 0.01),
          },
          performance: {
            ...currentState.performance,
            distanceTraveled: currentState.performance.distanceTraveled + distance,
            batteryUsed: currentState.performance.batteryUsed + 0.01,
          },
        });
      }, 16);

      (window as any).robotMoveInterval = moveInterval;
    }
  },

  rotateRobot: ({ direction, speed }) => {
    const state = get();
    if (!state.robotState || state.selectedRobot?.type === 'arm') return;

    if ((window as any).robotRotateInterval) {
      clearInterval((window as any).robotRotateInterval);
    }

    set({ isMoving: true });
    const delta = direction === 'left' ? 0.02 * speed : -0.02 * speed;

    const rotateInterval = setInterval(() => {
      const currentState = get();
      if (!currentState.robotState || !currentState.isMoving) {
        clearInterval(rotateInterval);
        return;
      }

      const newY = (currentState.robotState.rotation.y + delta) % (Math.PI * 2);

      set({
        robotState: {
          ...currentState.robotState,
          isMoving: true,
          rotation: {
            ...currentState.robotState.rotation,
            y: newY,
          },
          batteryLevel: Math.max(0, currentState.robotState.batteryLevel - 0.005),
        },
        performance: {
          ...currentState.performance,
          rotations: currentState.performance.rotations + 1,
          batteryUsed: currentState.performance.batteryUsed + 0.005,
        },
      });
    }, 16);

    (window as any).robotRotateInterval = rotateInterval;
  },

  grabObject: () => {
    const state = get();
    if (!state.robotState) return;
    set({
      robotState: {
        ...state.robotState,
        isGrabbing: true,
      },
    });
  },

  releaseObject: () => {
    const state = get();
    if (!state.robotState) return;
    set({
      robotState: {
        ...state.robotState,
        isGrabbing: false,
      },
    });
  },

  stopRobot: () => {
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
        currentJointCommand: null,
      },
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
}));
