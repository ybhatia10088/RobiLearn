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
  altitude?: number;
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
  viewedTheory: Set<string>;
  currentChallengeId: string | null;
  maxForwardDistance: number;
  maxBackwardDistance: number;
  totalRotationAngle: number;
  hasReadSensor: boolean;
  sensorReadings: number;
  hasReachedTarget: boolean;
  targetPositions: Array<{ x: number, z: number, reached: boolean }>;
  hasReachedPickupArea: boolean;
  hasCompletedPath: boolean;
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
  markTheoryViewed: (theoryId: string) => void;
  readSensor: (sensorType: string) => Promise<number>;
  getSensorData: (sensorType: string) => Promise<any>;
  checkChallengeCompletion: (challengeId: string) => void;
  simulateMovement: (direction: string, speed: number, duration: number) => Promise<void>;
  simulateRotation: (direction: string, angle: number) => Promise<void>;
  triggerObjectiveCheck: () => void;
  getTrackingDebugInfo: () => any;
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
  viewedTheory: new Set<string>(),
  currentChallengeId: null,
  maxForwardDistance: 0,
  maxBackwardDistance: 0,
  totalRotationAngle: 0,
  hasReadSensor: false,
  sensorReadings: 0,
  hasReachedTarget: false,
  targetPositions: [],
  hasReachedPickupArea: false,
  hasCompletedPath: false,
};

// Enhanced challenge objectives with all new challenges
const CHALLENGE_OBJECTIVES = {
  'intro-1': [
    { id: 'obj1', criteriaType: 'theory', criteriaValue: 'movement_basics' },
    { id: 'obj2', criteriaType: 'distance_forward', criteriaValue: 5 },
    { id: 'obj3', criteriaType: 'rotation_angle', criteriaValue: Math.PI/2 }
  ],
  'intro-2': [
    { id: 'obj4', criteriaType: 'theory', criteriaValue: 'sensor_basics' },
    { id: 'obj5', criteriaType: 'sensor_read', criteriaValue: true }
  ],
  'patrol-1': [
    { id: 'obj6', criteriaType: 'theory', criteriaValue: 'waypoint_navigation' },
    { id: 'obj7', criteriaType: 'waypoints_visited', criteriaValue: 4 }
  ],
  'circle-1': [
    { id: 'obj8', criteriaType: 'theory', criteriaValue: 'circular_motion' },
    { id: 'obj9', criteriaType: 'circle_completed', criteriaValue: 360 }
  ],
  'grid-1': [
    { id: 'obj10', criteriaType: 'theory', criteriaValue: 'grid_navigation' },
    { id: 'obj11', criteriaType: 'grid_points_visited', criteriaValue: 5 }
  ],
  'spiral-1': [
    { id: 'obj12', criteriaType: 'theory', criteriaValue: 'spiral_algorithms' },
    { id: 'obj13', criteriaType: 'spiral_completed', criteriaValue: 5 }
  ],
  'drone-1': [
    { id: 'obj14', criteriaType: 'theory', criteriaValue: 'drone_flight' },
    { id: 'obj15', criteriaType: 'altitude_reached', criteriaValue: 2.0 },
    { id: 'obj16', criteriaType: 'figure8_completed', criteriaValue: true }
  ],
  'arm-1': [
    { id: 'obj17', criteriaType: 'theory', criteriaValue: 'arm_kinematics' },
    { id: 'obj18', criteriaType: 'joints_exercised', criteriaValue: 4 },
    { id: 'obj19', criteriaType: 'pick_place_completed', criteriaValue: true }
  ],
  'spider-1': [
    { id: 'obj20', criteriaType: 'theory', criteriaValue: 'multi_leg_locomotion' },
    { id: 'obj21', criteriaType: 'gait_demonstrated', criteriaValue: 8 },
    { id: 'obj22', criteriaType: 'terrain_navigated', criteriaValue: 6 }
  ],
  'tank-1': [
    { id: 'obj23', criteriaType: 'theory', criteriaValue: 'tracked_vehicles' },
    { id: 'obj24', criteriaType: 'maneuvers_completed', criteriaValue: 4 },
    { id: 'obj25', criteriaType: 'positioning_completed', criteriaValue: 4 }
  ],
  'humanoid-1': [
    { id: 'obj26', criteriaType: 'theory', criteriaValue: 'bipedal_locomotion' },
    { id: 'obj27', criteriaType: 'walking_demonstrated', criteriaValue: 12 },
    { id: 'obj28', criteriaType: 'complex_movements', criteriaValue: true }
  ]
};

