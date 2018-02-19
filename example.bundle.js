/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

var Box, Shader, box, draw, frag_shader, frag_shader2, mouse, shaderA, shaderB;

({Box, Shader} = __webpack_require__(1));

frag_shader = __webpack_require__(3)();

frag_shader2 = __webpack_require__(4)();

// frag_shader3 = require('./examples/image.glsl')()
box = new Box({
  canvas: window.canvas, //canvas element to get context from
  resize: true, //auto resize on window.resize
  clearColor: [0.0, 0.0, 0.0, 1.0],
  grid: [
    2,
    1 //x and y size of a grid, if you want to display more than one shader like in this example. default is 1 x 1
  ],
  context: {
    antialias: true,
    depth: false
  }
});

shaderA = new Shader({
  code: frag_shader, //you can use webpack and require your shaders easy with a glsl or raw loader, look in the webpack.config.js for more
  uniforms: {
    iTime: {
      type: '1f',
      val: 0.4
    }
  }
});

shaderB = new Shader({
  code: frag_shader2, //you can use webpack and require your shaders easy with a glsl or raw loader, look in the webpack.config.js for 
  uniforms: {
    iTime: {
      type: '1f',
      val: 0.4
    }
  }
});

// shaderC = new Shader
// 	code: frag_shader3 #you can use webpack and require your shaders easy with a glsl or raw loader, look in the webpack.config.js for more
// 	textureUrl: './src/star.jpeg'
// 	uniforms:
// 		pos: #uniform name
// 			type:'2fv' # setter = @gl["uniform"+type]
// 			val: [0.4,0.4]
// 		iTime:
// 			type:'1f'
// 			val: 0.4
box.add(shaderA).add(shaderB);

mouse = {
  x: 0,
  y: 0
};

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  return mouse.y = e.clientY;
});

// set box.focus to index of the grid, eg if grid is [3,1] focus can be -1 (display all shaders), 0 ,1, or 2
window.addEventListener('click', (e) => {
  box.focus += 1;
  if (box.focus === 2) {
    return box.focus = -1;
  }
});

draw = function(t) {
  requestAnimationFrame(draw);
  shaderA.uniforms.iTime.val = t * .001;
  shaderB.uniforms.iTime.val = t * .001;
  // shaderC.uniforms.iTime.val = t+4242
  // shaderC.uniforms.pos.val[0] = 1 - (mouse.x / window.innerWidth)
  // shaderC.uniforms.pos.val[1] = mouse.y / window.innerHeight
  return box.clear().draw(shaderA).draw(shaderB);
};

// .draw(shaderC)
draw(0);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Box", function() { return Box; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Shader", function() { return Shader; });
var default_vertex_shader;

default_vertex_shader = __webpack_require__(2)();

