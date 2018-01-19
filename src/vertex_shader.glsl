attribute vec2 a_position;
attribute vec2 a_texture;


uniform vec2 u_move;
uniform vec2 u_scale;

varying vec2 v_uv;

void main(void){
	gl_Position = vec4((a_position + u_move) * u_scale , 0.0, 1.0);
	v_uv = a_texture;
}