export const useRobotStore = create<RobotStoreState>((set, get) => ({
  selectedRobot: null,
  robotState: {
    robotId: 'default',
    type: 'mobile',
    position: { x: 0, y: 0, z: 0 },
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
    altitude: 0.5,
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
      moveCommands: null,
    });
  },

  simulateMovement: async (direction: string, speed: number, duration: number) => {
    console.log(`🤖 Starting simulated movement: ${direction} at speed ${speed} for ${duration}ms`);
    
    const initialState = get();
    const initialPosition = initialState.robotState?.position || { x: 0, y: 0, z: 0 };
    
    get().moveRobot({ 
      direction: direction as any, 
      speed: speed 
    });

    await new Promise(resolve => setTimeout(resolve, duration));
    
    get().stopRobot();

    const finalState = get();
    const finalPosition = finalState.robotState?.position || { x: 0, y: 0, z: 0 };
    
    const actualDistance = Math.sqrt(
      Math.pow(finalPosition.x - initialPosition.x, 2) + 
      Math.pow(finalPosition.z - initialPosition.z, 2)
    );

    set((state) => {
      const newTracking = { ...state.challengeTracking };
      
      switch (direction) {
        case 'forward':
          newTracking.hasMovedForward = true;
          newTracking.totalDistanceMoved += actualDistance;
          const forwardDistance = finalPosition.z - initialPosition.z;
          if (forwardDistance > 0) {
            newTracking.maxForwardDistance = Math.max(
              newTracking.maxForwardDistance, 
              finalPosition.z
            );
          }
          console.log(`📈 Forward distance updated: ${newTracking.maxForwardDistance.toFixed(3)}m`);
          break;
        case 'backward':
          newTracking.hasMovedBackward = true;
          newTracking.totalDistanceMoved += actualDistance;
          break;
        case 'left':
          newTracking.hasMovedLeft = true;
          newTracking.totalDistanceMoved += actualDistance;
          break;
        case 'right':
          newTracking.hasMovedRight = true;
          newTracking.totalDistanceMoved += actualDistance;
          break;
      }
      
      return { challengeTracking: newTracking };
    });

    setTimeout(() => get().checkAndCompleteObjectives(), 200);
    
    console.log(`✅ Movement simulation complete`);
  },

  simulateRotation: async (direction: string, angle: number) => {
    console.log(`🔄 Starting simulated rotation: ${direction} by ${angle}°`);
    
    const initialState = get();
    const initialRotation = initialState.robotState?.rotation.y || 0;
    
    get().rotateRobot({ 
      direction: direction as any, 
      speed: 0.5 
    });

    const rotationDuration = (angle / 90) * 1000;
    
    console.log(`⏱️ Rotation duration: ${rotationDuration}ms`);

    await new Promise(resolve => setTimeout(resolve, rotationDuration));
    
    get().stopRobot();

    const finalState = get();
    const finalRotation = finalState.robotState?.rotation.y || 0;
    
    let actualRotation = Math.abs(finalRotation - initialRotation);
    if (actualRotation > Math.PI) {
      actualRotation = 2 * Math.PI - actualRotation;
    }

    set((state) => {
      const newTracking = { ...state.challengeTracking };
      
      if (direction === 'left') {
        newTracking.hasRotatedLeft = true;
      } else {
        newTracking.hasRotatedRight = true;
      }
      
      newTracking.totalRotations += actualRotation;
      newTracking.totalRotationAngle += actualRotation;
      
      console.log(`🧭 Total rotation: ${(newTracking.totalRotationAngle * 180 / Math.PI).toFixed(1)}°`);
      
      return { challengeTracking: newTracking };
    });

    setTimeout(() => get().checkAndCompleteObjectives(), 200);
    
    console.log(`✅ Rotation simulation complete`);
  },

  moveRobot: ({ direction, speed, joint }) => {
    const state = get();
    if (!state.robotState) return;

    console.log(`🚁 moveRobot called:`, { 
      direction, 
      speed, 
      joint, 
      robotType: state.selectedRobot?.type,
      currentPosition: state.robotState.position 
    });

    // Clear any existing intervals
    if ((window as any).robotMoveInterval) {
      clearInterval((window as any).robotMoveInterval);
      (window as any).robotMoveInterval = null;
    }

    set({ 
      isMoving: true,
      moveCommands: { direction, speed, joint }
    });

    // Update challenge tracking
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

    // Handle drone movement
    if (state.selectedRobot?.type === 'drone') {
      console.log(`🚁 Processing drone movement: ${direction}`);

      // Handle altitude control for up/down directions
      if (direction === 'up' || direction === 'down') {
        const step = direction === 'up' ? 0.1 : -0.1;
        set((state) => {
          const newAltitude = Math.max(0.1, Math.min(state.jointPositions.altitude! + step, 4.0));
          console.log(`🚁 Altitude change: ${state.jointPositions.altitude} -> ${newAltitude}`);
          return {
            jointPositions: {
              ...state.jointPositions,
              altitude: newAltitude,
            },
            robotState: state.robotState ? {
              ...state.robotState,
              position: {
                ...state.robotState.position,
                y: newAltitude
              }
            } : null
          };
        });
        return;
      }

      // Handle joint-specific altitude control
      if (joint === 'altitude') {
        const step = direction === 'up' ? 0.1 : -0.1;
        set((state) => {
          const newAltitude = Math.max(0.1, Math.min(state.jointPositions.altitude! + step, 4.0));
          console.log(`🚁 Joint altitude change: ${state.jointPositions.altitude} -> ${newAltitude}`);
          return {
            jointPositions: {
              ...state.jointPositions,
              altitude: newAltitude,
            },
            robotState: state.robotState ? {
              ...state.robotState,
              position: {
                ...state.robotState.position,
                y: newAltitude
              }
            } : null
          };
        });
        return;
      }

      // Handle horizontal movement for drones
      if (['forward', 'backward', 'left', 'right'].includes(direction)) {
        const moveStep = 0.15 * speed;
        
        console.log(`🚁 Setting up horizontal movement interval for direction: ${direction}, moveStep: ${moveStep}`);

        const moveInterval = setInterval(() => {
          const currentState = get();
          if (!currentState.robotState || !currentState.isMoving) {
            console.log(`🚁 Stopping movement interval - isMoving: ${currentState.isMoving}`);
            clearInterval(moveInterval);
            (window as any).robotMoveInterval = null;
            return;
          }

          const angle = currentState.robotState.rotation.y;
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

          const newPosition = {
            x: currentState.robotState.position.x + deltaX,
            y: currentState.robotState.position.y,
            z: currentState.robotState.position.z + deltaZ,
          };

          console.log(`🚁 Drone position update:`, {
            from: currentState.robotState.position,
            to: newPosition,
            delta: { deltaX: deltaX.toFixed(4), deltaZ: deltaZ.toFixed(4) }
          });

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
                ...state.robotState!,
                position: newPosition,
                isMoving: true,
              },
              challengeTracking: newTracking,
            };
          });
          
          get().checkAndCompleteObjectives();
        }, 50);

        (window as any).robotMoveInterval = moveInterval;
        console.log(`🚁 Movement interval started for ${direction} direction`);
        return;
      }
    }

    // Handle arm movement
    if (state.selectedRobot?.type === 'arm' && joint) {
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

    // Handle other robot types (explorer, spider, tank, humanoid)
    const moveStep = state.selectedRobot?.type === 'explorer' ? 0.12 * speed : 0.1 * speed;
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
        (window as any).robotMoveInterval = null;
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
            ...currentState.robotState!,
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

    console.log(`🔄 rotateRobot called:`, { direction, speed, robotType: state.selectedRobot?.type });

    if ((window as any).robotRotateInterval) {
      clearInterval((window as any).robotRotateInterval);
      (window as any).robotRotateInterval = null;
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
    } else if (state.selectedRobot?.type === 'drone') {
      rotateStep = 0.06 * speed;
    }
    
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

      set((state) => {
        const newTracking = { ...state.challengeTracking };
        newTracking.totalRotations += Math.abs(delta);
        newTracking.totalRotationAngle += Math.abs(delta);
        
        return {
          robotState: {
            ...currentState.robotState!,
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
    console.log(`🛑 stopRobot called`);
    
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
        get().markObjectiveCompleted('obj5');
        return distance;
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
          position: { ...state.robotState.position, y: 0.1 },
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
    console.log(`🎯 Setting current challenge: ${challengeId}`);
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
    const challengeId = challengeTracking.currentChallengeId;

    const objectives = CHALLENGE_OBJECTIVES[challengeId as keyof typeof CHALLENGE_OBJECTIVES];
    if (!objectives) return;

    let newCompletions = false;

    objectives.forEach(objective => {
      if (challengeTracking.completedObjectives.has(objective.id)) return;

      let shouldComplete = false;

      switch (objective.criteriaType) {
        case 'distance_forward':
          shouldComplete = challengeTracking.maxForwardDistance >= objective.criteriaValue;
          if (shouldComplete) {
            console.log(`✅ Distance objective completed! Moved ${challengeTracking.maxForwardDistance.toFixed(2)}m forward (required: ${objective.criteriaValue}m)`);
          }
          break;
        
        case 'rotation_angle':
          const requiredRadians = typeof objective.criteriaValue === 'number' ? objective.criteriaValue : (objective.criteriaValue * Math.PI / 180);
          shouldComplete = challengeTracking.totalRotationAngle >= requiredRadians;
          if (shouldComplete) {
            console.log(`✅ Rotation objective completed! Rotated ${(challengeTracking.totalRotationAngle * 180 / Math.PI).toFixed(1)}° (required: ${(requiredRadians * 180 / Math.PI).toFixed(1)}°)`);
          }
          break;
        
        case 'sensor_read':
          shouldComplete = challengeTracking.hasReadSensor;
          if (shouldComplete) {
            console.log(`✅ Sensor objective completed! Read sensor ${challengeTracking.sensorReadings} times`);
          }
          break;
        
        case 'theory':
          shouldComplete = challengeTracking.viewedTheory.has(objective.criteriaValue);
          if (shouldComplete) {
            console.log(`✅ Theory objective completed! Viewed theory: ${objective.criteriaValue}`);
          }
          break;

        // New challenge criteria
        case 'waypoints_visited':
          shouldComplete = challengeTracking.totalDistanceMoved > 5.0; // Simplified check
          if (shouldComplete) {
            console.log(`✅ Waypoints objective completed! Completed patrol route`);
          }
          break;

        case 'circle_completed':
          shouldComplete = challengeTracking.totalRotationAngle >= (2 * Math.PI * 0.9); // Almost full circle
          if (shouldComplete) {
            console.log(`✅ Circle objective completed! Completed circular motion`);
          }
          break;

        case 'grid_points_visited':
          shouldComplete = challengeTracking.totalDistanceMoved > 8.0; // Simplified check
          if (shouldComplete) {
            console.log(`✅ Grid navigation objective completed!`);
          }
          break;

        case 'spiral_completed':
          shouldComplete = challengeTracking.totalDistanceMoved > 12.0; // Simplified check
          if (shouldComplete) {
            console.log(`✅ Spiral pattern objective completed!`);
          }
          break;

        case 'altitude_reached':
          shouldComplete = position.y >= objective.criteriaValue;
          if (shouldComplete) {
            console.log(`✅ Altitude objective completed! Reached ${position.y.toFixed(1)}m (required: ${objective.criteriaValue}m)`);
          }
          break;

        case 'figure8_completed':
          shouldComplete = challengeTracking.totalDistanceMoved > 15.0; // Simplified check
          if (shouldComplete) {
            console.log(`✅ Figure-8 objective completed!`);
          }
          break;

        case 'joints_exercised':
          shouldComplete = challengeTracking.totalDistanceMoved > 2.0; // Simplified check for arm movement
          if (shouldComplete) {
            console.log(`✅ Joint exercise objective completed!`);
          }
          break;

        case 'pick_place_completed':
          shouldComplete = challengeTracking.hasGrabbed;
          if (shouldComplete) {
            console.log(`✅ Pick and place objective completed!`);
          }
          break;

        case 'gait_demonstrated':
          shouldComplete = challengeTracking.totalDistanceMoved > 6.0; // Spider walking
          if (shouldComplete) {
            console.log(`✅ Gait demonstration objective completed!`);
          }
          break;

        case 'terrain_navigated':
          shouldComplete = challengeTracking.hasReadSensor && challengeTracking.totalDistanceMoved > 4.0;
          if (shouldComplete) {
            console.log(`✅ Terrain navigation objective completed!`);
          }
          break;

        case 'maneuvers_completed':
          shouldComplete = challengeTracking.totalRotationAngle > Math.PI; // Tank maneuvers
          if (shouldComplete) {
            console.log(`✅ Tank maneuvers objective completed!`);
          }
          break;

        case 'positioning_completed':
          shouldComplete = challengeTracking.hasReadSensor && challengeTracking.totalDistanceMoved > 8.0;
          if (shouldComplete) {
            console.log(`✅ Tactical positioning objective completed!`);
          }
          break;

        case 'walking_demonstrated':
          shouldComplete = challengeTracking.totalDistanceMoved > 10.0; // Humanoid walking
          if (shouldComplete) {
            console.log(`✅ Walking demonstration objective completed!`);
          }
          break;

        case 'complex_movements':
          shouldComplete = challengeTracking.totalDistanceMoved > 20.0; // Complex humanoid movements
          if (shouldComplete) {
            console.log(`✅ Complex movements objective completed!`);
          }
          break;
      }

      if (shouldComplete) {
        get().markObjectiveCompleted(objective.id);
        newCompletions = true;
      }
    });

    if (newCompletions) {
      get().checkChallengeCompletion(challengeId);
    }
  },

  checkChallengeCompletion: (challengeId: string) => {
    const state = get();
    const objectives = CHALLENGE_OBJECTIVES[challengeId as keyof typeof CHALLENGE_OBJECTIVES];
    if (!objectives) return;

    const allObjectivesComplete = objectives.every(obj => 
      state.challengeTracking.completedObjectives.has(obj.id)
    );

    if (allObjectivesComplete && !state.challengeTracking.completedChallenges.has(challengeId)) {
      console.log(`🏆 Challenge completed: ${challengeId}`);
      get().markChallengeCompleted(challengeId);
      
      window.dispatchEvent(new CustomEvent('challengeCompleted', { 
        detail: { challengeId } 
      }));
    }
  },

  markObjectiveCompleted: (objectiveId) => {
    set((state) => {
      const newTracking = { ...state.challengeTracking };
      if (!newTracking.completedObjectives.has(objectiveId)) {
        newTracking.completedObjectives.add(objectiveId);
        console.log(`✅ Objective marked complete: ${objectiveId}`);
        
        window.dispatchEvent(new CustomEvent('objectiveCompleted', { 
          detail: { objectiveId, challengeId: state.challengeTracking.currentChallengeId } 
        }));
      }
      return { challengeTracking: newTracking };
    });
  },

  markTheoryViewed: (theoryId: string) => {
    set((state) => {
      const newTracking = { ...state.challengeTracking };
      if (!newTracking.viewedTheory.has(theoryId)) {
        newTracking.viewedTheory.add(theoryId);
        console.log(`📚 Theory viewed: ${theoryId}`);
        
        setTimeout(() => get().checkAndCompleteObjectives(), 100);
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
        console.log(`🏆 Challenge marked complete: ${challengeId}`);
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

  triggerObjectiveCheck: () => {
    const state = get();
    if (state.challengeTracking.currentChallengeId) {
      console.log('🔍 Manually triggering objective check...');
      get().checkAndCompleteObjectives();
    }
  },

  getTrackingDebugInfo: () => {
    const state = get();
    return {
      currentChallenge: state.challengeTracking.currentChallengeId,
      forwardDistance: state.challengeTracking.maxForwardDistance,
      totalRotation: state.challengeTracking.totalRotationAngle * 180 / Math.PI,
      completedObjectives: Array.from(state.challengeTracking.completedObjectives),
      hasReadSensor: state.challengeTracking.hasReadSensor,
      sensorReadings: state.challengeTracking.sensorReadings
    };
  },
})); 

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

    get().markObjectiveCompleted('obj5');

    switch (sensorType) {
      case 'ultrasonic':
        return {
          distance: Math.random() * 3.9 + 0.1,
          unit: 'meters',
          timestamp: Date.now()
        };
      case 'camera':
        return