var Box = class Box {
  constructor(opt) {
    var j, k, ref, ref1, x, y;
    this.setViewport = this.setViewport.bind(this);
    this.canvas = opt.canvas;
    this.grid = opt.grid || [1, 1];
    this.shaders = [];
    this.pos = [];
    this.gl = this.canvas.getContext("experimental-webgl", opt.context || {
      antialias: true,
      depth: false
    });
    if (!this.gl) {
      alert('failed to start webgl :(');
    }
    this.focus = -1;
    this.setViewport();
    if (opt.resize) {
      window.addEventListener('resize', this.setViewport);
    }
    if (opt.clearColor) {
      this.gl.clearColor(opt.clearColor[0], opt.clearColor[1], opt.clearColor[2], opt.clearColor[3]);
    } else {
      this.gl.clearColor(0, 0, 0, 1);
    }
    for (y = j = 0, ref = this.grid[1]; 0 <= ref ? j < ref : j > ref; y = 0 <= ref ? ++j : --j) {
      for (x = k = 0, ref1 = this.grid[0]; 0 <= ref1 ? k < ref1 : k > ref1; x = 0 <= ref1 ? ++k : --k) {
        this.pos.push({x, y});
      }
    }
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  }

  createBuffer(x, y, verts) {
    var buffer, mx, my, sx, sy;
    buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(verts), this.gl.STATIC_DRAW);
    mx = -this.grid[0] + 1 + x * 2;
    my = this.grid[1] - 1 - y * 2;
    buffer.u_move = {
      origin: [mx, my],
      state: [mx, my],
      stage: [mx, my]
    };
    sx = 1 / this.grid[0];
    sy = 1 / this.grid[1];
    buffer.u_scale = {
      origin: [sx, sy],
      state: [sx, sy],
      stage: [sx, sy]
    };
    return buffer;
  }

  setViewport() {
    var j, len, ref, results, shader;
    this.canvas.width = this.width = this.canvas.clientWidth;
    this.canvas.height = this.height = this.canvas.clientHeight;
    this.gl.viewport(0, 0, this.width, this.height);
    ref = this.shaders;
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      shader = ref[j];
      results.push(shader.setUvBuffer(shader.index));
    }
    return results;
  }

  add(shader) {
    shader.init(this, this.shaders.length);
    this.shaders.push(shader);
    return this;
  }

  clear() {
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    return this;
  }

  draw(shader) {
    var _u, i, j, len, ref, u, v_buffer;
    if (!shader.gl) {
      throw new Error('shader has not been added.');
    }
    i = i || 0;
    v_buffer = shader.vert_buffer;
    this.gl.useProgram(shader.program);
    shader.updateUvBuffer();
    if (this.focus >= 0) {
      if (shader.index === this.focus) {
        v_buffer.u_move.state[0] = v_buffer.u_move.state[1] = 0;
        v_buffer.u_scale.state[0] = v_buffer.u_scale.state[1] = 1;
      } else {
        v_buffer.u_scale.state[0] = v_buffer.u_scale.state[1] = 0;
      }
    } else {
      v_buffer.u_move.state[0] = v_buffer.u_move.origin[0];
      v_buffer.u_move.state[1] = v_buffer.u_move.origin[1];
      v_buffer.u_scale.state[0] = v_buffer.u_scale.origin[0];
      v_buffer.u_scale.state[1] = v_buffer.u_scale.origin[1];
    }
    v_buffer.u_move.stage[0] += 0.25 * (v_buffer.u_move.state[0] - v_buffer.u_move.stage[0]);
    v_buffer.u_move.stage[1] += 0.25 * (v_buffer.u_move.state[1] - v_buffer.u_move.stage[1]);
    v_buffer.u_scale.stage[0] += 0.25 * (v_buffer.u_scale.state[0] - v_buffer.u_scale.stage[0]);
    v_buffer.u_scale.stage[1] += 0.25 * (v_buffer.u_scale.state[1] - v_buffer.u_scale.stage[1]);
    this.gl.uniform2f(shader.u_move, v_buffer.u_move.stage[0], v_buffer.u_move.stage[1]);
    this.gl.uniform2f(shader.u_scale, v_buffer.u_scale.stage[0], v_buffer.u_scale.stage[1]);
    ref = shader._uniforms;
    for (j = 0, len = ref.length; j < len; j++) {
      u = ref[j];
      if (u.isArray) {
        u.set(u.loc, shader.uniforms[u.name].val);
      } else {
        _u = shader.uniforms[u.name];
        if (_u.val.length) {
          u.set(u.loc, _u.val[0], _u.val[1], _u.val[2], _u.val[3]);
        } else {
          u.set(u.loc, _u.val);
        }
      }
    }
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, v_buffer);
    this.gl.vertexAttribPointer(shader.a_position, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(shader.a_position);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, shader.uv_buffer);
    this.gl.vertexAttribPointer(shader.a_texture, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.enableVertexAttribArray(shader.a_texture);
    if (shader.texture) {
      this.gl.bindTexture(this.gl.TEXTURE_2D, shader.texture);
      this.gl.uniform1i(shader.u_texture, 0);
    }
    this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    return this;
  }

};

