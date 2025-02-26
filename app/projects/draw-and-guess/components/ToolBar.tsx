"use client";
import React from 'react';
import { useGame } from '../context/GameContext';

export default function ToolBar() {
  const { tools, setTools } = useGame();

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
      <div className="flex items-center gap-2">
        <label>颜色:</label>
        <input
          type="color"
          value={tools.color}
          onChange={(e) => setTools({ ...tools, color: e.target.value })}
          className="w-8 h-8 border-0"
        />
      </div>

      <div className="flex items-center gap-2">
        <label>线宽:</label>
        <input
          type="range"
          min={1}
          max={20}
          value={tools.lineWidth}
          onChange={(e) => setTools({ ...tools, lineWidth: Number(e.target.value) })}
          className="w-32"
        />
        <span>{tools.lineWidth}px</span>
      </div>

      <button
        onClick={() => setTools({ ...tools, tool: tools.tool === 'pen' ? 'eraser' : 'pen' })}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {tools.tool === 'pen' ? '橡皮擦' : '画笔'}
      </button>

      <button
        onClick={() => setTools({ ...tools, clear: true })}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        清空画布
      </button>
    </div>
  );
} 