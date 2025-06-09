import { create } from 'zustand';

interface RobotConfig {
  id: string;
  name: string;
  type: 'mobile' | 'arm' | 'drone' | 'spider' | 'tank' | 'humanoid';
  description: string;
  model: string;
  basePosition: { x: number; y: number; z: number };
  baseRotation: { x: number; y: number; z: number; w: number };
  sensors: any[];
}

interface RobotState {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  batteryLevel: number;
  isGrabbing?: boolean;
  isMoving: boolean;
}

interface RobotStore {
  selectedRobot: RobotConfig | null;
  robotState: RobotState | null;
  isMoving: boolean;
  
  // Actions
  selectRobot: (robot: RobotConfig | null) => void;
  setRobotState: (state: RobotState) => void;
  setIsMoving: (moving: boolean) => void;
  moveRobot: (params: { direction: string; speed: number; joint?: string }) => void;
  rotateRobot: (params: { direction: string; speed: number }) => void;
  grabObject: () => void;
  releaseObject: () => void;
  stopRobot: () => void;
  landDrone: () => void;
  startHover: () => void;
}

export const useRobotStore = create<RobotStore>((set, get) => ({
  selectedRobot: null,
  robotState: null,
  isMoving: false,
  
  selectRobot: (robot) => {
    set({ selectedRobot: robot });
    if (robot) {
      // Initialize robot state when selecting a robot
      set({
        robotState: {
          position: robot.basePosition,
          rotation: { x: robot.baseRotation.x, y: robot.baseRotation.y, z: robot.baseRotation.z },
          batteryLevel: 100,
          isGrabbing: false,
          isMoving: false
        }
      });
    }
  },
  
  setRobotState: (state) => set({ robotState: state }),
  setIsMoving: (moving) => set({ isMoving: moving }),
  
  moveRobot: (params) => {
    const { selectedRobot, robotState } = get();
    if (!selectedRobot || !robotState) return;
    
    console.log(`Moving robot ${params.direction} with speed ${params.speed}`);
    set({ isMoving: true });
    
    // Simulate movement by updating position
    const newPosition = { ...robotState.position };
    const moveDistance = params.speed * 0.1;
    
    switch (params.direction) {
      case 'forward':
        newPosition.z -= moveDistance;
        break;
      case 'backward':
        newPosition.z += moveDistance;
        break;
    }
    
    set({
      robotState: {
        ...robotState,
        position: newPosition,
        batteryLevel: Math.max(0, robotState.batteryLevel - 0.1)
      }
    });
  },
  
  rotateRobot: (params) => {
    const { selectedRobot, robotState } = get();
    if (!selectedRobot || !robotState) return;
    
    console.log(`Rotating robot ${params.direction} with speed ${params.speed}`);
    set({ isMoving: true });
    
    // Simulate rotation
    const newRotation = { ...robotState.rotation };
    const rotateAmount = params.speed * 0.05;
    
    switch (params.direction) {
      case 'left':
        newRotation.y += rotateAmount;
        break;
      case 'right':
        newRotation.y -= rotateAmount;
        break;
    }
    
    set({
      robotState: {
        ...robotState,
        rotation: newRotation,
        batteryLevel: Math.max(0, robotState.batteryLevel - 0.05)
      }
    });
  },
  
  grabObject: () => {
    const { robotState } = get();
    if (!robotState) return;
    
    console.log('Grabbing object');
    set({
      robotState: {
        ...robotState,
        isGrabbing: true
      }
    });
  },
  
  releaseObject: () => {
    const { robotState } = get();
    if (!robotState) return;
    
    console.log('Releasing object');
    set({
      robotState: {
        ...robotState,
        isGrabbing: false
      }
    });
  },
  
  stopRobot: () => {
    console.log('Stopping robot');
    set({ isMoving: false });
  },
  
  landDrone: () => {
    const { robotState } = get();
    if (!robotState) return;
    
    console.log('Landing drone');
    set({
      robotState: {
        ...robotState,
        position: { ...robotState.position, y: 0 }
      },
      isMoving: false
    });
  },
  
  startHover: () => {
    const { robotState } = get();
    if (!robotState) return;
    
    console.log('Starting hover');
    set({
      robotState: {
        ...robotState,
        position: { ...robotState.position, y: 2 }
      }
    });
  }
}));