import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from '@/components/layout/Layout';
import { ChevronRight, ChevronDown, Trophy, LockKeyhole, Star, Book, Tag, Play, CheckCircle, Clock, Target, Award, HelpCircle, Eye, BookOpen, Code, Lightbulb, X } from 'lucide-react';
import { useNavigate } from '@/hooks/useNavigation';
import { useRobotStore } from '@/store/robotStore';
import { ChallengeCategory, DifficultyLevel, Challenge } from '@/types/challenge.types';
import { motion, AnimatePresence } from 'framer-motion';

// Complete challenge data with proper completion tracking
const challenges: Challenge[] = [
  {
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
- Duration (in milliseconds or seconds)

Example command:
robot.move({
  direction: "forward",
  speed: 0.5,  // 50% speed
  duration: 2000  // 2 seconds
});`
      },
      { 
        id: 'obj2', 
        description: 'Move the robot forward 5 meters',
        completionCriteria: 'distance_forward_5m',
        completed: false,
        hints: [
          'Use robot.move() with the "forward" direction',
          'Set an appropriate speed between 0 and 1',
          'Calculate the duration based on speed and distance'
        ]
      },
      { 
        id: 'obj3', 
        description: 'Rotate the robot 90 degrees right',
        completionCriteria: 'rotation_90_degrees',
        completed: false,
        hints: [
          'Use robot.rotate() with the "right" direction',
          'The angle is specified in degrees',
          'Make sure to wait for the rotation to complete'
        ]
      }
    ],
    hints: [
      { id: 'hint1', text: 'Start with a lower speed for more precise control', unlockCost: 0 },
      { id: 'hint2', text: 'You can chain commands using async/await', unlockCost: 5 },
    ],
    startingCode: {
      natural_language: 'Move the robot forward and then turn right',
      block: '[]',
      code: `// Welcome to your first robot programming challenge!
// Follow the comments to complete each objective

// First, let's move the robot forward
// Use robot.move() with appropriate parameters

// Then, wait for the movement to complete
// Hint: Use await robot.wait()

// Finally, rotate the robot 90 degrees right
// Use robot.rotate() with appropriate parameters`
    },
    theory: {
      sections: [
        {
          title: 'Understanding Robot Movement',
          content: `Robots move through space using a coordinate system:
- X axis: Left/Right movement
- Y axis: Up/Down movement  
- Z axis: Forward/Backward movement

When you command a robot to move, you're changing its position along these axes.`,
          video: 'https://example.com/robot-movement-basics',
        },
        {
          title: 'Basic Movement Commands',
          content: `The robot.move() command accepts several parameters:
- direction: The direction to move ("forward", "backward", "left", "right")
- speed: A value between 0 and 1 (0% to 100% speed)
- duration: Time in milliseconds

Example:
robot.move({ direction: "forward", speed: 0.5, duration: 2000 });`,
          examples: [
            {
              title: 'Moving Forward',
              code: 'robot.move({ direction: "forward", speed: 0.5, duration: 2000 });',
              explanation: 'Moves the robot forward at 50% speed for 2 seconds'
            },
            {
              title: 'Rotating',
              code: 'robot.rotate({ direction: "right", angle: 90 });',
              explanation: 'Rotates the robot 90 degrees to the right'
            }
          ]
        }
      ],
      quiz: [
        {
          question: 'What parameter controls the robot\'s movement speed?',
          options: ['velocity', 'speed', 'rate', 'pace'],
          correctAnswer: 'speed',
          explanation: 'The speed parameter accepts a value between 0 and 1, representing 0% to 100% of maximum speed.'
        },
        {
          question: 'How is duration specified in robot.move()?',
          options: ['Seconds', 'Milliseconds', 'Minutes', 'Steps'],
          correctAnswer: 'Milliseconds',
          explanation: 'Duration is specified in milliseconds. For example, 2000 milliseconds equals 2 seconds.'
        }
      ]
    },
    robotType: 'mobile',
    environmentId: 'tutorial-room',
    unlocked: true,
    completed: false,
    nextChallengeIds: ['intro-2'],
  },
  {
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
        theory: `Robots use various sensors to perceive their environment:
1. Distance Sensors (Ultrasonic, Infrared)
2. Cameras (RGB, Depth)
3. Touch Sensors
4. Gyroscopes

Each sensor provides specific data about the environment.`
      },
      {
        id: 'obj5',
        description: 'Read the ultrasonic sensor',
        completionCriteria: 'sensor_read_complete',
        completed: false,
        hints: [
          'Use robot.getSensor("ultrasonic")',
          'The sensor returns distance in meters',
          'Values less than 1 indicate nearby obstacles'
        ]
      }
    ],
    hints: [
      { id: 'hint3', text: 'Sensors return promises, use await to get readings', unlockCost: 5 },
      { id: 'hint4', text: 'Combine movement and sensor data for smart navigation', unlockCost: 10 },
    ],
    startingCode: {
      natural_language: 'Move forward until you detect an obstacle, then stop',
      block: '[]',
      code: `// Let's learn about robot sensors!

// First, get a reading from the ultrasonic sensor
const distance = await robot.getSensor("ultrasonic");
console.log("Distance to obstacle:", distance, "meters");

// Now, let's move forward while checking the sensor
// Add your code here to:
// 1. Move forward
// 2. Continuously check the sensor  
// 3. Stop when an obstacle is detected`
    },
    theory: {
      sections: [
        {
          title: 'Introduction to Robot Sensors',
          content: `Sensors are crucial for robots to understand their environment. They provide:
- Distance measurements
- Visual information
- Orientation data
- Touch detection

Each sensor type has specific uses and limitations.`,
          video: 'https://example.com/robot-sensors-intro',
        }
      ],
      quiz: [
        {
          question: 'What unit does the ultrasonic sensor use for distance?',
          options: ['Centimeters', 'Meters', 'Feet', 'Inches'],
          correctAnswer: 'Meters',
          explanation: 'The ultrasonic sensor returns distance measurements in meters.'
        }
      ]
    },
    robotType: 'mobile',
    environmentId: 'sensor-course',
    unlocked: true,
    completed: false,
    nextChallengeIds: ['patrol-1'],
  },
  {
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

// Add your patrol logic here
// Remember to move to each waypoint and rotate as needed`
    },
    theory: {
      sections: [
        {
          title: 'Waypoint Navigation',
          content: `Waypoint navigation is essential for autonomous robots:
- Plan efficient routes between points
- Handle turns and orientation changes
- Verify arrival at each destination
- Maintain consistent movement patterns`,
        }
      ],
      quiz: [
        {
          question: 'What is the most efficient way to visit multiple waypoints?',
          options: ['Random order', 'Sequential order', 'Closest first', 'Furthest first'],
          correctAnswer: 'Sequential order',
          explanation: 'For patrol routes, following a planned sequential order ensures complete coverage and predictable behavior.'
        }
      ]
    },
    robotType: 'mobile',
    environmentId: 'tutorial-room',
    unlocked: false,
    completed: false,
    nextChallengeIds: ['circle-1'],
  },
  {
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
- Radius control through turn/speed ratio
- Smooth acceleration and deceleration`
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
    theory: {
      sections: [
        {
          title: 'Circular Motion Physics',
          content: `Creating smooth circular motion:
- Forward velocity + angular velocity = circular path
- Constant radius requires consistent speed ratio
- Smaller increments create smoother curves
- Total rotation should equal 360 degrees`,
        }
      ],
      quiz: [
        {
          question: 'What creates a circular path?',
          options: ['Only forward movement', 'Only rotation', 'Forward movement + rotation', 'Random movements'],
          correctAnswer: 'Forward movement + rotation',
          explanation: 'Circular motion is created by combining continuous forward movement with consistent rotation.'
        }
      ]
    },
    robotType: 'mobile',
    environmentId: 'tutorial-room',
    unlocked: false,
    completed: false,
    nextChallengeIds: ['grid-1'],
  },
  {
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
- Calculating optimal paths
- Precise positioning at grid intersections`
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
    hints: [
      { id: 'hint9', text: 'Calculate the direction needed for each move', unlockCost: 10 },
      { id: 'hint10', text: 'Use the robot position to track progress', unlockCost: 15 },
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
  
  // Add your navigation logic here
  // Consider: direction calculation, distance, rotation needed
}

console.log("Grid navigation completed!");`
    },
    theory: {
      sections: [
        {
          title: 'Grid-Based Navigation',
          content: `Grid systems provide structured navigation:
- Coordinates define exact positions
- Cardinal directions simplify movement
- Manhattan distance for path planning
- Discrete steps for precise positioning`,
        }
      ],
      quiz: [
        {
          question: 'What are the four cardinal directions?',
          options: ['Up, Down, Left, Right', 'North, South, East, West', 'Forward, Back, Left, Right', 'X+, X-, Z+, Z-'],
          correctAnswer: 'North, South, East, West',
          explanation: 'Cardinal directions are North, South, East, and West, corresponding to positive Z, negative Z, positive X, and negative X respectively.'
        }
      ]
    },
    robotType: 'mobile',
    environmentId: 'tutorial-room',
    unlocked: false,
    completed: false,
    nextChallengeIds: ['spiral-1'],
  },
  {
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
        theory: `Spiral patterns follow the sequence:
1 step, turn, 1 step, turn, 2 steps, turn, 2 steps, turn, 3 steps...
Each pair of sides increases the step count by 1.`
      },
      {
        id: 'obj13',
        description: 'Execute a 5-layer expanding spiral',
        completionCriteria: 'spiral_completed',
        completed: false,
        hints: [
          'Pattern: Right 1, Up 1, Left 2, Down 2, Right 3, Up 3...',
          'Increase step count every 2 direction changes',
          'Track total movements and direction changes'
        ]
      }
    ],
    hints: [
      { id: 'hint11', text: 'Use a counter to track direction changes', unlockCost: 15 },
      { id: 'hint12', text: 'Array of directions: ["right", "up", "left", "down"]', unlockCost: 20 },
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
    theory: {
      sections: [
        {
          title: 'Spiral Search Algorithms',
          content: `Spiral patterns are used for systematic area coverage:
- Start from center and expand outward
- Ensures complete area coverage
- Efficient for search and rescue operations
- Mathematical progression: 1,1,2,2,3,3,4,4...`,
        }
      ],
      quiz: [
        {
          question: 'In a spiral pattern, when do you increase the step count?',
          options: ['Every turn', 'Every 2 turns', 'Every 3 turns', 'Randomly'],
          correctAnswer: 'Every 2 turns',
          explanation: 'In a square spiral, the step count increases every 2 direction changes to maintain the expanding pattern.'
        }
      ]
    },
    robotType: 'mobile',
    environmentId: 'tutorial-room',
    unlocked: false,
    completed: false,
    nextChallengeIds: ['drone-1'],
  },
  {
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
- 3D positioning (X, Y, Z coordinates)
- Hovering and stabilization`
      },
      {
        id: 'obj15',
        description: 'Perform takeoff to 2m altitude',
        completionCriteria: 'altitude_reached',
        completed: false,
        hints: [
          'Use robot.move with direction "up"',
          'Monitor altitude with robot.position.y',
          'Maintain stable hover position'
        ]
      },
      {
        id: 'obj16',
        description: 'Execute figure-8 flight pattern',
        completionCriteria: 'figure8_completed',
        completed: false,
        hints: [
          'Combine forward movement with alternating turns',
          'Use smooth curves instead of sharp angles',
          'Maintain consistent altitude throughout'
        ]
      }
    ],
    hints: [
      { id: 'hint13', text: 'Start with simple up/down movements', unlockCost: 15 },
      { id: 'hint14', text: 'Figure-8 requires synchronized turns and movements', unlockCost: 25 },
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
    theory: {
      sections: [
        {
          title: 'Drone Flight Principles',
          content: `Drone flight requires understanding:
- Thrust for vertical movement
- Pitch/roll for horizontal movement
- Yaw for rotation
- Center of gravity and stability`,
        }
      ],
      quiz: [
        {
          question: 'What controls vertical movement in a drone?',
          options: ['Pitch', 'Roll', 'Yaw', 'Thrust'],
          correctAnswer: 'Thrust',
          explanation: 'Thrust from the propellers controls vertical movement - more thrust for up, less for down.'
        }
      ]
    },
    robotType: 'drone',
    environmentId: 'tutorial-room',
    unlocked: false,
    completed: false,
    nextChallengeIds: ['arm-1'],
  },
  {
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
- Wrist rotation and pitch
Each joint has specific range limits.`
      },
      {
        id: 'obj18',
        description: 'Move each joint through its range',
        completionCriteria: 'joints_exercised',
        completed: false,
        hints: [
          'Use robot.move with joint parameter',
          'Test base, shoulder, elbow, and wrist',
          'Stay within joint limits'
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
          'Close gripper and lift',
          'Move to target and release'
        ]
      }
    ],
    hints: [
      { id: 'hint15', text: 'Move joints slowly for precision', unlockCost: 15 },
      { id: 'hint16', text: 'Plan the sequence before executing', unlockCost: 20 },
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
await robot.move({
  direction: "backward",
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
await robot.move({
  direction: "backward",
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
await robot.move({
  direction: "left",
  speed: 0.3,
  joint: "wrist",
  duration: 1200
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

// Lower arm
await robot.move({
  direction: "forward",
  speed: 0.2,
  joint: "shoulder",
  duration: 800
});

// Grab object
await robot.grab();
await robot.wait(500);

// Lift object
await robot.move({
  direction: "backward",
  speed: 0.2,
  joint: "shoulder", 
  duration: 800
});

// Move to target location
await robot.move({
  direction: "left",
  speed: 0.2,
  joint: "base",
  duration: 3000
});

// Place object
await robot.move({
  direction: "forward",
  speed: 0.2,
  joint: "shoulder",
  duration: 800
});

await robot.releaseObject();
console.log("Pick and place completed!");`
    },
    theory: {
      sections: [
        {
          title: 'Robotic Arm Kinematics',
          content: `Robotic arms work through coordinated joint movement:
- Forward kinematics: joint angles → end position
- Inverse kinematics: desired position → joint angles
- Degrees of freedom determine workspace
- Joint limits prevent damage`,
        }
      ],
      quiz: [
        {
          question: 'What determines a robotic arm\'s workspace?',
          options: ['Joint limits', 'Degrees of freedom', 'Link lengths', 'All of the above'],
          correctAnswer: 'All of the above',
          explanation: 'The workspace is determined by joint limits, degrees of freedom, and the lengths of the arm segments.'
        }
      ]
    },
    robotType: 'arm',
    environmentId: 'tutorial-room',
    unlocked: false,
    completed: false,
    nextChallengeIds: ['spider-1'],
  },
  {
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
- Climbing on various surfaces
- Precise foot placement`
      },
      {
        id: 'obj21',
        description: 'Demonstrate stable walking gait',
        completionCriteria: 'gait_demonstrated',
        completed: false,
        hints: [
          'Move legs in alternating patterns',
          'Maintain 3-point contact for stability',
          'Use slow, deliberate movements'
        ]
      },
      {
        id: 'obj22',
        description: 'Navigate complex terrain',
        completionCriteria: 'terrain_navigated',
        completed: false,
        hints: [
          'Adjust leg positions for obstacles',
          'Use sensors to detect surfaces',
          'Maintain balance throughout'
        ]
      }
    ],
    hints: [
      { id: 'hint17', text: 'Start with simple forward walking', unlockCost: 20 },
      { id: 'hint18', text: 'Use tripod gait for stability', unlockCost: 25 },
    ],
    startingCode: {
      natural_language: 'Demonstrate spider robot walking and climbing',
      block: '[]',
      code: `// Spider Locomotion Challenge
console.log("Activating spider locomotion systems...");

// Basic walking gait demonstration
console.log("Demonstrating walking gait...");

// Spider walking pattern - alternating tripods
for (let step = 0; step < 8; step++) {
  console.log(\`Step \${step + 1}/8\`);
  
  // Move forward with stable gait
  await robot.move({
    direction: "forward",
    speed: 0.4,
    duration: 800
  });
  
  // Brief pause for stability
  await robot.wait(200);
}

console.log("Straight walking completed!");

// Turning demonstration
console.log("Demonstrating turning maneuvers...");

for (let turn = 0; turn < 4; turn++) {
  // Turn 90 degrees
  await robot.rotate({
    direction: "right",
    angle: 90
  });
  
  // Move forward after turn
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

// Simulate climbing/stepping motions
for (let i = 0; i < 6; i++) {
  // Check for obstacles with sensors
  const distance = await robot.getSensor("ultrasonic");
  console.log(\`Obstacle distance: \${distance.toFixed(2)}m\`);
  
  if (distance > 1.0) {
    // Safe to move forward
    await robot.move({
      direction: "forward",
      speed: 0.3,
      duration: 500
    });
  } else {
    // Obstacle detected - navigate around
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
    
    await robot.move({
      direction: "forward",
      speed: 0.3,
      duration: 700
    });
    
    await robot.rotate({
      direction: "left",
      angle: 45
    });
  }
  
  await robot.wait(250);
}

console.log("Terrain navigation completed!");
console.log("Spider locomotion challenge complete!");`
    },
    theory: {
      sections: [
        {
          title: 'Multi-Legged Locomotion',
          content: `Spider robots excel in rough terrain:
- Multiple legs provide stability
- Tripod gait ensures 3-point contact
- Individual leg control for precision
- Natural climbing and gripping ability`,
        }
      ],
      quiz: [
        {
          question: 'What is the tripod gait?',
          options: ['Three legs moving together', 'Moving on three legs only', 'Three-point contact maintained', 'Three-step movement pattern'],
          correctAnswer: 'Three-point contact maintained',
          explanation: 'The tripod gait maintains three-point contact with the ground for stability while moving the other three legs.'
        }
      ]
    },
    robotType: 'spider',
    environmentId: 'tutorial-room',
    unlocked: false,
    completed: false,
    nextChallengeIds: ['tank-1'],
  },
  {
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
- Differential steering (skid steering)
- Heavy payload carrying capacity`
      },
      {
        id: 'obj24',
        description: 'Execute precision maneuvers',
        completionCriteria: 'maneuvers_completed',
        completed: false,
        hints: [
          'Use pivot turns for tight spaces',
          'Tracks provide excellent grip',
          'Can climb over small obstacles'
        ]
      },
      {
        id: 'obj25',
        description: 'Demonstrate tactical positioning',
        completionCriteria: 'positioning_completed',
        completed: false,
        hints: [
          'Find optimal vantage points',
          'Use cover and concealment',
          'Maintain escape routes'
        ]
      }
    ],
    hints: [
      { id: 'hint19', text: 'Tracks allow zero-radius turns', unlockCost: 20 },
      { id: 'hint20', text: 'Use slow speeds for precision', unlockCost: 25 },
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
  
  // Calculate rough direction needed
  const currentPos = robot.position;
  const deltaX = pos.x - currentPos.x;
  const deltaZ = pos.z - currentPos.z;
  
  // Turn toward target
  if (Math.abs(deltaX) > Math.abs(deltaZ)) {
    if (deltaX > 0) {
      await robot.rotate({ direction: "right", angle: 90 });
    } else {
      await robot.rotate({ direction: "left", angle: 90 });
    }
  } else {
    if (deltaZ < 0) {
      await robot.rotate({ direction: "right", angle: 180 });
    }
  }
  
  // Move to position
  const distance = Math.sqrt(deltaX * deltaX + deltaZ * deltaZ);
  const moveDuration = Math.min(distance * 800, 3000);
  
  await robot.move({
    direction: "forward",
    speed: 0.5,
    duration: moveDuration
  });
  
  // Pause at position
  console.log(\`Arrived at \${pos.name}. Scanning area...\`);
  
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

console.log("Tactical positioning exercise completed!");
console.log("Tank maneuvers training complete!");`
    },
    theory: {
      sections: [
        {
          title: 'Tracked Vehicle Dynamics',
          content: `Tank robots excel in challenging conditions:
- Tracks distribute weight over large area
- Differential steering for precise control
- Can climb obstacles up to track height
- Excellent stability and traction`,
        }
      ],
      quiz: [
        {
          question: 'What steering method do tracked vehicles use?',
          options: ['Wheel steering', 'Differential steering', 'Rudder steering', 'Joystick steering'],
          correctAnswer: 'Differential steering',
          explanation: 'Tracked vehicles use differential steering - varying the speed of left and right tracks to turn.'
        }
      ]
    },
    robotType: 'tank',
    environmentId: 'tutorial-room',
    unlocked: false,
    completed: false,
    nextChallengeIds: ['humanoid-1'],
  },
  {
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
- Gait cycles: stance and swing phases
- Dynamic stability through controlled falling`
      },
      {
        id: 'obj27',
        description: 'Demonstrate stable walking cycle',
        completionCriteria: 'walking_demonstrated',
        completed: false,
        hints: [
          'Start with slow, deliberate steps',
          'Maintain balance throughout cycle',
          'Use arm movement for stability'
        ]
      },
      {
        id: 'obj28',
        description: 'Perform complex movements',
        completionCriteria: 'complex_movements',
        completed: false,
        hints: [
          'Combine walking with arm gestures',
          'Try different walking speeds',
          'Practice turning while walking'
        ]
      }
    ],
    hints: [
      { id: 'hint21', text: 'Focus on balance and timing', unlockCost: 25 },
      { id: 'hint22', text: 'Use animation system for natural movement', unlockCost: 30 },
    ],
    startingCode: {
      natural_language: 'Demonstrate humanoid walking and complex movements',
      block: '[]',
      code: `// Humanoid Walking Challenge
console.log("Initializing humanoid locomotion systems...");
console.log("Calibrating balance and posture...");

// Basic walking demonstration
console.log("Beginning walking cycle demonstration...");

// Start walking sequence
for (let step = 0; step < 12; step++) {
  console.log(\`Walking step \${step + 1}/12\`);
  
  // Each step combines forward movement with natural animation
  await robot.move({
    direction: "forward",
    speed: 0.5,
    duration: 600
  });
  
  // Brief pause between steps for natural rhythm
  await robot.wait(150);
}

console.log("Straight walking completed!");

// Turning while walking
console.log("Demonstrating walking turns...");

for (let turn = 0; turn < 4; turn++) {
  console.log(\`Turn \${turn + 1}/4\`);
  
  // Gradual turn while maintaining walking motion
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

// Complex movement sequence
console.log("Performing complex movement sequence...");

// Demonstrate different walking speeds
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
  
  // Pause between gaits
  await robot.wait(500);
}

// Demonstration of stopping and starting
console.log("Demonstrating controlled stops and starts...");

for (let cycle = 0; cycle < 3; cycle++) {
  // Start walking
  for (let step = 0; step < 4; step++) {
    await robot.move({
      direction: "forward",
      speed: 0.5,
      duration: 500
    });
    await robot.wait(100);
  }
  
  // Come to complete stop
  console.log("Coming to controlled stop...");
  await robot.wait(1000);
  
  // Resume walking
  console.log("Resuming walking...");
}

// Final demonstration - walking backward
console.log("Demonstrating backward walking...");

for (let step = 0; step < 8; step++) {
  await robot.move({
    direction: "backward",
    speed: 0.3,
    duration: 700
  });
  await robot.wait(200);
}

console.log("Backward walking completed!");

// Return to starting position with final flourish
console.log("Returning to start with 360-degree turn...");

await robot.rotate({
  direction: "left",
  angle: 360
});

await robot.wait(500);

console.log("Humanoid locomotion demonstration complete!");
console.log("All movement objectives achieved!");`
    },
    theory: {
      sections: [
        {
          title: 'Bipedal Locomotion',
          content: `Humanoid walking is complex:
- Dynamic balance during movement
- Inverted pendulum model
- Zero Moment Point (ZMP) control
- Gait planning and execution`,
        }
      ],
      quiz: [
        {
          question: 'What makes bipedal walking challenging?',
          options: ['Two legs only', 'Constant balance required', 'High center of gravity', 'All of the above'],
          correctAnswer: 'All of the above',
          explanation: 'Bipedal walking is challenging because it combines two legs only, requires constant balance, and has a high center of gravity.'
        }
      ]
    },
    robotType: 'humanoid',
    environmentId: 'tutorial-room',
    unlocked: false,
    completed: false,
    nextChallengeIds: [],
  }
];

const ChallengesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<{ type: string; data: Challenge } | null>(null);
  const [selectedHints, setSelectedHints] = useState<string[]>([]);
  const [currentQuizAnswer, setCurrentQuizAnswer] = useState<Record<number, string>>({});
  const [showQuizResults, setShowQuizResults] = useState<Record<number, { correct: boolean; selected: string }>>({});
  
  const navigate = useNavigate();
  
  const { 
    challengeTracking, 
    getChallengeStatus, 
    getObjectiveStatus,
    robotState,
    setCurrentChallenge,
    markTheoryViewed
  } = useRobotStore();

  // Use useMemo to compute challenge states to prevent infinite loops
  const computedChallenges = useMemo(() => {
    return challenges.map(challenge => {
      const completed = getChallengeStatus(challenge.id);
      
      // Dynamic unlocking logic
      let unlocked = challenge.unlocked; // Start with default
if (challenge.id === 'intro-1') {
  unlocked = true;
} else if (challenge.id === 'intro-2') {
  unlocked = getChallengeStatus('intro-1');
} else if (challenge.id === 'patrol-1') {
  unlocked = getChallengeStatus('intro-2');
} else if (challenge.id === 'circle-1') {
  unlocked = getChallengeStatus('patrol-1');
} else if (challenge.id === 'grid-1') {
  unlocked = getChallengeStatus('circle-1');
} else if (challenge.id === 'spiral-1') {
  unlocked = getChallengeStatus('grid-1');
} else if (challenge.id === 'drone-1') {
  unlocked = getChallengeStatus('spiral-1');
} else if (challenge.id === 'arm-1') {
  unlocked = getChallengeStatus('drone-1');
} else if (challenge.id === 'spider-1') {
  unlocked = getChallengeStatus('arm-1');
} else if (challenge.id === 'tank-1') {
  unlocked = getChallengeStatus('spider-1');
} else if (challenge.id === 'humanoid-1') {
  unlocked = getChallengeStatus('tank-1');
}

      return {
        ...challenge,
        completed,
        unlocked,
        objectives: challenge.objectives.map(obj => ({
          ...obj,
          completed: getObjectiveStatus(obj.id)
        }))
      };
    });
  }, [
    getChallengeStatus, 
    getObjectiveStatus,
    challengeTracking.completedChallenges.size,
    challengeTracking.completedObjectives.size
  ]);

  // Real-time objective and challenge completion listeners
  useEffect(() => {
    const handleObjectiveCompleted = (event: CustomEvent) => {
      console.log('✅ Objective completed:', event.detail);
    };

    const handleChallengeCompleted = (event: CustomEvent) => {
      console.log('🏆 Challenge completed:', event.detail);
    };

    window.addEventListener('objectiveCompleted', handleObjectiveCompleted as EventListener);
    window.addEventListener('challengeCompleted', handleChallengeCompleted as EventListener);
    
    return () => {
      window.removeEventListener('objectiveCompleted', handleObjectiveCompleted as EventListener);
      window.removeEventListener('challengeCompleted', handleChallengeCompleted as EventListener);
    };
  }, []);

  // Memoized modal handlers to prevent infinite loops
  const openModal = useCallback((type: string, data: Challenge | null = null) => {
    if (data) {
      setActiveModal({ type, data });
    }
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setSelectedHints([]);
    setCurrentQuizAnswer({});
    setShowQuizResults({});
  }, []);

  const handleHintUnlock = useCallback((hint: { id: string; unlockCost: number }) => {
    if (hint.unlockCost === 0 || window.confirm(`Unlock this hint for ${hint.unlockCost} points?`)) {
      setSelectedHints(prev => [...prev, hint.id]);
    }
  }, []);

  const handleQuizAnswer = useCallback((questionIndex: number, answer: string, correctAnswer: string) => {
    setCurrentQuizAnswer(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
    
    setTimeout(() => {
      setShowQuizResults(prev => ({
        ...prev,
        [questionIndex]: {
          correct: answer === correctAnswer,
          selected: answer
        }
      }));
    }, 500);
  }, []);

  const filteredChallenges = useMemo(() => {
    return computedChallenges.filter(challenge => 
      (selectedCategory === 'all' || challenge.category === selectedCategory) &&
      (selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty)
    );
  }, [computedChallenges, selectedCategory, selectedDifficulty]);
  
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: ChallengeCategory.INTRO, label: 'Introduction' },
    { value: ChallengeCategory.WAREHOUSE, label: 'Warehouse' },
    { value: ChallengeCategory.SURGERY, label: 'Surgery' },
    { value: ChallengeCategory.SEARCH_RESCUE, label: 'Search & Rescue' },
    { value: ChallengeCategory.MANUFACTURING, label: 'Manufacturing' },
  ];
  
  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: DifficultyLevel.BEGINNER, label: 'Beginner' },
    { value: DifficultyLevel.INTERMEDIATE, label: 'Intermediate' },
    { value: DifficultyLevel.ADVANCED, label: 'Advanced' },
    { value: DifficultyLevel.EXPERT, label: 'Expert' },
  ];
  
  const getDifficultyColor = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case DifficultyLevel.BEGINNER: return 'success';
      case DifficultyLevel.INTERMEDIATE: return 'primary';
      case DifficultyLevel.ADVANCED: return 'warning';
      case DifficultyLevel.EXPERT: return 'error';
      default: return 'primary';
    }
  };
  
  const getCategoryIcon = (category: ChallengeCategory) => {
    switch (category) {
      case ChallengeCategory.INTRO: return <Book size={16} />;
      case ChallengeCategory.WAREHOUSE: return <Tag size={16} />;
      case ChallengeCategory.SURGERY: return <Star size={16} />;
      case ChallengeCategory.SEARCH_RESCUE: return <Trophy size={16} />;
      case ChallengeCategory.MANUFACTURING: return <Tag size={16} />;
      default: return <Book size={16} />;
    }
  };

  const getObjectiveProgress = useCallback((challenge: Challenge) => {
    const completed = challenge.objectives.filter(obj => obj.completed).length;
    const total = challenge.objectives.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  }, []);

  const handleChallengeClick = useCallback((challenge: Challenge) => {
    if (!challenge.unlocked) return;
    setExpandedChallenge(expandedChallenge === challenge.id ? null : challenge.id);
  }, [expandedChallenge]);

  const handleStartChallenge = useCallback((challenge: Challenge) => {
    if (setCurrentChallenge) {
      setCurrentChallenge(challenge.id);
    }
    navigate(`/simulator?challenge=${challenge.id}`);
  }, [setCurrentChallenge, navigate]);

  // Calculate stats from actual robot store data
  const stats = useMemo(() => ({
    completedChallengesCount: challengeTracking.completedChallenges.size,
    totalChallenges: challenges.length,
    completedObjectivesCount: challengeTracking.completedObjectives.size,
    distanceMoved: challengeTracking.totalDistanceMoved
  }), [challengeTracking]);

  // Fixed Theory Modal without infinite loop
  const TheoryModal: React.FC<{ challenge: Challenge }> = React.memo(({ challenge }) => {
  useEffect(() => {
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
    
    const theoryId = theoryMap[challenge.id];
    if (theoryId) {
      markTheoryViewed(theoryId);
    }
  }, [challenge.id]);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-dark-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-dark-600">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center">
                <BookOpen className="mr-2" />
                Learning Materials - {challenge.title}
              </h2>
              <button onClick={closeModal} className="text-dark-400 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            {challenge.theory?.sections.map((section, index) => (
              <div key={index} className="mb-6 p-4 bg-dark-700 rounded-lg border border-dark-600">
                <h3 className="text-xl font-semibold text-primary-400 mb-3">{section.title}</h3>
                <div className="text-dark-300 whitespace-pre-wrap mb-4">{section.content}</div>
                
                {section.examples && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-medium text-success-400">Examples:</h4>
                    {section.examples.map((example, exampleIndex) => (
                      <div key={exampleIndex} className="bg-dark-800 rounded p-3 border border-dark-500">
                        <h5 className="text-white font-medium mb-2">{example.title}</h5>
                        <pre className="text-success-300 text-sm mb-2 overflow-x-auto">
                          <code>{example.code}</code>
                        </pre>
                        <p className="text-dark-400 text-sm">{example.explanation}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {section.video && (
                  <div className="mt-4">
                    <button className="bg-error-600 hover:bg-error-700 text-white px-4 py-2 rounded flex items-center">
                      <Play className="mr-2" size={16} />
                      Watch Video Tutorial
                    </button>
                  </div>
                )}
              </div>
            ))}

            <div className="bg-success-900/20 border border-success-600 rounded-lg p-4 mt-4">
              <div className="flex items-center text-success-400 mb-2">
                <CheckCircle size={16} className="mr-2" />
                <span className="font-medium">Theory Study Complete!</span>
              </div>
              <p className="text-success-300 text-sm">
                You've successfully reviewed the theory for this challenge. Theory-based objectives will be marked as complete.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  });

  // Quiz Modal Component
  const QuizModal: React.FC<{ challenge: Challenge }> = React.memo(({ challenge }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-dark-600">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Star className="mr-2" />
              Knowledge Quiz - {challenge.title}
            </h2>
            <button onClick={closeModal} className="text-dark-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          
          {challenge.theory?.quiz?.map((question, qIndex) => (
            <div key={qIndex} className="mb-6 p-4 bg-dark-700 rounded-lg border border-dark-600">
              <p className="text-white text-lg mb-4">{question.question}</p>
              <div className="grid grid-cols-1 gap-2">
                {question.options.map((option, optIndex) => {
                  const isSelected = currentQuizAnswer[qIndex] === option;
                  const showResult = showQuizResults[qIndex];
                  const isCorrect = option === question.correctAnswer;
                  
                  let buttonClass = "p-3 rounded border text-left transition-colors ";
                  if (showResult) {
                    if (isSelected && isCorrect) {
                      buttonClass += "bg-success-600 border-success-500 text-white";
                    } else if (isSelected && !isCorrect) {
                      buttonClass += "bg-error-600 border-error-500 text-white";
                    } else if (isCorrect) {
                      buttonClass += "bg-success-600 border-success-500 text-white";
                    } else {
                      buttonClass += "bg-dark-600 border-dark-500 text-dark-300";
                    }
                  } else {
                    buttonClass += isSelected 
                      ? "bg-primary-600 border-primary-500 text-white"
                      : "bg-dark-600 border-dark-500 text-dark-300 hover:border-dark-400";
                  }
                  
                  return (
                    <button
                      key={optIndex}
                      className={buttonClass}
                      onClick={() => handleQuizAnswer(qIndex, option, question.correctAnswer)}
                      disabled={!!showResult}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {showQuizResults[qIndex] && (
                <div className="mt-3 p-3 bg-primary-900 border border-primary-600 rounded">
                  <p className="text-primary-300 text-sm">{question.explanation}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  ));

  return (
    <Layout>
      <div className="min-h-screen bg-dark-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Learning Challenges</h1>
              <p className="text-dark-400">
                Progress through our robotics challenges from beginner to expert level
              </p>
            </div>
            
            <div className="flex space-x-6 mt-4 md:mt-0">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-900 border border-primary-700 text-primary-400 mb-1">
                  <Award size={24} />
                </div>
                <span className="text-sm text-dark-300">{stats.completedChallengesCount}/{stats.totalChallenges}</span>
                <span className="text-xs text-dark-500">Completed</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-warning-900 border border-warning-700 text-warning-400 mb-1">
                  <Trophy size={24} />
                </div>
                <span className="text-sm text-dark-300">{stats.completedObjectivesCount}</span>
                <span className="text-xs text-dark-500">Objectives</span>
              </div>
              
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent-900 border border-accent-700 text-accent-400 mb-1">
                  <Star size={24} />
                </div>
                <span className="text-sm text-dark-300">{stats.distanceMoved.toFixed(1)}m</span>
                <span className="text-xs text-dark-500">Distance</span>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-dark-800 rounded-lg border border-dark-700 p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Category</label>
                <select
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>{category.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-1">Difficulty</label>
                <select
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty.value} value={difficulty.value}>{difficulty.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Live Stats */}
          {robotState && (
            <div className="bg-dark-800 rounded-lg p-4 border border-dark-700 mb-6">
              <h3 className="text-white font-medium mb-3 flex items-center">
                <Target size={16} className="mr-2" />
                Live Robot Status
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-dark-400">Position</span>
                  <p className="text-white font-mono">
                    ({robotState.position.x.toFixed(1)}, {robotState.position.z.toFixed(1)})
                  </p>
                </div>
                <div>
                  <span className="text-dark-400">Distance</span>
                  <p className="text-white font-mono">
                    {challengeTracking.totalDistanceMoved.toFixed(1)}m
                  </p>
                </div>
                <div>
                  <span className="text-dark-400">Rotations</span>
                  <p className="text-white font-mono">
                    {(challengeTracking.totalRotations / Math.PI * 180).toFixed(0)}°
                  </p>
                </div>
                <div>
                  <span className="text-dark-400">Battery</span>
                  <p className="text-white font-mono">{robotState.batteryLevel}%</p>
                </div>
              </div>
            </div>
          )}

          {/* Challenge List */}
          <div className="space-y-4">
            {filteredChallenges.map((challenge) => {
              const progress = getObjectiveProgress(challenge);
              const isExpanded = expandedChallenge === challenge.id;
              
              return (
                <motion.div
                  key={challenge.id}
                  className={`bg-dark-800 rounded-lg border border-dark-700 p-6 cursor-pointer transition-all ${
                    challenge.unlocked ? 'hover:border-dark-600' : 'opacity-70'
                  } ${challenge.completed ? 'border-success-500 bg-success-900/10' : ''}`}
                  onClick={() => handleChallengeClick(challenge)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center mb-2">
                        <div className={`p-1.5 rounded-md bg-${getDifficultyColor(challenge.difficulty)}-900 border border-${getDifficultyColor(challenge.difficulty)}-700 mr-2 text-${getDifficultyColor(challenge.difficulty)}-400`}>
                          {getCategoryIcon(challenge.category)}
                        </div>
                        <h3 className="text-xl font-semibold text-white">{challenge.title}</h3>
                        {challenge.completed && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-2 text-success-400"
                          >
                            <CheckCircle size={20} />
                          </motion.div>
                        )}
                        {!challenge.unlocked && (
                          <LockKeyhole className="ml-2 text-dark-500" size={16} />
                        )}
                      </div>
                      
                      <p className="text-dark-400 mb-3">{challenge.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm">
                        <span className={`px-2 py-1 rounded text-xs font-medium bg-${getDifficultyColor(challenge.difficulty)}-900 text-${getDifficultyColor(challenge.difficulty)}-400 border border-${getDifficultyColor(challenge.difficulty)}-700`}>
                          {challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
                        </span>
                        <span className="text-dark-500 flex items-center">
                          <Clock size={14} className="mr-1" />
                          {challenge.estimatedTime} min
                        </span>
                        <span className="text-dark-500">
                          {progress.completed}/{progress.total} objectives
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end ml-4">
                      <div className="flex items-center space-x-2 mb-2">
                        {challenge.unlocked && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartChallenge(challenge);
                            }}
                            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded flex items-center text-sm transition-colors"
                          >
                            <Play size={14} className="mr-1" />
                            Start
                          </button>
                        )}
                      </div>
                      
                      <div className="flex items-center text-dark-400">
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                      </div>
                      
                      {progress.total > 0 && (
                        <div className="w-24 bg-dark-700 rounded-full h-2 mt-2">
                          <motion.div
                            className={`h-2 rounded-full transition-all ${
                              challenge.completed ? 'bg-success-500' : 'bg-primary-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress.percentage}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t border-dark-700"
                      >
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 mb-6">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal('theory', challenge);
                            }}
                            className="bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded flex items-center text-sm"
                          >
                            <BookOpen size={14} className="mr-2" />
                            Theory
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal('quiz', challenge);
                            }}
                            className="bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded flex items-center text-sm"
                          >
                            <Star size={14} className="mr-2" />
                            Quiz
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal('hints', challenge);
                            }}
                            className="bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded flex items-center text-sm"
                          >
                            <Lightbulb size={14} className="mr-2" />
                            Hints ({challenge.hints?.length || 0})
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(`Starting Code:\n\n${challenge.startingCode?.code}`);
                            }}
                            className="bg-dark-700 hover:bg-dark-600 text-white px-4 py-2 rounded flex items-center text-sm"
                          >
                            <Code size={14} className="mr-2" />
                            View Code
                          </button>
                        </div>

                        {/* Objectives */}
                        <div>
                          <h4 className="text-white font-medium mb-3 flex items-center">
                            <Target size={16} className="mr-2" />
                            Objectives
                          </h4>
                          <div className="space-y-3">
                            {challenge.objectives.map((objective, index) => (
                              <motion.div
                                key={objective.id}
                                className={`p-4 rounded-lg border ${
                                  objective.completed
                                    ? 'bg-success-900/20 border-success-700'
                                    : 'bg-dark-700 border-dark-600'
                                }`}
                                animate={objective.completed ? { backgroundColor: 'rgba(34, 197, 94, 0.1)' } : {}}
                                transition={{ duration: 0.3 }}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center mb-2">
                                      <span className="text-sm font-medium text-dark-400 mr-3">
                                        #{index + 1}
                                      </span>
                                      <p className="text-white">{objective.description}</p>
                                      <AnimatePresence>
                                        {objective.completed && (
                                          <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="ml-2 text-success-400"
                                          >
                                            <CheckCircle size={16} />
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                    
                                    {objective.theory && (
                                      <div className="mt-2 p-3 bg-dark-800 rounded border border-dark-600">
                                        <h5 className="text-primary-400 text-sm font-medium mb-2">Theory:</h5>
                                        <pre className="text-dark-300 text-xs whitespace-pre-wrap overflow-x-auto">
                                          {objective.theory}
                                        </pre>
                                      </div>
                                    )}
                                    
                                    {objective.hints && objective.hints.length > 0 && (
                                      <div className="mt-2">
                                        <details className="group">
                                          <summary className="text-warning-400 text-sm cursor-pointer hover:text-warning-300">
                                            💡 Show hints ({objective.hints.length})
                                          </summary>
                                          <div className="mt-2 space-y-1">
                                            {objective.hints.map((hint, hintIndex) => (
                                              <div key={hintIndex} className="text-dark-400 text-sm pl-4 border-l-2 border-warning-500">
                                                {hint}
                                              </div>
                                            ))}
                                          </div>
                                        </details>
                                      </div>
                                    )}

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

                        {/* Next Challenges Preview */}
                        {challenge.nextChallengeIds && challenge.nextChallengeIds.length > 0 && (
                          <div className="mt-6 pt-4 border-t border-dark-700">
                            <h4 className="text-white font-medium mb-3">Next Challenges:</h4>
                            <div className="flex space-x-3">
                              {challenge.nextChallengeIds.map((nextId) => {
                                const nextChallenge = challenges.find(c => c.id === nextId);
                                return nextChallenge ? (
                                  <div key={nextId} className="bg-dark-700 rounded p-3 text-sm">
                                    <p className="text-white font-medium">{nextChallenge.title}</p>
                                    <p className="text-dark-400 text-xs mt-1">{nextChallenge.category}</p>
                                  </div>
                                ) : null;
                              })}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>

          {/* No challenges found */}
          {filteredChallenges.length === 0 && (
            <div className="text-center py-12">
              <div className="text-dark-500 mb-4">
                <Book size={48} className="mx-auto mb-4" />
                <p className="text-lg">No challenges found</p>
                <p className="text-sm">Try adjusting your filters</p>
              </div>
            </div>
          )}
        </div>

        {/* Modals */}
        {activeModal?.type === 'theory' && <TheoryModal challenge={activeModal.data} />}
        {activeModal?.type === 'quiz' && <QuizModal challenge={activeModal.data} />}
      </div>
    </Layout>
  );
};

export default ChallengesPage;
