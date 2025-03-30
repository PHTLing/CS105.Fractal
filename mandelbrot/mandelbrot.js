let gl, program;
let zoom = 1.0, offsetX = -0.5, offsetY = 0.0;

function initWebGL() {
    const canvas = document.getElementById("glCanvas");
    gl = canvas.getContext("webgl");
    if (!gl) {
        alert("WebGL not supported");
        return;
    }

    initShaders();
    drawMandelbrot();
}
function checkShaderCompile(shader) {
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
    }
}
function checkProgramLink(program) {
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(program));
    }
}

function initShaders() {
    const vsSource = `
        attribute vec2 coordinates;
        void main() {
            gl_Position = vec4(coordinates, 0.0, 1.0);
        }
    `;

    const fsSource = `
        precision highp float;
        uniform vec2 u_resolution;
        uniform float u_zoom;
        uniform vec2 u_offset;

        void main() {
            vec2 c = (gl_FragCoord.xy / u_resolution - 0.5) * (3.0 / u_zoom) + u_offset;
            vec2 z = c;
            int iter = 0;  // Khai báo biến trước vòng lặp

            for (int i = 0; i < 100; i++) {
                if (dot(z, z) > 4.0) break;
                z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
                iter++; // Cập nhật số lần lặp
            }

            float color = float(iter) / 100.0;
            gl_FragColor = vec4(0.5 + 0.5 * cos(3.0 + color * 10.0), 
                                0.5 + 0.5 * cos(2.0 + color * 10.0), 
                                0.5 + 0.5 * cos(1.0 + color * 10.0), 1.0);

        }
    `;

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);
    checkShaderCompile(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);
    checkShaderCompile(fragmentShader);

    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    checkProgramLink(program);
    gl.useProgram(program);
}




function drawMandelbrot() {
    const vertices = new Float32Array([
        -1, -1, 1, -1, -1, 1,
        -1, 1, 1, -1, 1, 1
    ]);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const coord = gl.getAttribLocation(program, "coordinates");
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);

    const resolution = gl.getUniformLocation(program, "u_resolution");
    gl.uniform2f(resolution, gl.canvas.width, gl.canvas.height);

    const zoomLoc = gl.getUniformLocation(program, "u_zoom");
    gl.uniform1f(zoomLoc, zoom);

    const offsetLoc = gl.getUniformLocation(program, "u_offset");
    gl.uniform2f(offsetLoc, offsetX, offsetY);

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
}

window.onload = () => {
    initWebGL();
    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowUp") offsetY += 0.1 / zoom;
        if (event.key === "ArrowDown") offsetY -= 0.1 / zoom;
        if (event.key === "ArrowLeft") offsetX -= 0.1 / zoom;
        if (event.key === "ArrowRight") offsetX += 0.1 / zoom;
        if (event.key === "+") zoom *= 1.2;
        if (event.key === "-") zoom /= 1.2;
        drawMandelbrot();
    });
};
