'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface Props {
  obstacleGrid?: number[][];
}

// 默认的网格数据
const defaultGrid = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 0, 0]
];

export default function UniquePathWithObstacles({ obstacleGrid = defaultGrid }: Props) {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 验证输入数据
    if (!Array.isArray(obstacleGrid) || !Array.isArray(obstacleGrid[0])) {
      console.error('Invalid obstacleGrid data');
      return;
    }

    // 初始化场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // ... 其余代码保持不变 ...
  }, [obstacleGrid]);

  return (
    <div className="w-full h-[600px]" ref={canvasRef}>
      <div className="absolute top-4 left-4 bg-white/80 p-4 rounded-lg shadow">
        <h3 className="text-lg font-bold mb-2">不同路径 II</h3>
        <p>红色方块: 障碍物</p>
        <p>绿色方块: 可能路径</p>
        <p>方块高度: 经过该点的路径数量</p>
      </div>
    </div>
  );
} 