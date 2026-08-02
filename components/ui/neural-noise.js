// neural-noise.js - Vanilla JS WebGL Adapter for Neural Noise inside Project 09 Card
(function () {
  document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("neuralCanvas");
    if (!canvas) return;

    const pointer = { x: 0, y: 0, tX: 0, tY: 0 };
    let gl = null;
    let uniforms = {};

    const color = [1.0, 0.42, 0.08]; // Neon Amber / Sunset Orange matching Project 09
    const speed = 0.001;

    function initShader() {
      const vsSource = `
        precision mediump float;
        varying vec2 vUv;
        attribute vec2 a_position;
        void main() {
          vUv = 0.5 * (a_position + 1.0);
          gl_Position = vec4(a_position, 0.0, 1.0);
        }
      `;
      const fsSource = `
        precision mediump float;
        varying vec2 vUv;
        uniform float u_time;
        uniform float u_ratio;
        uniform vec2 u_pointer_position;
        uniform vec3 u_color;
        uniform float u_speed;
        vec2 rotate(vec2 uv, float th) {
          return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
        }
        float neuro_shape(vec2 uv, float t, float p) {
          vec2 sine_acc = vec2(0.0);
          vec2 res = vec2(0.0);
          float scale = 8.0;
          for (int j = 0; j < 15; j++) {
            uv = rotate(uv, 1.0);
            sine_acc = rotate(sine_acc, 1.0);
            vec2 layer = uv * scale + float(j) + sine_acc - t;
            sine_acc += sin(layer) + 2.4 * p;
            res += (0.5 + 0.5 * cos(layer)) / scale;
            scale *= 1.2;
          }
          return res.x + res.y;
        }
        void main() {
          vec2 uv = 0.5 * vUv;
          uv.x *= u_ratio;
          vec2 pointer = vUv - u_pointer_position;
          pointer.x *= u_ratio;
          float p = clamp(length(pointer), 0.0, 1.0);
          p = 0.5 * pow(1.0 - p, 2.0);
          float t = u_speed * u_time;
          vec3 col = vec3(0.0);
          float noise = neuro_shape(uv, t, p);
          noise = 1.2 * pow(noise, 3.0);
          noise += pow(noise, 10.0);
          noise = max(0.0, noise - 0.5);
          noise *= (1.0 - length(vUv - 0.5));
          col = u_color * noise;
          gl_FragColor = vec4(col, noise);
        }
      `;

      gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        console.error("WebGL not supported for NeuralNoise");
        return null;
      }

      function createShader(gl, source, type) {
        const shader = gl.createShader(type);
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.error("Shader compile error:", gl.getShaderInfoLog(shader));
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      }

      function createProgram(gl, vs, fs) {
        const program = gl.createProgram();
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
          console.error("Program link error:", gl.getProgramInfoLog(program));
          return null;
        }
        return program;
      }

      const vs = createShader(gl, vsSource, gl.VERTEX_SHADER);
      const fs = createShader(gl, fsSource, gl.FRAGMENT_SHADER);
      if (!vs || !fs) return null;
      const program = createProgram(gl, vs, fs);
      if (!program) return null;

      const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; i++) {
        const activeUniform = gl.getActiveUniform(program, i);
        if (activeUniform) {
          uniforms[activeUniform.name] = gl.getUniformLocation(program, activeUniform.name);
        }
      }

      const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
      const vertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
      gl.useProgram(program);

      const positionLocation = gl.getAttribLocation(program, "a_position");
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

      return gl;
    }

    function resizeCanvas() {
      if (!canvas || !gl) return;
      const devicePixelRatio = Math.min(window.devicePixelRatio, 2);
      const parent = canvas.parentElement;
      const w = (parent ? parent.clientWidth : window.innerWidth);
      const h = (parent ? parent.clientHeight : window.innerHeight);

      canvas.width = w * devicePixelRatio;
      canvas.height = h * devicePixelRatio;

      if (uniforms && uniforms.u_ratio) {
        gl.uniform1f(uniforms.u_ratio, canvas.width / canvas.height);
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    function setupEvents() {
      const updateMousePosition = (x, y) => {
        pointer.tX = x;
        pointer.tY = y;
      };
      const pointermove = (e) => updateMousePosition(e.clientX, e.clientY);
      const touchmove = (e) => {
        if (e.targetTouches[0]) updateMousePosition(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
      };
      window.addEventListener("pointermove", pointermove);
      window.addEventListener("touchmove", touchmove);
    }

    function render() {
      if (!gl) return;
      const currentTime = performance.now();
      pointer.x += (pointer.tX - pointer.x) * 0.2;
      pointer.y += (pointer.tY - pointer.y) * 0.2;

      if (uniforms.u_time) gl.uniform1f(uniforms.u_time, currentTime);
      if (uniforms.u_pointer_position) {
        gl.uniform2f(uniforms.u_pointer_position, pointer.x / window.innerWidth, 1 - pointer.y / window.innerHeight);
      }
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    }

    gl = initShader();
    if (!gl) return;

    setupEvents();
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    if (uniforms.u_color) gl.uniform3f(uniforms.u_color, color[0], color[1], color[2]);
    if (uniforms.u_speed) gl.uniform1f(uniforms.u_speed, speed);

    render();
  });
})();
