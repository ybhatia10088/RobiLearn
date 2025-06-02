import React, { useState, useRef } from 'react';
import { Play, PlusCircle, X, ArrowDown, ArrowUp, Trash2, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRobotStore } from '@/store/robotStore';

type BlockType = 'motion' | 'sensor' | 'logic' | 'action';

interface Block {
  id: string;
  type: BlockType;
  name: string;
  params: Record<string, any>;
}

const BlockEditor: React.FC = () => {
  const [blocks, setBlocks] = useState<Block[]>([{
    id: '1', type: 'motion', name: 'Move Forward', params: { distance: 10, speed: 50 }
  }, {
    id: '2', type: 'motion', name: 'Turn Right', params: { angle: 90, speed: 50 }
  }, {
    id: '3', type: 'sensor', name: 'Check Distance', params: { sensor: 'ultrasonic', threshold: 20 }
  }]);

  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(-1);
  
  // Use ref to track running state to avoid stale closure issues
  const isRunningRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const blockTypes: Array<{ type: BlockType, name: string, blocks: Array<{ name: string, params: Record<string, any> }> }> = [
    {
      type: 'motion',
      name: 'Motion',
      blocks: [
        { name: 'Move Forward', params: { distance: 10, speed: 50 } },
        { name: 'Move Backward', params: { distance: 10, speed: 50 } },
        { name: 'Turn Left', params: { angle: 90, speed: 50 } },
        { name: 'Turn Right', params: { angle: 90, speed: 50 } },
      ]
    },
    {
      type: 'sensor',
      name: 'Sensors',
      blocks: [
        { name: 'Check Distance', params: { sensor: 'ultrasonic', threshold: 20 } },
        { name: 'Detect Color', params: { sensor: 'camera', color: 'red' } },
        { name: 'Check Light Level', params: { sensor: 'light', threshold: 50 } },
      ]
    },
    {
      type: 'logic',
      name: 'Logic',
      blocks: [
        { name: 'If Condition', params: { condition: 'distance < 20' } },
        { name: 'Repeat', params: { times: 5 } },
        { name: 'Wait', params: { seconds: 2 } },
      ]
    },
    {
      type: 'action',
      name: 'Actions',
      blocks: [
        { name: 'Grab Object', params: {} },
        { name: 'Release Object', params: {} },
        { name: 'Light LED', params: { color: 'green' } },
      ]
    },
  ];

  const addBlock = (type: BlockType, name: string, params: Record<string, any>) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      name,
      params,
    };
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
    if (selectedBlockId === id) setSelectedBlockId(null);
  };

  const selectBlock = (id: string) => setSelectedBlockId(id === selectedBlockId ? null : id);

  const updateBlockParam = (id: string, paramName: string, value: any) => {
    setBlocks(blocks.map(block => block.id === id ? {
      ...block,
      params: {
        ...block.params,
        [paramName]: value,
      }
    } : block));
  };

  const moveBlockUp = (id: string) => {
    const index = blocks.findIndex(b => b.id === id);
    if (index > 0) {
      const newBlocks = [...blocks];
      [newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]];
      setBlocks(newBlocks);
    }
  };

  const moveBlockDown = (id: string) => {
    const index = blocks.findIndex(b => b.id === id);
    if (index < blocks.length - 1) {
      const newBlocks = [...blocks];
      [newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]];
      setBlocks(newBlocks);
    }
  };

  const stopProgram = () => {
    console.log('Stopping program...');
    isRunningRef.current = false;
    setIsRunning(false);
    setCurrentBlockIndex(-1);
    
    // Abort any ongoing operations
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Stop robot using store
    try {
      const { stopRobot } = useRobotStore.getState();
      stopRobot();
    } catch (error) {
      console.warn('Error stopping robot:', error);
    }
    
    console.log('Program stopped');
  };

  // Helper function to create abortable delay
  const delay = (ms: number, abortSignal?: AbortSignal): Promise<void> => {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(resolve, ms);
      
      if (abortSignal) {
        abortSignal.addEventListener('abort', () => {
          clearTimeout(timeout);
          reject(new Error('Aborted'));
        });
      }
    });
  };

  const runProgram = async () => {
    // If already running, stop the program
    if (isRunningRef.current) {
      stopProgram();
      return;
    }

    if (blocks.length === 0) {
      console.log('No blocks to execute');
      return;
    }

    console.log('Starting program execution...');
    
    // Set running state
    isRunningRef.current = true;
    setIsRunning(true);
    setCurrentBlockIndex(0);
    
    // Create new abort controller for this execution
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      // Get robot control functions
      const { moveRobot, rotateRobot, grabObject, releaseObject, stopRobot } = useRobotStore.getState();

      for (let i = 0; i < blocks.length; i++) {
        // Check if program was stopped
        if (!isRunningRef.current || signal.aborted) {
          console.log('Program execution interrupted');
          break;
        }
        
        const block = blocks[i];
        setCurrentBlockIndex(i);
        console.log(`Executing block ${i + 1}/${blocks.length}: ${block.name}`);
        
        // Always stop the robot before starting a new action
        await stopRobot();
        await delay(100, signal); // Brief pause for state to settle

        const speed = Math.max(0.1, Math.min(1.0, (block.params.speed || 50) / 100));
        
        try {
          switch (block.name) {
            case 'Move Forward':
              const forwardDistance = block.params.distance || 10;
              const forwardDuration = Math.max(500, forwardDistance * 100);
              
              await moveRobot({ direction: 'forward', speed });
              await delay(forwardDuration, signal);
              await stopRobot();
              break;

            case 'Move Backward':
              const backwardDistance = block.params.distance || 10;
              const backwardDuration = Math.max(500, backwardDistance * 100);
              
              await moveRobot({ direction: 'backward', speed });
              await delay(backwardDuration, signal);
              await stopRobot();
              break;

            case 'Turn Left':
              const leftAngle = block.params.angle || 90;
              const leftDuration = Math.max(300, leftAngle * 10);
              
              await rotateRobot({ direction: 'left', speed });
              await delay(leftDuration, signal);
              await stopRobot();
              break;

            case 'Turn Right':
              const rightAngle = block.params.angle || 90;
              const rightDuration = Math.max(300, rightAngle * 10);
              
              await rotateRobot({ direction: 'right', speed });
              await delay(rightDuration, signal);
              await stopRobot();
              break;

            case 'Grab Object':
              await grabObject();
              await delay(1000, signal);
              break;

            case 'Release Object':
              await releaseObject();
              await delay(1000, signal);
              break;

            case 'Wait':
              const seconds = Math.max(0.1, block.params.seconds || 1);
              await delay(seconds * 1000, signal);
              break;

            case 'Check Distance':
              console.log(`Checking distance with ${block.params.sensor} sensor (threshold: ${block.params.threshold})`);
              await delay(500, signal);
              break;

            case 'Detect Color':
              console.log(`Detecting ${block.params.color} color with ${block.params.sensor} sensor`);
              await delay(500, signal);
              break;

            case 'Check Light Level':
              console.log(`Checking light level with ${block.params.sensor} sensor (threshold: ${block.params.threshold})`);
              await delay(500, signal);
              break;

            case 'Light LED':
              console.log(`Lighting LED with color: ${block.params.color}`);
              await delay(500, signal);
              break;

            default:
              console.warn(`Unhandled block: ${block.name}`);
              await delay(300, signal);
              break;
          }
        } catch (blockError) {
          if (blockError instanceof Error && blockError.message === 'Aborted') {
            throw blockError; // Re-throw abort errors
          }
          console.error(`Error executing block ${block.name}:`, blockError);
          // Continue with next block on non-abort errors
        }

        // Pause between blocks for better visualization and control
        if (isRunningRef.current && !signal.aborted) {
          await delay(200, signal);
        }
      }

      if (isRunningRef.current && !signal.aborted) {
        console.log('Program execution completed successfully');
      }
      
    } catch (error) {
      if (error instanceof Error && error.message === 'Aborted') {
        console.log('Program execution was aborted');
      } else {
        console.error('Error during program execution:', error);
      }
    } finally {
      // Ensure robot is stopped and state is reset
      try {
        const { stopRobot } = useRobotStore.getState();
        await stopRobot();
      } catch (error) {
        console.warn('Error stopping robot in cleanup:', error);
      }
      
      // Reset state
      isRunningRef.current = false;
      setIsRunning(false);
      setCurrentBlockIndex(-1);
      abortControllerRef.current = null;
      
      console.log('Program execution cleanup completed');
    }
  };

  return (
    <div className="bg-dark-800 rounded-lg border border-dark-600 h-full flex flex-col">
      <div className="border-b border-dark-600 p-3 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Block Editor</h3>
        <div className="flex items-center space-x-2">
          {isRunning && (
            <div className="flex items-center text-sm text-primary-400">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse mr-2"></div>
              Running ({currentBlockIndex + 1}/{blocks.length})
            </div>
          )}
          <button 
            onClick={runProgram} 
            className={`btn text-white text-sm py-1 px-3 flex items-center ${
              isRunning 
                ? 'bg-error-500 hover:bg-error-600' 
                : 'bg-primary-500 hover:bg-primary-600'
            }`}
          >
            {isRunning ? (
              <>
                <Square size={14} className="mr-1" /> 
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play size={14} className="mr-1" /> 
                <span>Run Program</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        <div className="w-full md:w-1/3 lg:w-1/4 border-b md:border-b-0 md:border-r border-dark-600 overflow-y-auto">
          <div className="p-4">
            <h4 className="text-sm font-medium text-white mb-3">Block Library</h4>
            {blockTypes.map((bt) => (
              <div key={bt.type} className="mb-4">
                <h5 className={`text-xs font-medium mb-2 text-${bt.type}-400`}>{bt.name}</h5>
                <div className="space-y-2">
                  {bt.blocks.map((b) => (
                    <motion.div 
                      key={`${bt.type}-${b.name}`} 
                      className={`block block-${bt.type} cursor-pointer ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`} 
                      whileHover={!isRunning ? { scale: 1.02 } : {}} 
                      whileTap={!isRunning ? { scale: 0.98 } : {}} 
                      onClick={() => !isRunning && addBlock(bt.type, b.name, b.params)}
                    >
                      <div className="flex items-center">
                        <PlusCircle size={14} className="mr-2 text-white" />
                        <span className="text-sm text-white">{b.name}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="p-4 flex justify-between items-center">
            <h4 className="text-sm font-medium text-white">Program</h4>
            {blocks.length > 0 && !isRunning && (
              <button 
                onClick={() => setBlocks([])} 
                className="text-xs text-error-400 hover:text-error-300 flex items-center"
              >
                <Trash2 size={12} className="mr-1" /> 
                <span>Clear All</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-4">
            {blocks.length === 0 ? (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-dark-600 rounded-lg">
                <p className="text-center text-dark-400 p-6">Drag blocks from the library to build your program</p>
              </div>
            ) : (
              <div className="space-y-2">
                {blocks.map((block, index) => (
                  <motion.div 
                    key={block.id} 
                    className={`block block-${block.type} ${
                      selectedBlockId === block.id ? 'ring-2 ring-white' : ''
                    } ${
                      currentBlockIndex === index ? 'ring-2 ring-primary-400 bg-primary-900/20' : ''
                    } ${
                      isRunning && currentBlockIndex !== index ? 'opacity-60' : ''
                    }`} 
                    whileHover={!isRunning ? { scale: 1.01 } : {}} 
                    onClick={() => !isRunning && selectBlock(block.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="text-xs text-dark-400 mr-2">#{index + 1}</span>
                          <div className="font-medium text-white mb-1">{block.name}</div>
                          {currentBlockIndex === index && (
                            <div className="ml-2 flex items-center">
                              <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"></div>
                            </div>
                          )}
                        </div>
                        {selectedBlockId === block.id && !isRunning && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: 'auto' }} 
                            exit={{ opacity: 0, height: 0 }} 
                            className="mt-2 space-y-2"
                          >
                            {Object.entries(block.params).map(([paramName, paramValue]) => (
                              <div key={paramName} className="flex items-center">
                                <label className="text-xs text-dark-300 w-24 capitalize">{paramName}:</label>
                                <input 
                                  type={typeof paramValue === 'number' ? 'number' : 'text'} 
                                  className="input text-xs py-1 h-8 bg-dark-700" 
                                  value={paramValue} 
                                  min={typeof paramValue === 'number' ? 0 : undefined}
                                  max={paramName === 'speed' ? 100 : undefined}
                                  onChange={(e) => updateBlockParam(
                                    block.id, 
                                    paramName, 
                                    typeof paramValue === 'number' ? Number(e.target.value) : e.target.value
                                  )} 
                                />
                                {paramName === 'speed' && <span className="text-xs text-dark-400 ml-1">%</span>}
                                {paramName === 'distance' && <span className="text-xs text-dark-400 ml-1">units</span>}
                                {paramName === 'angle' && <span className="text-xs text-dark-400 ml-1">°</span>}
                                {paramName === 'seconds' && <span className="text-xs text-dark-400 ml-1">sec</span>}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </div>
                      {!isRunning && (
                        <div className="flex space-x-1">
                          <button 
                            className="p-1 rounded hover:bg-dark-600 text-dark-400 hover:text-white" 
                            onClick={(e) => { e.stopPropagation(); moveBlockUp(block.id); }}
                            disabled={index === 0}
                          >
                            <ArrowUp size={14} />
                          </button>
                          <button 
                            className="p-1 rounded hover:bg-dark-600 text-dark-400 hover:text-white" 
                            onClick={(e) => { e.stopPropagation(); moveBlockDown(block.id); }}
                            disabled={index === blocks.length - 1}
                          >
                            <ArrowDown size={14} />
                          </button>
                          <button 
                            className="p-1 rounded hover:bg-dark-600 text-dark-400 hover:text-white" 
                            onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockEditor;
