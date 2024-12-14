precision mediump float;
varying vec2 vColor;
void main() {
    
    gl_FragColor = vec4(vColor, 1.0, 1.0);
}