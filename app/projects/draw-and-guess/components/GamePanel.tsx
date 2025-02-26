"use client";
import React from 'react';
import { useGame } from '../context/GameContext';

export default function GamePanel() {
  const { gameState } = useGame();

  return (
    <div className="w-80 bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">游戏信息</h2>
        <div className="text-gray-600">
          <p>当前回合: {gameState.currentRound}/{gameState.totalRounds}</p>
          <p>剩余时间: {gameState.timeLeft}秒</p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-bold mb-2">玩家列表</h3>
        <div className="space-y-2">
          {gameState.players.map(player => (
            <div key={player.id} className="flex justify-between items-center">
              <span>{player.name}</span>
              <span className="font-bold">{player.score}分</span>
            </div>
          ))}
        </div>
      </div>

      {gameState.currentPlayer === gameState.userId ? (
        <div className="bg-yellow-100 p-2 rounded">
          <p className="font-bold">你要画的词是:</p>
          <p className="text-xl text-center">{gameState.word}</p>
        </div>
      ) : (
        <div className="mt-4">
          <input
            type="text"
            placeholder="在这里输入你的猜测..."
            className="w-full p-2 border rounded"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                // 提交猜测
              }
            }}
          />
        </div>
      )}
    </div>
  );
} 