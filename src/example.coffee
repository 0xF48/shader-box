
{Box,Shader} = require './shader-box.coffee'
frag_shader = require('./example_frag.glsl')()
frag_shader2 = require('./example_frag2.glsl')()

box = new Box
	canvas: window.canvas #canvas element to get context from
	resize: true #auto resize on window.resize
	clearColor: [0.0, 0.0, 0.0, 1.0]
	grid: [2,1] #x and y size of a grid, if you want to display more than one shader like in this example. default is 1 x 1
	context:
		antialias: true
		depth: false


shaderA = new Shader
	code: frag_shader #you can use webpack and require your shaders easy with a glsl or raw loader, look in the webpack.config.js for more
	uniforms:
		iTime:
			type:'1f'
			val: 0.4


shaderB = new Shader
	code: frag_shader2 #you can use webpack and require your shaders easy with a glsl or raw loader, look in the webpack.config.js for more
	textureUrl: './star.jpeg'
	uniforms:
		pos: #uniform name
			type:'2fv' # setter = @gl["uniform"+type]
			val: [0.4,0.4]
		iTime:
			type:'1f'
			val: 0.4



box.add(shaderA).add(shaderB)

mouse = {x:0,y:0}

window.addEventListener 'mousemove', (e)=>
	mouse.x = e.clientX
	mouse.y = e.clientY


# set box.focus to index of the grid, eg if grid is [3,1] focus can be -1 (display all shaders), 0 ,1, or 2
window.addEventListener 'click', (e)=>
	box.focus += 1
	if box.focus == 2
		box.focus = -1

draw = (t)->
	requestAnimationFrame(draw)
	shaderA.uniforms.iTime.val = t
	shaderB.uniforms.iTime.val = t+4242
	shaderB.uniforms.pos.val[0] = 1 - (mouse.x / window.innerWidth)
	shaderB.uniforms.pos.val[1] = mouse.y / window.innerHeight
	box
		.clear()
		.draw(shaderA)
		.draw(shaderB)



draw(0)