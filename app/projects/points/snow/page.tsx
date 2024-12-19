"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
export default function About() {
    const ref = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        if (!ref.current) return;
        // scene 
        const scene = new THREE.Scene();
        // camera 
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;

        // render 
        const renderer = new THREE.WebGLRenderer();
        // render size 
        renderer.setSize(window.innerWidth, window.innerHeight);
        // add render dom
        ref.current.appendChild(renderer.domElement);

        // orbit controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;

        // Add AxesHelper
        const axesHelper = new THREE.AxesHelper(5); // Length of each axis line
        scene.add(axesHelper);

        // texture 
        const texture = new THREE.TextureLoader().load("/images/snow.png");     
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        // 创建一个简单的矩形. 在这里我们左上和右下顶点被复制了两次。
        // 因为在两个三角面片里，这两个顶点都需要被用到。
        const vertices = new Float32Array([
            0.0, 0.0, 0.0  // 单个点的位置 (x, y, z)
        ]);

        // 创建几何体，用于存储雪花点的位置
        const geometry = new THREE.BufferGeometry();
        const numPoints = 1000;
        const positions = new Float32Array(numPoints * 3);  // 每个点有 x, y, z 位置

        // 随机生成 100 个点的位置
        for (let i = 0; i < numPoints; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 20; // x 坐标
            positions[i * 3 + 1] = (Math.random() - 0.5) * 20; // y 坐标
            positions[i * 3 + 2] = (Math.random() - 0.5) * 20; // z 坐标
        }

        // itemSize = 3 因为每个顶点都是一个三元组。
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        // 创建材质
        const material = new THREE.PointsMaterial({
            size: 0.5,           // 点的大小
            sizeAttenuation: true,// 根据相机距离调整点的大小
            map: texture,
            transparent: true
        });
        const point = new THREE.Points(geometry, material);

        // define point
        scene.add(point);



        // 渲染循环
        const animate = () => {
            requestAnimationFrame(animate);
            const positions = geometry.attributes.position.array;

            // 更新每个点的位置，模拟雪花下落
            for (let i = 0; i < numPoints; i++) {
                positions[i * 3 + 1] -= 0.05; // 下移每个点的 y 坐标

                // 如果雪花超出屏幕下方，将它重置到顶部
                if (positions[i * 3 + 1] < -10) {
                    positions[i * 3 + 1] = 10; // 重置到顶部
                }
            }

            geometry.attributes.position.needsUpdate = true;
            renderer.render(scene, camera);
            controls.update();
        };

        animate();


    }, [])
    return (<div ref={ref}></div>)
}