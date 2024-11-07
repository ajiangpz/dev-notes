
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
      uniform float rows;
      void main() {
        vec2 st = fract(vUv * rows);
        float d1 = step(st.x, 0.9);
        float d2 = step(0.1, st.y);
        gl_FragColor = vec4(mix(vec3(0.8), vec3(1.0), d1 * d2), 1.0);
      }
    `;

        // Create a plane geometry and apply shaders
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                rows: { value: 50.0 }, // Adjust for the number of rows in the grid
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
