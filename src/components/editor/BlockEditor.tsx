import React, { useState } from 'react';
import { Play, PlusCircle, X, ArrowDown, ArrowUp, Trash2 } from 'lucide-react';
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

  const runProgram = async () => {
    const { moveRobot, rotateRobot, grabObject, releaseObject, stopRobot } = useRobotStore.getState();

    for (const block of blocks) {
      const speed = block.params.speed || 50;
      const distance = block.params.distance || 10;
      const angle = block.params.angle || 90;
      const seconds = block.params.seconds || 1;

      const smoothDelay = async (ms: number) => new Promise((res) => setTimeout(res, ms));

      switch (block.name) {
        case 'Move Forward':
        case 'Move Backward': {
          const duration = (distance / speed) * 1000;
          moveRobot({
            direction: block.name === 'Move Forward' ? 'forward' : 'backward',
            speed
          });
          await smoothDelay(duration);
          break;
        }

        case 'Turn Left':
        case 'Turn Right': {
          const duration = (angle / speed) * 1000;
          rotateRobot({
            direction: block.name === 'Turn Left' ? 'left' : 'right',
            speed
          });
          await smoothDelay(duration);
          break;
        }

        case 'Grab Object':
          await grabObject();
          await smoothDelay(500);
          break;

        case 'Release Object':
          await releaseObject();
          await smoothDelay(500);
          break;

        case 'Wait':
          await smoothDelay(seconds * 1000);
          break;

        default:
          console.warn(`Unhandled block: ${block.name}`);
          break;
      }

      await smoothDelay(300); // Delay between blocks
    }

    stopRobot();
  };

  return (
    <div className="bg-dark-800 rounded-lg border border-dark-600 h-full flex flex-col">
      <div className="border-b border-dark-600 p-3 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Block Editor</h3>
        <button onClick={runProgram} className="btn bg-primary-500 hover:bg-primary-600 text-white text-sm py-1 px-3 flex items-center">
          <Play size={14} className="mr-1" /> <span>Run Program</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 lg:w-1/4 border-b md:border-b-0 md:border-r border-dark-600 p-4 overflow-auto">
          <h4 className="text-sm font-medium text-white mb-3">Block Library</h4>
          {blockTypes.map((bt) => (
            <div key={bt.type} className="mb-4">
              <h5 className={`text-xs font-medium mb-2 text-${bt.type}-400`}>{bt.name}</h5>
              <div className="space-y-2">
                {bt.blocks.map((b) => (
                  <motion.div key={`${bt.type}-${b.name}`} className={`block block-${bt.type} cursor-pointer`} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => addBlock(bt.type, b.name, b.params)}>
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

        <div className="flex-1 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-medium text-white">Program</h4>
            {blocks.length > 0 && (
              <button onClick={() => setBlocks([])} className="text-xs text-error-400 hover:text-error-300 flex items-center">
                <Trash2 size={12} className="mr-1" /> <span>Clear All</span>
              </button>
            )}
          </div>

          {blocks.length === 0 ? (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-dark-600 rounded-lg">
              <p className="text-center text-dark-400 p-6">Drag blocks from the library to build your program</p>
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              {blocks.map((block) => (
                <motion.div key={block.id} className={`block block-${block.type} ${selectedBlockId === block.id ? 'ring-2 ring-white' : ''}`} whileHover={{ scale: 1.01 }} onClick={() => selectBlock(block.id)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-white mb-1">{block.name}</div>
                      {selectedBlockId === block.id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-2 space-y-2">
                          {Object.entries(block.params).map(([paramName, paramValue]) => (
                            <div key={paramName} className="flex items-center">
                              <label className="text-xs text-dark-300 w-24">{paramName}:</label>
                              <input type={typeof paramValue === 'number' ? 'number' : 'text'} className="input text-xs py-1 h-8 bg-dark-700" value={paramValue} onChange={(e) => updateBlockParam(block.id, paramName, typeof paramValue === 'number' ? Number(e.target.value) : e.target.value)} />
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 rounded hover:bg-dark-600 text-dark-400 hover:text-white" onClick={(e) => { e.stopPropagation(); moveBlockUp(block.id); }}><ArrowUp size={14} /></button>
                      <button className="p-1 rounded hover:bg-dark-600 text-dark-400 hover:text-white" onClick={(e) => { e.stopPropagation(); moveBlockDown(block.id); }}><ArrowDown size={14} /></button>
                      <button className="p-1 rounded hover:bg-dark-600 text-dark-400 hover:text-white" onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}><X size={14} /></button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlockEditor;
