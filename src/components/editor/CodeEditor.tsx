import React, { useState } from 'react';
import { Play, XCircle, Save, Trash2 } from 'lucide-react';
import { useRobotStore } from '@/store/robotStore';
import { motion } from 'framer-motion';

const CodeEditor: React.FC = () => {
  const { selectedRobot } = useRobotStore();
  const [code, setCode] = useState(`// Control your robot with JavaScript
// Example: Move the robot forward
robot.move({
  direction: 'forward',
  speed: 0.5,
  duration: 2000
});

// Wait for the movement to complete
await robot.wait(2000);

// Turn the robot
robot.rotate({
  direction: 'right',
  angle: 90
});

// Access sensors
const sensorData = await robot.getSensorData('camera');
console.log(sensorData);
`);
  
  const [output, setOutput] = useState<Array<{type: 'info' | 'error' | 'success', message: string}>>([
    { type: 'info', message: 'Ready to run your code.' },
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  
  const handleRunCode = () => {
    if (!selectedRobot) {
      setOutput([
        ...output,
        { type: 'error', message: 'No robot selected. Please select a robot first.' }
      ]);
      return;
    }
    
    setIsRunning(true);
    setOutput([
      ...output,
      { type: 'info', message: 'Running code...' }
    ]);
    
    // Simulate code execution with a timeout
    setTimeout(() => {
      setOutput(prev => [
        ...prev,
        { type: 'success', message: `Code executed successfully on ${selectedRobot.name}.` }
      ]);
      setIsRunning(false);
    }, 2000);
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
        </div>
        <div className="flex space-x-2">
          <button className="btn bg-dark-700 hover:bg-dark-600 text-white text-sm py-1 px-3 flex items-center">
            <Save size={14} className="mr-1" />
            <span>Save</span>
          </button>
          <button 
            className={`btn text-sm py-1 px-3 flex items-center ${isRunning ? 'bg-error-500 hover:bg-error-600' : 'bg-primary-500 hover:bg-primary-600'} text-white`}
            onClick={isRunning ? () => {} : handleRunCode}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <XCircle size={14} className="mr-1" />
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
            className="code-editor w-full h-full resize-none outline-none"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
          />
        </div>
        
        <div className="w-full md:w-2/5 flex flex-col">
          <div className="p-2 border-b border-dark-600 bg-dark-700 flex justify-between items-center">
            <h4 className="text-sm font-medium text-white">Output</h4>
            <button 
              className="text-dark-400 hover:text-dark-200 transition-colors"
              onClick={handleClearOutput}
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
                    ? 'terminal-error' 
                    : line.type === 'success' 
                      ? 'terminal-success' 
                      : 'terminal-output'
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