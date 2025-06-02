import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, ContactShadows, BakeShadows, SoftShadows, Box, Cylinder, Plane } from '@react-three/drei';
import { useRobotStore } from '@/store/robotStore';
import RobotModel from './RobotModel';
import * as THREE from 'three';

// Detailed environment configurations
const environments = [
  {
    name: 'warehouse',
    preset: 'warehouse',
    description: 'Industrial warehouse with shelving units and cargo containers',
    lighting: { 
      intensity: 0.8, 
      color: '#ffffff',
      ambient: 0.3,
      shadows: true
    },
    ground: { color: '#2a2a2a', roughness: 0.8 },
    fog: { color: '#404040', near: 10, far: 50 }
  },
  {
    name: 'laboratory',
    preset: 'studio',
    description: 'Clean research laboratory with equipment and workbenches',
    lighting: { 
      intensity: 1.2, 
      color: '#f0f8ff',
      ambient: 0.6,
      shadows: false
    },
    ground: { color: '#e8e8e8', roughness: 0.1 },
    fog: null
  },
  {
    name: 'factory',
    preset: 'sunset',
    description: 'Manufacturing floor with machinery and industrial equipment',
    lighting: { 
      intensity: 0.9, 
      color: '#ffcc80',
      ambient: 0.4,
      shadows: true
    },
    ground: { color: '#3d3d3d', roughness: 0.9 },
    fog: { color: '#5a4a3a', near: 15, far: 40 }
  },
  {
    name: 'outdoors',
    preset: 'park',
    description: 'Outdoor terrain with natural obstacles and varied surfaces',
    lighting: { 
      intensity: 1.0, 
      color: '#fff8e1',
      ambient: 0.5,
      shadows: true
    },
    ground: { color: '#4a5d3a', roughness: 0.7 },
    fog: { color: '#87ceeb', near: 20, far: 60 }
  }
];

// Warehouse Props Component
const WarehouseProps = () => {
  return (
    <group>
      {/* Shelving Units */}
      {[...Array(6)].map((_, i) => (
        <group key={`shelf-${i}`} position={[
          -15 + (i % 3) * 15, 
          0, 
          -10 + Math.floor(i / 3) * 20
        ]}>
          {/* Shelf frame */}
          <Box args={[0.2, 8, 4]} position={[0, 4, 0]} castShadow>
            <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
          </Box>
          <Box args={[0.2, 8, 4]} position={[8, 4, 0]} castShadow>
            <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
          </Box>
          {/* Shelf levels */}
          {[1, 3, 5, 7].map(height => (
            <Box key={height} args={[8, 0.2, 4]} position={[4, height, 0]} castShadow>
              <meshStandardMaterial color="#444444" metalness={0.5} roughness={0.6} />
            </Box>
          ))}
          {/* Cargo boxes */}
          <Box args={[2, 1.5, 1.5]} position={[2, 2.25, 0]} castShadow>
            <meshStandardMaterial color="#8B4513" roughness={0.8} />
          </Box>
          <Box args={[1.5, 1, 1]} position={[6, 3.5, 1]} castShadow>
            <meshStandardMaterial color="#2F4F4F" roughness={0.7} />
          </Box>
        </group>
      ))}
      
      {/* Large containers */}
      <Box args={[4, 4, 8]} position={[20, 2, 0]} castShadow>
        <meshStandardMaterial color="#800080" metalness={0.3} roughness={0.8} />
      </Box>
      <Box args={[4, 4, 8]} position={[20, 2, -12]} castShadow>
        <meshStandardMaterial color="#008080" metalness={0.3} roughness={0.8} />
      </Box>
      
      {/* Forklift */}
      <group position={[10, 0, 15]}>
        <Box args={[2, 1, 4]} position={[0, 0.5, 0]} castShadow>
          <meshStandardMaterial color="#FF4500" metalness={0.6} roughness={0.4} />
        </Box>
        <Cylinder args={[0.5, 0.5, 0.3]} position={[-0.7, 0.3, 1.5]} rotation={[Math.PI/2, 0, 0]} castShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </Cylinder>
        <Cylinder args={[0.5, 0.5, 0.3]} position={[0.7, 0.3, 1.5]} rotation={[Math.PI/2, 0, 0]} castShadow>
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </Cylinder>
      </group>
    </group>
  );
};

