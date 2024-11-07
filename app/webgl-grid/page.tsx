"use client";
import React, { useRef, useEffect } from 'react';
import fragmentShaderSource from './fragmentShader.glsl';
import vertexShaderSource from './vertexShader.glsl';



function WebGLGrid() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return
        }
        const gl = canvas.getContext('webgl');

        if (!gl) {
            console.error("WebGL isn't supported in this browser.");
            return;
        }

        // 编译着色器
        const compileShader = (source: string, type: number) => {
            const shader = gl.createShader(type) as WebGLShader;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER) as WebGLShader;
        const fragmentShader = compileShader(fragmentShaderSource, gl.FRAGMENT_SHADER) as WebGLShader;

        // 链接着色器
        const program = gl.createProgram() as WebGLProgram;
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error('Program link error:', gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return;
        }
        gl.useProgram(program);

        // 设置顶点
        const vertices = new Float32Array([
            -1.0, -1.0,
            1.0, -1.0,
            -1.0, 1.0,
            1.0, -1.0,
            1.0, 1.0,
            -1.0, 1.0,
        ]);
        // 设置 UV 纹理坐标
        const uvs = new Float32Array([
            0.0, 0.0,
            1.0, 0.0,
            0.0, 1.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ]);

        // 设置顶点缓冲区
        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        const aVertexPosition = gl.getAttribLocation(program, 'a_vertexPosition');
        gl.enableVertexAttribArray(aVertexPosition);
        gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0, 0);

        // 设置 UV 缓冲区
        const uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
        const uvLocation = gl.getAttribLocation(program, 'uv');
        gl.enableVertexAttribArray(uvLocation);
        gl.vertexAttribPointer(uvLocation, 2, gl.FLOAT, false, 0, 0);

        // 设置 uniform 变量
        const rowsLocation = gl.getUniformLocation(program, 'rows');
        gl.uniform1f(rowsLocation, 50.0); // 设置行数

        // 绘制
        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 6);

        // 删除资源
        return () => {
            gl.deleteProgram(program);
            gl.deleteShader(vertexShader);
            gl.deleteShader(fragmentShader);
            gl.deleteBuffer(vertexBuffer);
            gl.deleteBuffer(uvBuffer);
        };
    }, []);

    return <canvas ref={canvasRef} width="500" height="500" />;
}

export default WebGLGrid;
