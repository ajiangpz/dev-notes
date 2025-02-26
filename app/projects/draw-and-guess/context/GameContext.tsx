"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GameState {
  currentRound: number;
  totalRounds: number;
  timeLeft: number;
  word: string;
  currentPlayer: string;
  userId: string;
  players: Array<{
    id: string;
    name: string;
    score: number;
  }>;
}

interface Tools {
  color: string;
  lineWidth: number;
  tool: 'pen' | 'eraser';
  clear: boolean;
}

interface GameContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  tools: Tools;
  setTools: React.Dispatch<React.SetStateAction<Tools>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 1,
    totalRounds: 5,
    timeLeft: 60,
    word: '',
    currentPlayer: '',
    userId: 'user1',
    players: []
  });

  const [tools, setTools] = useState<Tools>({
    color: '#000000',
    lineWidth: 2,
    tool: 'pen',
    clear: false
  });

  return (
    <GameContext.Provider value={{ gameState, setGameState, tools, setTools }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
} 