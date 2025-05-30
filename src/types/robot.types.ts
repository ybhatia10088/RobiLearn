export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export type Quaternion = {
  x: number;
  y: number;
  z: number;
  w: number;
};

export enum RobotType {
  ARM = 'arm',
  MOBILE = 'mobile',
  DRONE = 'drone',
}

export type JointConfig = {
  id: string;
  type: 'revolute' | 'prismatic';
  limits: {
    min: number;
    max: number;
  };
  position: Vector3;
  rotation: Quaternion;
  parentId?: string;
};

export type RobotConfig = {
  id: string;
  name: string;
  type: RobotType;
  description: string;
  model: string; // path to 3D model
  basePosition: Vector3;
  baseRotation: Quaternion;
  joints?: JointConfig[];
  sensors: SensorConfig[];
};

export type SensorType = 'camera' | 'lidar' | 'ultrasonic' | 'infrared' | 'touch' | 'gyro';

export type SensorConfig = {
  id: string;
  type: SensorType;
  position: Vector3;
  rotation: Quaternion;
  range?: number;
  fieldOfView?: number;
};

export type SensorReading = {
  sensorId: string;
  type: SensorType;
  value: number | number[] | string | boolean;
  timestamp: number;
};

export type RobotCommand = {
  type: 'move' | 'rotate' | 'setJoint' | 'grab' | 'release' | 'stop';
  params: Record<string, any>;
};

export type RobotState = {
  robotId: string;
  position: Vector3;
  rotation: Quaternion;
  jointPositions: Record<string, number>;
  sensorReadings: SensorReading[];
  isMoving: boolean;
  isGrabbing: boolean;
  batteryLevel: number;
  errors: string[];
};
