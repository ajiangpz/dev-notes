
"use client";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import vertexShader from "./vertexShader.glsl";
import fragmentShader from "./fragmentShader.glsl";
export default function Home() {
    const mountRef = useRef<HTMLDivElement | null>(null)
    useEffect(() => {
        if (!mountRef.current) return;
        // 设置场景
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(100, 1024/512, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(1024, 512);
        if (mountRef.current) {
            mountRef.current.appendChild(renderer.domElement)
        }
        // 创建几何体

        const geometry = new THREE.PlaneGeometry(5, 5, 100, 100);
        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: {
                    value: 0.0
                },
                u_amplitude: {
                    value: 1.0
                },
                u_frequency: {
                    value: 2.0
                },
                u_speed: {
                    value: 1.0
                }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            wireframe: true
        });

        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        camera.position.z = 5;


        // 动画循环
        const animate = () => {
            requestAnimationFrame(animate);
            // 更新 uniform 的时间值
            material.uniforms.u_time.value += 0.05;
            renderer.render(scene, camera);
        };

        animate();
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight)
        }
        window.addEventListener("resize", handleResize);
        // 清理函数
        return () => {
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
        };
    }, [])
    return <div ref={mountRef}></div>;
}