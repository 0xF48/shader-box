default_vertex_shader = require('./vertex_shader.glsl')()
export class Box
	constructor: (opt)->
		@canvas = opt.canvas
		@grid = opt.grid || [1,1]
		@shaders = []
		@pos = []
		@gl = @canvas.getContext "experimental-webgl",(opt.context or {antialias:true,depth:false})
		if !@gl
			alert 'failed to start webgl :('
		
		@focus = -1
		@setViewport()
		if opt.resize then window.addEventListener 'resize',@setViewport
		if opt.clearColor
			@gl.clearColor(opt.clearColor[0], opt.clearColor[1], opt.clearColor[2], opt.clearColor[3])
		else 
			@gl.clearColor(0,0,0,1)
	

		
		for y in [0...@grid[1]]
			for x in [0...@grid[0]]
				@pos.push {x,y}
			

		@gl.bindFramebuffer(@gl.FRAMEBUFFER,null)


	createBuffer: (x,y,verts)->
		buffer = @gl.createBuffer()
		@gl.bindBuffer @gl.ARRAY_BUFFER,buffer
		@gl.bufferData @gl.ARRAY_BUFFER,new Float32Array(verts),@gl.STATIC_DRAW
		
		mx = -@grid[0]+1+x*2
		my = @grid[1]-1-y*2
		
		buffer.u_move =
			origin:  [mx,my]
			state:  [mx,my]
			stage:  [mx,my]
		
		sx = 1 / @grid[0]
		sy = 1 / @grid[1]
		
		buffer.u_scale =
			origin: [sx,sy]
			state: [sx,sy]
			stage: [sx,sy]
		
		return buffer


	setViewport: =>
		@canvas.width = @width = @canvas.clientWidth
		@canvas.height = @height = @canvas.clientHeight
		@gl.viewport(0, 0, @width, @height)
		for shader in @shaders
			shader.setUvBuffer(shader.index)


	add: (shader)->

		shader.init(@,@shaders.length)
		@shaders.push shader
		return @


	clear: ()->
		@gl.clear(@gl.COLOR_BUFFER_BIT | @gl.DEPTH_BUFFER_BIT)
		return @
	

	draw: (shader)->
		if !shader.gl
			throw new Error 'shader has not been added.'
		i = i || 0
		v_buffer = shader.vert_buffer
		
		
		@gl.useProgram shader.program
		

		shader.updateUvBuffer()


		if @focus >= 0
			if shader.index == @focus
				v_buffer.u_move.state[0] = v_buffer.u_move.state[1] = 0
				v_buffer.u_scale.state[0] = v_buffer.u_scale.state[1] = 1
			else
				v_buffer.u_scale.state[0] = v_buffer.u_scale.state[1] = 0
		else
			v_buffer.u_move.state[0] = v_buffer.u_move.origin[0]
			v_buffer.u_move.state[1] = v_buffer.u_move.origin[1]
			v_buffer.u_scale.state[0] = v_buffer.u_scale.origin[0]
			v_buffer.u_scale.state[1] = v_buffer.u_scale.origin[1]


		v_buffer.u_move.stage[0] += 0.25 * (v_buffer.u_move.state[0] - v_buffer.u_move.stage[0])
		v_buffer.u_move.stage[1] += 0.25 * (v_buffer.u_move.state[1] - v_buffer.u_move.stage[1])

		v_buffer.u_scale.stage[0] += 0.25 * (v_buffer.u_scale.state[0] - v_buffer.u_scale.stage[0])
		v_buffer.u_scale.stage[1] += 0.25 * (v_buffer.u_scale.state[1] - v_buffer.u_scale.stage[1])



		@gl.uniform2f(shader.u_move, v_buffer.u_move.stage[0], v_buffer.u_move.stage[1])
		@gl.uniform2f(shader.u_scale, v_buffer.u_scale.stage[0], v_buffer.u_scale.stage[1])
		for u in shader._uniforms
			if u.isArray
				u.set(u.loc,shader.uniforms[u.name].val)
			else
				_u = shader.uniforms[u.name]
				if _u.val.length
					u.set(u.loc,_u.val[0],_u.val[1],_u.val[2],_u.val[3])
				else
					u.set(u.loc,_u.val)

	
		@gl.bindBuffer(@gl.ARRAY_BUFFER, v_buffer)
		@gl.vertexAttribPointer(shader.a_position, 2, @gl.FLOAT, false, 0, 0)
		@gl.enableVertexAttribArray(shader.a_position)
		




		@gl.bindBuffer(@gl.ARRAY_BUFFER, shader.uv_buffer)
		@gl.vertexAttribPointer(shader.a_texture, 2, @gl.FLOAT, false, 0, 0)
		@gl.enableVertexAttribArray(shader.a_texture)
		
		if shader.texture
			@gl.bindTexture(@gl.TEXTURE_2D, shader.texture);
			@gl.uniform1i(shader.u_texture, 0);
		
		
		@gl.drawArrays(@gl.TRIANGLE_STRIP, 0,4)



		
		

		return @


