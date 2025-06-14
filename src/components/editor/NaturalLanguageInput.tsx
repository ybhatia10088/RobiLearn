import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Brain, ArrowRight, Square, Zap, Eye, Activity, Clock } from 'lucide-react';
import { useRobotStore } from '@/store/robotStore';

const NaturalLanguageInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [conversation, setConversation] = useState<Array<{ 
    role: 'user' | 'assistant', 
    content: string, 
    executing?: boolean,
    timestamp?: number,
    parsedCommand?: any,
    executionResult?: string
  }>>([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m your AI programming assistant. I can help you control the robot using natural language commands. Here are some examples:\n\n• **Movement**: "Move forward 3 meters", "Turn left 45 degrees", "Go backward"\n• **Actions**: "Grab the object", "Release", "Read sensor data"\n• **Complex**: "Move forward then turn right", "Hover for 5 seconds then land"\n\nWhat would you like the robot to do?',
      timestamp: Date.now()
    }
  ]);

  const isExecutingRef = useRef(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const recognitionRef = useRef<any>(null);

  // Get robot store functions
  const { 
    moveRobot, 
    rotateRobot, 
    grabObject, 
    releaseObject, 
    stopRobot, 
    getSensorData,
    readSensor,
    startHover,
    landDrone,
    selectedRobot,
    robotState,
    isMoving
  } = useRobotStore();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

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
    
    // Stop robot using real store
    try {
      await stopRobot();
    } catch (error) {
      console.warn('Error stopping robot:', error);
    }
  };

  const executeCommand = async (parsedCommand: any, messageIndex: number) => {
    if (isExecutingRef.current) {
      await stopExecution();
      return;
    }

    console.log('Executing parsed command:', parsedCommand);
    
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
      // Always stop robot first
      await stopRobot();
      await delay(100, signal);

      let executionResult = '';

      for (const action of parsedCommand.actions) {
        if (signal.aborted) break;

        switch (action.type) {
          case 'move':
            await moveRobot({ 
              direction: action.direction, 
              speed: action.speed || 0.5,
              joint: action.joint 
            });
            await delay(action.duration || 1000, signal);
            await stopRobot();
            executionResult += `Moved ${action.direction} for ${action.duration}ms. `;
            break;

          case 'rotate':
            await rotateRobot({ 
              direction: action.direction, 
              speed: action.speed || 0.5 
            });
            await delay(action.duration || 900, signal);
            await stopRobot();
            executionResult += `Rotated ${action.direction} by ~${action.angle || 90}°. `;
            break;

          case 'grab':
            await grabObject();
            await delay(1000, signal);
            executionResult += 'Object grabbed. ';
            break;

          case 'release':
            await releaseObject();
            await delay(1000, signal);
            executionResult += 'Object released. ';
            break;

          case 'sensor':
            const sensorData = await getSensorData(action.sensorType || 'ultrasonic');
            console.log('Sensor data:', sensorData);
            executionResult += `Sensor reading: ${JSON.stringify(sensorData)}. `;
            break;

          case 'hover':
            if (selectedRobot?.type === 'drone') {
              await startHover();
              await delay(action.duration || 3000, signal);
              executionResult += `Hovered for ${action.duration || 3000}ms. `;
            }
            break;

          case 'land':
            if (selectedRobot?.type === 'drone') {
              await landDrone();
              await delay(1000, signal);
              executionResult += 'Landed safely. ';
            }
            break;

          case 'wait':
            await delay(action.duration || 2000, signal);
            executionResult += `Waited for ${action.duration || 2000}ms. `;
            break;

          case 'stop':
            await stopRobot();
            executionResult += 'Robot stopped. ';
            break;
        }
      }

      console.log('Command sequence executed successfully');
      
      // Update conversation with execution result
      setConversation(prev => prev.map((msg, idx) => 
        idx === messageIndex ? { 
          ...msg, 
          executing: false, 
          executionResult: executionResult.trim() || 'Command executed successfully.' 
        } : msg
      ));
      
    } catch (error) {
      if (error instanceof Error && error.message === 'Aborted') {
        console.log('Command execution was aborted');
      } else {
        console.error('Error executing command:', error);
      }
      
      // Update conversation with error
      setConversation(prev => prev.map((msg, idx) => 
        idx === messageIndex ? { 
          ...msg, 
          executing: false, 
          executionResult: 'Execution interrupted or failed.' 
        } : msg
      ));
    } finally {
      // Cleanup
      try {
        await stopRobot();
      } catch (error) {
        console.warn('Error stopping robot in cleanup:', error);
      }
      
      isExecutingRef.current = false;
      setIsExecuting(false);
      abortControllerRef.current = null;
    }
  };

  const parseCommand = (inputText: string) => {
    const lowerInput = inputText.toLowerCase();
    const actions = [];
    let canExecute = false;

    // Enhanced parsing for complex commands
    if (lowerInput.includes('forward') || lowerInput === 'forward') {
      const distanceMatch = lowerInput.match(/(\d+)\s*(units?|meters?|cm|steps?)/);
      const speedMatch = lowerInput.match(/speed\s*(\d+)|(\d+)%|slow|fast/);
      
      let speed = 0.5;
      if (speedMatch) {
        if (speedMatch[0].includes('slow')) speed = 0.3;
        else if (speedMatch[0].includes('fast')) speed = 0.8;
        else speed = Math.max(0.1, Math.min(1.0, parseInt(speedMatch[1] || speedMatch[2]) / 100));
      }
      
      const distance = distanceMatch ? parseInt(distanceMatch[1]) : 2;
      const duration = Math.max(500, distance * 200);
      
      actions.push({
        type: 'move',
        direction: 'forward',
        speed,
        duration,
        distance
      });
      canExecute = true;

    } else if (lowerInput.includes('backward') || lowerInput.includes('back')) {
      const distanceMatch = lowerInput.match(/(\d+)\s*(units?|meters?|cm|steps?)/);
      const speedMatch = lowerInput.match(/speed\s*(\d+)|(\d+)%|slow|fast/);
      
      let speed = 0.5;
      if (speedMatch) {
        if (speedMatch[0].includes('slow')) speed = 0.3;
        else if (speedMatch[0].includes('fast')) speed = 0.8;
        else speed = Math.max(0.1, Math.min(1.0, parseInt(speedMatch[1] || speedMatch[2]) / 100));
      }
      
      const distance = distanceMatch ? parseInt(distanceMatch[1]) : 2;
      const duration = Math.max(500, distance * 200);
      
      actions.push({
        type: 'move',
        direction: 'backward',
        speed,
        duration,
        distance
      });
      canExecute = true;

    } else if (lowerInput.includes('left')) {
      const angleMatch = lowerInput.match(/(\d+)\s*(degrees?|°)/);
      const speedMatch = lowerInput.match(/speed\s*(\d+)|(\d+)%|slow|fast/);
      
      let speed = 0.5;
      if (speedMatch) {
        if (speedMatch[0].includes('slow')) speed = 0.3;
        else if (speedMatch[0].includes('fast')) speed = 0.8;
        else speed = Math.max(0.1, Math.min(1.0, parseInt(speedMatch[1] || speedMatch[2]) / 100));
      }
      
      const angle = angleMatch ? parseInt(angleMatch[1]) : 90;
      const duration = Math.max(300, angle * 12);
      
      actions.push({
        type: 'rotate',
        direction: 'left',
        speed,
        duration,
        angle
      });
      canExecute = true;

    } else if (lowerInput.includes('right')) {
      const angleMatch = lowerInput.match(/(\d+)\s*(degrees?|°)/);
      const speedMatch = lowerInput.match(/speed\s*(\d+)|(\d+)%|slow|fast/);
      
      let speed = 0.5;
      if (speedMatch) {
        if (speedMatch[0].includes('slow')) speed = 0.3;
        else if (speedMatch[0].includes('fast')) speed = 0.8;
        else speed = Math.max(0.1, Math.min(1.0, parseInt(speedMatch[1] || speedMatch[2]) / 100));
      }
      
      const angle = angleMatch ? parseInt(angleMatch[1]) : 90;
      const duration = Math.max(300, angle * 12);
      
      actions.push({
        type: 'rotate',
        direction: 'right',
        speed,
        duration,
        angle
      });
      canExecute = true;
    }

    // Handle multiple actions (sequences)
    if (lowerInput.includes('then') || lowerInput.includes('and then')) {
      // This is a sequence command - would need more complex parsing
      // For now, handle simple cases
    }

    // Other actions
    if (lowerInput.includes('grab') || lowerInput.includes('pick')) {
      actions.push({ type: 'grab' });
      canExecute = true;
    }

    if (lowerInput.includes('release') || lowerInput.includes('drop')) {
      actions.push({ type: 'release' });
      canExecute = true;
    }

    if (lowerInput.includes('sensor') || lowerInput.includes('scan')) {
      actions.push({ 
        type: 'sensor',
        sensorType: lowerInput.includes('camera') ? 'camera' : 'ultrasonic'
      });
      canExecute = true;
    }

    if (lowerInput.includes('hover') && selectedRobot?.type === 'drone') {
      const timeMatch = lowerInput.match(/(\d+)\s*(seconds?|sec|s)/);
      const duration = timeMatch ? parseInt(timeMatch[1]) * 1000 : 3000;
      actions.push({ type: 'hover', duration });
      canExecute = true;
    }

    if (lowerInput.includes('land') && selectedRobot?.type === 'drone') {
      actions.push({ type: 'land' });
      canExecute = true;
    }

    if (lowerInput.includes('wait') || lowerInput.includes('pause')) {
      const timeMatch = lowerInput.match(/(\d+)\s*(seconds?|sec|s)/);
      const duration = timeMatch ? parseInt(timeMatch[1]) * 1000 : 2000;
      actions.push({ type: 'wait', duration });
      canExecute = true;
    }

    if (lowerInput.includes('stop')) {
      actions.push({ type: 'stop' });
      canExecute = true;
    }

    return {
      actions,
      canExecute,
      complexity: actions.length > 1 ? 'sequence' : 'simple',
      robotType: selectedRobot?.type || 'unknown'
    };
  };

  const generateCodePreview = (parsedCommand: any) => {
    if (!parsedCommand.canExecute || parsedCommand.actions.length === 0) {
      return null;
    }

    let code = '';
    
    parsedCommand.actions.forEach((action: any, index: number) => {
      switch (action.type) {
        case 'move':
          code += `await robot.move({\n  direction: '${action.direction}',\n  speed: ${action.speed},\n  duration: ${action.duration}\n});\n`;
          break;
        case 'rotate':
          code += `await robot.rotate({\n  direction: '${action.direction}',\n  speed: ${action.speed},\n  angle: ${action.angle}\n});\n`;
          break;
        case 'grab':
          code += `await robot.grab();\n`;
          break;
        case 'release':
          code += `await robot.release();\n`;
          break;
        case 'sensor':
          code += `const sensorData = await robot.getSensorData('${action.sensorType}');\nconsole.log('Sensor:', sensorData);\n`;
          break;
        case 'hover':
          code += `await robot.startHover();\nawait delay(${action.duration});\n`;
          break;
        case 'land':
          code += `await robot.landDrone();\n`;
          break;
        case 'wait':
          code += `await delay(${action.duration});\n`;
          break;
        case 'stop':
          code += `await robot.stop();\n`;
          break;
      }
      if (index < parsedCommand.actions.length - 1) code += '\n';
    });

    return code;
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message to conversation
    const newConversation = [...conversation, { 
      role: 'user', 
      content: input,
      timestamp: Date.now()
    }];
    setConversation(newConversation);
    
    const currentInput = input;
    setInput('');
    
    // Parse the command
    const parsed = parseCommand(currentInput);
    
    setTimeout(() => {
      let response;
      
      if (parsed.canExecute) {
        const code = generateCodePreview(parsed);
        const actionSummary = parsed.actions.map((action: any) => {
          switch (action.type) {
            case 'move':
              return `Move ${action.direction} (${action.distance || 'default'} units, ${action.speed * 100}% speed)`;
            case 'rotate':
              return `Rotate ${action.direction} (${action.angle}°, ${action.speed * 100}% speed)`;
            case 'grab':
              return 'Grab object';
            case 'release':
              return 'Release object';
            case 'sensor':
              return `Read ${action.sensorType} sensor`;
            case 'hover':
              return `Hover for ${action.duration / 1000}s`;
            case 'land':
              return 'Land drone';
            case 'wait':
              return `Wait for ${action.duration / 1000}s`;
            case 'stop':
              return 'Stop robot';
            default:
              return action.type;
          }
        }).join(' → ');

        response = `I'll execute the following sequence: **${actionSummary}**

${parsed.complexity === 'sequence' ? '**Multi-step sequence detected!**\n\n' : ''}**Generated Code:**
\`\`\`javascript
${code}
\`\`\`

Robot Type: ${parsed.robotType.toUpperCase()} | Actions: ${parsed.actions.length} | Complexity: ${parsed.complexity.toUpperCase()}

Ready to execute?`;
      } else {
        response = `I couldn't interpret that command. Here are some examples you can try:

**Basic Movement:**
• "Move forward 3 meters"
• "Turn left 45 degrees"
• "Go backward slowly"

**Actions:**
• "Grab the object"
• "Read ultrasonic sensor"
• "Release and stop"

**Drone Commands:**
• "Hover for 5 seconds"
• "Land the drone"

**Complex Sequences:**
• "Move forward then turn right"
• "Grab object and move backward"

What would you like the robot to do?`;
      }
      
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: response,
        executing: false,
        parsedCommand: parsed.canExecute ? parsed : null,
        timestamp: Date.now()
      }]);
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-600 h-full flex flex-col">
      <div className="border-b border-gray-600 p-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-white">Natural Language Controller</h3>
            <div className="px-2 py-1 rounded-md bg-blue-900 text-blue-300 text-xs border border-blue-700">
              <div className="flex items-center">
                <Brain size={12} className="mr-1" />
                <span>AI Powered</span>
              </div>
            </div>
            {selectedRobot && (
              <div className="px-2 py-1 rounded-md bg-green-900 text-green-300 text-xs border border-green-700">
                <div className="flex items-center">
                  <Activity size={12} className="mr-1" />
                  <span>{selectedRobot.type.toUpperCase()}</span>
                </div>
              </div>
            )}
          </div>
          {isExecuting && (
            <div className="flex items-center text-sm text-blue-400">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
              Executing...
            </div>
          )}
        </div>
        
        {robotState && (
          <div className="mt-2 flex items-center space-x-4 text-xs text-gray-400">
            <span>Position: ({robotState.position.x.toFixed(1)}, {robotState.position.z.toFixed(1)})</span>
            <span>Battery: {robotState.batteryLevel}%</span>
            <span className={`flex items-center ${isMoving ? 'text-yellow-400' : 'text-green-400'}`}>
              <div className={`w-1.5 h-1.5 rounded-full mr-1 ${isMoving ? 'bg-yellow-400' : 'bg-green-400'}`}></div>
              {isMoving ? 'Moving' : 'Idle'}
            </span>
          </div>
        )}
      </div>
      
      <div className="flex-1 p-4 overflow-auto">
        <div className="space-y-4">
          {conversation.map((message, index) => (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-lg p-3 ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-white border border-gray-600'
              } ${message.executing ? 'ring-2 ring-blue-400 animate-pulse' : ''}`}>
                
                {message.timestamp && (
                  <div className="flex items-center mb-2 text-xs opacity-60">
                    <Clock size={10} className="mr-1" />
                    {formatTimestamp(message.timestamp)}
                  </div>
                )}

                <div className="space-y-2">
                  {message.content.split('\n').map((line, i) => {
                    if (line.startsWith('```javascript')) {
                      return null;
                    } else if (line === '```') {
                      return null;
                    } else if (
                      message.content.includes('```javascript') && 
                      !line.startsWith('```') && 
                      i > message.content.split('\n').findIndex(l => l.includes('```javascript')) &&
                      i < message.content.split('\n').findIndex(l => l === '```')
                    ) {
                      return (
                        <div key={i} className="font-mono text-xs bg-gray-900 p-3 rounded border-l-2 border-green-500">
                          <div className="text-green-400">{line}</div>
                        </div>
                      );
                    } else {
                      return (
                        <p key={i} className={`${i !== 0 ? 'mt-1' : ''} ${line.startsWith('**') && line.endsWith('**') ? 'font-semibold text-blue-300' : ''}`}>
                          {line.replace(/\*\*(.*?)\*\*/g, '$1')}
                        </p>
                      );
                    }
                  })}
                </div>
                
                {message.role === 'assistant' && message.parsedCommand && (
                  <div className="mt-3 flex space-x-2">
                    <button 
                      className={`text-xs py-2 px-4 rounded flex items-center transition-all duration-200 ${
                        isExecuting
                          ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg'
                          : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl'
                      }`}
                      onClick={() => executeCommand(message.parsedCommand, index)}
                      disabled={message.executing}
                    >
                      {isExecuting ? (
                        <>
                          <Square size={12} className="mr-1" />
                          <span>Stop Execution</span>
                        </>
                      ) : (
                        <>
                          <Zap size={12} className="mr-1" />
                          <span>Execute Command</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
                
                {message.executing && (
                  <div className="mt-3 flex items-center text-xs text-blue-400 bg-blue-900/20 p-2 rounded">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                    Executing sequence... Robot is active.
                  </div>
                )}

                {message.executionResult && (
                  <div className="mt-3 text-xs bg-green-900/20 text-green-300 p-2 rounded border border-green-700/50">
                    <div className="flex items-center mb-1">
                      <Eye size={10} className="mr-1" />
                      <span className="font-medium">Execution Result:</span>
                    </div>
                    {message.executionResult}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-3 border-t border-gray-600">
        <div className="flex space-x-2">
          <button 
            className={`p-2 rounded-full transition-all duration-200 ${
              isListening 
                ? 'bg-red-500 text-white shadow-lg animate-pulse' 
                : 'bg-gray-700 text-gray-300 hover:text-white hover:bg-gray-600 hover:shadow-md'
            }`}
            onClick={toggleListening}
            disabled={isExecuting}
            title={recognitionRef.current ? 'Voice input' : 'Voice input not supported'}
          >
            <Mic size={18} />
          </button>
          <input
            type="text"
            className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            placeholder={isListening ? 'Listening...' : 'Tell the robot what to do...'}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isExecuting || isListening}
          />
          <button
            className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            onClick={handleSend}
            disabled={!input.trim() || isExecuting || isListening}
            title="Send command"
          >
            <Send size={18} />
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          Try: "Move forward 2 meters", "Turn left 90 degrees", "Read sensor data"
        </div>
      </div>
    </div>
  );
};

export default NaturalLanguageInput;
