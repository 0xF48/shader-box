
# ShaderBox
`npm install shader-box`


<a href="https://npmjs.com/package/shader-box" alt="npm link"><img src="https://img.shields.io/npm/v/preact-slide.svg?style=flat-square" /></a>


[live example](http://arxii.github.io/shader-box)



An easy way to render a simple frag shader on a 4 vertex triangle strip, no dependencies. Great for initial/concept development of different shaders, or showing off a collection of shaders on one canvas!

Import it as a module or use the script tag with `window.ShaderBox`



### Example
```javascript
import {Shader,Box} from 'shader-box'

var box = new Box({
  canvas: window.my_canvas, //canvas element to get context from
  resize: true, //auto resize viewport on window.resize
  clearColor: [0, 0, 0, 1], //clear color
  grid: [2,1], //set a cutom size for columns and rows (x,y) of a grid if you want to display more 
  than one shader like in this example.
  context: {  // context options passed to .getContext
    antialias: true,
    depth: false
  }
});

//create a shader
var shaderA = new Shader({
  source: frag_shader, //you can use webpack and require your shaders easy with a glsl or raw loader, look in the webpack.config.js for more
  uniforms: {
    iTime: {
      type: '1f',
      value: 0.4
    }
  }
});

//create another shader
var shaderB = new Shader({
  source: frag_shader2, //you can use webpack and require your shaders easy with a glsl or raw loader, look in the webpack.config.js for more
  textureUrl: './star.jpeg',
  uv: [1,1], //set the uv to match the width/height ratio of the star, in this case the image is square.
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
  shaderA.uniforms.iTime.value = t 
  shaderB.uniforms.pos.value[0] = 0.5

  //clear and draw
  box
    .clear()
    .draw(shaderA) //draw a shader
    .draw(shaderB) //draw a shader
  
  box.focus = 0  //make the first shader fullscreen.
}

tick(0);
```


### Uniforms
```glsl
varying vec2 v_uv; //gl uv position from 0 to 1, starting top left and ending at bottom right.
uniform sampler2D u_texture;
```
***



### Box Options
* **`canvas`** *`domElement (required)`*  canvas element 
* **`resize`** *`true`*  update the viewport on window resize
* **`clearColor`** *`[0,0,0,0]`* : 4 length array for the clearColor
* **`context`** *`{}`* : canvas.getContext 2nd parameter object. includes settings such as antialias and depth. 
* **`grid`** *`[1,1]`* : columns and rows. change this when you want to show multiple shaders on one screen.
***



### Shader Options
* **`source`** *`String (required)`* fragment shader string.
* **`uv`** *`[1.0,1.0]`* : aspect/size ratio for width and height of the UV.
* **`uniforms`** *`{}`* uniform format is as follows:
* ```javascript
  my_uniform_name: {
    type: '2fv', // uniform type. creates a function from this string `set = @gl["uniform"+type].bind(@gl)`
    value: [0.4, 0.4]
  }
  ```
* **`textureUrl`**: *String* set the url of a texture you want to load. if your texture is not 1:1, you need to set the uv so that it matches the ratio of the texture.
***



### Box Methods
* **`.add`** *`Shader`* add and initalize a shader assigning it to a position on the grid.
* **`.clear`** clear the canvas.
* **`.draw`** *`Shader`* draw a shader.
* **`.focus`** *`Integer`* when rendering more than one shader, you can set the focus to a particular index on the grid. index positions are incremented whenever a shader is added.
***


----------


This library uses ES6 classes and is compiled from coffeescript. you can find the source files in the src folder/
To run webpack-dev-server with example use `npm i && npm run dev`


### todos
* multiple buffers for image transitions, etc...
* clean up code
