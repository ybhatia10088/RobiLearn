import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import SceneContainer from '@/components/simulator/SceneContainer';
import ControlPanel from '@/components/simulator/ControlPanel';
import CodeEditor from '@/components/editor/CodeEditor';
import BlockEditor from '@/components/editor/BlockEditor';
import NaturalLanguageInput from '@/components/editor/NaturalLanguageInput';
import { Code, Blocks, MessageSquare, Book, ArrowLeft, CheckCircle, Target, Trophy, Play, Lightbulb, BookOpen } from 'lucide-react';
import { useNavigate } from '@/hooks/useNavigation';
import { Challenge, ChallengeCategory, DifficultyLevel } from '@/types/challenge.types';
import { useRobotStore } from '@/store/robotStore';
import { motion, AnimatePresence } from 'framer-motion';

type EditorTab = 'code' | 'blocks' | 'natural';

// Complete challenge data with proper integration
const challengeData: Record<string, Challenge> = {
  'intro-1': {
    id: 'intro-1',
    title: 'Hello Robot',
    description: 'Learn the fundamentals of robot programming with basic movement commands.',
    category: ChallengeCategory.INTRO,
    difficulty: DifficultyLevel.BEGINNER,
    estimatedTime: 15,
    objectives: [
      { 
        id: 'obj1', 
        description: 'Study basic robot movement commands',
        completionCriteria: 'theory_complete',
        completed: false,
        theory: `Robot movement is controlled through basic commands that specify:
- Direction (forward, backward, left, right)
- Speed (usually as a percentage or m/s)
- Duration (in milliseconds or seconds)`
      },
      { 
        id: 'obj2', 
        description: 'Move the robot forward 5 meters',
        completionCriteria: 'distance_forward_5m',
        completed: false,
        hints: [
          'Use robot.move() with the "forward" direction',
          'Set speed between 0 and 1',
          'Calculate duration based on speed and distance'
        ]
      },
      { 
        id: 'obj3', 
        description: 'Rotate the robot 90 degrees right',
        completionCriteria: 'rotation_90_degrees',
        completed: false,
        hints: [
          'Use robot.rotate() with the "right" direction',
          'Angle is specified in degrees',
          'Wait for rotation to complete'
        ]
      }
    ],
    hints: [
      { id: 'hint1', text: 'Start with lower speed for precise control', unlockCost: 0 },
      { id: 'hint2', text: 'Chain commands using async/await', unlockCost: 5 },
    ],
    startingCode: {
      natural_language: 'Move the robot forward and then turn right',
      block: '[]',
      code: `// Welcome to your first robot programming challenge!
// Complete the objectives by programming the robot

// Objective 1: Study the theory (completed when you read it)
// Objective 2: Move robot forward 5 meters
await robot.move({
  direction: "forward",
  speed: 0.5,
  duration: 4000  // Adjust for 5 meters
});

// Objective 3: Rotate robot 90 degrees right  
await robot.rotate({
  direction: "right",
  angle: 90
});

console.log("Challenge completed!");`
    },
    robotType: 'mobile',
    environmentId: 'tutorial-room',
    unlocked: true,
    completed: false,
    nextChallengeIds: ['intro-2'],
  },
  'intro-2': {
    id: 'intro-2',
    title: 'Using Sensors',
    description: 'Learn how to read and interpret sensor data for robot navigation.',
    category: ChallengeCategory.INTRO,
    difficulty: DifficultyLevel.BEGINNER,
    estimatedTime: 20,
    objectives: [
      {
        id: 'obj4',
        description: 'Study different types of sensors',
        completionCriteria: 'theory_complete',
        completed: false,
        theory: `Robots use various sensors:
1. Distance Sensors (Ultrasonic, Infrared)
2. Cameras (RGB, Depth)
3. Touch Sensors
4. Gyroscopes`
      },
      {
        id: 'obj5',
        description: 'Read the ultrasonic sensor',
        completionCriteria: 'sensor_read_complete',
        completed: false,
        hints: [
          'Use robot.getSensor("ultrasonic")',
          'Sensor returns distance in meters',
          'Values < 1 indicate nearby obstacles'
        ]
      }
    ],
    hints: [
      { id: 'hint3', text: 'Sensors return promises, use await', unlockCost: 5 },
      { id: 'hint4', text: 'Combine movement with sensor data', unlockCost: 10 },
    ],
    startingCode: {
      natural_language: 'Move forward until obstacle detected, then stop',
      block: '[]',
      code: `// Learn about robot sensors!

// Objective 1: Study sensor theory (completed when you read it)
// Objective 2: Read the ultrasonic sensor
const distance = await robot.getSensor("ultrasonic");
console.log("Distance to obstacle:", distance, "meters");

// Move forward while monitoring sensor
while (true) {
  const currentDistance = await robot.getSensor("ultrasonic");
  console.log("Current distance:", currentDistance);
  
  if (currentDistance < 1.0) {
    console.log("Obstacle detected! Stopping...");
    await robot.stop();
    break;
  }
  
  await robot.move({
    direction: "forward",
    speed: 0.3,
    duration: 100
  });
  
  await robot.wait(50);
}`
    },
    robotType: 'mobile',
    environmentId: 'sensor-course',
    unlocked: true,
    completed: false,
    nextChallengeIds: ['patrol-1'],
  },
  'patrol-1': {
    id: 'patrol-1',
    title: 'Security Patrol Route',
    description: 'Program the robot to follow a patrol route with multiple waypoints and turns.',
    category: ChallengeCategory.INTRO,
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedTime: 20,
    objectives: [
      {
        id: 'obj6',
        description: 'Understand waypoint navigation',
        completionCriteria: 'theory_complete',
        completed: false,
        theory: `Waypoint navigation involves:
- Planning a route with multiple stops
- Precise turning between waypoints
- Maintaining consistent speed
- Position verification at each point`
      },
      {
        id: 'obj7',
        description: 'Visit all 4 patrol waypoints in sequence',
        completionCriteria: 'waypoints_completed',
        completed: false,
        hints: [
          'Move to (3, 0), then (3, 3), then (0, 3), then back to (0, 0)',
          'Make precise 90-degree turns at each corner',
          'Verify position at each waypoint'
        ]
      }
    ],
    hints: [
      { id: 'hint5', text: 'Break the patrol into smaller movements', unlockCost: 10 },
      { id: 'hint6', text: 'Use a loop to visit each waypoint', unlockCost: 15 },
    ],
    startingCode: {
      natural_language: 'Follow a square patrol route visiting 4 waypoints',
      block: '[]',
      code: `// Security Patrol Mission
// Visit waypoints: (3,0) -> (3,3) -> (0,3) -> (0,0)

const waypoints = [
  {x: 3, z: 0}, {x: 3, z: 3}, {x: 0, z: 3}, {x: 0, z: 0}
];

console.log("Starting patrol route...");

for (let i = 0; i < waypoints.length; i++) {
  const target = waypoints[i];
  console.log(\`Moving to waypoint \${i + 1}: (\${target.x}, \${target.z})\`);
  
  // Move forward (adjust duration based on distance needed)
  await robot.move({
    direction: "forward",
    speed: 0.4,
    duration: 2000
  });
  
  // Turn 90 degrees right at each corner
  await robot.rotate({
    direction: "right",
    angle: 90
  });
  
  await robot.wait(500);
}

console.log("Patrol route completed!");`
    },
    robotType: 'mobile',
    environmentId: 'tutorial-room',
    unlocked: false,
    completed: false,
    nextChallengeIds: ['circle-1'],
  },
  'circle-1': {
    id: 'circle-1',
    title: 'Perfect Circle',
    description: 'Master curved movement by making the robot travel in a perfect circle.',
    category: ChallengeCategory.INTRO,
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedTime: 25,
    objectives: [
      {
        id: 'obj8',
        description: 'Understand circular motion mechanics',
        completionCriteria: 'theory_complete',
        completed: false,
        theory: `Circular movement requires:
- Continuous small turns while moving forward
- Consistent speed and turn rate
- Radius control through turn/speed ratio`
      },
      {
        id: 'obj9',
        description: 'Complete one full circle with 2m radius',
        completionCriteria: 'circle_completed',
        completed: false,
        hints: [
          'Use small, frequent turns while moving forward',
          'Keep the turn rate consistent for a perfect circle',
          'A full circle is 360 degrees of rotation'
        ]
      }
    ],
    hints: [
      { id: 'hint7', text: 'Try 5-degree turns with short forward movements', unlockCost: 10 },
      { id: 'hint8', text: 'Use a loop to repeat the turn-move pattern', unlockCost: 15 },
    ],
    startingCode: {
      natural_language: 'Move in a perfect circle',
      block: '[]',
      code: `// Circle Motion Challenge
// Create a perfect circle by combining small movements and turns

console.log("Starting circular motion...");

// Method: Small forward movement + small turn = circular path
for (let i = 0; i < 360; i += 5) {
  // Move forward a small amount
  await robot.move({
    direction: "forward",
    speed: 0.3,
    duration: 100
  });
  
  // Turn right 5 degrees
  await robot.rotate({
    direction: "right", 
    angle: 5
  });
  
  await robot.wait(50);
}

console.log("Circle completed!");`
    },
    robotType: 'mobile',
    environmentId: 'tutorial-room',
    unlocked: false,
    completed: false,
    nextChallengeIds: ['grid-1'],
  },
  'grid-1': {
    id: 'grid-1',
    title: 'Grid Navigation Master',
    description: 'Navigate efficiently through a grid system using coordinate-based movement.',
    category: ChallengeCategory.INTRO,
    difficulty: DifficultyLevel.INTERMEDIATE,
    estimatedTime: 20,
    objectives: [
      {
        id: 'obj10',
        description: 'Understand grid coordinate systems',
        completionCriteria: 'theory_complete',
        completed: false,
        theory: `Grid navigation involves:
- Understanding X,Z coordinate system
- Moving in cardinal directions (N,S,E,W)
- Calculating optimal paths`
      },
      {
        id: 'obj11',
        description: 'Visit 5 specific grid points in sequence',
        completionCriteria: 'grid_points_visited',
        completed: false,
        hints: [
          'Points: (2,2) -> (6,2) -> (6,6) -> (2,6) -> (4,4)',
          'Move in straight lines between points',
          'Face the correct direction before moving'
        ]
      }
    ],
    startingCode: {
      natural_language: 'Navigate through specific grid points',
      block: '[]',
      code: `// Grid Navigation Challenge
// Visit points: (2,2) -> (6,2) -> (6,6) -> (2,6) -> (4,4)

const gridPoints = [
  {x: 2, z: 2}, {x: 6, z: 2}, {x: 6, z: 6}, {x: 2, z: 6}, {x: 4, z: 4}
];

console.log("Starting grid navigation...");

for (let i = 0; i < gridPoints.length; i++) {
  const target = gridPoints[i];
  console.log(\`Moving to point \${i + 1}: (\${target.x}, \${target.z})\`);
  
  // Simple movement pattern (you can improve this!)
  await robot.move({
    direction: "forward",
    speed: 0.4,
    duration: 1500
  });
  
  await robot.rotate({
    direction: "right",
    angle: 45
  });
  
  await robot.wait(300);
}

console.log("Grid navigation completed!");`
    },
    robotType: 'mobile',
    environmentId: 'tutorial-room',
    unlocked: false,
    completed: false,
    nextChallengeIds: ['spiral-1'],
  },
  'spiral-1': {
    id: 'spiral-1',
    title: 'Spiral Search Pattern',
    description: 'Program the robot to move in an expanding spiral pattern.',
    category: ChallengeCategory.SEARCH_RESCUE,
    difficulty: DifficultyLevel.ADVANCED,
    estimatedTime: 25,
    objectives: [
      {
        id: 'obj12',
        description: 'Understand spiral movement algorithms',
        completionCriteria: 'theory_complete',
        completed: false,
        theory: `Spiral patterns follow:
1 step, turn, 1 step, turn, 2 steps, turn, 2 steps, turn, 3 steps...`
      },
      {
        id: 'obj13',
        description: 'Execute a 5-layer expanding spiral',
        completionCriteria: 'spiral_completed',
        completed: false,
        hints: [
          'Pattern: Right 1, Up 1, Left 2, Down 2, Right 3...',
          'Increase step count every 2 direction changes'
        ]
      }
    ],
    startingCode: {
      natural_language: 'Create an expanding spiral pattern',
      block: '[]',
      code: `// Spiral Search Pattern
// Pattern: 1,1,2,2,3,3,4,4,5,5 steps

const directions = ['right', 'up', 'left', 'down'];
let directionIndex = 0;
let steps = 1;
let directionChanges = 0;

console.log("Starting spiral search pattern...");

while (steps <= 5) {
  const currentDirection = directions[directionIndex];
  console.log(\`Moving \${currentDirection} for \${steps} steps\`);
  
  // Move in current direction for 'steps' number of times
  for (let i = 0; i < steps; i++) {
    await robot.move({
      direction: currentDirection,
      speed: 0.4,
      duration: 500
    });
    await robot.wait(100);
  }
  
  // Rotate to next direction
  await robot.rotate({
    direction: "left",
    angle: 90
  });
  
  directionIndex = (directionIndex + 1) % 4;
  directionChanges++;
  
  // Increase steps every 2 direction changes
  if (directionChanges % 2 === 0) {
    steps++;
  }
}

console.log("Spiral pattern completed!");`
    },
    robotType: 'mobile',
    environmentId: 'tutorial-room',
    unlocked: false,
    completed: false,
    nextChallengeIds: ['drone-1'],
  },
  'drone-1': {
    id: 'drone-1',
    title: 'Drone Flight Training',
    description: 'Master 3D movement with altitude control and hovering maneuvers.',
    category: ChallengeCategory.SEARCH_RESCUE,
    difficulty: DifficultyLevel.ADVANCED,
    estimatedTime: 30,
    objectives: [
      {
        id: 'obj14',
        description: 'Learn drone flight mechanics',
        completionCriteria: 'theory_complete',
        completed: false,
        theory: `Drone flight involves:
- Vertical takeoff and landing
- Altitude maintenance and control
- 3D positioning (X, Y, Z coordinates)`
      },
      {
        id: 'obj15',
        description: 'Perform takeoff to 2m altitude',
        completionCriteria: 'altitude_reached',
        completed: false,
        hints: [
          'Use robot.move with direction "up"',
          'Monitor altitude with robot.position.y'
        ]
      },
      {
        id: 'obj16',
        description: 'Execute figure-8 flight pattern',
        completionCriteria: 'figure8_completed',
        completed: false,
        hints: [
          'Combine forward movement with alternating turns',
          'Maintain consistent altitude throughout'
        ]
      }
    ],
    startingCode: {
      natural_language: 'Perform drone takeoff and execute figure-8 pattern',
      block: '[]',
      code: `// Drone Flight Training
console.log("Initializing drone systems...");

// Takeoff to 2m altitude
console.log("Taking off...");
await robot.move({
  direction: "up",
  speed: 0.5,
  duration: 3000
});

console.log("Altitude reached:", robot.position.y);

// Hover stabilization
await robot.wait(1000);

// Figure-8 pattern (two connected circles)
console.log("Starting figure-8 maneuver...");

// First loop of figure-8
for (let i = 0; i < 180; i += 10) {
  await robot.move({
    direction: "forward",
    speed: 0.3,
    duration: 150
  });
  await robot.rotate({
    direction: "right",
    angle: 10
  });
}

// Cross-over movement
await robot.move({
  direction: "forward",
  speed: 0.3,
  duration: 500
});

// Second loop of figure-8 (opposite direction)
for (let i = 0; i < 180; i += 10) {
  await robot.move({
    direction: "forward",
    speed: 0.3,
    duration: 150
  });
  await robot.rotate({
    direction: "left",
    angle: 10
  });
}

console.log("Figure-8 completed! Landing...");

// Landing sequence
await robot.move({
  direction: "down",
  speed: 0.3,
  duration: 3000
});

console.log("Landing complete!");`
    },
    robotType: 'drone',
    environmentId: 'tutorial-room',
    unlocked: false,
    completed: false,
    nextChallengeIds: ['arm-1'],
  },
  'arm-1': {
    id: 'arm-1',
    title: 'Robotic Arm Precision',
    description: 'Master precise joint control and coordinate manipulation tasks.',
    category: ChallengeCategory.MANUFACTURING,
    difficulty: DifficultyLevel.ADVANCED,
    estimatedTime: 25,
    objectives: [
      {
        id: 'obj17',
        description: 'Understand robotic arm kinematics',
        completionCriteria: 'theory_complete',
        completed: false,
        theory: `Robotic arms use multiple joints:
- Base rotation (around Y-axis)
- Shoulder pitch (up/down)
- Elbow pitch (bend/extend)
- Wrist rotation and pitch`
      },
      {
        id: 'obj18',
        description: 'Move each joint through its range',
        completionCriteria: 'joints_exercised',
        completed: false,
        hints: [
          'Use robot.move with joint parameter',
          'Test base, shoulder, elbow, and wrist'
        ]
      },
      {
        id: 'obj19',
        description: 'Perform pick and place sequence',
        completionCriteria: 'pick_place_completed',
        completed: false,
        hints: [
          'Position arm over object',
          'Lower to grab height',
          'Close gripper and lift'
        ]
      }
    ],
    startingCode: {
      natural_language: 'Control robotic arm joints and perform pick-and-place',
      block: '[]',
      code: `// Robotic Arm Precision Challenge
console.log("Initializing robotic arm...");

// Exercise each joint
console.log("Testing joint movements...");

// Base rotation
await robot.move({
  direction: "right",
  speed: 0.3,
  joint: "base",
  duration: 1000
});
await robot.move({
  direction: "left", 
  speed: 0.3,
  joint: "base",
  duration: 2000
});

// Shoulder movement
await robot.move({
  direction: "forward",
  speed: 0.3,
  joint: "shoulder", 
  duration: 1000
});

// Elbow movement
await robot.move({
  direction: "forward",
  speed: 0.3,
  joint: "elbow",
  duration: 800
});

// Wrist movement
await robot.move({
  direction: "right",
  speed: 0.3,
  joint: "wrist",
  duration: 600
});

console.log("Joint exercise complete!");

// Pick and place sequence
console.log("Starting pick and place...");

// Position over object
await robot.move({
  direction: "right",
  speed: 0.2,
  joint: "base",
  duration: 1500
});

// Grab object
await robot.grab();
await robot.wait(500);

// Move to target location
await robot.move({
  direction: "left",
  speed: 0.2,
  joint: "base",
  duration: 3000
});

await robot.releaseObject();
console.log("Pick and place completed!");`
    },
    robotType: 'arm',
    environmentId: 'tutorial-room',
    unlocked: false,
    completed: false,
    nextChallengeIds: ['spider-1'],
  },
  'spider-1': {
    id: 'spider-1',
    title: 'Spider Locomotion',
    description: 'Master multi-legged robot movement and climbing techniques.',
    category: ChallengeCategory.SEARCH_RESCUE,
    difficulty: DifficultyLevel.EXPERT,
    estimatedTime: 30,
    objectives: [
      {
        id: 'obj20',
        description: 'Understand multi-legged locomotion',
        completionCriteria: 'theory_complete',
        completed: false,
        theory: `Spider robots use multiple legs for:
- Distributed weight and stability
- Redundancy if legs are damaged
- Climbing on various surfaces`
      },
      {
        id: 'obj21',
        description: 'Demonstrate stable walking gait',
        completionCriteria: 'gait_demonstrated',
        completed: false,
        hints: [
          'Move legs in alternating patterns',
          'Maintain 3-point contact for stability'
        ]
      },
      {
        id: 'obj22',
        description: 'Navigate complex terrain',
        completionCriteria: 'terrain_navigated',
        completed: false,
        hints: [
          'Adjust leg positions for obstacles',
          'Use sensors to detect surfaces'
        ]
      }
    ],
    startingCode: {
      natural_language: 'Demonstrate spider robot walking and climbing',
      block: '[]',
      code: `// Spider Locomotion Challenge
console.log("Activating spider locomotion systems...");

// Basic walking gait demonstration
console.log("Demonstrating walking gait...");

// Spider walking pattern
for (let step = 0; step < 8; step++) {
  console.log(\`Step \${step + 1}/8\`);
  
  await robot.move({
    direction: "forward",
    speed: 0.4,
    duration: 800
  });
  
  await robot.wait(200);
}

console.log("Straight walking completed!");

// Turning demonstration
console.log("Demonstrating turning maneuvers...");

for (let turn = 0; turn < 4; turn++) {
  await robot.rotate({
    direction: "right",
    angle: 90
  });
  
  await robot.move({
    direction: "forward", 
    speed: 0.3,
    duration: 600
  });
  
  await robot.wait(300);
}

console.log("Square pattern completed!");

// Complex terrain navigation
console.log("Navigating complex terrain...");

for (let i = 0; i < 6; i++) {
  const distance = await robot.getSensor("ultrasonic");
  console.log(\`Obstacle distance: \${distance.toFixed(2)}m\`);
  
  if (distance > 1.0) {
    await robot.move({
      direction: "forward",
      speed: 0.3,
      duration: 500
    });
  } else {
    console.log("Obstacle detected, navigating around...");
    
    await robot.rotate({
      direction: "left", 
      angle: 45
    });
    
    await robot.move({
      direction: "forward",
      speed: 0.3,
      duration: 700
    });
    
    await robot.rotate({
      direction: "right",
      angle: 90
    });
  }
  
  await robot.wait(250);
}

console.log("Spider locomotion challenge complete!");`
    },
    robotType: 'spider',
    environmentId: 'tutorial-room',
    unlocked: false,
    completed: false,
    nextChallengeIds: ['tank-1'],
  },
  'tank-1': {
    id: 'tank-1',
    title: 'Tank Maneuvers',
    description: 'Master tracked vehicle movement and tactical positioning.',
    category: ChallengeCategory.SEARCH_RESCUE,
    difficulty: DifficultyLevel.EXPERT,
    estimatedTime: 25,
    objectives: [
      {
        id: 'obj23',
        description: 'Understand tracked vehicle dynamics',
        completionCriteria: 'theory_complete',
        completed: false,
        theory: `Tank robots use tracks for:
- High traction on rough surfaces
- Ability to climb obstacles
- Differential steering (skid steering)`
      },
      {
        id: 'obj24',
        description: 'Execute precision maneuvers',
        completionCriteria: 'maneuvers_completed',
        completed: false,
        hints: [
          'Use pivot turns for tight spaces',
          'Tracks provide excellent grip'
        ]
      },
      {
        id: 'obj25',
        description: 'Demonstrate tactical positioning',
        completionCriteria: 'positioning_completed',
        completed: false,
        hints: [
          'Find optimal vantage points',
          'Use cover and concealment'
        ]
      }
    ],
    startingCode: {
      natural_language: 'Demonstrate tank maneuvers and tactical positioning',
      block: '[]',
      code: `// Tank Maneuvers Challenge
console.log("Tank systems online. Beginning maneuver training...");

// Precision movement demonstration
console.log("Demonstrating precision maneuvers...");

// Forward advance
await robot.move({
  direction: "forward",
  speed: 0.6,
  duration: 2000
});

// Pivot turn (zero radius)
console.log("Executing pivot turn...");
await robot.rotate({
  direction: "right",
  angle: 90
});

// Side movement
await robot.move({
  direction: "forward",
  speed: 0.5,
  duration: 1500
});

// Reverse movement
console.log("Tactical reverse...");
await robot.move({
  direction: "backward",
  speed: 0.4,
  duration: 1000
});

// Another pivot turn
await robot.rotate({
  direction: "left",
  angle: 180
});

console.log("Basic maneuvers completed!");

// Tactical positioning sequence
console.log("Beginning tactical positioning...");

const positions = [
  { name: "Overwatch Position", x: 4, z: 2 },
  { name: "Flanking Position", x: 2, z: 4 },
  { name: "Cover Position", x: -2, z: 3 },
  { name: "Rally Point", x: 0, z: 0 }
];

for (let i = 0; i < positions.length; i++) {
  const pos = positions[i];
  console.log(\`Moving to \${pos.name}...\`);
  
  // Move to position (simplified)
  await robot.move({
    direction: "forward",
    speed: 0.5,
    duration: 2000
  });
  
  // 360-degree scan
  for (let scan = 0; scan < 4; scan++) {
    await robot.rotate({
      direction: "right",
      angle: 90
    });
    
    const distance = await robot.getSensor("ultrasonic");
    console.log(\`Scan \${scan + 1}: \${distance.toFixed(2)}m\`);
    
    await robot.wait(300);
  }
  
  await robot.wait(500);
}

console.log("Tank maneuvers training complete!");`
    },
    robotType: 'tank',
    environmentId: 'tutorial-room',
    unlocked: false,
    completed: false,
    nextChallengeIds: ['humanoid-1'],
  },
  'humanoid-1': {
    id: 'humanoid-1',
    title: 'Humanoid Walking',
    description: 'Master bipedal locomotion and human-like movement patterns.',
    category: ChallengeCategory.MANUFACTURING,
    difficulty: DifficultyLevel.EXPERT,
    estimatedTime: 35,
    objectives: [
      {
        id: 'obj26',
        description: 'Understand bipedal locomotion',
        completionCriteria: 'theory_complete',
        completed: false,
        theory: `Humanoid robots simulate human movement:
- Bipedal walking requires constant balance
- Center of gravity management is critical
- Gait cycles: stance and swing phases`
      },
      {
        id: 'obj27',
        description: 'Demonstrate stable walking cycle',
        completionCriteria: 'walking_demonstrated',
        completed: false,
        hints: [
          'Start with slow, deliberate steps',
          'Maintain balance throughout cycle'
        ]
      },
      {
        id: 'obj28',
        description: 'Perform complex movements',
        completionCriteria: 'complex_movements',
        completed: false,
        hints: [
          'Combine walking with arm gestures',
          'Try different walking speeds'
        ]
      }
    ],
    startingCode: {
      natural_language: 'Demonstrate humanoid walking and complex movements',
      block: '[]',
      code: `// Humanoid Walking Challenge
console.log("Initializing humanoid locomotion systems...");

// Basic walking demonstration
console.log("Beginning walking cycle demonstration...");

// Start walking sequence
for (let step = 0; step < 12; step++) {
  console.log(\`Walking step \${step + 1}/12\`);
  
  await robot.move({
    direction: "forward",
    speed: 0.5,
    duration: 600
  });
  
  await robot.wait(150);
}

console.log("Straight walking completed!");

// Turning while walking
console.log("Demonstrating walking turns...");

for (let turn = 0; turn < 4; turn++) {
  console.log(\`Turn \${turn + 1}/4\`);
  
  for (let step = 0; step < 3; step++) {
    await robot.move({
      direction: "forward",
      speed: 0.4,
      duration: 400
    });
    
    await robot.rotate({
      direction: "right",
      angle: 30
    });
    
    await robot.wait(100);
  }
}

console.log("Walking turns completed!");

// Different walking speeds
const speeds = [
  { name: "Slow walk", speed: 0.3, duration: 800 },
  { name: "Normal walk", speed: 0.5, duration: 600 },
  { name: "Fast walk", speed: 0.7, duration: 400 }
];

for (let i = 0; i < speeds.length; i++) {
  const gait = speeds[i];
  console.log(\`Demonstrating \${gait.name}...\`);
  
  for (let step = 0; step < 6; step++) {
    await robot.move({
      direction: "forward",
      speed: gait.speed,
      duration: gait.duration
    });
    
    await robot.wait(gait.duration * 0.2);
  }
  
  await robot.wait(500);
}

console.log("Humanoid locomotion demonstration complete!");`
    },
    robotType: 'humanoid',
    environmentId: 'tutorial-room',
    unlocked: false,
    completed: false,
    nextChallengeIds: [],
  }
};

const SimulatorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EditorTab>('code');
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [code, setCode] = useState<string>('// Welcome to the Robot Simulator!\n// Select a robot from the control panel and start programming\n\nconsole.log("Hello, Robot!");');
  const [showTheoryModal, setShowTheoryModal] = useState(false);
  const [showHintsModal, setShowHintsModal] = useState(false);
  const navigate = useNavigate();
  
  const { 
    setCurrentChallenge: setStoreChallengeId,
    challengeTracking,
    getObjectiveStatus,
    getChallengeStatus,
    markTheoryViewed,
    moveRobot,
    rotateRobot,
    grabObject,
    readSensor,
    stopRobot,
    robotState
  } = useRobotStore();

  // Load challenge from URL parameter (optional)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const challengeId = params.get('challenge');
    
    if (challengeId && challengeData[challengeId]) {
      const challenge = challengeData[challengeId];
      setCurrentChallenge(challenge);
      setCode(challenge.startingCode.code);
      setStoreChallengeId(challengeId);
      
      console.log(`🎯 Loaded challenge: ${challenge.title}`);
    } else {
      // Standalone simulator mode
      setCurrentChallenge(null);
      setStoreChallengeId(null);
      setCode('// Welcome to the Robot Simulator!\n// Select a robot from the control panel and start programming\n\nconsole.log("Hello, Robot!");');
    }
  }, [setStoreChallengeId]);

  // Real-time objective completion listener
  useEffect(() => {
    const handleObjectiveCompleted = (event: CustomEvent) => {
      const { objectiveId, challengeId } = event.detail;
      console.log(`✅ Objective completed: ${objectiveId} in ${challengeId}`);
      
      // Update current challenge objectives if we're in challenge mode
      if (currentChallenge && challengeId === currentChallenge.id) {
        setCurrentChallenge(prev => prev ? {
          ...prev,
          objectives: prev.objectives.map(obj => 
            obj.id === objectiveId ? { ...obj, completed: true } : obj
          )
        } : null);
      }
    };

    const handleChallengeCompleted = (event: CustomEvent) => {
      const { challengeId } = event.detail;
      console.log(`🏆 Challenge completed: ${challengeId}`);
      
      if (currentChallenge && challengeId === currentChallenge.id) {
        setCurrentChallenge(prev => prev ? { ...prev, completed: true } : null);
      }
    };

    window.addEventListener('objectiveCompleted', handleObjectiveCompleted as EventListener);
    window.addEventListener('challengeCompleted', handleChallengeCompleted as EventListener);
    
    return () => {
      window.removeEventListener('objectiveCompleted', handleObjectiveCompleted as EventListener);
      window.removeEventListener('challengeCompleted', handleChallengeCompleted as EventListener);
    };
  }, [currentChallenge]);

  // Update objectives based on store state
  useEffect(() => {
    if (currentChallenge) {
      const updatedObjectives = currentChallenge.objectives.map(obj => ({
        ...obj,
        completed: getObjectiveStatus(obj.id)
      }));
      
      const hasChanges = updatedObjectives.some((obj, index) => 
        obj.completed !== currentChallenge.objectives[index]?.completed
      );
      
      if (hasChanges) {
        setCurrentChallenge(prev => prev ? {
          ...prev,
          objectives: updatedObjectives,
          completed: getChallengeStatus(prev.id)
        } : null);
      }
    }
  }, [currentChallenge, getObjectiveStatus, getChallengeStatus, challengeTracking.completedObjectives]);

  const handleCodeRun = async (codeToRun: string) => {
    console.log('🚀 Running code:', codeToRun);
    
    // Mark theory as viewed for theory-based objectives if in challenge mode
    if (currentChallenge) {
      const theoryMap: Record<string, string> = {
        'intro-1': 'movement_basics',
        'intro-2': 'sensor_basics',
        'patrol-1': 'waypoint_navigation',
        'circle-1': 'circular_motion',
        'grid-1': 'grid_navigation',
        'spiral-1': 'spiral_algorithms',
        'drone-1': 'drone_flight',
        'arm-1': 'arm_kinematics',
        'spider-1': 'multi_leg_locomotion',
        'tank-1': 'tracked_vehicles',
        'humanoid-1': 'bipedal_locomotion'
      };
      
      const theoryId = theoryMap[currentChallenge.id];
      if (theoryId) {
        markTheoryViewed(theoryId);
      }
    }
    
    try {
      // Create robot API that integrates with the store and tracks objectives
      const robot = {
        move: async (params: { direction: string; speed: number; duration: number; joint?: string }) => {
          console.log('🤖 Robot moving:', params);
          
          const normalizedSpeed = Math.max(0.1, Math.min(1.0, params.speed));
          
          await stopRobot();
          await new Promise(resolve => setTimeout(resolve, 100));
          
          if (params.joint) {
            // Joint movement for arm
            moveRobot({ 
              direction: params.direction as any, 
              speed: normalizedSpeed, 
              joint: params.joint as any 
            });
          } else if (params.direction === 'forward' || params.direction === 'backward') {
            moveRobot({ direction: params.direction as any, speed: normalizedSpeed });
          } else {
            rotateRobot({ direction: params.direction as any, speed: normalizedSpeed });
          }
          
          // Wait for the specified duration
          await new Promise(resolve => setTimeout(resolve, params.duration));
          await stopRobot();
          
          // Update challenge tracking after movement
          const state = useRobotStore.getState();
          const newTracking = { ...state.challengeTracking };
          
          // Calculate distance moved based on speed and duration
          const distance = (normalizedSpeed * params.duration) / 1000;
          newTracking.totalDistanceMoved += distance;
          
          if (params.direction === 'forward') {
            newTracking.hasMovedForward = true;
            newTracking.maxForwardDistance += distance;
          } else if (params.direction === 'backward') {
            newTracking.hasMovedBackward = true;
            newTracking.maxBackwardDistance += distance;
          }
          
          useRobotStore.setState({
            challengeTracking: newTracking
          });
          
          setTimeout(() => {
            state.checkAndCompleteObjectives();
          }, 100);
        },
        
        rotate: async (params: { direction: string; angle: number }) => {
          console.log('🔄 Robot rotating:', params);
          
          const normalizedSpeed = 0.5;
          const duration = Math.max(300, params.angle * 10);
          
          await stopRobot();
          await new Promise(resolve => setTimeout(resolve, 100));
          
          rotateRobot({ direction: params.direction as any, speed: normalizedSpeed });
          await new Promise(resolve => setTimeout(resolve, duration));
          await stopRobot();
          
          const state = useRobotStore.getState();
          const newTracking = { ...state.challengeTracking };
          
          const angleInRadians = (params.angle * Math.PI) / 180;
          newTracking.totalRotations += angleInRadians;
          newTracking.totalRotationAngle += angleInRadians;
          
          if (params.direction === 'left') {
            newTracking.hasRotatedLeft = true;
          } else {
            newTracking.hasRotatedRight = true;
          }
          
          useRobotStore.setState({
            challengeTracking: newTracking
          });
          
          setTimeout(() => {
            state.checkAndCompleteObjectives();
          }, 100);
        },
        
        stop: async () => {
          console.log('⏹️ Robot stopping');
          stopRobot();
          return Promise.resolve();
        },
        
        wait: async (ms: number) => {
          console.log(`⏱️ Waiting ${ms}ms`);
          return new Promise(resolve => setTimeout(resolve, ms));
        },
        
       getSensor: async (type: string) => {
  console.log('📡 Reading sensor:', type);
  const reading = await readSensor(type);
  console.log(`📊 Sensor reading: ${reading}`);
  
  // Trigger objective check after sensor reading
  setTimeout(() => {
    const state = useRobotStore.getState();
    state.checkAndCompleteObjectives();
  }, 200);
  
  return reading;
},
        
        grab: async () => {
          console.log('🤏 Grabbing object');
          grabObject();
          return Promise.resolve();
        },
        
        releaseObject: async () => {
          console.log('🤲 Releasing object');
          // Add release object functionality to store if needed
          return Promise.resolve();
        },
        
        get position() {
          return robotState?.position || { x: 0, y: 0, z: 0 };
        }
      };
      
      // Execute the code with the robot API
      const asyncFunction = new Function('robot', `
        return (async () => {
          ${codeToRun}
        })();
      `);
      
      await asyncFunction(robot);
      console.log('✅ Code execution completed');
      
    } catch (error) {
      console.error('❌ Code execution error:', error);
      alert(`Code Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getCompletedObjectivesCount = () => {
    if (!currentChallenge) return { completed: 0, total: 0 };
    const completed = currentChallenge.objectives.filter(obj => obj.completed).length;
    return { completed, total: currentChallenge.objectives.length };
  };

  const progress = getCompletedObjectivesCount();
  const progressPercentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

  // Handle opening theory modal and marking theory as viewed
  const handleOpenTheoryModal = () => {
    setShowTheoryModal(true);
    
    // Mark theory as viewed when modal is opened
    if (currentChallenge) {
      const theoryMap: Record<string, string> = {
        'intro-1': 'movement_basics',
        'intro-2': 'sensor_basics',
        'patrol-1': 'waypoint_navigation',
        'circle-1': 'circular_motion',
        'grid-1': 'grid_navigation',
        'spiral-1': 'spiral_algorithms',
        'drone-1': 'drone_flight',
        'arm-1': 'arm_kinematics',
        'spider-1': 'multi_leg_locomotion',
        'tank-1': 'tracked_vehicles',
        'humanoid-1': 'bipedal_locomotion'
      };
      
      const theoryId = theoryMap[currentChallenge.id];
      if (theoryId) {
        markTheoryViewed(theoryId);
      }
    }
  };

  // Theory Modal Component
  const TheoryModal = () => {
    if (!showTheoryModal || !currentChallenge) return null;

    const theoryObjective = currentChallenge.objectives.find(obj => obj.theory);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-dark-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-dark-600">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <BookOpen className="mr-2" />
                Theory - {currentChallenge.title}
              </h2>
              <button 
                onClick={() => setShowTheoryModal(false)}
                className="text-dark-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            {theoryObjective && (
              <div className="p-4 bg-dark-700 rounded-lg border border-dark-600">
                <pre className="text-dark-300 whitespace-pre-wrap text-sm">
                  {theoryObjective.theory}
                </pre>
              </div>
            )}
            
            <div className="bg-success-900/20 border border-success-600 rounded-lg p-4 mt-4">
              <div className="flex items-center text-success-400 mb-2">
                <CheckCircle size={16} className="mr-2" />
                <span className="font-medium">Theory Study Complete!</span>
              </div>
              <p className="text-success-300 text-sm">
                Theory-based objectives will be marked as complete.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Hints Modal Component
  const HintsModal = () => {
    if (!showHintsModal || !currentChallenge) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-dark-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-dark-600">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Lightbulb className="mr-2" />
                Hints - {currentChallenge.title}
              </h2>
              <button 
                onClick={() => setShowHintsModal(false)}
                className="text-dark-400 hover:text-white"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              {currentChallenge.hints?.map((hint, index) => (
                <div key={hint.id} className="p-4 bg-dark-700 rounded-lg border border-dark-600">
                  <h3 className="text-white font-medium mb-2">Hint #{index + 1}</h3>
                  <p className="text-dark-300">{hint.text}</p>
                </div>
              ))}
              
              {currentChallenge.objectives?.map((objective) => 
                objective.hints?.map((hint, hintIndex) => (
                  <div key={`${objective.id}-${hintIndex}`} className="p-4 bg-dark-700 rounded-lg border border-dark-600">
                    <h3 className="text-white font-medium mb-2">
                      {objective.description} - Hint #{hintIndex + 1}
                    </h3>
                    <p className="text-dark-300">{hint}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <div className="min-h-[calc(100vh-var(--header-height)-var(--footer-height))] bg-dark-900">
        {/* Challenge Header - Only show if in challenge mode */}
        {currentChallenge && (
          <>
            <div className="px-6 py-6 bg-dark-800 border-b border-dark-600">
              <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <button 
                      className="btn bg-dark-700 hover:bg-dark-600 text-white p-2.5 rounded-lg transition-colors"
                      onClick={() => navigate('/challenges')}
                    >
                      <ArrowLeft size={20} />
                    </button>
                    <div>
                      <h1 className="text-2xl font-bold text-white mb-2">{currentChallenge.title}</h1>
                      <p className="text-dark-300 text-lg">{currentChallenge.description}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-sm text-dark-400">
                          Progress: {progress.completed}/{progress.total} objectives ({progressPercentage}%)
                        </span>
                        {currentChallenge.completed && (
                          <span className="flex items-center text-success-400 text-sm">
                            <Trophy size={16} className="mr-1" />
                            Challenge Complete!
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="hidden lg:flex space-x-3">
                    <button
                      onClick={handleOpenTheoryModal}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded flex items-center text-sm"
                    >
                      <BookOpen size={14} className="mr-2" />
                      Theory
                    </button>
                    <button
                      onClick={() => setShowHintsModal(true)}
                      className="bg-warning-600 hover:bg-warning-700 text-white px-4 py-2 rounded flex items-center text-sm"
                    >
                      <Lightbulb size={14} className="mr-2" />
                      Hints
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Objectives Panel - Only show if in challenge mode */}
            <div className="px-6 py-4 bg-dark-850 border-b border-dark-600">
              <div className="max-w-7xl mx-auto">
                <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
                  <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <Target size={18} className="mr-2" />
                    Challenge Objectives
                  </h3>
                  
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-dark-400">Overall Progress</span>
                      <span className="text-sm text-dark-400">{progressPercentage}%</span>
                    </div>
                    <div className="w-full bg-dark-600 rounded-full h-3">
                      <motion.div
                        className={`h-3 rounded-full transition-all ${
                          currentChallenge.completed ? 'bg-success-500' : 'bg-primary-500'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentChallenge.objectives.map((objective, index) => (
                      <motion.div
                        key={objective.id}
                        className={`p-4 rounded-lg border transition-all ${
                          objective.completed
                            ? 'bg-success-900/20 border-success-700'
                            : 'bg-dark-600 border-dark-500'
                        }`}
                        animate={objective.completed ? { backgroundColor: 'rgba(34, 197, 94, 0.1)' } : {}}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="flex items-start">
                          <div className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center transition-colors mt-0.5 ${
                            objective.completed 
                              ? 'bg-success-500 text-white' 
                              : 'bg-dark-500 text-dark-300'
                          }`}>
                            <AnimatePresence>
                              {objective.completed ? (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  exit={{ scale: 0 }}
                                >
                                  <CheckCircle size={14} />
                                </motion.div>
                              ) : (
                                <span className="text-xs font-bold">{index + 1}</span>
                              )}
                            </AnimatePresence>
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm font-medium transition-colors ${
                              objective.completed ? 'text-success-300' : 'text-white'
                            }`}>
                              {objective.description}
                            </p>
                            {objective.completed && (
                              <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-success-400 text-xs mt-1 font-medium"
                              >
                                ✓ Completed!
                              </motion.p>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Standalone Simulator Header - Only show if not in challenge mode */}
        {!currentChallenge && (
          <div className="px-6 py-6 bg-dark-800 border-b border-dark-600">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-bold text-white mb-2">Robot Simulator</h1>
              <p className="text-dark-300 text-lg">Program and control robots in a virtual environment</p>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {/* 3D Scene */}
              <div className="h-[600px] bg-dark-800 rounded-xl border border-dark-600 overflow-hidden shadow-xl">
                <SceneContainer />
              </div>
              
              {/* Code Editor */}
              <div className="editor-container shadow-xl">
                <div className="flex border-b border-dark-600 bg-dark-800 px-2">
                  <button 
                    className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'code' 
                        ? 'text-primary-400 border-b-2 border-primary-400 bg-dark-900' 
                        : 'text-dark-300 hover:text-dark-200 hover:bg-dark-700'
                    }`}
                    onClick={() => setActiveTab('code')}
                  >
                    <Code size={16} className="mr-2" />
                    <span>Code Editor</span>
                  </button>
                  <button 
                    className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'blocks' 
                        ? 'text-primary-400 border-b-2 border-primary-400 bg-dark-900' 
                        : 'text-dark-300 hover:text-dark-200 hover:bg-dark-700'
                    }`}
                    onClick={() => setActiveTab('blocks')}
                  >
                    <Blocks size={16} className="mr-2" />
                    <span>Block Editor</span>
                  </button>
                  <button 
                    className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'natural' 
                        ? 'text-primary-400 border-b-2 border-primary-400 bg-dark-900' 
                        : 'text-dark-300 hover:text-dark-200 hover:bg-dark-700'
                    }`}
                    onClick={() => setActiveTab('natural')}
                  >
                    <MessageSquare size={16} className="mr-2" />
                    <span>Natural Language</span>
                  </button>
                </div>
                
                <div className="editor-content">
                  {activeTab === 'code' && (
                    <CodeEditor 
                      initialCode={code}
                      onCodeChange={setCode}
                      onCodeRun={handleCodeRun}
                    />
                  )}
                  {activeTab === 'blocks' && <BlockEditor />}
                  {activeTab === 'natural' && <NaturalLanguageInput />}
                </div>
              </div>
            </div>
            
            {/* Control Panel */}
            <div className="h-full">
              <ControlPanel challenge={currentChallenge} />
            </div>
          </div>
        </div>
      </div>

      {/* Modals - Only show if in challenge mode */}
      {currentChallenge && (
        <>
          <TheoryModal />
          <HintsModal />
        </>
      )}
    </Layout>
  );
};

export default SimulatorPage;
