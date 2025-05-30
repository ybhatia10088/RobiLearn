import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import SceneContainer from '@/components/simulator/SceneContainer';
import ControlPanel from '@/components/simulator/ControlPanel';
import CodeEditor from '@/components/editor/CodeEditor';
import BlockEditor from '@/components/editor/BlockEditor';
import NaturalLanguageInput from '@/components/editor/NaturalLanguageInput';
import { Code, Blocks, MessageSquare } from 'lucide-react';

type EditorTab = 'code' | 'blocks' | 'natural';

const SimulatorPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<EditorTab>('code');
  
  return (
    <Layout>
      <div className="min-h-[calc(100vh-var(--header-height)-var(--footer-height))] bg-dark-900 p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          <div className="lg:col-span-2 flex flex-col space-y-6">
            <div className="bg-dark-800 rounded-lg border border-dark-600 overflow-hidden h-[400px] md:h-[500px]">
              <SceneContainer />
            </div>
            
            <div className="flex-1 min-h-[400px]">
              <div className="flex border-b border-dark-600">
                <button 
                  className={`flex items-center px-4 py-2 text-sm font-medium ${activeTab === 'code' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-dark-300'}`}
                  onClick={() => setActiveTab('code')}
                >
                  <Code size={16} className="mr-2" />
                  <span>Code</span>
                </button>
                <button 
                  className={`flex items-center px-4 py-2 text-sm font-medium ${activeTab === 'blocks' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-dark-300'}`}
                  onClick={() => setActiveTab('blocks')}
                >
                  <Blocks size={16} className="mr-2" />
                  <span>Blocks</span>
                </button>
                <button 
                  className={`flex items-center px-4 py-2 text-sm font-medium ${activeTab === 'natural' ? 'text-primary-400 border-b-2 border-primary-400' : 'text-dark-300'}`}
                  onClick={() => setActiveTab('natural')}
                >
                  <MessageSquare size={16} className="mr-2" />
                  <span>Natural Language</span>
                </button>
              </div>
              
              <div className="h-[400px]">
                {activeTab === 'code' && <CodeEditor />}
                {activeTab === 'blocks' && <BlockEditor />}
                {activeTab === 'natural' && <NaturalLanguageInput />}
              </div>
            </div>
          </div>
          
          <div className="h-full">
            <ControlPanel />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SimulatorPage;