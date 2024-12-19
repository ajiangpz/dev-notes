"use client";
import { useEffect, useRef } from "react"
import vertex from "./vertexShader.glsl";
import fragment from "./fragmentShader.glsl";
export default function Triangle() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        if (canvasRef.current) {
            // 获取 webgl 上下文

            const gl = canvasRef.current.getContext("webgl2");
            if (!gl) return;

            // 创建顶点着色器
            const vertexShader = gl?.createShader(gl.VERTEX_SHADER);
            if (vertexShader) {
                gl?.shaderSource(vertexShader, vertex);
                gl.compileShader(vertexShader)
            }

            // 创建片元着色器
            const fragmentShader = gl?.createShader(gl.FRAGMENT_SHADER);
            if (fragmentShader) {

                gl?.shaderSource(fragmentShader, fragment);
                gl.compileShader(fragmentShader)
            }

            // 创建webgl程序

            const program = gl?.createProgram();

            if (program) {
                gl?.attachShader(program, vertexShader as WebGLShader);
                gl?.attachShader(program, fragmentShader as WebGLShader)
                gl.linkProgram(program)

                gl.useProgram(program);
                // 定义六个顶点数据 构成一个正方形
                const points = new Float32Array([
                    0.0, 0.0,
                    1.0, 0.0,
                    0.0, 1.0,
                    1.0, 0.0,
                    0.0, 1.0,
                    1.0, 1.0
                ])
                // 将数据写入缓存区
                const bufferId = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
                gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW)

                // 绑定给 position 变量
                // 获取 position 变量地址   
                const vPosition = gl.getAttribLocation(program, 'position');
                // 设置如何读取缓冲区中的数据
                gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
                // 开启
                gl.enableVertexAttribArray(vPosition);

                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLES, 0, 3)
            }
        }
    }, [])

    return (<canvas id="canvas" ref={canvasRef} width="1024" height="512">Triangle</canvas>)
}

