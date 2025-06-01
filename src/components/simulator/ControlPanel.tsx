import React, { useState, useEffect } from 'react';
import { create } from 'zustand'; // Re-import zustand if useRobotStore is defined in the same file
import { FaPlay, FaPause, FaArrowUp, FaArrowDown, FaArrowLeft, FaArrowRight, FaHandPaper, FaHandRock, FaPlane, FaCloudDownloadAlt, FaUndo, FaRedo, FaBatteryFull, FaBatteryHalf, FaBatteryQuarter, FaBatteryEmpty, FaWifi, FaWifiSlash } from 'react-icons/fa';

// Define types (these should ideally be in a separate '@/types/robot.types' file as you had)
// For a single file, we'll put them here.
interface Vector3 {
  x: number;
  y: number;
  z: number;
}

interface Quaternion {
  x: number;
  y: number;
  z: number;
  w: number;
}

interface RobotConfig {
  id: string;
  name: string;
  type: 'mobile' | 'arm' | 'drone' | 'spider' | 'tank' | 'humanoid'\; // Added common robot types
  basePosition: Vector3;
  baseRotation: Quaternion;
  // Add other config properties as needed (e.g., joint limits for arm, max speed for mobile)
}

interface RobotState {
  robotId: string;
  position: Vector3;
  rotation: Quaternion;
  jointPositions: { [key: string]: number }; // Dynamic for different joints
  sensorReadings: any[]; // Placeholder
  isMoving: boolean;
  isGrabbing: boolean;
  batteryLevel: number; // 0-100
  errors: string[];
  currentJointCommand: { joint: string; direction: string; speed: number } | null;
}

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
  // Add other joints like 'gripper' if treated as a joint
}

interface RobotStoreState {
  selectedRobot: RobotConfig | null;
  robotState: RobotState | null;
  environment: EnvironmentConfig | null;
  isMoving: boolean; // Global flag for any movement
  moveCommands: { joint?: string; direction: string; speed: number } | null; // Unified move commands
  jointPositions: JointState; // Actual desired joint positions
  selectRobot: (config: RobotConfig) => void;
  moveRobot: (params: { direction: 'forward' | 'backward' | 'left' | 'right' | 'up' | 'down', speed: number, joint?: string }) => void;
  rotateRobot: (params: { direction: 'left' | 'right', speed: number }) => void;
  grabObject: () => void;
  releaseObject: () => void;
  stopRobot: () => void;
  setEnvironment: (config: EnvironmentConfig) => void;
  updateRobotPosition: (position: Vector3) => void;
  updateRobotRotation: (rotation: Quaternion) => void;
  updateJointPosition: (joint: keyof JointState, value: number) => void;
}

// Rest of the code remains the same...

export default ControlPanel;