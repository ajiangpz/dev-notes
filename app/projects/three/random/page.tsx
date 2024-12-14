
"use client";
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
function ThreeJsGrid() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Set up the scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(
            -1, 1, 1, -1, 0.1, 10
        );
        camera.position.z = 1;

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(500, 500);
        if (!mountRef.current) return;
        mountRef.current.appendChild(renderer.domElement);

        // Define shaders
        const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

        const fragmentShader = `
      precision mediump float;
      varying vec2 vUv;
      // 定义一个行数
      uniform float rows;
      uniform float randomValue;
      // 定义一个随机函数 返回一个 0-1 之间的随机数
      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
      }
      void main() {
        // 向下取整，得到 10 行 10列的方块
        float color = random(floor(vUv*rows));
        // 设置gl_FragColor 设置灰色
        gl_FragColor = vec4(color, color*2.0, color*3.0, 1.0);
        // 转化为彩色方块

      }
    `;

        // Create a plane geometry and apply shaders
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                rows: { value: 10.0 }, // Adjust for the number of rows in the grid
                randomValue: { value: Math.random() }
            },
        });
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        // Render loop
        const animate = () => {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // Clean up on component unmount
        return () => {
            renderer.dispose();
            material.dispose();
            geometry.dispose();
            if (mountRef.current)
                mountRef.current.removeChild(renderer.domElement);
        };
    }, []);

    return <div ref={mountRef} />;
}

export default ThreeJsGrid;