// Laboratory Props Component
const LaboratoryProps = () => {
  return (
    <group>
      {/* Workbenches */}
      {[...Array(4)].map((_, i) => (
        <group key={`bench-${i}`} position={[
          -12 + i * 8, 
          0, 
          i % 2 === 0 ? -8 : 8
        ]}>
          <Box args={[6, 0.2, 2]} position={[0, 2, 0]} castShadow>
            <meshStandardMaterial color="#f5f5f5" metalness={0.1} roughness={0.2} />
          </Box>
          <Box args={[0.2, 2, 0.2]} position={[-2.8, 1, -0.8]} castShadow>
            <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
          </Box>
          <Box args={[0.2, 2, 0.2]} position={[2.8, 1, -0.8]} castShadow>
            <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
          </Box>
          <Box args={[0.2, 2, 0.2]} position={[-2.8, 1, 0.8]} castShadow>
            <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
          </Box>
          <Box args={[0.2, 2, 0.2]} position={[2.8, 1, 0.8]} castShadow>
            <meshStandardMaterial color="#c0c0c0" metalness={0.8} roughness={0.2} />
          </Box>
          
          {/* Equipment on benches */}
          <Cylinder args={[0.3, 0.3, 0.8]} position={[-1, 2.6, 0]} castShadow>
            <meshStandardMaterial color="#4169E1" metalness={0.5} roughness={0.3} />
          </Cylinder>
          <Box args={[0.8, 0.4, 0.6]} position={[1, 2.4, 0]} castShadow>
            <meshStandardMaterial color="#708090" metalness={0.7} roughness={0.2} />
          </Box>
        </group>
      ))}
      
      {/* Server racks */}
      <Box args={[2, 6, 1]} position={[15, 3, -5]} castShadow>
        <meshStandardMaterial color="#2F2F2F" metalness={0.8} roughness={0.2} />
      </Box>
      <Box args={[2, 6, 1]} position={[15, 3, 5]} castShadow>
        <meshStandardMaterial color="#2F2F2F" metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Large equipment */}
      <Cylinder args={[1.5, 1.5, 3]} position={[-15, 1.5, 0]} castShadow>
        <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.1} />
      </Cylinder>
    </group>
  );
};

