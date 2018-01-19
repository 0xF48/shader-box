(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["ShaderBox"] = factory();
	else
		root["ShaderBox"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Box", function() { return Box; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Shader", function() { return Shader; });
var default_vertex_shader;

default_vertex_shader = __webpack_require__(1)();

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
      throw new Error(this.gl.getShaderInfoLog(fs));
    }
    // make vertex shader
    vs = this.gl.createShader(this.gl.VERTEX_SHADER);
    this.gl.shaderSource(vs, vert);
    this.gl.compileShader(vs);
    if (!this.gl.getShaderParameter(vs, this.gl.COMPILE_STATUS)) {
      throw new Error(this.gl.getShaderInfoLog(vs));
    }
    // make and use program
    prog = this.gl.createProgram();
    this.gl.attachShader(prog, fs);
    this.gl.attachShader(prog, vs);
    this.gl.linkProgram(prog);
    if (!this.gl.getProgramParameter(prog, this.gl.LINK_STATUS)) {
      throw new Error(this.gl.getProgramInfoLog(prog));
    }
    return prog;
  }

};


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports=opts=>"attribute vec2 a_position;\nattribute vec2 a_texture;\nuniform vec2 u_move;\nuniform vec2 u_scale;\nvarying vec2 v_uv;\nvoid main() {\n\tgl_Position = vec4((a_position + u_move) * u_scale, 0.0, 1.0);\n\tv_uv = a_texture;\n}\n";

/***/ })
/******/ ]);
});