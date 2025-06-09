import { create } from 'zustand';

interface RobotState {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  isMoving: boolean;
}

interface RobotStore {
  robotState: RobotState | null;
  isMoving: boolean;
  setRobotState: (state: RobotState) => void;
  setIsMoving: (moving: boolean) => void;
}

export const useRobotStore = create<RobotStore>((set) => ({
  robotState: null,
  isMoving: false,
  setRobotState: (state) => set({ robotState: state }),
  setIsMoving: (moving) => set({ isMoving: moving }),
}));