import React, { useState, useEffect } from 'react';
import { ChevronRight, Trophy, LockKeyhole, Star, Book, Tag, Play, CheckCircle, Clock, Target } from 'lucide-react';
import { ChallengeCategory, DifficultyLevel, Challenge } from '@/types/challenge.types';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from '@/hooks/useNavigation';
import { useRobotStore } from '@/store/robotStore';

// Enhanced challenge data with all 11 challenges
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
await robot.move({
  direction: "forward",
  speed: 0.5,
  duration: 3000
});

// Then, wait for the movement to complete
await robot.wait(500);

// Finally, rotate the robot 90 degrees right
await robot.rotate({
  direction: "right",
  angle: 90
});

console.log("First challenge completed!");`
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

// Move forward while checking for obstacles
let moving = true;
while (moving) {
  const currentDistance = await robot.getSensor("ultrasonic");
  
  if (currentDistance > 1.0) {
    // Safe to move forward
    await robot.move({
      direction: "forward",
      speed: 0.3,
      duration: 300
    });
  } else {
    // Obstacle detected, stop moving
    console.log("Obstacle detected! Stopping...");
    moving = false;
  }
  
  await robot.wait(100);
}

console.log("Sensor challenge completed!");`
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
    unlocked: false,
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
  {x: 3, z: 0, name: "Point A"}, 
  {x: 3, z: 3, name: "Point B"}, 
  {x: 0, z: 3, name: "Point C"}, 
  {x: 0, z: 0, name: "Point D"}
];

console.log("Starting security patrol route...");

