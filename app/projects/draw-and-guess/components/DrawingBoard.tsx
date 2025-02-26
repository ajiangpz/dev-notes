"use client";
import React, { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { useWebSocket } from '../hooks/useWebSocket';

export default function DrawingBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  
  const { gameState, tools } = useGame();
  const { sendDrawing } = useWebSocket();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const getMousePos = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const drawLine = (start: {x: number, y: number}, end: {x: number, y: number}) => {
      if (!ctx) return;
      
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.strokeStyle = tools.color;
      ctx.lineWidth = tools.lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();

      // 发送绘画数据
      sendDrawing({
        type: 'draw',
        points: [start, end],
        color: tools.color,
        lineWidth: tools.lineWidth
      });
    };

    const handleMouseDown = (e: MouseEvent) => {
      isDrawing.current = true;
      lastPos.current = getMousePos(e);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDrawing.current) return;
      const currentPos = getMousePos(e);
      drawLine(lastPos.current, currentPos);
      lastPos.current = currentPos;
    };

    const handleMouseUp = () => {
      isDrawing.current = false;
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
    };
  }, [tools, sendDrawing]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      className="bg-white border border-gray-300 rounded-lg shadow-lg"
    />
  );
} 