// Factory Props Component
const FactoryProps = () => {
  return (
    <group>
      {/* Conveyor belts */}
      {[...Array(3)].map((_, i) => (
        <group key={`conveyor-${i}`} position={[0, 0.5, -10 + i * 10]}>
          <Box args={[20, 0.2, 1]} position={[0, 0, 0]} castShadow>
            <meshStandardMaterial color="#333333" metalness={0.6} roughness={0.4} />
          </Box>
          <Box args={[0.3, 1, 1.2]} position={[-9, 0, 0]} castShadow>
            <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
          </Box>
          <Box args={[0.3, 1, 1.2]} position={[9, 0, 0]} castShadow>
            <meshStandardMaterial color="#666666" metalness={0.7} roughness={0.3} />
          </Box>
        </group>
      ))}
      
      {/* Industrial machinery */}
      <group position={[12, 0, 5]}>
        <Box args={[4, 3, 3]} position={[0, 1.5, 0]} castShadow>
          <meshStandardMaterial color="#654321" metalness={0.8} roughness={0.5} />
        </Box>
        <Cylinder args={[0.5, 0.5, 2]} position={[0, 4, 0]} castShadow>
          <meshStandardMaterial color="#C0C0C0" metalness={0.9} roughness={0.1} />
        </Cylinder>
      </group>
      
      <group position={[-12, 0, -5]}>
        <Cylinder args={[2, 2, 4]} position={[0, 2, 0]} castShadow>
          <meshStandardMaterial color="#8B0000" metalness={0.6} roughness={0.4} />
        </Cylinder>
        <Box args={[1, 1, 1]} position={[0, 4.5, 0]} castShadow>
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </Box>
      </group>
      
      {/* Pipes and infrastructure */}
      <Cylinder args={[0.3, 0.3, 30]} position={[0, 6, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
        <meshStandardMaterial color="#708090" metalness={0.8} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.2, 0.2, 20]} position={[8, 4, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
        <meshStandardMaterial color="#708090" metalness={0.8} roughness={0.3} />
      </Cylinder>
      
      {/* Oil drums */}
      <Cylinder args={[0.6, 0.6, 1.8]} position={[18, 0.9, 12]} castShadow>
        <meshStandardMaterial color="#4169E1" metalness={0.7} roughness={0.3} />
      </Cylinder>
      <Cylinder args={[0.6, 0.6, 1.8]} position={[20, 0.9, 12]} castShadow>
        <meshStandardMaterial color="#DC143C" metalness={0.7} roughness={0.3} />
      </Cylinder>
    </group>
  );
};

// Outdoor Props Component
const OutdoorProps = () => {
  return (
    <group>
      {/* Terrain variations */}
      <Cylinder args={[3, 3, 0.5]} position={[8, 0.25, 8]} castShadow receiveShadow>
        <meshStandardMaterial color="#654321" roughness={0.9} />
      </Cylinder>
      <Cylinder args={[2, 2, 0.8]} position={[-6, 0.4, -10]} castShadow receiveShadow>
        <meshStandardMaterial color="#556B2F" roughness={0.8} />
      </Cylinder>
      
      {/* Rocks and boulders */}
      {[...Array(8)].map((_, i) => (
        <Box 
          key={`rock-${i}`}
          args={[
            0.5 + Math.random() * 2, 
            0.3 + Math.random() * 1.5, 
            0.5 + Math.random() * 2
          ]} 
          position={[
            -15 + Math.random() * 30, 
            0.3, 
            -15 + Math.random() * 30
          ]}
          rotation={[
            Math.random() * 0.3, 
            Math.random() * Math.PI * 2, 
            Math.random() * 0.3
          ]}
          castShadow
        >
          <meshStandardMaterial color="#696969" roughness={0.95} />
        </Box>
      ))}
      
      {/* Tree stumps */}
      <Cylinder args={[1, 1.2, 1]} position={[12, 0.5, -8]} castShadow>
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </Cylinder>
      <Cylinder args={[0.8, 1, 0.8]} position={[-10, 0.4, 12]} castShadow>
        <meshStandardMaterial color="#A0522D" roughness={0.9} />
      </Cylinder>
      
      {/* Fallen logs */}
      <Cylinder args={[0.4, 0.4, 6]} position={[5, 0.4, -12]} rotation={[0, Math.PI/4, 0]} castShadow>
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </Cylinder>
      <Cylinder args={[0.3, 0.3, 4]} position={[-8, 0.3, 8]} rotation={[0, -Math.PI/6, 0]} castShadow>
        <meshStandardMaterial color="#654321" roughness={0.8} />
      </Cylinder>
      
      {/* Simple bushes (green spheres) */}
      {[...Array(6)].map((_, i) => (
        <group key={`bush-${i}`} position={[
          -12 + Math.random() * 24, 
          0.5, 
          -12 + Math.random() * 24
        ]}>
          <mesh castShadow>
            <sphereGeometry args={[0.8 + Math.random() * 0.4, 8, 6]} />
            <meshStandardMaterial color="#228B22" roughness={0.8} />
          </mesh>
        </group>
      ))}
      
      {/* Gravel patches */}
      <Cylinder args={[4, 4, 0.1]} position={[0, 0.05, 15]} castShadow receiveShadow>
        <meshStandardMaterial color="#A9A9A9" roughness={0.95} />
      </Cylinder>
      <Cylinder args={[2.5, 2.5, 0.1]} position={[-15, 0.05, -5]} castShadow receiveShadow>
        <meshStandardMaterial color="#B8860B" roughness={0.9} />
      </Cylinder>
    </group>
  );
};

const SceneContainer: React.FC = () => {
  const { selectedRobot, environment, setEnvironment } = useRobotStore();
  const canvasRef = useRef(null);
  const controlsRef = useRef(null);
  const [showGrid, setShowGrid] = useState(true);
  const [selectedEnvIndex, setSelectedEnvIndex] = useState(0);

  const currentEnvironment = environments[selectedEnvIndex];
  const environmentName = environment?.name || currentEnvironment.name;

  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.object.position.set(5, 5, 5);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  const handleToggleGrid = () => {
    setShowGrid(prev => !prev);
  };

  const handleEnvironmentChange = (index: number) => {
    setSelectedEnvIndex(index);
    if (setEnvironment) {
      setEnvironment(environments[index]);
    }
  };

  // Render environment-specific props
  const renderEnvironmentProps = () => {
    switch (currentEnvironment.name) {
      case 'warehouse':
        return <WarehouseProps />;
      case 'laboratory':
        return <LaboratoryProps />;
      case 'factory':
        return <FactoryProps />;
      case 'outdoors':
        return <OutdoorProps />;
      default:
        return null;
    }
  };

  const CustomEnvironment = ({ config }: { config: typeof currentEnvironment }) => {
    return (
      <>
        <Environment preset={config.preset} />
        
        {/* Fog */}
        {config.fog && (
          <fog attach="fog" args={[config.fog.color, config.fog.near, config.fog.far]} />
        )}
        
        {/* Advanced lighting setup */}
        <ambientLight intensity={config.lighting.ambient} color="#ffffff" />
        
        <directionalLight 
          position={[10, 15, 5]} 
          intensity={config.lighting.intensity} 
          color={config.lighting.color}
          castShadow={config.lighting.shadows}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-far={50}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
        />
        
        {/* Additional fill lighting */}
        <pointLight 
          position={[-15, 8, -10]} 
          intensity={config.lighting.intensity * 0.3} 
          color={config.lighting.color}
          distance={40}
        />
        <pointLight 
          position={[15, 8, 10]} 
          intensity={config.lighting.intensity * 0.3} 
          color={config.lighting.color}
          distance={40}
        />
        
        {/* Enhanced ground plane */}
        <Plane 
          args={[100, 100]} 
          rotation={[-Math.PI / 2, 0, 0]} 
          position={[0, -0.01, 0]}
          receiveShadow
        >
          <meshStandardMaterial 
            color={config.ground.color} 
            roughness={config.ground.roughness}
            metalness={0.1}
          />
        </Plane>
      </>
    );
  };

  return (
    <div className="relative w-full h-full bg-gray-900">
      <Canvas
        ref={canvasRef}
        shadows="soft"
        camera={{ position: [5, 5, 5], fov: 50 }}
        className="w-full h-full"
      >
        <SoftShadows size={25} near={9} samples={10} rings={11} />
        
        <CustomEnvironment config={currentEnvironment} />
        
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          dampingFactor={0.05}
          screenSpacePanning={false}
          minDistance={3}
          maxDistance={30}
          maxPolarAngle={Math.PI / 2}
        />
        
        {showGrid && (
          <Grid
            renderOrder={-1}
            position={[0, 0.001, 0]}
            infiniteGrid
            cellSize={1}
            cellThickness={0.3}
            sectionSize={10}
            sectionThickness={0.8}
            sectionColor="#666666"
            cellColor="#444444"
            fadeDistance={40}
            fadeStrength={1}
          />
        )}
        
        {/* Environment-specific props */}
        {renderEnvironmentProps()}
        
        {selectedRobot && <RobotModel robotConfig={selectedRobot} />}
        
        <ContactShadows 
          position={[0, -0.005, 0]} 
          opacity={0.6} 
          scale={30} 
          blur={2} 
          far={10} 
          color={currentEnvironment.ground.color}
        />
        
        <BakeShadows />
      </Canvas>
      
      {/* Enhanced UI Controls */}
      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white p-4 rounded-lg shadow-xl border border-gray-700">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-bold mb-2 text-blue-300">Environment</h3>
            <select 
              value={selectedEnvIndex}
              onChange={(e) => handleEnvironmentChange(Number(e.target.value))}
              className="bg-gray-800 text-white border border-gray-600 rounded px-3 py-2 text-sm min-w-[180px] focus:border-blue-500 focus:outline-none"
            >
              {environments.map((env, index) => (
                <option key={env.name} value={index}>
                  {env.name.charAt(0).toUpperCase() + env.name.slice(1)}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-300 mt-2 leading-relaxed max-w-[200px]">
              {currentEnvironment.description}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleResetView}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-2 rounded text-sm transition-all duration-200 transform hover:scale-105"
            >
              Reset View
            </button>
            <button
              onClick={handleToggleGrid}
              className="bg-gray-600 hover:bg-gray-700 px-3 py-2 rounded text-sm transition-all duration-200 transform hover:scale-105"
            >
              {showGrid ? 'Hide Grid' : 'Show Grid'}
            </button>
          </div>
        </div>
      </div>

      {/* Environment Details Panel */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md text-white p-4 rounded-lg shadow-xl border border-gray-700">
        <div className="text-sm space-y-2">
          <div className="font-bold text-yellow-300">{currentEnvironment.name.toUpperCase()}</div>
          <div className="text-xs text-gray-300 space-y-1">
            <div>Lighting: {Math.round(currentEnvironment.lighting.intensity * 100)}%</div>
            <div>Shadows: {currentEnvironment.lighting.shadows ? 'Enabled' : 'Disabled'}</div>
            <div>Surface: {currentEnvironment.ground.roughness > 0.5 ? 'Rough' : 'Smooth'}</div>
            {currentEnvironment.fog && <div>Atmosphere: Foggy</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneContainer;