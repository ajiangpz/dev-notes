"use client";
import { useEffect, useRef } from "react";
import vertex from "./vertexShader.glsl";
import fragment from "./fragmentShader.glsl";

export default function Triangle() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (canvasRef.current) {
            const gl = canvasRef.current.getContext("webgl2");
            if (!gl) return;

            // Function to compile shaders
            const compileShader = (source: string, type: number) => {
                const shader = gl.createShader(type);
                if (!shader) return null;
                gl.shaderSource(shader, source);
                gl.compileShader(shader);

                return shader;
            };

            // Compile shaders
            const vertexShader = compileShader(vertex, gl.VERTEX_SHADER);
            const fragmentShader = compileShader(fragment, gl.FRAGMENT_SHADER);
            if (!vertexShader || !fragmentShader) return;

            // Create and link program
            const program = gl.createProgram();
            if (!program) return;
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);


            gl.useProgram(program);

            // Define vertex data
            const points = new Float32Array([0.0, 1.0, -1.0, -1.0, 1.0, -1.0]);
            const bufferId = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
            gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

            // Bind data to 'position' attribute
            const vPosition = gl.getAttribLocation(program, "position");
            gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(vPosition);

            // Set clear color and draw the triangle
            gl.clearColor(0.0, 0.0, 0.0, 1.0); // Set clear color (black)
            gl.clear(gl.COLOR_BUFFER_BIT); // Clear the color buffer
            gl.drawArrays(gl.TRIANGLES, 0, points.length / 2);
        }
    }, []);

    return (
        <canvas
            id="canvas"
            ref={canvasRef}
            width="500"
            height="500"
        >
            Triangle
        </canvas>
    );
}
