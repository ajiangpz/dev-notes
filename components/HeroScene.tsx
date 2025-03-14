'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const HeroScene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scene, setScene] = useState<THREE.Scene | null>(null);

  useEffect(() => {
    // 确认我们在客户端
    setMounted(true);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    // 创建场景
    const scene = new THREE.Scene();
    setScene(scene);
    
    // 创建相机
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 15;
    
    // 创建渲染器
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0); // 透明背景
    containerRef.current.appendChild(renderer.domElement);
    
    // 添加粒子系统
    const particles = createParticles();
    scene.add(particles);
    
    // 添加环境光（为了微妙的光照效果）
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    
    // 添加控制器（仅用于轻微的自动旋转）
    const controls = new OrbitControls(camera, renderer.domElement);
    (controls as any).enableZoom = false;
    (controls as any).enablePan = false;
    (controls as any).autoRotate = true;
    (controls as any).autoRotateSpeed = 0.2;
    controls.enableDamping = true;
    (controls as any).dampingFactor = 0.05;
    
    // 处理窗口大小变化
    const handleResize = () => {
      if (!containerRef.current) return;
      
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // 动画循环
    let animationFrameId: number;
    let lastTime = 0;
    
    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);
      
      const delta = time - lastTime;
      lastTime = time;
      
      // 更新粒子位置
      updateParticles(particles, delta);
      
      controls.update();
      renderer.render(scene, camera);
    };
    
    animate(0);
    
    // 在useEffect中监听主题变化
    const handleThemeChange = () => {
      if (scene && scene.children.length > 0) {
        // 移除旧的粒子系统
        const oldParticles = scene.children.find(child => child instanceof THREE.Points);
        if (oldParticles) {
          scene.remove(oldParticles);
        }
        
        // 创建新的粒子系统
        const particles = createParticles();
        scene.add(particles);
      }
    };
    
    // 监听主题变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class' && 
            mutation.target === document.documentElement) {
          handleThemeChange();
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    // 清理函数
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      
      if (containerRef.current && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // 释放资源
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          } else if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          }
        }
      });
      
      renderer.dispose();
      
      observer.disconnect();
    };
  }, [mounted, scene]); // 使用mounted而不是isClient
  
  // 创建粒子系统
  function createParticles() {
    const particleCount = 1000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    
    // 获取当前主题模式
    const isDarkMode = document.documentElement.classList.contains('dark');
    
    // 为白天模式设置更深的颜色
    const baseColor = isDarkMode 
      ? new THREE.Color(0x4a88ff) 
      : new THREE.Color(0x1a56db); // 更深的蓝色，提高白天模式对比度
    
    const colorVariation = isDarkMode ? 0.3 : 0.4; // 增加白天模式的颜色变化范围
    
    for (let i = 0; i < particleCount; i++) {
      // 位置 - 球形分布
      const radius = 10 * Math.random();
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
      
      // 速度 - 轻微随机
      velocities[i * 3] = (Math.random() - 0.5) * 0.05;
      velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
      
      // 大小 - 变化更大
      sizes[i] = Math.random() * (isDarkMode ? 0.1 : 0.15); // 白天模式粒子稍大
      
      // 颜色 - 基于基础颜色的变化
      const color = baseColor.clone();
      
      // 增加随机性和亮度变化
      color.r += (Math.random() - 0.5) * colorVariation;
      color.g += (Math.random() - 0.5) * colorVariation;
      color.b += (Math.random() - 0.5) * colorVariation;
      
      // 白天模式下增加饱和度
      if (!isDarkMode) {
        color.r = Math.max(0.3, color.r);
        color.g = Math.max(0.3, color.g);
        color.b = Math.max(0.6, color.b);
      }
      
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    // 粒子材质 - 增加亮度和对比度
    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: isDarkMode ? 0.8 : 0.9, // 白天模式下更高的不透明度
      sizeAttenuation: true,
      blending: THREE.AdditiveBlending,
    });
    
    const particles = new THREE.Points(geometry, material);
    particles.userData = { velocities };
    
    return particles;
  }
  
  // 更新粒子位置 - 更加自然细腻的动画
  function updateParticles(particles: THREE.Points, delta: number) {
    // 确保粒子和用户数据存在
    if (!particles || !particles.geometry || !particles.userData || !particles.userData.velocities) {
      return;
    }
    
    const positions = particles.geometry.attributes.position.array as Float32Array;
    const velocities = particles.userData.velocities as Float32Array;
    
    // 确保size属性存在
    if (!particles.geometry.attributes.size) {
      return;
    }
    
    const sizes = particles.geometry.attributes.size.array as Float32Array;
    
    const time = Date.now() * 0.0005;
    
    for (let i = 0; i < positions.length; i += 3) {
      // 应用速度
      positions[i] += velocities[i] * delta * 0.05;
      positions[i + 1] += velocities[i + 1] * delta * 0.05;
      positions[i + 2] += velocities[i + 2] * delta * 0.05;
      
      // 添加柔和的波动效果
      const idx = i / 3;
      
      // 确保idx在sizes数组范围内
      if (idx < sizes.length) {
        const amplitude = 0.02 + sizes[idx] * 0.1;
        
        // 使用不同的频率和相位创建更自然的运动
        positions[i] += Math.sin(time + idx * 0.1) * amplitude;
        positions[i + 1] += Math.cos(time + idx * 0.2) * amplitude;
        positions[i + 2] += Math.sin(time * 0.8 + idx * 0.3) * amplitude;
      }
      
      // 保持粒子在一定范围内
      const distance = Math.sqrt(
        positions[i] * positions[i] + 
        positions[i + 1] * positions[i + 1] + 
        positions[i + 2] * positions[i + 2]
      );
      
      if (distance > 15) {
        const factor = 15 / distance;
        positions[i] *= factor;
        positions[i + 1] *= factor;
        positions[i + 2] *= factor;
      }
    }
    
    particles.geometry.attributes.position.needsUpdate = true;
  }

  // 如果还没有挂载，返回一个空的占位符
  if (!mounted) {
    return <div className="absolute inset-0" />;
  }

  // 如果正在加载，显示一个简单的占位符
  if (isLoading) {
    return (
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="flex h-full items-center justify-center">
          <div className="animate-pulse h-8 w-8 rounded-full bg-white/30"></div>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className="absolute inset-0" />;
};

export default HeroScene; 