precision highp float;

uniform vec2 pos;
uniform float iTime;
varying vec2 v_uv;

const float PI = 3.1415926535897932384626433832795;
const float PI_2 = 1.57079632679489661923;
const float PI_4 = 0.785398163397448309616;


float random (in vec2 _st) { 
    return fract(sin(dot(_st.xy, vec2(12.9898,78.233))) * 43758.54531237);
}

float noise (in vec2 _st) {
    vec2 i = floor(_st);
    vec2 f = fract(_st);

    // Four corners in 2D of a tile
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3. - 2.0 * f);

    return mix(a, b, u.x) + 
            (c - a)* u.y * (1. - u.x) + 
            (d - b) * u.x * u.y;
}



void main() {
    vec2 uv = vec2(v_uv-0.5)*1.5;
    uv.y -= .6;
    float d = length(vec2(uv.x-(uv.x*.3)-(uv.x*.2),uv.y));

    float dx = abs(uv.x);

    vec3 sky = vec3(0.0,0.1,0.2);
    float planet_r = .5;
    float planet = smoothstep(planet_r+0.01,planet_r,d);
    float d2 = length(vec2(uv.x*.97,uv.y));
    
    float flare = (1.-pow(sin(abs(planet_r-d))*10.,.1))*2./(1.0+abs(uv.x)*40.);
    // flare -= (1.0 - pow(smoothstep(planet_r*.9,planet_r*2.,d2),1.))*(dx*2.);

    vec3 color = clamp(vec3(sky-planet),0.0,1.0);
    color += flare;

	gl_FragColor = vec4(vec3(flare),1.0);
}