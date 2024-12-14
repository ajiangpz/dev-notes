  precision mediump float;
  varying vec2 vUv;
  uniform float rows;
  void main() {
    vec2 st = fract(vUv * rows);
    float d1 = step(st.x, 0.9);
    float d2 = step(0.1, st.y);
    gl_FragColor = vec4(mix(vec3(0.8), vec3(1.0), d1 * d2), 1.0);
  }