'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// 示例输入
const defaultInput = "25525511135";

// 复原 IP 地址的函数
function restoreIpAddresses(s: string) {
  const result: string[] = [];
  const len = s.length;
  if (len < 4 || len > 12) return result;

  const segments: string[] = [];
  const backtrack = (start: number, path: string[]) => {
    if (path.length === 4 && start === len) {
      result.push(path.join('.'));
      return;
    }
    for (let i = start; i < Math.min(start + 3, len); i++) {
      const segment = s.slice(start, i + 1);
      if (segment.length > 1 && segment[0] === '0') continue;
      if (parseInt(segment) > 255) continue;
      backtrack(i + 1, [...path, segment]);
    }
  };
  backtrack(0, []);
  return result;
}

export default function RestoreIPAddress() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState(defaultInput);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [allSteps, setAllSteps] = useState<string[]>([]);

  // 生成所有可能的 IP 地址
  useEffect(() => {
    const results = restoreIpAddresses(input);
    setAllSteps(results);
    setCurrentStep(0);
  }, [input]);

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
    camera.position.set(0, 5, 10);

    // 设置渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    canvasRef.current.appendChild(renderer.domElement);

    // 添加控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);

    // 创建文本精灵
    function createTextSprite(text: string, color: string = 'white') {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;
      canvas.width = 256;
      canvas.height = 64;

      context.font = '32px Arial';
      context.fillStyle = color;
      context.textAlign = 'center';
      context.fillText(text, 128, 40);

      const texture = new THREE.CanvasTexture(canvas);
      const material = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(4, 1, 1);
      return sprite;
    }

    // 显示当前 IP 地址
    let textSprites: THREE.Sprite[] = [];
    
    function updateDisplay() {
      // 清除旧的显示
      textSprites.forEach(sprite => scene.remove(sprite));
      textSprites = [];

      if (allSteps.length === 0) return;

      const currentIP = allSteps[currentStep];
      const segments = currentIP.split('.');

      segments.forEach((segment, index) => {
        const sprite = createTextSprite(segment, '#2563eb');
        sprite.position.set(index * 3 - 4.5, 0, 0);
        scene.add(sprite);
        textSprites.push(sprite);

        if (index < 3) {
          const dot = createTextSprite('.', '#2563eb');
          dot.position.set(index * 3 - 3, 0, 0);
          scene.add(dot);
          textSprites.push(dot);
        }
      });
    }

    updateDisplay();

    // 动画循环
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // 自动播放
    let playInterval: NodeJS.Timeout;
    if (isPlaying) {
      playInterval = setInterval(() => {
        setCurrentStep((prev) => (prev + 1) % allSteps.length);
      }, 1000);
    }

    // 清理函数
    return () => {
      clearInterval(playInterval);
      renderer.dispose();
      canvasRef.current?.removeChild(renderer.domElement);
    };
  }, [allSteps, currentStep, isPlaying]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">IP 地址复原</h1>
      <div className="mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="px-4 py-2 border rounded-lg mr-4"
          placeholder="输入数字串..."
        />
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 mr-2"
        >
          {isPlaying ? '暂停' : '播放'}
        </button>
        <button
          onClick={() => setCurrentStep((prev) => (prev + 1) % allSteps.length)}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          下一个
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-full h-[600px]" ref={canvasRef}>
          <div className="absolute top-4 left-4 bg-white/80 p-4 rounded-lg shadow">
            <h3 className="text-lg font-bold mb-2">当前结果</h3>
            <p>输入: {input}</p>
            <p>IP地址 {currentStep + 1} / {allSteps.length}</p>
            <p>当前: {allSteps[currentStep] || '无有效结果'}</p>
          </div>
        </div>
      </div>
      <div className="mt-4 prose dark:prose-invert">
        <h2>算法说明</h2>
        <p>
          给定一个只包含数字的字符串，通过在字符串中添加 . 来创建有效的 IP 地址。
          返回所有可能的有效 IP 地址，这些地址可以通过在字符串中插入 . 来形成。
        </p>
        <h3>有效 IP 地址的规则：h3</h3>
        <ul>
          <li>IP 地址由四个整数组成，整数之间用 . 分隔</li>
          <li>每个整数位于 0 到 255 之间</li>
          <li>不能包含前导零</li>
        </ul>
      </div>
    </div>
  );
}
