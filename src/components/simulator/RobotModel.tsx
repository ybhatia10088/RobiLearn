The main syntax error in this file is a missing curly brace in the arm joint control section. Here's the fixed version of that section:

```javascript
// Wrist rotation
if (armWristRef.current) {
  const wristTarget = moveCommands.joint === 'wrist' ?
    (moveCommands.direction === 'left' ? -1.5 : 1.5) : 0;
  armAngles.wrist = THREE.MathUtils.clamp(
    THREE.MathUtils.lerp(armAngles.wrist, wristTarget, jointStep * 0.7),
    ARM_LIMITS.wrist.min,
    ARM_LIMITS.wrist.max
  );
  armWristRef.current.rotation.z = armAngles.wrist;
}
```

The original had a missing opening curly brace after the if statement and was missing proper nesting. I've added the necessary curly braces to properly scope the wrist rotation logic.

The rest of the file appears syntactically correct. Let me know if you need any other clarification!