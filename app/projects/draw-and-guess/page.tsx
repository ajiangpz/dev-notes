"use client";
import React from 'react';
import DrawingBoard from './components/DrawingBoard';
import ToolBar from './components/ToolBar';
import GamePanel from './components/GamePanel';
import { GameProvider } from './context/GameContext';

export default function DrawAndGuess() {
  return (
    <GameProvider>
      <div className="flex flex-col h-screen">
        <header className="bg-white shadow p-4">
          <h1 className="text-2xl font-bold">你画我猜</h1>
        </header>
        
        <main className="flex-1 flex gap-4 p-4">
          <div className="flex-1 flex flex-col gap-4">
            <ToolBar />
            <DrawingBoard />
          </div>
          <GamePanel />
        </main>
      </div>
    </GameProvider>
  );
} 