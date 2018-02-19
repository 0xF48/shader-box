precision highp float;

uniform float iTime;
uniform vec2 pos;

varying vec2 v_uv;
uniform sampler2D u_texture;

void main(){
	vec4 sum = vec4( 0.0 );
	vec2 uv = v_uv;
	gl_FragColor = texture2D( u_texture, vec2( uv.x, uv.y ) * pos );
}