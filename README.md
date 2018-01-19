
# ShaderBox
`npm install shader-box`


A very easy way to render a simple frag shader on a 4 vertex triangle strip, no dependencies. `shader-box` is good for developing many different shaders seperately from main project, or showing off a collection of shaders on one canvas.

Import it as a module or use the script tag with `window.ShaderBox`



### Uniforms
```glsl
varying vec2 v_uv; //uv frag position [-1,1]

uniform sampler2D u_texture; //texture uniform
```
***



### Box Options
* **`canvas`** *domElement* : canvas element (required)
* **`resize`** *Boolean* : (default: true)
* **`clearColor`** *Array[4]* : 4 length array for the clearColor (default: [0,0,0,0])
* **`context`** *Object* : canvas.getContext 2nd parameter object. includes settings such as antialias and depth. (default {})
* **`grid`** *Array[2]* : columns and rows. change this when you want to show multiple shaders on one screen. (default : [1,1])
* **`uv_size`** *Array[2]* : aspect ratio for x and y uv. (default: [1,1])
***



### Shader Options
* **`code`** *String* fragment shader string.
* **`uniforms`** *Object* see example on how to add uniforms.
```javascript
my_uniform_name: {
  type: '2fv', // uniform type. creates a function like `set = @gl["uniform"+type].bind(@gl)`
  value: [0.4, 0.4]
}
```
* **`textureUrl`**: *String* set the url of a texture you want to load. if your texture is not 1:1, you need to set the uv_size so that it matches the ratio of the texture.
***



### Box Methods
* **`.add`** *Shader* add and initalize shader, increment the index and set a position on the grid.
* **`.clear`** clear the canvas
* **`.draw`** *Shader* draw a shader.
* **`.focus`** *Integer* when rendering more than one shader, set shader index position to zoom in on a particular one. index positions are incremented on each .add method call
***



### Example
```javascript
import {Shader,Box} from 'shader-box'

var box = new Box({
  canvas: window.my_canvas, //canvas element to get context from
  resize: true, //auto resize viewport on window.resize
  clearColor: [0, 0, 0, 1], //clear color
  grid: [2,1], //x and y size of a grid, if you want to display more than one shader like in this example. default is 1 x 1
  context: {  // context options passed to .getContext
    antialias: true,
    depth: false
  }
});

//create a shader
var shaderA = new Shader({
  code: frag_shader, //you can use webpack and require your shaders easy with a glsl or raw loader, look in the webpack.config.js for more
  uniforms: {
    iTime: {
      type: '1f',
      value: 0.4
    }
  }
});

//create another shader
var shaderB = new Shader({
  code: frag_shader2, //you can use webpack and require your shaders easy with a glsl or raw loader, look in the webpack.config.js for more
  textureUrl: './star.jpeg',
  uniforms: {
    pos: {
      type: '2fv', // uniform type. creates a function like `set = @gl["uniform"+type].bind(@gl)`
      value: [0.4, 0.4]
    },
    iTime: {
      type: '1f',
      value: 0.4
    }
  }
});

//add the shaders.
box.add(shaderA).add(shaderB);

//draw it!
var tick = function(t){
  requestAnimationFrame(tick)

  //update the uniforms.
  shaderA.uniforms.iTime.val = t 
  shaderB.uniforms.pos.val[0] = 0.5

  //clear and draw
  box
    .clear()
    .draw(shaderA) //draw a shader
    .draw(shaderB) //draw a shader
  
  box.focus = 0  //make the first shader fullscreen.
}

tick(0);
```



---
this library uses ES6 classes, and is compiled from coffeescript. you can find the source files in the src folder
---


to run webpack-dev-server with example:
```
npm install
npm run-script dev
```


repo todos:
* clean up code
* multiple shader passes per texture


