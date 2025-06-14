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
  altitude?: number; // Added for drone altitude control
}

interface PerformanceMetrics {
  distanceTraveled: number;
  rotations: number;
  tasksCompleted: number;
  batteryUsed: number;
}

interface ChallengeTracking {
  hasMovedForward: boolean;
  hasMovedBackward: boolean;
  hasMovedLeft: boolean;
  hasMovedRight: boolean;
  hasRotatedLeft: boolean;
  hasRotatedRight: boolean;
  hasGrabbed: boolean;
  hasReleased: boolean;
  hasHovered: boolean;
  hasLanded: boolean;
  totalDistanceMoved: number;
  totalRotations: number;
  completedChallenges: Set<string>;
  completedObjectives: Set<string>;
  currentChallengeId: string | null;
  maxForwardDistance: number;
  maxBackwardDistance: number;
  totalRotationAngle: number;
  hasReadSensor: boolean;
  sensorReadings: number;
  hasReachedTarget: boolean;
  targetPositions: Array<{ x: number, z: number, reached: boolean }>;
}

interface RobotStoreState {
  selectedRobot: RobotConfig | null;
  robotState: RobotState | null;
  environment: EnvironmentConfig | null;
  isMoving: boolean;
  jointPositions: JointState;
  performance: PerformanceMetrics;
  challengeTracking: ChallengeTracking;
  moveCommands: {
    direction?: 'forward' | 'backward' | 'left' | 'right' | 'up' | 'down';
    speed?: number;
    joint?: keyof JointState;
  } | null;
  
  // Actions
  selectRobot: (config: RobotConfig) => void;
  moveRobot: (params: { 
    direction: 'forward' | 'backward' | 'left' | 'right' | 'up' | 'down', 
    speed: number, 
    joint?: keyof JointState 
  }) => void;
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
  startExplorerAnimation: () => void;
  stopExplorerAnimation: () => void;
  markChallengeCompleted: (challengeId: string) => void;
  resetChallengeTracking: () => void;
  getChallengeStatus: (challengeId: string) => boolean;
  setCurrentChallenge: (challengeId: string | null) => void;
  checkAndCompleteObjectives: () => void;
  getObjectiveStatus: (objectiveId: string) => boolean;
  markObjectiveCompleted: (objectiveId: string) => void;
  readSensor: (sensorType: string) => Promise<number>;
  getSensorData: (sensorType: string) => Promise<any>;
}

const INITIAL_ROBOT_STATE = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  isMoving: false,
  isGrabbing: false,
  batteryLevel: 100,
};

