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

interface Objective {
  challengeId: string;
  objectiveId: string;
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

  // New fields for challenge tracking
  completedObjectives: Objective[];
  completeObjective: (challengeId: string, objectiveId: string) => void;
  isObjectiveCompleted: (challengeId: string, objectiveId: string) => boolean;

  selectRobot: (config: RobotConfig) => void;
  moveRobot: (params: { direction: 'forward' | 'backward' | 'left' | 'right', speed: number }) => void;
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
  },
  performance: {
    distanceTraveled: 0,
    rotations: 0,
    tasksCompleted: 0,
    batteryUsed: 0,
  },
  completedObjectives: [],

  completeObjective: (challengeId, objectiveId) =>
    set((state) => {
      if (
        !state.completedObjectives.some(
          (obj) =>
            obj.challengeId === challengeId &&
            obj.objectiveId === objectiveId
        )
      ) {
        return {
          completedObjectives: [
            ...state.completedObjectives,
            { challengeId, objectiveId },
          ],
        };
      }
      return {};
    }),

  isObjectiveCompleted: (challengeId, objectiveId) =>
    get().completedObjectives.some(
      (obj) =>
        obj.challengeId === challengeId &&
        obj.objectiveId === objectiveId
    ),

  // Your existing methods remain unchanged...
  resetRobotState: () => {
    set((state) => ({
      ...state,
      robotState: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        isMoving: false,
        isGrabbing: false,
        batteryLevel: 100,
        errors: [],
        type: state.robotState?.type || 'mobile',
        robotId: state.robotState?.robotId || '',
        jointPositions: {},
        sensorReadings: [],
        currentJointCommand: null,
      },
      isMoving: false,
    }));
  },

  resetRobotStateByType: () => {
    set((state) => ({
      ...state,
      robotState: {
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        isMoving: false,
        isGrabbing: false,
        batteryLevel: 100,
        errors: [],
        type: state.selectedRobot?.type || 'mobile',
        robotId: state.robotState?.robotId || '',
        jointPositions: {},
        sensorReadings: [],
        currentJointCommand: null,
      },
    }));
  },

  startHover: () => {
    const state = get();
    if (!state.robotState || state.selectedRobot?.type !== 'drone') return;

    const hoverInterval = setInterval(() => {
      const currentState = get();
      if (!currentState.robotState) {
        clearInterval(hoverInterval);
        return;
      }

      const currentHeight = currentState.robotState.position.y;
      const targetHeight = 1.5;

      if (currentHeight >= targetHeight) {
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

    const landingInterval = setInterval(() => {
      const currentState = get();
      if (!currentState.robotState) {
        clearInterval(landingInterval);
        return;
      }

      const currentHeight = currentState.robotState.position.y;
      if (currentHeight <= 0.1) {
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
    set({
      selectedRobot: config,
      robotState: {
        robotId: config.id,
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        isMoving: false,
        isGrabbing: false,
        batteryLevel: 100,
        errors: [],
        jointPositions: {},
        sensorReadings: [],
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

  moveRobot: ({ direction, speed }) => {
    const state = get();
    if (!state.robotState) return;

    const moveStep = 0.05 * speed;
    const angle = state.robotState.rotation.y;
    const deltaX = Math.sin(angle) * moveStep;
    const deltaZ = Math.cos(angle) * moveStep;
    const multiplier = direction === 'forward' ? 1 : -1;

    if ((window as any).robotMoveInterval) {
      clearInterval((window as any).robotMoveInterval);
    }

    set({ isMoving: true });

    const moveInterval = setInterval(() => {
      const currentState = get();
      if (!currentState.robotState || !currentState.isMoving) {
        clearInterval(moveInterval);
        return;
      }

      const newPosition = {
        x: currentState.robotState!.position.x + deltaX * multiplier,
        y: currentState.robotState!.position.y,
        z: currentState.robotState!.position.z + deltaZ * multiplier,
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
  },

  rotateRobot: ({ direction, speed }) => {
    const state = get();
    if (!state.robotState) return;

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
  updateJointPosition: (joint, value) =>
    set((state) => ({
      jointPositions: {
        ...state.jointPositions,
        [joint]: value,
      },
    })),
}));
