"use client";
import { useEffect, useRef } from "react"
import vertex from "./vertexShader.glsl";
import fragment from "./fragmentShader.glsl";

// 实现一个创建随机三角形的函数
function createRandomTriangle(gl: WebGLRenderingContext) {
    // 随机颜色
    const u_color = [Math.random(), Math.random(), Math.random(), 1.0];
    // 初始化旋转角度 
    const u_rotation = Math.random() * Math.PI;
    // 初始化缩放
    const u_scale = Math.random() * 0.05 + 0.03;
    const u_time = 0;
    const u_duration = 3.0;
    const rad = Math.random() * Math.PI * 2;
    const u_direction = [Math.cos(rad), Math.sin(rad)];// 运动方向
    const startTime = performance.now();
    return { u_color, u_rotation, u_scale, u_time, u_duration, u_direction, startTime };
}

// 设置uniform变量，将随机三角形信息传递给 shader 中的uniform 变量
function setUniforms(gl: WebGLRenderingContext, program: WebGLProgram, triangle: any) {
    gl.uniform4fv(gl.getUniformLocation(program, "u_color"), triangle.u_color);
    gl.uniform1f(gl.getUniformLocation(program, "u_rotation"), triangle.u_rotation);
    gl.uniform1f(gl.getUniformLocation(program, "u_scale"), triangle.u_scale);
    gl.uniform1f(gl.getUniformLocation(program, "u_time"), triangle.u_time);
    gl.uniform1f(gl.getUniformLocation(program, "u_duration"), triangle.u_duration);
    gl.uniform2fv(gl.getUniformLocation(program, "u_direction"), triangle.u_direction);
}


// 用 request Animation 实现动画
let triangles: any[] = [];
function update(gl: WebGLRenderingContext, program: WebGLProgram) {
    for (let i = 0; i < 5 * Math.random(); i++) {
        triangles.push(createRandomTriangle(gl));
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    triangles.forEach((triangle) => {
        triangle.u_time = (performance.now() - triangle.startTime) / 1000;
        setUniforms(gl, program, triangle);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    })
    // 移除已经结束动画的三角形 
    triangles = triangles.filter((triangle) => {
        return triangle.u_time < triangle.u_duration
    })
    requestAnimationFrame(() => update(gl, program));
}



export default function Triangle() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(() => {
        if (canvasRef.current) {
            // 获取 webgl 上下文

            const gl = canvasRef.current.getContext("webgl");
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
                const position = new Float32Array([-1, -1, 0, 1, 1, -1,]);
                // 将数据写入缓存区
                const bufferId = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
                gl.bufferData(gl.ARRAY_BUFFER, position, gl.STATIC_DRAW)

                // 绑定给 position 变量
                // 获取 position 变量地址   
                const vPosition = gl.getAttribLocation(program, 'position');
                // 如何读取缓冲区中的数据
                gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
                // 开启
                gl.enableVertexAttribArray(vPosition);
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

                requestAnimationFrame(() => update(gl, program));
            }
        }
    }, [])

    return (<canvas id="canvas" ref={canvasRef} width="512" height="512">Triangle</canvas>)
}

