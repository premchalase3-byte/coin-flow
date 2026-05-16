import React, { useEffect, useRef } from "react";

const NeuralBackground = () => {
  const canvasRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0, tX: 0, tY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");

    if (!gl) return;

    const vs = `
      attribute vec2 a_position;
      varying vec2 vUv;
      void main() {
        vUv = 0.5 * (a_position + 1.0);
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    const fs = `
      precision mediump float;

      varying vec2 vUv;
      uniform float u_time;
      uniform float u_ratio;
      uniform vec2 u_pointer;

      vec2 rotate(vec2 uv, float th) {
        return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
      }

      float pattern(vec2 uv, float t, float p) {
        vec2 acc = vec2(0.0);
        vec2 res = vec2(0.0);
        float scale = 5.0; // 🔽 reduced intensity

        for (int i = 0; i < 10; i++) { // 🔽 fewer layers = smoother
          uv = rotate(uv, 0.8); // 🔽 softer rotation
          acc = rotate(acc, 0.8);

          vec2 layer = uv * scale + float(i) + acc - t;
          acc += sin(layer) * 0.8 + p * 0.5;

          res += (0.5 + 0.5 * cos(layer)) / scale;
          scale *= 1.15;
        }

        return res.x + res.y;
      }

      void main() {
        vec2 uv = vUv - 0.5;
        uv.x *= u_ratio;

        vec2 pointer = vUv - u_pointer;
        pointer.x *= u_ratio;

        float p = clamp(length(pointer), 0.0, 1.0);
        p = pow(1.0 - p, 2.5);

        float t = u_time * 0.0006; // 🔽 slower animation

        float n = pattern(uv, t, p);

        // 🔽 softer shaping
        n = pow(n, 2.0);
        n += pow(n, 5.0) * 0.5;
        n = max(0.0, n - 0.35);

        // 🎨 COLORS (LESS BRIGHT)
        vec3 color = vec3(0.015, 0.03, 0.08); // darker base

        color += vec3(0.0, 0.5, 0.7) * n * 0.7;   // softer cyan
        color += vec3(0.3, 0.1, 0.6) * n * 0.3;   // subtle purple

        gl_FragColor = vec4(color, 1.0);
      }
    `;

    const compile = (type, source) => {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vs));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(program);
    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1, 1, 1,
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const pos = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRatio = gl.getUniformLocation(program, "u_ratio");
    const uPointer = gl.getUniformLocation(program, "u_pointer");

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(uRatio, canvas.width / canvas.height);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = (t) => {
      // 🔽 smoother pointer movement
      pointer.current.x += (pointer.current.tX - pointer.current.x) * 0.05;
      pointer.current.y += (pointer.current.tY - pointer.current.y) * 0.05;

      gl.uniform1f(uTime, t);
      gl.uniform2f(
        uPointer,
        pointer.current.x / window.innerWidth,
        1 - pointer.current.y / window.innerHeight
      );

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(render);
    };

    requestAnimationFrame(render);

    window.addEventListener("pointermove", (e) => {
      pointer.current.tX = e.clientX;
      pointer.current.tY = e.clientY;
    });

    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
      }}
    />
  );
};

export default NeuralBackground;