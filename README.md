
# ShaderBox
`npm install shader-box`

---

A very easy way to render a simple 1x1 frag shader on a 4 vertex triangle strip, no dependencies. `shader-box` is good for developing many different shaders seperately from main project, or showing off a collection of shaders on one canvas.

---



Import it or use the tag `<script src = '/shader-box.js'></script>`, access via `window.ShaderBox`

```javascript
import {Shader,Box} from 'shader-box'
```


---

Create a "Box" this super stripped verstion of webgl context that will handle the shaders.

```javascript
box = new Box({
  canvas: window.my_canvas, //canvas element to get context from
  resize: true, //auto resize viewport on window.resize
  clearColor: [0, 0, 0, 1], //clear color
  grid: [2,1], //x and y size of a grid, if you want to display more than one shader like in this example. default is 1 x 1
  context: {  // context options passed to .getContext
    antialias: true,
    depth: false
  }
});
```

---

Create a "Shader" with fragment code and some uniforms.
```javascript
//create a shader
shaderA = new Shader({
  code: frag_shader, //you can use webpack and require your shaders easy with a glsl or raw loader, look in the webpack.config.js for more
  uniforms: {
    iTime: {
      type: '1f',
      val: 0.4
    }
  }
});


//create another shader
shaderB = new Shader({
  code: frag_shader2, //you can use webpack and require your shaders easy with a glsl or raw loader, look in the webpack.config.js for more
  textureUrl: './star.jpeg',
  uniforms: {
    pos: {
      type: '2fv', // uniform type. creates a function like `set = @gl["uniform"+type].bind(@gl)`
      val: [0.4, 0.4]
    },
    iTime: {
      type: '1f',
      val: 0.4
    }
  }
});


//add the shaders.
box.add(shaderA).add(shaderB);
```

---

draw it!##
```javascript

tick = function(t){
  requestAnimationFrame(tick)

  shaderA.uniforms.iTime.val = t
  shaderB.uniforms.pos.val[0] = 0.5

  box
    .clear()
    .draw(shaderA)
    .draw(shaderB)
  
  box.focus = 0 //make a shader fullscreen if there is more than one drawn on the grid, setting to -1 will display all the shaders in a grid
}

tick(0);
```

---
this library uses ES6 classes, and is compiled from coffeescript. you can find the source files in the src folder

---
todo:
* clean up
* multiple shader passes per texture


