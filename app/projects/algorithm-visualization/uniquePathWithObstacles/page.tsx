'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
//  10*10
const obstacleGrid = [
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],

];

// 获取所有可能的路径
function getAllPaths(grid: number[][]) {
  const m = grid.length, n = grid[0].length;
  const paths: number[][][] = [];
  
  function backtrack(row: number, col: number, current: number[][]) {
    if (row === m - 1 && col === n - 1) {
      paths.push([...current, [row, col]]);
      return;
    }
    
    if (row >= m || col >= n || grid[row][col] === 1) return;
    
    // 向右移动
    if (col + 1 < n && grid[row][col + 1] !== 1) {
      backtrack(row, col + 1, [...current, [row, col]]);
    }
    // 向下移动
    if (row + 1 < m && grid[row + 1][col] !== 1) {
      backtrack(row + 1, col, [...current, [row, col]]);
    }
  }
  
  backtrack(0, 0, []);
  return paths;
}

export default function UniquePathWithObstacles() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const allPaths = getAllPaths(obstacleGrid);

  useEffect(() => {
    if (!canvasRef.current) return;

    // 初始化场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    // 设置相机
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10);

    // 设置渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    canvasRef.current.appendChild(renderer.domElement);

    // 添加控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 添加网格辅助线
    const gridHelper = new THREE.GridHelper(
      Math.max(obstacleGrid.length, obstacleGrid[0].length),
      Math.max(obstacleGrid.length, obstacleGrid[0].length)
    );
    scene.add(gridHelper);

    // 创建材质
    const obstacleMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const pathMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00, transparent: true, opacity: 0.3 });
    const currentPathMaterial = new THREE.MeshPhongMaterial({ color: 0x0000ff, transparent: true, opacity: 0.8 });
    const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

    // 添加障碍物
    obstacleGrid.forEach((row, i) => {
      row.forEach((cell, j) => {
        if (cell === 1) {
          const obstacle = new THREE.Mesh(boxGeometry, obstacleMaterial);
          obstacle.position.set(j - obstacleGrid[0].length/2 + 0.5, 0.5, i - obstacleGrid.length/2 + 0.5);
          scene.add(obstacle);
        }
      });
    });

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // 创建移动点
    const movingPoint = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 32),
      new THREE.MeshPhongMaterial({ 
        color: 0x4444ff,
        emissive: 0x2222ff,
        emissiveIntensity: 0.5
      })
    );
    movingPoint.position.y = 0.5;
    scene.add(movingPoint);

    // 存储当前路径的方块
    let pathCubes: THREE.Mesh[] = [];

    // 动画循环
    let lastTime = 0;
    const moveSpeed = 2; // 调整移动速度

    function animate(time: number) {
      requestAnimationFrame(animate);
      controls.update();

      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      // 更新路径显示
      pathCubes.forEach(cube => scene.remove(cube));
      pathCubes = [];

      const currentPath = allPaths[currentPathIndex];
      if (currentPath) {
        // 显示整条路径
        currentPath.forEach(([row, col], index) => {
          const cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 0.1, 1),
            new THREE.MeshPhongMaterial({ 
              color: index < stepIndex ? 0x00ff00 : 0xcccccc,
              transparent: true,
              opacity: 0.3
            })
          );
          cube.position.set(
            col - obstacleGrid[0].length/2 + 0.5,
            0.1,
            row - obstacleGrid.length/2 + 0.5
          );
          scene.add(cube);
          pathCubes.push(cube);
        });

        // 更新移动点位置
        if (stepIndex < currentPath.length) {
          const [targetRow, targetCol] = currentPath[stepIndex];
          const targetX = targetCol - obstacleGrid[0].length/2 + 0.5;
          const targetZ = targetRow - obstacleGrid.length/2 + 0.5;

          // 平滑移动
          const dx = targetX - movingPoint.position.x;
          const dz = targetZ - movingPoint.position.z;
          const distance = Math.sqrt(dx * dx + dz * dz);

          if (distance > 0.01) {
            movingPoint.position.x += (dx / distance) * moveSpeed * deltaTime;
            movingPoint.position.z += (dz / distance) * moveSpeed * deltaTime;
            
            // 添加上下浮动动画
            movingPoint.position.y = 0.5 + Math.sin(time * 0.003) * 0.1;
          } else {
            // 到达当前点，移动到下一个点
            if (isPlaying) {
              setStepIndex(prev => {
                if (prev + 1 >= currentPath.length) {
                  // 到达终点，切换到下一条路径
                  setStepIndex(0);
                  setCurrentPathIndex(prevPath => (prevPath + 1) % allPaths.length);
                  return 0;
                }
                return prev + 1;
              });
            }
          }
        }
      }

      renderer.render(scene, camera);
    }
    animate(0);

    // 清理函数
    return () => {
      renderer.dispose();
      canvasRef.current?.removeChild(renderer.domElement);
    };
  }, [obstacleGrid, currentPathIndex, stepIndex, isPlaying]);

  return (
    <div className="w-full h-[600px] relative" ref={canvasRef}>
      <div className="absolute top-4 left-4 bg-white/80 p-4 rounded-lg shadow dark:text-black">
        <h3 className="text-lg font-bold mb-2">不同路径 II</h3>
        <p>红色方块: 障碍物</p>
        <p>绿色路径: 已经过的路径</p>
        <p>灰色路径: 未经过的路径</p>
        <p>蓝色球体: 当前位置</p>
        <p className="mb-4">路径 {currentPathIndex + 1} / {allPaths.length}</p>
        <div className="flex gap-2">
          <button
            onClick={() => {
              setIsPlaying(!isPlaying);
              if (!isPlaying && stepIndex >= allPaths[currentPathIndex].length) {
                setStepIndex(0);
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isPlaying ? '暂停' : '播放'}
          </button>
          <button
            onClick={() => {
              setCurrentPathIndex((prev) => (prev + 1) % allPaths.length);
              setStepIndex(0);
            }}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            下一条
          </button>
        </div>
      </div>
    </div>
  );
}
