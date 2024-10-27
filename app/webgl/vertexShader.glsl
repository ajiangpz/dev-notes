uniform float u_time;
uniform float u_amplitude;
uniform float u_frequency;
uniform float u_speed;
varying vec2 vUv;

void main() {
  vUv = uv;
  // 计算波浪的高度
  vec3 pos = position;
  pos.z = sin(pos.x * u_frequency + u_time * u_speed) * u_amplitude;
  
  // 将坐标传递给顶点位置
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
