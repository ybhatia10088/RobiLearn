import React, { useState, useRef } from 'react';
import { Mic, Send, Brain, ArrowRight, Square } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRobotStore } from '@/store/robotStore';

const NaturalLanguageInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant', content: string, executing?: boolean }>>([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m your AI programming assistant. You can tell me what you want the robot to do in natural language, and I\'ll help translate that into robot commands. For example, try saying "Move forward", "Turn right", or "Forward".' 
    }
  ]);

  const isExecutingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);

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

  const stopExecution = async () => {
    console.log('Stopping execution...');
    isExecutingRef.current = false;
    setIsExecuting(false);
    
    // Abort any ongoing operations
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Stop robot
    try {
      const { stopRobot } = useRobotStore.getState();
      await stopRobot();
    } catch (error) {
      console.warn('Error stopping robot:', error);
    }
  };

  const executeCommand = async (command: string, messageIndex: number) => {
    if (isExecutingRef.current) {
      await stopExecution();
      return;
    }

    console.log('Executing command:', command);
    
    isExecutingRef.current = true;
    setIsExecuting(true);
    
    // Update conversation to show executing state
    setConversation(prev => prev.map((msg, idx) => 
      idx === messageIndex ? { ...msg, executing: true } : msg
    ));

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    try {
      const { moveRobot, rotateRobot, grabObject, releaseObject, stopRobot, getSensorData } = useRobotStore.getState();
      
      // Always stop robot first
      await stopRobot();
      await delay(100, signal);

      const lowerCommand = command.toLowerCase();
      
      if (lowerCommand.includes('forward') || lowerCommand === 'forward') {
        // Extract distance and speed if mentioned
        const distanceMatch = lowerCommand.match(/(\d+)\s*(units?|meters?|cm|seconds?)/);
        const speedMatch = lowerCommand.match(/speed\s*(\d+)|(\d+)%/);
        
        const distance = distanceMatch ? parseInt(distanceMatch[1]) : 10;
        const speed = speedMatch ? Math.max(0.1, Math.min(1.0, parseInt(speedMatch[1] || speedMatch[2]) / 100)) : 0.5;
        const duration = Math.max(500, distance * 100);
        
        await moveRobot({ direction: 'forward', speed });
        await delay(duration, signal);
        await stopRobot();
        
      } else if (lowerCommand.includes('backward') || lowerCommand.includes('back')) {
        const distanceMatch = lowerCommand.match(/(\d+)\s*(units?|meters?|cm|seconds?)/);
        const speedMatch = lowerCommand.match(/speed\s*(\d+)|(\d+)%/);
        
        const distance = distanceMatch ? parseInt(distanceMatch[1]) : 10;
        const speed = speedMatch ? Math.max(0.1, Math.min(1.0, parseInt(speedMatch[1] || speedMatch[2]) / 100)) : 0.5;
        const duration = Math.max(500, distance * 100);
        
        await moveRobot({ direction: 'backward', speed });
        await delay(duration, signal);
        await stopRobot();
        
      } else if (lowerCommand.includes('left')) {
        const angleMatch = lowerCommand.match(/(\d+)\s*(degrees?|°)/);
        const speedMatch = lowerCommand.match(/speed\s*(\d+)|(\d+)%/);
        
        const angle = angleMatch ? parseInt(angleMatch[1]) : 90;
        const speed = speedMatch ? Math.max(0.1, Math.min(1.0, parseInt(speedMatch[1] || speedMatch[2]) / 100)) : 0.5;
        const duration = Math.max(300, angle * 10);
        
        await rotateRobot({ direction: 'left', speed });
        await delay(duration, signal);
        await stopRobot();
        
      } else if (lowerCommand.includes('right')) {
        const angleMatch = lowerCommand.match(/(\d+)\s*(degrees?|°)/);
        const speedMatch = lowerCommand.match(/speed\s*(\d+)|(\d+)%/);
        
        const angle = angleMatch ? parseInt(angleMatch[1]) : 90;
        const speed = speedMatch ? Math.max(0.1, Math.min(1.0, parseInt(speedMatch[1] || speedMatch[2]) / 100)) : 0.5;
        const duration = Math.max(300, angle * 10);
        
        await rotateRobot({ direction: 'right', speed });
        await delay(duration, signal);
        await stopRobot();
        
      } else if (lowerCommand.includes('grab') || lowerCommand.includes('pick')) {
        await grabObject();
        await delay(1000, signal);
        
      } else if (lowerCommand.includes('release') || lowerCommand.includes('drop')) {
        await releaseObject();
        await delay(1000, signal);
        
      } else if (lowerCommand.includes('sensor') || lowerCommand.includes('scan')) {
        // Read sensor data
        const sensorData = await getSensorData('ultrasonic');
        console.log('Sensor data:', sensorData);
        
      } else if (lowerCommand.includes('wait') || lowerCommand.includes('pause')) {
        const timeMatch = lowerCommand.match(/(\d+)\s*(seconds?|sec|s)/);
        const seconds = timeMatch ? Math.max(0.1, parseInt(timeMatch[1])) : 2;
        await delay(seconds * 1000, signal);
        
      } else if (lowerCommand.includes('stop')) {
        await stopRobot();
      }
      
      console.log('Command executed successfully');
      
    } catch (error) {
      if (error instanceof Error && error.message === 'Aborted') {
        console.log('Command execution was aborted');
      } else {
        console.error('Error executing command:', error);
      }
    } finally {
      // Cleanup
      try {
        const { stopRobot } = useRobotStore.getState();
        await stopRobot();
      } catch (error) {
        console.warn('Error stopping robot in cleanup:', error);
      }
      
      isExecutingRef.current = false;
      setIsExecuting(false);
      abortControllerRef.current = null;
      
      // Remove executing state from conversation
      setConversation(prev => prev.map((msg, idx) => 
        idx === messageIndex ? { ...msg, executing: false } : msg
      ));
    }
  };

  const parseCommand = (inputText: string) => {
    const lowerInput = inputText.toLowerCase();
    
    if (lowerInput.includes('forward') || lowerInput === 'forward') {
      return {
        action: 'move forward',
        code: `robot.move({
  direction: 'forward',
  speed: 0.5,
  duration: 1000
});`,
        canExecute: true
      };
    } else if (lowerInput.includes('backward') || lowerInput.includes('back')) {
      return {
        action: 'move backward',
        code: `robot.move({
  direction: 'backward',
  speed: 0.5,
  duration: 1000
});`,
        canExecute: true
      };
    } else if (lowerInput.includes('left')) {
      return {
        action: 'turn left',
        code: `robot.rotate({
  direction: 'left',
  speed: 0.5,
  angle: 90
});`,
        canExecute: true
      };
    } else if (lowerInput.includes('right')) {
      return {
        action: 'turn right',
        code: `robot.rotate({
  direction: 'right',
  speed: 0.5,
  angle: 90
});`,
        canExecute: true
      };
    } else if (lowerInput.includes('grab') || lowerInput.includes('pick')) {
      return {
        action: 'grab object',
        code: `robot.grab();`,
        canExecute: true
      };
    } else if (lowerInput.includes('release') || lowerInput.includes('drop')) {
      return {
        action: 'release object',
        code: `robot.release();`,
        canExecute: true
      };
    } else if (lowerInput.includes('sensor') || lowerInput.includes('scan')) {
      return {
        action: 'read sensor',
        code: `const sensorData = await robot.getSensorData('ultrasonic');
console.log('Sensor data:', sensorData);`,
        canExecute: true
      };
    } else if (lowerInput.includes('stop')) {
      return {
        action: 'stop robot',
        code: `robot.stop();`,
        canExecute: true
      };
    } else if (lowerInput.includes('wait') || lowerInput.includes('pause')) {
      return {
        action: 'wait',
        code: `robot.wait({
  duration: 2000
});`,
        canExecute: true
      };
    } else {
      return {
        action: null,
        code: null,
        canExecute: false
      };
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message to conversation
    const newConversation = [...conversation, { role: 'user', content: input }];
    setConversation(newConversation);
    
    const currentInput = input;
    setInput('');
    
    // Parse the command
    const parsed = parseCommand(currentInput);
    
    setTimeout(() => {
      let response;
      
      if (parsed.canExecute) {
        response = `I'll make the robot ${parsed.action}. Here's the code I'll execute:

\`\`\`javascript
${parsed.code}
\`\`\`

Should I run this command?`;
      } else {
        response = 'I\'m not sure how to interpret that instruction. Could you please rephrase it or try a different command? For example: "forward", "move forward", "turn left", "turn right", "grab", "read sensor", "stop".';
      }
      
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: response,
        executing: false
      }]);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    
    // Simulate voice recognition
    if (!isListening) {
      setTimeout(() => {
        setInput('Forward');
        setIsListening(false);
      }, 2000);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-600 h-full flex flex-col">
      <div className="border-b border-gray-600 p-3 flex justify-between items-center">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-white">Natural Language Programming</h3>
          <div className="ml-3 px-2 py-1 rounded-md bg-blue-900 text-blue-300 text-xs border border-blue-700">
            <div className="flex items-center">
              <Brain size={12} className="mr-1" />
              <span>AI Powered</span>
            </div>
          </div>
        </div>
        {isExecuting && (
          <div className="flex items-center text-sm text-blue-400">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
            Executing...
          </div>
        )}
      </div>
      
      <div className="flex-1 p-4 overflow-auto">
        <div className="space-y-4">
          {conversation.map((message, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-700 text-white border border-gray-600'
                } ${
                  message.executing ? 'ring-2 ring-blue-400' : ''
                }`}
              >
                {message.content.split('\n').map((line, i) => {
                  if (line.startsWith('```')) {
                    return null;
                  } else if (line.endsWith('```')) {
                    return null;
                  } else if (
                    message.content.includes('```javascript') && 
                    !line.startsWith('```') && 
                    i > message.content.split('\n').findIndex(l => l.includes('```javascript')) &&
                    i < message.content.split('\n').findIndex(l => l === '```')
                  ) {
                    return (
                      <div key={i} className="font-mono text-xs bg-gray-900 p-2 rounded text-green-400 my-1">
                        {line}
                      </div>
                    );
                  } else {
                    return <p key={i} className={i !== 0 ? 'mt-2' : ''}>{line}</p>;
                  }
                })}
                
                {message.role === 'assistant' && message.content.includes('Should I run this command?') && (
                  <div className="mt-3 flex space-x-2">
                    <button 
                      className={`text-xs py-2 px-3 rounded flex items-center transition-colors ${
                        isExecuting
                          ? 'bg-red-500 hover:bg-red-600 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                      onClick={() => executeCommand(message.content, index)}
                      disabled={message.executing}
                    >
                      {isExecuting ? (
                        <>
                          <Square size={12} className="mr-1" />
                          <span>Stop</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight size={12} className="mr-1" />
                          <span>Run Code</span>
                        </>
                      )}
                    </button>
                    <button 
                      className="bg-gray-600 hover:bg-gray-500 text-white text-xs py-2 px-3 rounded transition-colors"
                      disabled={isExecuting}
                    >
                      Edit First
                    </button>
                  </div>
                )}
                
                {message.executing && (
                  <div className="mt-2 flex items-center text-xs text-blue-400">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                    Executing command...
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="p-3 border-t border-gray-600">
        <div className="flex space-x-2">
          <button 
            className={`p-2 rounded-full transition-colors ${
              isListening 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600'
            }`}
            onClick={toggleListening}
            disabled={isExecuting}
          >
            <Mic size={18} />
          </button>
          <input
            type="text"
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type a command in natural language..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isExecuting}
          />
          <button
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSend}
            disabled={!input.trim() || isExecuting}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NaturalLanguageInput;
