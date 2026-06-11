import React, { useState } from 'react';
import { useGameStore, ElementType } from '../store/gameStore';
import { motion, AnimatePresence } from 'motion/react';
import { Droplet, Sparkles, Wind, Flame, Sprout, Sun } from 'lucide-react';
import { useAccount, useConnect, useDisconnect, useSendTransaction, useSignMessage } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { BUILDER_CODE } from '../lib/web3/config';
import { withAttribution } from '../lib/erc8021/withAttribution';

export const UIOverlay: React.FC = () => {
  const inventory = useGameStore(state => state.inventory);
  const essence = useGameStore(state => state.essence);
  const addPlant = useGameStore(state => state.addPlant);
  const consumeInventory = useGameStore(state => state.consumeInventory);
  const plants = useGameStore(state => state.plants);
  
  const [selectedElement, setSelectedElement] = useState<ElementType | null>(null);

  // Wagmi Web3 Hooks
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransaction, isPending: isTxPending } = useSendTransaction();
  const { signMessage, isPending: isSignPending } = useSignMessage();

  const sendGMTransaction = async (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent planting
    if (!isConnected) {
      connect({ connector: injected() });
      return;
    }
    try {
      if (!address) return;
      const dataPayload = withAttribution('0x474d', BUILDER_CODE); // '0x474d' is 'GM'
      sendTransaction({
        to: '0xcD0dd3716C5561De47a24949335dF8a8CD8F71a3',
        value: 0n,
        data: dataPayload,
      }, {
        onSuccess(data) {
          alert(`GM transaction sent! Hash: ${data.substring(0, 15)}...`);
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitGarden = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isConnected) {
      connect({ connector: injected() });
      return;
    }
    try {
      if (!address) return;
      const message = `submitting my gorgeous Dreamseed Garden to the leaderboard!\n\nPlants: ${plants.length}\nEssence: ${essence}\nBuilder: ${BUILDER_CODE}\nApp ID: 693da7b8d19763ca26ddc282`;
      signMessage({ account: address, message }, {
        onSuccess(data) {
          alert(`Garden signature submitted! Signature: ${data.substring(0, 15)}...`);
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDisconnect = (e: React.MouseEvent) => {
    e.stopPropagation();
    disconnect();
  };

  const handleDragStart = (e: React.DragEvent, element: ElementType) => {
    e.dataTransfer.setData('element', element);
    setSelectedElement(element);
  };

  const handlePointerDown = (element: ElementType) => {
    // For mobile "tap to select, tap ground to plant" support
    setSelectedElement(element);
  };

  const handleDropAreaClick = (e: React.MouseEvent) => {
    if (selectedElement && inventory[selectedElement] > 0) {
      // Determine ground position. We'll simply use the un-scrolled clientX
      const success = consumeInventory(selectedElement);
      if (success) {
        addPlant({
          x: e.clientX,
          y: window.innerHeight - 50, // Approx earth level
          elements: [selectedElement],
          stage: 'seed',
          health: 100,
          essence: 10
        });
        
        // Haptic feedback for mobile
        if (navigator.vibrate) navigator.vibrate(50);
        
        setSelectedElement(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // allow drop
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const element = e.dataTransfer.getData('element') as ElementType;
    if (element && inventory[element] > 0) {
      const success = consumeInventory(element);
      if (success) {
        addPlant({
          x: e.clientX,
          y: window.innerHeight - 50,
          elements: [element],
          stage: 'seed',
          health: 100,
          essence: 10
        });
        
        if (navigator.vibrate) navigator.vibrate(50);
        setSelectedElement(null);
      }
    }
  };

  const getElementIcon = (el: ElementType) => {
    switch (el) {
      case 'starlight': return <Sparkles size={20} className="text-yellow-200" />;
      case 'moondew': return <Droplet size={20} className="text-blue-300" />;
      case 'whisperwind': return <Wind size={20} className="text-purple-300" />;
      case 'emberheart': return <Flame size={20} className="text-red-300" />;
    }
  };

  return (
    <div 
      className="absolute inset-0 z-10" 
      onClick={handleDropAreaClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Top Header */}
      <div className="absolute top-10 w-full px-6 flex justify-between items-start pointer-events-none">
        <div className="flex flex-col">
          <span className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold">Essence</span>
          <div className="flex items-center gap-1">
            <span className="text-lg font-bold text-slate-100">{essence}</span>
            <div className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-1 pointer-events-auto">
          {!isConnected ? (
             <button onClick={() => connect({ connector: injected() })} className="px-3 py-1.5 bg-indigo-600/30 border border-indigo-400/50 rounded-full text-[11px] font-bold hover:bg-indigo-600/50 transition-all text-slate-100">
               CONNECT WALLET
             </button>
          ) : (
            <button 
              onClick={sendGMTransaction}
              disabled={isTxPending}
              className="px-3 py-2 rounded-lg bg-[#E8A020]/20 hover:bg-[#E8A020]/30 border border-[#E8A020]/40 text-[#E8A020] transition-colors flex items-center gap-2 font-['Cinzel'] text-xs font-bold"
            >
              <Sun size={16} />
              {isTxPending ? 'SENDING...' : 'SAY GM'}
            </button>
          )}
          {isConnected && (
            <button onClick={handleDisconnect} className="text-[9px] text-slate-400 hover:text-slate-200 mt-1 mr-2 uppercase tracking-wider font-bold tracking-tighter">
              Disconnect {address?.substring(0,6)}...
            </button>
          )}
        </div>
      </div>

      {/* Selected Mode Indicator */}
      <AnimatePresence>
        {selectedElement && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-40 left-1/2 -translate-x-1/2 glass-panel px-6 py-3 rounded-full text-slate-100 pointer-events-none"
          >
            Tap anywhere to plant <span className="capitalize font-bold text-indigo-300">{selectedElement}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Floating Menu (Visual only) */}
      <div className="absolute top-1/2 right-4 -translate-y-1/2 flex flex-col gap-3 pointer-events-none">
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-xs shadow-lg pointer-events-auto hover:bg-white/10 transition-colors cursor-pointer active:scale-95">☀️</div>
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-xs shadow-lg pointer-events-auto hover:bg-white/10 transition-colors cursor-pointer active:scale-95">💧</div>
        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center text-xs shadow-lg pointer-events-auto hover:bg-white/10 transition-colors cursor-pointer active:scale-95">🎵</div>
      </div>

      {/* Bottom Left Label */}
      <div className="absolute bottom-32 left-6 pointer-events-none opacity-20">
        <h1 className="text-4xl font-serif italic text-white/90 drop-shadow-lg leading-tight">Dreamseed<br/>Gardener</h1>
      </div>

      {/* Seed Inventory / Toolbar */}
      <div className="absolute bottom-0 left-0 w-full px-6 pb-10 bg-gradient-to-t from-black/60 to-transparent pointer-events-none">
        <div className="glass-panel flex flex-col rounded-2xl p-4 pointer-events-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-semibold text-slate-400">Your Dream Seeds</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {(Object.keys(inventory) as ElementType[]).map((el) => (
              <div 
                key={el}
                draggable
                onDragStart={(e) => handleDragStart(e, el)}
                onPointerDown={(e) => {
                  e.stopPropagation(); // prevent immediate drop
                  handlePointerDown(el);
                }}
                className={`
                  relative min-w-[64px] h-16 flex flex-col items-center justify-center rounded-xl cursor-grab active:cursor-grabbing transition-all border
                  ${selectedElement === el ? 'bg-indigo-900/40 border-indigo-400/30 scale-105' : 'bg-white/5 border-white/10 hover:bg-white/10'}
                  ${inventory[el] === 0 ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                 {getElementIcon(el)}
                 <span className="text-[9px] uppercase font-bold mt-1 text-slate-300">{el}</span>
                 <div className="absolute -top-2 -right-2 bg-teal-500/80 text-slate-100 text-[10px] min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full font-bold shadow-[0_0_8px_#2dd4bf] border border-teal-300/50">
                   {inventory[el]}
                 </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex gap-2 pointer-events-auto">
            <button 
              onClick={handleSubmitGarden}
              disabled={isSignPending}
              className="flex-1 py-3 bg-indigo-600 rounded-xl font-bold text-sm shadow-lg shadow-indigo-600/20 text-white disabled:opacity-50 transition-all hover:bg-indigo-500 active:scale-95"
            >
              {isSignPending ? 'SIGNING...' : isConnected ? 'Record Garden On-Chain' : 'Connect to Record'}
            </button>
            <button className="w-12 h-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center transition-all hover:bg-white/10 active:scale-95">
              🏆
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