const INITIAL_CHALLENGE_TRACKING: ChallengeTracking = {
  hasMovedForward: false,
  hasMovedBackward: false,
  hasMovedLeft: false,
  hasMovedRight: false,
  hasRotatedLeft: false,
  hasRotatedRight: false,
  hasGrabbed: false,
  hasReleased: false,
  hasHovered: false,
  hasLanded: false,
  totalDistanceMoved: 0,
  totalRotations: 0,
  completedChallenges: new Set<string>(),
  completedObjectives: new Set<string>(),
  currentChallengeId: null,
  maxForwardDistance: 0,
  maxBackwardDistance: 0,
  totalRotationAngle: 0,
  hasReadSensor: false,
  sensorReadings: 0,
  hasReachedTarget: false,
  targetPositions: [],
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
    altitude: 0.5, // Initial drone altitude
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
  challengeTracking: { ...INITIAL_CHALLENGE_TRACKING },
  moveCommands: null,

  selectRobot: (config) => {
    const initialPosition = { x: 0, y: config.type === 'drone' ? 0.5 : 0, z: 0 };
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
      jointPositions: {
        base: 0,
        shoulder: 0,
        elbow: 0,
        wrist: 0,
        altitude: config.type === 'drone' ? 0.5 : 0,
      },
      challengeTracking: { ...INITIAL_CHALLENGE_TRACKING },
      moveCommands: null,
    });
  },

  moveRobot: ({ direction, speed, joint }) => {
    const state = get();
    if (!state.robotState) return;

    // Clear any existing intervals
    if ((window as any).robotMoveInterval) {
      clearInterval((window as any).robotMoveInterval);
    }

    set({ 
      isMoving: true,
      moveCommands: { direction, speed, joint }
    });

    // Track the movement direction for challenge completion
    set((state) => {
      const newTracking = { ...state.challengeTracking };
      switch (direction) {
        case 'forward':
          newTracking.hasMovedForward = true;
          break;
        case 'backward':
          newTracking.hasMovedBackward = true;
          break;
        case 'left':
          newTracking.hasMovedLeft = true;
          break;
        case 'right':
          newTracking.hasMovedRight = true;
          break;
        case 'up':
        case 'down':
          newTracking.hasHovered = true;
          break;
      }
      
      return { challengeTracking: newTracking };
    });

    // Handle drone altitude changes
    if (state.selectedRobot?.type === 'drone' && joint === 'altitude') {
      const step = direction === 'up' ? 0.05 : -0.05;
      set((state) => ({
        jointPositions: {
          ...state.jointPositions,
          altitude: Math.max(0.1, Math.min(state.jointPositions.altitude + step, 4.0)),
        },
      }));
      return;
    }

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
      
      setTimeout(() => get().checkAndCompleteObjectives(), 100);
      return;
    }

    // Handle movement for explorer bot (sphere robot)
    if (state.selectedRobot?.type === 'explorer') {
      const moveStep = 0.12 * speed;
      const angle = state.robotState.rotation.y;
      let deltaX = 0;
      let deltaZ = 0;

      switch (direction) {
        case 'forward':
          deltaX = Math.sin(angle) * moveStep;
          deltaZ = Math.cos(angle) * moveStep;
          break;
        case 'backward':
          deltaX = -Math.sin(angle) * moveStep;
          deltaZ = -Math.cos(angle) * moveStep;
          break;
        case 'left':
          deltaX = -Math.cos(angle) * moveStep;
          deltaZ = Math.sin(angle) * moveStep;
          break;
        case 'right':
          deltaX = Math.cos(angle) * moveStep;
          deltaZ = -Math.sin(angle) * moveStep;
          break;
      }

      const moveInterval = setInterval(() => {
        const currentState = get();
        if (!currentState.robotState || !currentState.isMoving) {
          clearInterval(moveInterval);
          return;
        }

        const newPosition = {
          x: currentState.robotState.position.x + deltaX,
          y: currentState.robotState.position.y,
          z: currentState.robotState.position.z + deltaZ,
        };

        const distance = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);
        
        set((state) => {
          const newTracking = { ...state.challengeTracking };
          newTracking.totalDistanceMoved += distance;
          
          if (direction === 'forward') {
            newTracking.maxForwardDistance = Math.max(newTracking.maxForwardDistance, newPosition.z);
          } else if (direction === 'backward') {
            newTracking.maxBackwardDistance = Math.max(newTracking.maxBackwardDistance, Math.abs(newPosition.z));
          }
          
          return {
            robotState: {
              ...currentState.robotState,
              position: newPosition,
              isMoving: true,
            },
            challengeTracking: newTracking,
          };
        });
        
        get().checkAndCompleteObjectives();
      }, 16);

      (window as any).robotMoveInterval = moveInterval;
      return;
    }

    // Handle movement for other robot types
    const moveStep = 0.1 * speed;
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

      const distance = Math.sqrt((deltaX * multiplier) ** 2 + (deltaZ * multiplier) ** 2);
      
      set((state) => {
        const newTracking = { ...state.challengeTracking };
        newTracking.totalDistanceMoved += distance;
        
        if (direction === 'forward') {
          newTracking.maxForwardDistance = Math.max(newTracking.maxForwardDistance, newPosition.z);
        } else if (direction === 'backward') {
          newTracking.maxBackwardDistance = Math.max(newTracking.maxBackwardDistance, Math.abs(newPosition.z));
        }
        
        return {
          robotState: {
            ...currentState.robotState,
            position: newPosition,
            isMoving: true,
          },
          challengeTracking: newTracking,
        };
      });
      
      get().checkAndCompleteObjectives();
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
    
    set((state) => {
      const newTracking = { ...state.challengeTracking };
      if (direction === 'left') {
        newTracking.hasRotatedLeft = true;
      } else {
        newTracking.hasRotatedRight = true;
      }
      return { challengeTracking: newTracking };
    });
    
    let rotateStep = 0.05 * speed;
    if (state.selectedRobot?.type === 'explorer') {
      rotateStep = 0.08 * speed;
    }
    
    const delta = direction === 'left' ? rotateStep : -rotateStep;

    const rotateInterval = setInterval(() => {
      const currentState = get();
      if (!currentState.robotState || !currentState.isMoving) {
        clearInterval(rotateInterval);
        return;
      }

      const newRotation = {
        ...currentState.robotState.rotation,
        y: (currentState.robotState.rotation.y + delta) % (Math.PI * 2),
      };

      set((state) => {
        const newTracking = { ...state.challengeTracking };
        newTracking.totalRotations += Math.abs(delta);
        newTracking.totalRotationAngle += Math.abs(delta);
        
        return {
          robotState: {
            ...currentState.robotState,
            rotation: newRotation,
            isMoving: true,
          },
          challengeTracking: newTracking,
        };
      });
      
      get().checkAndCompleteObjectives();
    }, 16);

    (window as any).robotRotateInterval = rotateInterval;
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

    set((state) => ({
      isMoving: false,
      moveCommands: null,
      robotState: state.robotState ? {
        ...state.robotState,
        isMoving: false,
      } : null,
    }));
  },

  grabObject: () => {
    set((state) => {
      const newTracking = { ...state.challengeTracking };
      newTracking.hasGrabbed = true;

      return {
        robotState: state.robotState ? {
          ...state.robotState,
          isGrabbing: true,
        } : null,
        challengeTracking: newTracking,
      };
    });
    
    setTimeout(() => get().checkAndCompleteObjectives(), 100);
  },

  releaseObject: () => {
    set((state) => {
      const newTracking = { ...state.challengeTracking };
      newTracking.hasReleased = true;

      return {
        robotState: state.robotState ? {
          ...state.robotState,
          isGrabbing: false,
        } : null,
        challengeTracking: newTracking,
      };
    });
    
    setTimeout(() => get().checkAndCompleteObjectives(), 100);
  },

  readSensor: async (sensorType: string): Promise<number> => {
    const state = get();
    if (!state.robotState) return 0;

    set((state) => ({
      challengeTracking: {
        ...state.challengeTracking,
        hasReadSensor: true,
        sensorReadings: state.challengeTracking.sensorReadings + 1,
      }
    }));

    switch (sensorType) {
      case 'ultrasonic':
        const distance = Math.random() * 3.9 + 0.1;
        get().markObjectiveCompleted('sensor_read_complete');
        return distance;
      case 'camera':
        return Math.random();
      default:
        return 0;
    }
  },

  getSensorData: async (sensorType: string): Promise<any> => {
    const state = get();
    if (!state.robotState) return null;

    set((state) => ({
      challengeTracking: {
        ...state.challengeTracking,
        hasReadSensor: true,
        sensorReadings: state.challengeTracking.sensorReadings + 1,
      }
    }));

    get().markObjectiveCompleted('sensor_read_complete');

    switch (sensorType) {
      case 'ultrasonic':
        return {
          distance: Math.random() * 3.9 + 0.1,
          unit: 'meters',
          timestamp: Date.now()
        };
      case 'camera':
        return {
          objects: ['red_ball', 'blue_cube'],
          brightness: Math.floor(Math.random() * 100),
          timestamp: Date.now()
        };
      case 'light':
        return {
          level: Math.floor(Math.random() * 100),
          unit: 'lux',
          timestamp: Date.now()
        };
      default:
        return { error: 'Unknown sensor type' };
    }
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
      position: { 
        ...INITIAL_ROBOT_STATE.position,
        y: state.selectedRobot?.type === 'drone' ? 0.5 : 0 
      },
    } : null,
    isMoving: false,
    jointPositions: {
      base: 0,
      shoulder: 0,
      elbow: 0,
      wrist: 0,
      altitude: state.selectedRobot?.type === 'drone' ? 0.5 : 0,
    },
    moveCommands: null,
  })),

  resetRobotStateByType: () => set((state) => ({
    robotState: state.robotState ? {
      ...state.robotState,
      ...INITIAL_ROBOT_STATE,
      position: { 
        ...INITIAL_ROBOT_STATE.position,
        y: state.selectedRobot?.type === 'drone' ? 0.5 : 0 
      },
    } : null,
    isMoving: false,
    jointPositions: {
      base: 0,
      shoulder: 0,
      elbow: 0,
      wrist: 0,
      altitude: state.selectedRobot?.type === 'drone' ? 0.5 : 0,
    },
    moveCommands: null,
  })),

  startHover: () => {
    const state = get();
    if (!state.robotState || state.selectedRobot?.type !== 'drone') return;
    
    set((state) => {
      const newTracking = { ...state.challengeTracking };
      newTracking.hasHovered = true;

      return {
        robotState: state.robotState ? {
          ...state.robotState,
          position: { ...state.robotState.position, y: 1.5 },
          isMoving: true,
        } : null,
        isMoving: true,
        jointPositions: {
          ...state.jointPositions,
          altitude: 1.5,
        },
        challengeTracking: newTracking,
      };
    });
    
    setTimeout(() => get().checkAndCompleteObjectives(), 100);
  },

  landDrone: () => {
    const state = get();
    if (!state.robotState || state.selectedRobot?.type !== 'drone') return;
    
    set((state) => {
      const newTracking = { ...state.challengeTracking };
      newTracking.hasLanded = true;

      return {
        robotState: state.robotState ? {
          ...state.robotState,
          position: { ...state.robotState.position, y: 0 },
          isMoving: false,
        } : null,
        isMoving: false,
        jointPositions: {
          ...state.jointPositions,
          altitude: 0.1,
        },
        challengeTracking: newTracking,
      };
    });
    
    setTimeout(() => get().checkAndCompleteObjectives(), 100);
  },

  startExplorerAnimation: () => {
    const state = get();
    if (!state.robotState || state.selectedRobot?.type !== 'explorer') return;
    
    set((state) => ({
      robotState: state.robotState ? {
        ...state.robotState,
        isMoving: true,
      } : null,
      isMoving: true,
    }));
  },

  stopExplorerAnimation: () => {
    const state = get();
    if (!state.robotState || state.selectedRobot?.type !== 'explorer') return;
    
    set((state) => ({
      robotState: state.robotState ? {
        ...state.robotState,
        isMoving: false,
      } : null,
      isMoving: false,
    }));
  },

  setCurrentChallenge: (challengeId) => {
    set((state) => ({
      challengeTracking: {
        ...state.challengeTracking,
        currentChallengeId: challengeId,
      },
    }));
  },

  checkAndCompleteObjectives: () => {
    const state = get();
    if (!state.challengeTracking.currentChallengeId || !state.robotState) return;

    const { position, rotation } = state.robotState;
    const { challengeTracking } = state;

    if (state.challengeTracking.currentChallengeId === 'intro-1') {
      if (challengeTracking.maxForwardDistance >= 5 && !challengeTracking.completedObjectives.has('obj2')) {
        console.log('🎯 Objective completed: Robot moved forward 5 meters!');
        get().markObjectiveCompleted('obj2');
      }
      
      if (challengeTracking.totalRotationAngle >= Math.PI/2 && !challengeTracking.completedObjectives.has('obj3')) {
        console.log('🎯 Objective completed: Robot rotated 90 degrees!');
        get().markObjectiveCompleted('obj3');
      }

      if (challengeTracking.hasRotatedRight && challengeTracking.totalRotationAngle >= Math.PI/4 && !challengeTracking.completedObjectives.has('obj3')) {
        console.log('🎯 Objective completed: Robot turned right significantly!');
        get().markObjectiveCompleted('obj3');
      }
    }

    if (state.challengeTracking.currentChallengeId === 'intro-2') {
      if (challengeTracking.hasReadSensor && !challengeTracking.completedObjectives.has('obj5')) {
        console.log('🎯 Objective completed: Sensor reading completed!');
        get().markObjectiveCompleted('obj5');
      }
    }

    if (state.challengeTracking.currentChallengeId === 'warehouse-1') {
      const targetDistance = Math.sqrt(
        Math.pow(position.x - 5, 2) + 
        Math.pow(position.z - 8, 2)
      );
      
      if (targetDistance < 1 && !challengeTracking.completedObjectives.has('obj2')) {
        console.log('🎯 Objective completed: Reached pickup area!');
        get().markObjectiveCompleted('obj2');
      }
      
      if (state.robotState.isGrabbing && !challengeTracking.completedObjectives.has('obj3')) {
        console.log('🎯 Objective completed: Package grabbed!');
        get().markObjectiveCompleted('obj3');
      }
    }

    if (challengeTracking.hasMovedForward && !challengeTracking.completedObjectives.has('move_forward_basic')) {
      console.log('🎯 Basic objective: Robot moved forward!');
      get().markObjectiveCompleted('move_forward_basic');
    }

    if (challengeTracking.hasRotatedLeft || challengeTracking.hasRotatedRight) {
      if (!challengeTracking.completedObjectives.has('rotate_basic')) {
        console.log('🎯 Basic objective: Robot rotated!');
        get().markObjectiveCompleted('rotate_basic');
      }
    }
  },

  markObjectiveCompleted: (objectiveId) => {
    set((state) => {
      const newTracking = { ...state.challengeTracking };
      if (!newTracking.completedObjectives.has(objectiveId)) {
        newTracking.completedObjectives.add(objectiveId);
        console.log(`✅ Objective completed: ${objectiveId}`);
        
        window.dispatchEvent(new CustomEvent('objectiveCompleted', { 
          detail: { objectiveId, challengeId: state.challengeTracking.currentChallengeId } 
        }));
      }
      return { challengeTracking: newTracking };
    });
  },

  getObjectiveStatus: (objectiveId) => {
    const state = get();
    return state.challengeTracking.completedObjectives.has(objectiveId);
  },

  markChallengeCompleted: (challengeId) => {
    set((state) => {
      const newTracking = { ...state.challengeTracking };
      if (!newTracking.completedChallenges.has(challengeId)) {
        newTracking.completedChallenges.add(challengeId);
        console.log(`🏆 Challenge completed: ${challengeId}`);
      }
      return { challengeTracking: newTracking };
    });
  },

  resetChallengeTracking: () => {
    set({ challengeTracking: { ...INITIAL_CHALLENGE_TRACKING } });
  },

  getChallengeStatus: (challengeId) => {
    const state = get();
    return state.challengeTracking.completedChallenges.has(challengeId);
  },
}));