import React, { useState, useEffect, useRef } from 'react';
import { Play, XCircle, Save, Trash2, Square } from 'lucide-react';
import { useRobotStore } from '@/store/robotStore';
import { motion } from 'framer-motion';

interface CodeEditorProps {
  initialCode?: string;
  onCodeRun?: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, onCodeRun }) => {
  const { selectedRobot } = useRobotStore();
  const [code, setCode] = useState(initialCode || `// Control your robot with JavaScript
// Example: Move the robot forward
await robot.move({
  direction: 'forward',
  speed: 0.5,
  duration: 2000
});

// Wait for the movement to complete
await robot.wait(2000);

// Turn the robot
await robot.rotate({
  direction: 'right',
  angle: 90
});

// Access sensors
const sensorData = await robot.getSensorData('ultrasonic');
console.log('Sensor data:', sensorData);

// More complex example
await robot.move({ direction: 'forward', speed: 0.3, duration: 1000 });
await robot.rotate({ direction: 'left', angle: 45 });
await robot.grabObject();
await robot.wait(1000);
await robot.releaseObject();
`);
  
  const [output, setOutput] = useState<Array<{type: 'info' | 'error' | 'success', message: string}>>([
    { type: 'info', message: 'Ready to run your code.' },
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const isRunningRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (initialCode) {
      setCode(initialCode);
    }
  }, [initialCode]);

  // Handle tab key in the editor
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const spaces = '  '; // 2 spaces for indentation
      
      setCode(code.substring(0, start) + spaces + code.substring(end));
      
      // Set cursor position after indentation
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.selectionStart = editorRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
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

  // Add output message
  const addOutput = (type: 'info' | 'error' | 'success', message: string) => {
    setOutput(prev => [...prev, { type, message }]);
  };

  // Stop execution
  const stopExecution = () => {
    console.log('Stopping code execution...');
    isRunningRef.current = false;
    setIsRunning(false);
    
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
    
    addOutput('info', 'Code execution stopped.');
  };

  // Create robot API object that will be available in the executed code
  const createRobotAPI = (abortSignal: AbortSignal) => {
    const { moveRobot, rotateRobot, grabObject, releaseObject, stopRobot, getSensorData } = useRobotStore.getState();
    
    return {
      move: async ({ direction, speed = 0.5, duration = 1000 }: { 
        direction: 'forward' | 'backward' | 'left' | 'right', 
        speed?: number, 
        duration?: number 
      }) => {
        if (!isRunningRef.current || abortSignal.aborted) {
          throw new Error('Execution stopped');
        }
        
        addOutput('info', `Moving ${direction} at speed ${speed} for ${duration}ms`);
        
        // Normalize speed to 0-1 range
        const normalizedSpeed = Math.max(0.1, Math.min(1.0, speed));
        
        await stopRobot();
        await delay(100, abortSignal);
        
        if (direction === 'forward' || direction === 'backward') {
          await moveRobot({ direction, speed: normalizedSpeed });
        } else {
          await rotateRobot({ direction, speed: normalizedSpeed });
        }
        
        await delay(duration, abortSignal);
        await stopRobot();
        
        addOutput('success', `Completed ${direction} movement`);
      },

      rotate: async ({ direction, angle = 90, speed = 0.5 }: {
        direction: 'left' | 'right',
        angle?: number,
        speed?: number
      }) => {
        if (!isRunningRef.current || abortSignal.aborted) {
          throw new Error('Execution stopped');
        }
        
        addOutput('info', `Rotating ${direction} ${angle}° at speed ${speed}`);
        
        const normalizedSpeed = Math.max(0.1, Math.min(1.0, speed));
        const duration = Math.max(300, angle * 10); // Estimate duration based on angle
        
        await stopRobot();
        await delay(100, abortSignal);
        
        await rotateRobot({ direction, speed: normalizedSpeed });
        await delay(duration, abortSignal);
        await stopRobot();
        
        addOutput('success', `Completed ${direction} rotation of ${angle}°`);
      },

      wait: async (duration: number) => {
        if (!isRunningRef.current || abortSignal.aborted) {
          throw new Error('Execution stopped');
        }
        
        addOutput('info', `Waiting for ${duration}ms`);
        await delay(duration, abortSignal);
        addOutput('success', `Wait completed`);
      },

      grabObject: async () => {
        if (!isRunningRef.current || abortSignal.aborted) {
          throw new Error('Execution stopped');
        }
        
        addOutput('info', 'Grabbing object...');
        await grabObject();
        await delay(1000, abortSignal);
        addOutput('success', 'Object grabbed');
      },

      releaseObject: async () => {
        if (!isRunningRef.current || abortSignal.aborted) {
          throw new Error('Execution stopped');
        }
        
        addOutput('info', 'Releasing object...');
        await releaseObject();
        await delay(1000, abortSignal);
        addOutput('success', 'Object released');
      },

      getSensorData: async (sensorType: string) => {
        if (!isRunningRef.current || abortSignal.aborted) {
          throw new Error('Execution stopped');
        }
        
        addOutput('info', `Reading ${sensorType} sensor...`);
        await delay(500, abortSignal);
        
        // Use the enhanced sensor data function from the store
        const sensorData = await getSensorData(sensorType);
        addOutput('success', `Sensor data: ${JSON.stringify(sensorData)}`);
        
        return sensorData;
      },

      getSensor: async (sensorType: string) => {
        if (!isRunningRef.current || abortSignal.aborted) {
          throw new Error('Execution stopped');
        }
        
        addOutput('info', `Reading ${sensorType} sensor...`);
        await delay(500, abortSignal);
        
        // Use the readSensor function from the store for backward compatibility
        const { readSensor } = useRobotStore.getState();
        const reading = await readSensor(sensorType);
        addOutput('success', `Sensor reading: ${reading}`);
        
        return reading;
      },

      stop: async () => {
        addOutput('info', 'Stopping robot...');
        await stopRobot();
        addOutput('success', 'Robot stopped');
      }
    };
  };

  const handleRunCode = async () => {
    if (!selectedRobot) {
      addOutput('error', 'No robot selected. Please select a robot first.');
      return;
    }

    // If already running, stop the execution
    if (isRunningRef.current) {
      stopExecution();
      return;
    }
    
    isRunningRef.current = true;
    setIsRunning(true);
    addOutput('info', 'Starting code execution...');
    
    // Create new abort controller for this execution
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      // Create the robot API
      const robot = createRobotAPI(signal);
      
      // Create a console object that logs to our output
      const customConsole = {
        log: (...args: any[]) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          addOutput('info', `Console: ${message}`);
        },
        error: (...args: any[]) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          addOutput('error', `Console Error: ${message}`);
        },
        warn: (...args: any[]) => {
          const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' ');
          addOutput('error', `Console Warning: ${message}`);
        }
      };

      // Execute the code using Function constructor with async support
      // We wrap the code in an async function to support await
      const asyncFunction = new Function('robot', 'console', `
        return (async () => {
          ${code}
        })();
      `);

      // Call the onCodeRun prop if provided
      if (onCodeRun) {
        onCodeRun(code);
      }

      // Execute the user's code
      await asyncFunction(robot, customConsole);
      
      if (isRunningRef.current && !signal.aborted) {
        addOutput('success', `Code executed successfully on ${selectedRobot.name}.`);
      }
      
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Aborted' || error.message === 'Execution stopped') {
          addOutput('info', 'Code execution was stopped.');
        } else {
          addOutput('error', `Execution error: ${error.message}`);
          console.error('Code execution error:', error);
        }
      } else {
        addOutput('error', 'An unknown error occurred during execution.');
        console.error('Unknown execution error:', error);
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
      abortControllerRef.current = null;
      
      if (isRunningRef.current) {
        addOutput('info', 'Code execution completed.');
      }
    }
  };
  
  const handleClearOutput = () => {
    setOutput([{ type: 'info', message: 'Output cleared.' }]);
  };
  
  return (
    <div className="bg-dark-800 rounded-lg border border-dark-600 h-full flex flex-col">
      <div className="border-b border-dark-600 p-3 flex justify-between items-center">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-white">Code Editor</h3>
          <div className="ml-3 px-2 py-1 rounded-md bg-dark-700 text-dark-300 text-xs">
            JavaScript
          </div>
          {isRunning && (
            <div className="ml-3 flex items-center text-sm text-primary-400">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse mr-2"></div>
              Running
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          <button className="btn bg-dark-700 hover:bg-dark-600 text-white text-sm py-1 px-3 flex items-center">
            <Save size={14} className="mr-1" />
            <span>Save</span>
          </button>
          <button 
            className={`btn text-sm py-1 px-3 flex items-center ${
              isRunning 
                ? 'bg-error-500 hover:bg-error-600' 
                : 'bg-primary-500 hover:bg-primary-600'
            } text-white`}
            onClick={handleRunCode}
          >
            {isRunning ? (
              <>
                <Square size={14} className="mr-1" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play size={14} className="mr-1" />
                <span>Run</span>
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row">
        <div className="flex-1 border-b md:border-b-0 md:border-r border-dark-600">
          <textarea
            ref={editorRef}
            className="w-full h-full resize-none outline-none bg-dark-900 text-white p-4 font-mono text-sm"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            disabled={isRunning}
          />
        </div>
        
        <div className="w-full md:w-2/5 flex flex-col">
          <div className="p-2 border-b border-dark-600 bg-dark-700 flex justify-between items-center">
            <h4 className="text-sm font-medium text-white">Output</h4>
            <button 
              className="text-dark-400 hover:text-dark-200 transition-colors"
              onClick={handleClearOutput}
              disabled={isRunning}
            >
              <Trash2 size={14} />
            </button>
          </div>
          
          <div className="terminal flex-1 overflow-auto p-3">
            {output.map((line, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`terminal-line ${
                  line.type === 'error' 
                    ? 'text-error-400' 
                    : line.type === 'success' 
                      ? 'text-success-400' 
                      : 'text-white'
                } mb-1`}
              >
                {line.message}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