var Shader = class Shader {
  constructor(opt) {
    this.code = opt.code;
    this.textureUrl = opt.textureUrl;
    this.uniforms = opt.uniforms;
    this._uniforms = [];
    this.focus = false;
    this.uv = opt.uv || [1.0, 1.0];
  }

  updateUvBuffer() {
    if (this.box.focus === this.index && !this.focus) {
      this.focus = true;
      return this.setUvBuffer(this.index);
    } else if (this.box.focus !== this.index && this.focus) {
      this.focus = false;
      return this.setUvBuffer(this.index);
    }
  }

  setUvBuffer(i) {
    var nh, nw, r_x, r_y;
    // console.log @image_ratio_y,@image_ratio_x
    if (this.focus) {
      nw = this.box.width / this.uv[0];
      nh = this.box.height / this.uv[1];
    } else {
      nw = this.box.width / this.uv[0] / this.box.grid[0];
      nh = this.box.height / this.uv[1] / this.box.grid[1];
    }
    r_x = .5 - ((nw / nh) / 2);
    r_y = .5 - (nh / nw) / 2;
    if (r_x > 0) {
      r_y = 0;
    } else {
      // r_x *= @image_ratio_x
      r_x = 0;
    }
    // r_y *= @image_ratio_y
    return this.uv_buffer = this.box.createBuffer(this.box.pos[i].x, this.box.pos[i].y, [r_x, 1 - r_y, r_x, r_y, 1 - r_x, 1 - r_y, 1 - r_x, 0 + r_y]);
  }

  setVertBuffer(i) {
    return this.vert_buffer = this.box.createBuffer(this.box.pos[i].x, this.box.pos[i].y, [-1, -1, -1, 1, 1, -1, 1, 1]);
  }

  init(box, index) {
    var image, key, ref, results, u, val;
    this.box = box;
    this.index = index;
    this.setUvBuffer(this.index);
    this.setVertBuffer(this.index);
    this.gl = this.box.gl;
    this.program = this.createProgram(default_vertex_shader, this.code);
    this.a_position = this.gl.getAttribLocation(this.program, "a_position");
    this.a_texture = this.gl.getAttribLocation(this.program, "a_texture");
    this.u_move = this.gl.getUniformLocation(this.program, "u_move");
    this.u_scale = this.gl.getUniformLocation(this.program, "u_scale");
    this.u_texture = this.gl.getUniformLocation(this.program, "u_texture");
    if (this.textureUrl) {
      this.texture = this.gl.createTexture();
      this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
      this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
      image = new Image();
      image.src = this.textureUrl;
      image.addEventListener('load', (e) => {
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        return this.setUvBuffer(this.index);
      });
    }
    ref = this.uniforms;
    results = [];
    for (key in ref) {
      val = ref[key];
      u = {
        loc: this.gl.getUniformLocation(this.program, key),
        set: this.gl["uniform" + val.type].bind(this.gl),
        name: key,
        isArray: val.type.match(/v$/) != null
      };
      results.push(this._uniforms.push(u));
    }
    return results;
  }

  createProgram(vert, frag) {
    var fs, prog, vs;
    // make fragment shader
    fs = this.gl.createShader(this.gl.FRAGMENT_SHADER);
    this.gl.shaderSource(fs, frag);
    this.gl.compileShader(fs);
    if (!this.gl.getShaderParameter(fs, this.gl.COMPILE_STATUS)) {
      throw new Error('\nFRAGMENT_COMPILE_ERROR:\n\n' + this.gl.getShaderInfoLog(fs) + '\nSOURCE:\n\n' + this.gl.getShaderSource(fs));
    }
    // make vertex shader
    vs = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(vs, vert);
    this.gl.compileShader(vs);
    if (!this.gl.getShaderParameter(vs, this.gl.COMPILE_STATUS)) {
      throw new Error('\nVERTEX_COMPILE_ERROR:\n\n' + this.gl.getShaderInfoLog(vs) + '\nSOURCE:\n\n' + gl.getShaderSource(vs));
    }
    // make and use program
    prog = this.gl.createProgram();
    this.gl.attachShader(prog, fs);
    this.gl.attachShader(prog, vs);
    this.gl.linkProgram(prog);
    if (!this.gl.getProgramParameter(prog, this.gl.LINK_STATUS)) {
      throw new Error('SHADER_LINK_' + this.gl.getProgramInfoLog(prog));
    }
    return prog;
  }

};


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports=opts=>"attribute vec2 a_position;\nattribute vec2 a_texture;\nuniform vec2 u_move;\nuniform vec2 u_scale;\nvarying vec2 v_uv;\nvoid main() {\n\tgl_Position = vec4((a_position + u_move) * u_scale, 0.0, 1.0);\n\tv_uv = a_texture;\n}\n";

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports=opts=>"precision highp float;\nuniform vec2 pos;\nuniform float iTime;\nvarying vec2 v_uv;\nfloat random(in vec2 _st) {\n\treturn fract(sin(dot(_st.xy, vec2(12.9898, 78.233))) * 43758.54531237);\n}\nfloat noise(in vec2 _st) {\n\tvec2 i = floor(_st);\n\tvec2 f = fract(_st);\n\tfloat a = random(i);\n\tfloat b = random(i + vec2(1.0, 0.0));\n\tfloat c = random(i + vec2(0.0, 1.0));\n\tfloat d = random(i + vec2(1.0, 1.0));\n\tvec2 u = (f * f) * (3. - (2.0 * f));\n\treturn (mix(a, b, u.x) + (((c - a) * u.y) * (1. - u.x))) + (((d - b) * u.x) * u.y);\n}\nfloat light(in vec2 pos, in float size, in float radius, in float inner_fade, in float outer_fade) {\n\tfloat len = length(pos / size);\n\treturn pow(clamp(1.0 - pow(clamp(len - radius, 0.0, 1.0), 1.0 / inner_fade), 0.0, 1.0), 1.0 / outer_fade);\n}\nfloat flare(in float angle, in float alpha, in float time) {\n\tfloat t = time;\n\tfloat n = noise(vec2(((t + 0.5) + abs(angle)) + pow(alpha, 0.6), (t - abs(angle)) + pow(alpha + 0.1, 0.6)) * 7.0);\n\tfloat split = 15.0 + (sin((((t * 2.0) + (n * 4.0)) + (angle * 20.0)) + ((alpha * 1.0) * n)) * ((.3 + .5) + ((alpha * .6) * n)));\n\tfloat rotate = sin((angle * 20.0) + sin(((((angle * 15.0) + (alpha * 4.0)) + (t * 30.0)) + (n * 5.0)) + (alpha * 4.0))) * (.5 + (alpha * 1.5));\n\tfloat g = pow(((2.0 + (sin((split + ((n * 1.5) * alpha)) + rotate) * 1.4)) * n) * 4.0, n * (1.5 - (0.8 * alpha)));\n\tg *= (((alpha * alpha) * alpha) * .4);\n\tg += ((alpha * .7) + ((g * g) * g));\n\treturn g;\n}\n#define SIZE 2.3\n#define RADIUS 0.099\n#define INNER_FADE .8\n#define OUTER_FADE 0.02\n#define OUTER_FADE_2 0.01\n#define SPEED .1\n#define BORDER 0.21999\nvoid main() {\n\tvec2 uv = vec2(v_uv - 0.5) * 1.5;\n\tfloat f = .0;\n\tfloat f2 = .0;\n\tfloat t = iTime * SPEED;\n\tfloat alpha = light(uv, SIZE, RADIUS, INNER_FADE, OUTER_FADE);\n\tfloat angle = atan(uv.x, uv.y);\n\tfloat n = noise(vec2((uv.x * 20.) + iTime, (uv.y * 20.) + iTime));\n\tfloat l = length(uv);\n\tif (l < BORDER) {\n\t\tt *= .8;\n\t\talpha = 1. - (pow((BORDER - l) / BORDER, 0.22) * 0.7);\n\t\talpha = clamp(alpha - (light(uv, 0.2, 0.0, 1.3, .7) * .55), .0, 1.);\n\t\tf = flare(angle * 1.0, alpha, (-t * .5) + alpha);\n\t\tf2 = flare(angle * 1.0, alpha, (-t + (alpha * .5)) + 0.38134);\n\t}\n\telse if (alpha < 0.001) {\n\t\tf = alpha;\n\t}\n\telse {\n\t\tf = flare(angle, alpha, t) * 1.3;\n\t}\n\tgl_FragColor = vec4(vec3((f * (1.0 + (sin(angle - (t * 4.)) * .3))) + ((f2 * f2) * f2), (f * alpha) + ((f2 * f2) * 2.0), ((f * alpha) * 0.5) + (f2 * (1.0 + (sin(angle + (t * 4.)) * .3)))), 1.0);\n}\n";

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports=opts=>"precision highp float;\nvarying vec2 v_uv;\nuniform float iTime;\nconst vec3 inkColor = vec3(0.01, 0.01, 0.1);\nconst vec3 paperColor = vec3(1.0, 0.98, 0.94);\nconst float speed = 0.01;\nconst float shadeContrast = 0.55;\nconst float F3 = 0.3333333;\nconst float G3 = 0.1666667;\nvec3 random3(vec3 c) {\n\tfloat j = 4096.0 * sin(dot(c, vec3(17.0, 59.4, 15.0)));\n\tvec3 r;\n\tr.z = fract(512.0 * j);\n\tj *= .125;\n\tr.x = fract(512.0 * j);\n\tj *= .125;\n\tr.y = fract(512.0 * j);\n\treturn r - 0.5;\n}\nfloat simplex3d(vec3 p) {\n\tvec3 s = floor(p + dot(p, vec3(F3)));\n\tvec3 x = (p - s) + dot(s, vec3(G3));\n\tvec3 e = step(vec3(0.0), x - x.yzx);\n\tvec3 i1 = e * (1.0 - e.zxy);\n\tvec3 i2 = 1.0 - (e.zxy * (1.0 - e));\n\tvec3 x1 = (x - i1) + G3;\n\tvec3 x2 = (x - i2) + (2.0 * G3);\n\tvec3 x3 = (x - 1.0) + (3.0 * G3);\n\tvec4 w, d;\n\tw.x = dot(x, x);\n\tw.y = dot(x1, x1);\n\tw.z = dot(x2, x2);\n\tw.w = dot(x3, x3);\n\tw = max(0.6 - w, 0.0);\n\td.x = dot(random3(s), x);\n\td.y = dot(random3(s + i1), x1);\n\td.z = dot(random3(s + i2), x2);\n\td.w = dot(random3(s + 1.0), x3);\n\tw *= w;\n\tw *= w;\n\td *= w;\n\treturn dot(d, vec4(52.0));\n}\nfloat fbm(vec3 p) {\n\tfloat f = 0.0;\n\tfloat frequency = 1.0;\n\tfloat amplitude = 0.5;\n\tfor (int i = 0; i < 5; i++) {\n\t\tf += (simplex3d(p * frequency) * amplitude);\n\t\tamplitude *= 0.5;\n\t\tfrequency *= (2.0 + (float(i) / 100.0));\n\t}\n\treturn min(f, 1.0);\n}\n#define SCALE 3.0\nvoid main() {\n\tvec2 uv = vec2(v_uv);\n\tuv.x = 1.0 - (abs(.5 - uv.x) * SCALE);\n\tuv.y *= SCALE;\n\tvec3 p = vec3(uv, iTime * speed);\n\tfloat blot = fbm((p * 3.0) + 8.0);\n\tfloat shade = fbm((p * 2.0) + 16.0);\n\tblot = blot + (sqrt(uv.x) - abs((SCALE / 2.0) - uv.y));\n\tblot = smoothstep(0.65, 0.71, blot) * max(1.0 - (shade * shadeContrast), 0.0);\n\tgl_FragColor = vec4(mix(paperColor, inkColor, blot), 1.0);\n}\n";

/***/ })
/******/ ]);
//# sourceMappingURL=example.bundle.js.map