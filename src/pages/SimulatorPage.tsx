import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import SceneContainer from '@/components/simulator/SceneContainer';
import ControlPanel from '@/components/simulator/ControlPanel';
import CodeEditor from '@/components/editor/CodeEditor';
import BlockEditor from '@/components/editor/BlockEditor';
import NaturalLanguageInput from '@/components/editor/NaturalLanguageInput';
import { Code, Blocks, MessageSquare, Book, ArrowLeft } from 'lucide-react';
import { useNavigate } from '@/hooks/useNavigation';
import { Challenge } from '@/types/challenge.types';

type EditorTab = 'code' | 'blocks' | 'natural';

const SimulatorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EditorTab>('code');
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const challengeId = params.get('challenge');
    
    if (challengeId) {
      // In a real app, this would fetch from an API
      fetch(`/api/challenges/${challengeId}`)
        .then(res => res.json())
        .catch(() => {
          // For demo, show tutorial content
          setCurrentChallenge({
            id: 'intro-1',
            title: 'Hello Robot',
            description: 'Get started with basic robot movement commands.',
            objectives: [
              { id: 'obj1', description: 'Move the robot forward', completionCriteria: 'robot.position.z > 5', completed: false },
              { id: 'obj2', description: 'Turn the robot right', completionCriteria: 'robot.rotation.y > 1.5', completed: false },
            ],
            hints: [
              { id: 'hint1', text: 'Use robot.move() to move forward', unlockCost: 0 },
              { id: 'hint2', text: 'Use robot.rotate() to turn the robot', unlockCost: 5 },
            ],
            category: 'intro',
            difficulty: 'beginner',
            estimatedTime: 10,
            startingCode: {
              natural_language: 'Move the robot forward and then turn right',
              block: '[]',
              code: '// Your code here\n\n// Example:\n// robot.move({\n//   direction: "forward",\n//   speed: 0.5,\n//   duration: 2000\n// });'
            },
            robotType: 'mobile',
            environmentId: 'simple-room',
            unlocked: true,
            completed: false,
            nextChallengeIds: ['intro-2'],
          } as Challenge);
        });
    }
  }, []);

  return (
    <Layout>
      <div className="min-h-[calc(100vh-var(--header-height)-var(--footer-height))] bg-dark-900">
        {currentChallenge && (
          <div className="px-6 py-6 bg-dark-800 border-b border-dark-600">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <button 
                    className="btn bg-dark-700 hover:bg-dark-600 text-white p-2.5 rounded-lg transition-colors"
                    onClick={() => navigate('/challenges')}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold text-white mb-2">{currentChallenge.title}</h1>
                    <p className="text-dark-300 text-lg">{currentChallenge.description}</p>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <div className="bg-dark-700 rounded-lg p-4 border border-dark-600 shadow-lg">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Book size={18} className="mr-2" />
                      Challenge Objectives
                    </h3>
                    <ul className="space-y-3">
                      {currentChallenge.objectives.map((objective) => (
                        <li 
                          key={objective.id}
                          className="flex items-center text-sm"
                        >
                          <div className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                            objective.completed 
                              ? 'bg-success-500 text-white' 
                              : 'bg-dark-600'
                          }`}>
                            {objective.completed && (
                              <svg width="12\" height="12\" viewBox="0 0 12 12\" fill="none">
                                <path d="M10 3L4.5 8.5L2 6\" stroke="currentColor\" strokeWidth="2\" strokeLinecap="round\" strokeLinejoin="round"/>
                              </svg>
                            )}
                          </div>
                          <span className={objective.completed ? 'text-success-400' : 'text-dark-200'}>
                            {objective.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="h-[600px] bg-dark-800 rounded-xl border border-dark-600 overflow-hidden shadow-xl">
                <SceneContainer />
              </div>
              
              <div className="editor-container shadow-xl">
                <div className="flex border-b border-dark-600 bg-dark-800 px-2">
                  <button 
                    className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'code' 
                        ? 'text-primary-400 border-b-2 border-primary-400 bg-dark-900' 
                        : 'text-dark-300 hover:text-dark-200 hover:bg-dark-700'
                    }`}
                    onClick={() => setActiveTab('code')}
                  >
                    <Code size={16} className="mr-2" />
                    <span>Code Editor</span>
                  </button>
                  <button 
                    className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'blocks' 
                        ? 'text-primary-400 border-b-2 border-primary-400 bg-dark-900' 
                        : 'text-dark-300 hover:text-dark-200 hover:bg-dark-700'
                    }`}
                    onClick={() => setActiveTab('blocks')}
                  >
                    <Blocks size={16} className="mr-2" />
                    <span>Block Editor</span>
                  </button>
                  <button 
                    className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                      activeTab === 'natural' 
                        ? 'text-primary-400 border-b-2 border-primary-400 bg-dark-900' 
                        : 'text-dark-300 hover:text-dark-200 hover:bg-dark-700'
                    }`}
                    onClick={() => setActiveTab('natural')}
                  >
                    <MessageSquare size={16} className="mr-2" />
                    <span>Natural Language</span>
                  </button>
                </div>
                
                <div className="editor-content">
                  {activeTab === 'code' && (
                    <CodeEditor 
                      initialCode={currentChallenge?.startingCode.code} 
                      onCodeRun={(code) => {
                        console.log('Running code:', code);
                      }}
                    />
                  )}
                  {activeTab === 'blocks' && <BlockEditor />}
                  {activeTab === 'natural' && <NaturalLanguageInput />}
                </div>
              </div>
            </div>
            
            <div className="h-full">
              <ControlPanel challenge={currentChallenge} />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SimulatorPage;