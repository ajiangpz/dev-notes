varying vec2 vUv;
void main() {
  // 使用简单的颜色映射
  gl_FragColor = vec4(vUv, 0.5 + 0.5 * sin(vUv.x * 10.0), 1.0);
}
