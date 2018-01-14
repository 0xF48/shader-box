precision mediump float;

uniform float iTime;
uniform vec2 pos;
void main(){
	gl_FragColor = vec4(abs(cos(iTime/2e3)+pos.x),abs(sin(iTime/3e3)+pos.x),abs(sin(iTime/2e3)),1.0);
}
