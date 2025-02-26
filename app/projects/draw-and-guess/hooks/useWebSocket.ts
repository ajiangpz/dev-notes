"use client";
import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';

interface DrawingData {
  type: 'draw' | 'clear';
  points: Array<{x: number; y: number}>;
  color: string;
  lineWidth: number;
}

export function useWebSocket() {
  const ws = useRef<WebSocket>();
  const { setGameState } = useGame();

  useEffect(() => {
    // 连接WebSocket
    ws.current = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');

    ws.current.onopen = () => {
      console.log('WebSocket连接已建立');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'gameState') {
        setGameState(data.payload);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket连接已关闭');
    };

    return () => {
      ws.current?.close();
    };
  }, [setGameState]);

  const sendDrawing = (data: DrawingData) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'drawing',
        payload: data
      }));
    }
  };

  return { sendDrawing };
} 