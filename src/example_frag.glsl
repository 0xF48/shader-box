precision mediump float;

uniform float iTime;
varying vec2 v_uv;

void main(){
	float l = length(v_uv - 0.5);
	gl_FragColor = vec4(vec3(l),1.0);
}
