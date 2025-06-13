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
}

interface RobotStoreState {
  selectedRobot: RobotConfig | null;
  robotState: RobotState | null;
  environment: EnvironmentConfig | null;
  isMoving: boolean;
  jointPositions: JointState;
  performance: PerformanceMetrics;
  challengeTracking: ChallengeTracking;
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
  challengeTracking: { ...INITIAL_CHALLENGE_TRACKING },

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
      challengeTracking: { ...INITIAL_CHALLENGE_TRACKING },
    });
  },

  moveRobot: ({ direction, speed, joint }) => {
    const state = get();
    if (!state.robotState) return;

    // Clear any existing intervals
    if ((window as any).robotMoveInterval) {
      clearInterval((window as any).robotMoveInterval);
    }

    set({ isMoving: true });

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
      }
      
      // Check and mark movement challenges as completed
      if (newTracking.hasMovedForward && !state.challengeTracking.completedChallenges.has('move_forward')) {
        newTracking.completedChallenges.add('move_forward');
        console.log('🏆 Challenge completed: Move Forward');
      }
      if (newTracking.hasMovedBackward && !state.challengeTracking.completedChallenges.has('move_backward')) {
        newTracking.completedChallenges.add('move_backward');
        console.log('🏆 Challenge completed: Move Backward');
      }
      if (newTracking.hasMovedLeft && !state.challengeTracking.completedChallenges.has('move_left')) {
        newTracking.completedChallenges.add('move_left');
        console.log('🏆 Challenge completed: Move Left');
      }
      if (newTracking.hasMovedRight && !state.challengeTracking.completedChallenges.has('move_right')) {
        newTracking.completedChallenges.add('move_right');
        console.log('🏆 Challenge completed: Move Right');
      }

      return { challengeTracking: newTracking };
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
      
      // Check objectives after joint movement
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
        set((state) => ({
          robotState: {
            ...currentState.robotState,
            position: newPosition,
            isMoving: true,
          },
          challengeTracking: {
            ...state.challengeTracking,
            totalDistanceMoved: state.challengeTracking.totalDistanceMoved + distance,
          },
        }));
        
        // Check objectives after position update
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
      set((state) => ({
        robotState: {
          ...currentState.robotState,
          position: newPosition,
          isMoving: true,
        },
        challengeTracking: {
          ...state.challengeTracking,
          totalDistanceMoved: state.challengeTracking.totalDistanceMoved + distance,
        },
      }));
      
      // Check objectives after position update
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
    
    // Track rotation direction for challenge completion
    set((state) => {
      const newTracking = { ...state.challengeTracking };
      if (direction === 'left') {
        newTracking.hasRotatedLeft = true;
        if (!state.challengeTracking.completedChallenges.has('rotate_left')) {
          newTracking.completedChallenges.add('rotate_left');
          console.log('🏆 Challenge completed: Rotate Left');
        }
      } else {
        newTracking.hasRotatedRight = true;
        if (!state.challengeTracking.completedChallenges.has('rotate_right')) {
          newTracking.completedChallenges.add('rotate_right');
          console.log('🏆 Challenge completed: Rotate Right');
        }
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

      set((state) => ({
        robotState: {
          ...currentState.robotState,
          rotation: newRotation,
          isMoving: true,
        },
        challengeTracking: {
          ...state.challengeTracking,
          totalRotations: state.challengeTracking.totalRotations + Math.abs(delta),
        },
      }));
      
      // Check objectives after rotation update
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
      
      if (!state.challengeTracking.completedChallenges.has('grab_object')) {
        newTracking.completedChallenges.add('grab_object');
        console.log('🏆 Challenge completed: Grab Object');
      }

      return {
        robotState: state.robotState ? {
          ...state.robotState,
          isGrabbing: true,
        } : null,
        challengeTracking: newTracking,
      };
    });
    
    // Check objectives after grabbing
    setTimeout(() => get().checkAndCompleteObjectives(), 100);
  },

  releaseObject: () => {
    set((state) => {
      const newTracking = { ...state.challengeTracking };
      newTracking.hasReleased = true;
      
      if (!state.challengeTracking.completedChallenges.has('release_object')) {
        newTracking.completedChallenges.add('release_object');
        console.log('🏆 Challenge completed: Release Object');
      }

      return {
        robotState: state.robotState ? {
          ...state.robotState,
          isGrabbing: false,
        } : null,
        challengeTracking: newTracking,
      };
    });
    
    // Check objectives after releasing
    setTimeout(() => get().checkAndCompleteObjectives(), 100);
  },

  readSensor: async (sensorType: string): Promise<number> => {
    // Simulate sensor reading based on robot position and environment
    const state = get();
    if (!state.robotState) return 0;

    // Simulate different sensor types
    switch (sensorType) {
      case 'ultrasonic':
        // Simulate distance sensor - return random value between 0.1 and 4.0 meters
        const distance = Math.random() * 3.9 + 0.1;
        
        // Mark sensor reading objective as completed
        get().markObjectiveCompleted('sensor_read_complete');
        
        return distance;
      case 'camera':
        return Math.random(); // Simulate camera confidence value
      default:
        return 0;
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
    
    set((state) => {
      const newTracking = { ...state.challengeTracking };
      newTracking.hasHovered = true;
      
      if (!state.challengeTracking.completedChallenges.has('hover_drone')) {
        newTracking.completedChallenges.add('hover_drone');
        console.log('🏆 Challenge completed: Hover Drone');
      }

      return {
        robotState: state.robotState ? {
          ...state.robotState,
          position: { ...state.robotState.position, y: 1.5 },
          isMoving: true,
        } : null,
        isMoving: true,
        challengeTracking: newTracking,
      };
    });
    
    // Check objectives after hovering
    setTimeout(() => get().checkAndCompleteObjectives(), 100);
  },

  landDrone: () => {
    const state = get();
    if (!state.robotState || state.selectedRobot?.type !== 'drone') return;
    
    set((state) => {
      const newTracking = { ...state.challengeTracking };
      newTracking.hasLanded = true;
      
      if (!state.challengeTracking.completedChallenges.has('land_drone')) {
        newTracking.completedChallenges.add('land_drone');
        console.log('🏆 Challenge completed: Land Drone');
      }

      return {
        robotState: state.robotState ? {
          ...state.robotState,
          position: { ...state.robotState.position, y: 0 },
          isMoving: false,
        } : null,
        isMoving: false,
        challengeTracking: newTracking,
      };
    });
    
    // Check objectives after landing
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

  // Enhanced challenge tracking methods
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

    // Check various objective completion criteria
    const { position, rotation } = state.robotState;
    const { challengeTracking } = state;

    // Example objective checks for intro-1 challenge
    if (state.challengeTracking.currentChallengeId === 'intro-1') {
      // Check if robot moved forward 5 meters
      if (position.z >= 5 && !challengeTracking.completedObjectives.has('obj2')) {
        get().markObjectiveCompleted('obj2');
      }
      
      // Check if robot rotated 90 degrees right
      if (Math.abs(rotation.y - Math.PI/2) < 0.1 && !challengeTracking.completedObjectives.has('obj3')) {
        get().markObjectiveCompleted('obj3');
      }
    }

    // Check warehouse challenge objectives
    if (state.challengeTracking.currentChallengeId === 'warehouse-1') {
      // Check if reached pickup area (coordinates 5, 0, 8)
      const targetDistance = Math.sqrt(
        Math.pow(position.x - 5, 2) + 
        Math.pow(position.z - 8, 2)
      );
      
      if (targetDistance < 1 && !challengeTracking.completedObjectives.has('obj2')) {
        get().markObjectiveCompleted('obj2');
      }
      
      // Check if package was grabbed
      if (state.robotState.isGrabbing && !challengeTracking.completedObjectives.has('obj3')) {
        get().markObjectiveCompleted('obj3');
      }
    }
  },

  markObjectiveCompleted: (objectiveId) => {
    set((state) => {
      const newTracking = { ...state.challengeTracking };
      if (!newTracking.completedObjectives.has(objectiveId)) {
        newTracking.completedObjectives.add(objectiveId);
        console.log(`✅ Objective completed: ${objectiveId}`);
        
        // Trigger UI update event
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