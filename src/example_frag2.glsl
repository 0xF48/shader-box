
precision mediump float;

uniform float iTime;
uniform vec2 pos;

varying vec2 v_texture;
uniform sampler2D u_texture;

void main(){
	vec4 sum = vec4( 0.0 );
	vec2 uv = v_texture;
	float h = 0.004 * length(uv-pos)*5.0 + sin(iTime/2e2) / 5e2;


	sum += texture2D( u_texture, vec2( uv.x - 4.0 * h, uv.y ) ) * 0.051;
	sum += texture2D( u_texture, vec2( uv.x - 3.0 * h, uv.y ) ) * 0.0918;
	sum += texture2D( u_texture, vec2( uv.x - 2.0 * h, uv.y ) ) * 0.12245;
	sum += texture2D( u_texture, vec2( uv.x - 1.0 * h, uv.y ) ) * 0.1531;
	sum += texture2D( u_texture, vec2( uv.x, uv.y ) ) * 0.1633;
	sum += texture2D( u_texture, vec2( uv.x + 1.0 * h, uv.y ) ) * 0.1531;
	sum += texture2D( u_texture, vec2( uv.x + 2.0 * h, uv.y ) ) * 0.12245;
	sum += texture2D( u_texture, vec2( uv.x + 3.0 * h, uv.y ) ) * 0.0918;
	sum += texture2D( u_texture, vec2( uv.x + 4.0 * h, uv.y ) ) * 0.051;
	
	sum += length(uv-pos) * 0.5;

	gl_FragColor = sum
}