for (let i = 0; i < waypoints.length; i++) {
  const waypoint = waypoints[i];
  console.log(\`Moving to \${waypoint.name} at (\${waypoint.x}, \${waypoint.z})\`);
  
  // Move forward to reach waypoint
  await robot.move({
    direction: "forward",
    speed: 0.5,
    duration: 2000
  });
  
  // Turn 90 degrees right for next waypoint
  if (i < waypoints.length - 1) {
    await robot.rotate({
      direction: "right",
      angle: 90
    });
  }
  
  console.log(\`Reached \${waypoint.name}\`);
  await robot.wait(500);
}

console.log("Patrol route completed!");`
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
  
  // Calculate movement needed
  const currentPos = robot.position;
  const deltaX = target.x - currentPos.x;
  const deltaZ = target.z - currentPos.z;
  
  // Move horizontally first (X-axis)
  if (deltaX > 0) {
    await robot.rotate({ direction: "right", angle: 90 });
    await robot.move({
      direction: "forward",
      speed: 0.4,
      duration: Math.abs(deltaX) * 500
    });
  } else if (deltaX < 0) {
    await robot.rotate({ direction: "left", angle: 90 });
    await robot.move({
      direction: "forward",
      speed: 0.4,
      duration: Math.abs(deltaX) * 500
    });
  }
  
  // Move vertically (Z-axis)
  if (deltaZ > 0) {
    await robot.rotate({ direction: "left", angle: 90 });
    await robot.move({
      direction: "forward",
      speed: 0.4,
      duration: Math.abs(deltaZ) * 500
    });
  } else if (deltaZ < 0) {
    await robot.rotate({ direction: "right", angle: 90 });
    await robot.move({
      direction: "forward",
      speed: 0.4,
      duration: Math.abs(deltaZ) * 500
    });
  }
  
  console.log(\`Reached point (\${target.x}, \${target.z})\`);
  await robot.wait(300);
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

const ChallengeList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ChallengeCategory | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | 'all'>('all');
  const [expandedChallenge, setExpandedChallenge] = useState<string | null>(null);
  const [realtimeChallenges, setRealtimeChallenges] = useState<Challenge[]>(challenges);
  const navigate = useNavigate();
  
  const { 
    challengeTracking, 
    getChallengeStatus, 
    getObjectiveStatus,
    performance,
    robotState,
    setCurrentChallenge,
    markTheoryViewed
  } = useRobotStore();
  
  // Real-time objective and challenge completion listeners
  useEffect(() => {
    const handleObjectiveCompleted = (event: CustomEvent) => {
      const { objectiveId, challengeId } = event.detail;
      
      setRealtimeChallenges(prev => 
        prev.map(challenge => 
          challenge.id === challengeId 
            ? {
                ...challenge,
                objectives: challenge.objectives.map(obj => 
                  obj.id === objectiveId 
                    ? { ...obj, completed: true }
                    : obj
                )
              }
            : challenge
        )
      );
    };

    const handleChallengeCompleted = (event: CustomEvent) => {
      const { challengeId } = event.detail;
      
      setRealtimeChallenges(prev => 
        prev.map(challenge => 
          challenge.id === challengeId 
            ? { ...challenge, completed: true }
            : challenge
        )
      );
    };

    window.addEventListener('objectiveCompleted', handleObjectiveCompleted as EventListener);
    window.addEventListener('challengeCompleted', handleChallengeCompleted as EventListener);
    
    return () => {
      window.removeEventListener('objectiveCompleted', handleObjectiveCompleted as EventListener);
      window.removeEventListener('challengeCompleted', handleChallengeCompleted as EventListener);
    };
  }, []);

  // Update challenge completion status based on robot store
  useEffect(() => {
    setRealtimeChallenges(prev => 
      prev.map(challenge => {
        const completed = getChallengeStatus(challenge.id);
        
        // Dynamic unlocking logic
        let unlocked = false;
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
      })
    );
  }, [challengeTracking.completedChallenges, challengeTracking.completedObjectives, getChallengeStatus, getObjectiveStatus]);
  
  const filteredChallenges = realtimeChallenges.filter(challenge => 
    (selectedCategory === 'all' || challenge.category === selectedCategory) &&
    (selectedDifficulty === 'all' || challenge.difficulty === selectedDifficulty)
  );
  
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

  const getObjectiveProgress = (challenge: Challenge) => {
    const completed = challenge.objectives.filter(obj => obj.completed).length;
    const total = challenge.objectives.length;
    return { completed, total, percentage: Math.round((completed / total) * 100) };
  };

  const handleChallengeClick = (challenge: Challenge) => {
    if (!challenge.unlocked) return;
    setCurrentChallenge(challenge.id);
    if (expandedChallenge === challenge.id) {
      navigate(`/simulator?challenge=${challenge.id}`);
    } else {
      setExpandedChallenge(challenge.id);
    }
  };

  const ObjectiveProgressBar: React.FC<{ challenge: Challenge }> = ({ challenge }) => {
    const progress = getObjectiveProgress(challenge);
    
    return (
      <div className="mt-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-dark-300">Progress</span>
          <span className="text-xs text-dark-300">{progress.completed}/{progress.total}</span>
        </div>
        <div className="w-full bg-dark-600 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full transition-all ${
              challenge.completed ? 'bg-success-500' : 'bg-primary-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    );
  };

  const LiveStatsPanel: React.FC = () => {
    if (!robotState) return null;

    return (
      <div className="bg-dark-700 rounded-lg p-4 border border-dark-600 mb-4">
        <h3 className="text-white font-medium mb-3 flex items-center">
          <Target size={16} className="mr-2" />
          Live Robot Status
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-dark-300">Position</span>
            <p className="text-white font-mono">
              ({robotState.position.x.toFixed(1)}, {robotState.position.z.toFixed(1)})
            </p>
          </div>
          <div>
            <span className="text-dark-300">Distance</span>
            <p className="text-white font-mono">
              {challengeTracking.totalDistanceMoved.toFixed(1)}m
            </p>
          </div>
          <div>
            <span className="text-dark-300">Rotations</span>
            <p className="text-white font-mono">
              {(challengeTracking.totalRotations / Math.PI * 180).toFixed(0)}°
            </p>
          </div>
          <div>
            <span className="text-dark-300">Battery</span>
            <p className="text-white font-mono">{robotState.batteryLevel}%</p>
          </div>
        </div>
      </div>
    );
  };

  // Enhanced Progress Summary Panel
  const ProgressSummaryPanel: React.FC = () => {
    const completedChallengesCount = Array.from(challengeTracking.completedChallenges).length;
    const totalChallenges = challenges.length;
    const completedObjectivesCount = Array.from(challengeTracking.completedObjectives).length;
    const totalObjectives = challenges.reduce((sum, challenge) => sum + challenge.objectives.length, 0);

    return (
      <div className="bg-dark-700 rounded-lg p-4 border border-dark-600 mb-4">
        <h3 className="text-white font-medium mb-3 flex items-center">
          <Trophy size={16} className="mr-2" />
          Your Progress
        </h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-400">{completedChallengesCount}</div>
            <div className="text-dark-300">Challenges</div>
            <div className="text-xs text-dark-500">of {totalChallenges} total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-success-400">{completedObjectivesCount}</div>
            <div className="text-dark-300">Objectives</div>
            <div className="text-xs text-dark-500">of {totalObjectives} total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-warning-400">{challengeTracking.totalDistanceMoved.toFixed(1)}m</div>
            <div className="text-dark-300">Distance</div>
            <div className="text-xs text-dark-500">traveled</div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="bg-dark-800 rounded-lg border border-dark-600 h-full flex flex-col">
      <div className="border-b border-dark-600 p-4">
        <h2 className="text-xl font-semibold text-white mb-4">Robotics Challenges</h2>