export class Shader
	constructor: (opt)->
		@code = opt.code
		@textureUrl = opt.textureUrl
		@uniforms = opt.uniforms
		@_uniforms = []
		@focus = false
		@uv = opt.uv || [1.0,1.0]
	updateUvBuffer: ()->
		if @box.focus == @index && !@focus
			@focus = true
			@setUvBuffer(@index)
		else if @box.focus != @index && @focus
			@focus = false
			@setUvBuffer(@index)
			
	
	setUvBuffer: (i)->
		# console.log @image_ratio_y,@image_ratio_x
		if @focus
			nw = @box.width / @uv[0]
			nh = @box.height / @uv[1]
		else
			nw = @box.width / @uv[0] / @box.grid[0]
			nh = @box.height / @uv[1] / @box.grid[1]
	
		r_x = ( (.5) - ((nw / nh) / 2))
		r_y = ( (.5) - (nh / nw) / 2 )

		if r_x > 0
			r_y = 0
			# r_x *= @image_ratio_x
		else
			r_x = 0
			# r_y *= @image_ratio_y
		@uv_buffer = @box.createBuffer(@box.pos[i].x,@box.pos[i].y,[ r_x,1-r_y,   r_x,r_y, 1-r_x,1-r_y   ,1-r_x,0+r_y,    ])


	setVertBuffer: (i)->
		@vert_buffer = @box.createBuffer(@box.pos[i].x,@box.pos[i].y,[-1,-1,-1,1,1,-1,1,1])
				

	init: (@box,@index)->


		@setUvBuffer(@index)
		@setVertBuffer(@index)

		

		@gl = @box.gl
		@program = @createProgram(default_vertex_shader,@code)


		@a_position = @gl.getAttribLocation(@program, "a_position")
		@a_texture = @gl.getAttribLocation(@program, "a_texture")
		@u_move = @gl.getUniformLocation(@program, "u_move")
		@u_scale = @gl.getUniformLocation(@program, "u_scale")
		@u_texture = @gl.getUniformLocation(@program, "u_texture")

	
		if @textureUrl
			@texture = @gl.createTexture()
			@gl.bindTexture(@gl.TEXTURE_2D, @texture)
			@gl.texImage2D(@gl.TEXTURE_2D, 0, @gl.RGBA, 1, 1, 0, @gl.RGBA, @gl.UNSIGNED_BYTE,new Uint8Array([0, 0, 255, 255]))
			image = new Image()
			image.src = @textureUrl
			image.addEventListener 'load', (e)=>
				@gl.bindTexture(@gl.TEXTURE_2D, @texture)
				@gl.texImage2D(@gl.TEXTURE_2D, 0, @gl.RGBA,@gl.RGBA,@gl.UNSIGNED_BYTE, image)
				@gl.texParameteri(@gl.TEXTURE_2D, @gl.TEXTURE_WRAP_S, @gl.CLAMP_TO_EDGE)
				@gl.texParameteri(@gl.TEXTURE_2D, @gl.TEXTURE_WRAP_T, @gl.CLAMP_TO_EDGE)
				@gl.texParameteri(@gl.TEXTURE_2D, @gl.TEXTURE_MIN_FILTER, @gl.NEAREST)
				@gl.texParameteri(@gl.TEXTURE_2D, @gl.TEXTURE_MAG_FILTER, @gl.NEAREST)
				@setUvBuffer(@index)


		for key,val of @uniforms
			u = 
				loc: @gl.getUniformLocation(@program,key)
				set: @gl["uniform"+val.type].bind(@gl)
				name: key
				isArray: val.type.match(/v$/)?
			@_uniforms.push u

	
		
	createProgram: (vert,frag)->
		# make fragment shader
		fs = @gl.createShader(@gl.FRAGMENT_SHADER)
		@gl.shaderSource(fs,frag)
		@gl.compileShader(fs)
		if !@gl.getShaderParameter(fs, @gl.COMPILE_STATUS)
			throw new Error(@gl.getShaderInfoLog(fs))

		# make vertex shader
		vs = @gl.createShader(@gl.VERTEX_SHADER)
		@gl.shaderSource(vs,vert)
		@gl.compileShader(vs)
		if !@gl.getShaderParameter(vs, @gl.COMPILE_STATUS)
			throw new Error(@gl.getShaderInfoLog(vs))

		# make and use program
		prog = @gl.createProgram()
		@gl.attachShader(prog, fs)
		@gl.attachShader(prog, vs)
		@gl.linkProgram(prog)

		if !@gl.getProgramParameter(prog, @gl.LINK_STATUS)
			throw new Error(this.gl.getProgramInfoLog(prog))
		
		return prog
