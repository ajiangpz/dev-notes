attribute vec2 position;
varying vec2 vColor;
void main() {
    vColor = position;
    gl_Position = vec4(position*0.5, 0.0, 1.0);
}
