
function createRandomTriangle() {
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
export function update(gl: WebGLRenderingContext, program: WebGLProgram) {
    for (let i = 0; i < 100; i++) {
        triangles.push(createRandomTriangle());
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    triangles.forEach((triangle) => {
        triangle.u_time = performance.now() - triangle.startTime;
        setUniforms(gl, program, triangle);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    })
    // 移除已经结束动画的三角形 
    triangles = triangles.filter((triangle) => {
        return triangle.u_time < triangle.u_duration
    })
    requestAnimationFrame(() => update(gl, program));
}