import React, { useState } from 'react';
import { Mic, Send, Brain, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const NaturalLanguageInput: React.FC = () => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([
    { 
      role: 'assistant', 
      content: 'Hello! I\'m your AI programming assistant. You can tell me what you want the robot to do in natural language, and I\'ll help translate that into robot commands. For example, try saying "Move forward for 5 seconds then turn right".' 
    }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message to conversation
    setConversation([...conversation, { role: 'user', content: input }]);
    
    // Clear input
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      let response;
      
      if (input.toLowerCase().includes('move') && input.toLowerCase().includes('forward')) {
        response = 'I\'ll make the robot move forward. Here\'s the code I\'ll execute:\n\n```javascript\nrobot.move({\n  direction: \'forward\',\n  speed: 0.5,\n  duration: 5000\n});\n```\n\nShould I run this command?';
      } else if (input.toLowerCase().includes('turn') || input.toLowerCase().includes('rotate')) {
        response = 'I\'ll make the robot turn. Here\'s the code I\'ll execute:\n\n```javascript\nrobot.rotate({\n  direction: \'right\',\n  angle: 90\n});\n```\n\nShould I run this command?';
      } else if (input.toLowerCase().includes('grab') || input.toLowerCase().includes('pick')) {
        response = 'I\'ll make the robot grab an object. Here\'s the code I\'ll execute:\n\n```javascript\nrobot.grab();\n```\n\nShould I run this command?';
      } else {
        response = 'I\'m not sure how to interpret that instruction. Could you please rephrase it or try a different command? For example: "move forward", "turn left", "grab the object".';
      }
      
      setConversation(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
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
        setInput('Move forward and then turn right');
        setIsListening(false);
      }, 3000);
    }
  };

  return (
    <div className="bg-dark-800 rounded-lg border border-dark-600 h-full flex flex-col">
      <div className="border-b border-dark-600 p-3 flex justify-between items-center">
        <div className="flex items-center">
          <h3 className="text-lg font-semibold text-white">Natural Language Programming</h3>
          <div className="ml-3 px-2 py-1 rounded-md bg-primary-900 text-primary-300 text-xs border border-primary-700">
            <div className="flex items-center">
              <Brain size={12} className="mr-1" />
              <span>AI Powered</span>
            </div>
          </div>
        </div>
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
                    ? 'bg-primary-700 text-white' 
                    : 'bg-dark-700 text-white border border-dark-600'
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
                      <div key={i} className="font-mono text-xs bg-dark-900 p-1 text-green-400">
                        {line}
                      </div>
                    );
                  } else {
                    return <p key={i} className={i !== 0 ? 'mt-2' : ''}>{line}</p>;
                  }
                })}
                
                {message.role === 'assistant' && message.content.includes('Should I run this command?') && (
                  <div className="mt-3 flex space-x-2">
                    <button className="btn-primary text-xs py-1 px-2 flex items-center">
                      <ArrowRight size={12} className="mr-1" />
                      <span>Run Code</span>
                    </button>
                    <button className="btn bg-dark-600 hover:bg-dark-500 text-white text-xs py-1 px-2">
                      Edit First
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="p-3 border-t border-dark-600">
        <div className="flex space-x-2">
          <button 
            className={`p-2 rounded-full ${isListening ? 'bg-error-500 text-white' : 'bg-dark-700 text-dark-300 hover:text-white hover:bg-dark-600'} transition-colors`}
            onClick={toggleListening}
          >
            <Mic size={18} />
          </button>
          <input
            type="text"
            className="input bg-dark-700"
            placeholder="Type a command in natural language..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            className="p-2 rounded-full bg-primary-500 hover:bg-primary-600 text-white transition-colors"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NaturalLanguageInput;