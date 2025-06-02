The main issue in this file is a missing closing brace in the `useFrame` function's `arm` case block. Here's the fixed section with the added closing brace:

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

The issue was that the `if (armWristRef.current)` block was missing its closing brace. I've added it to properly close the block. The rest of the file appears to be syntactically correct.