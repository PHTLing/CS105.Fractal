let gl, program;
let cRe = -0.05, cIm = 0.0; // Hằng số cho Julia Set
let stepSize = 0.05;

function initWebGL() {
    const canvas = document.getElementById("glCanvas");
    gl = canvas.getContext("webgl");
    if (!gl) {
        alert("WebGL not supported");
        return;
    }

    initShaders();
    drawJulia();
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
        uniform vec2 u_c; // Hằng số phức c

        void main() {
            vec2 z = (gl_FragCoord.xy / u_resolution - 0.5) * 3.0;
            int iter = 0;
            const int maxIter = 100;

            for (int i = 0; i < maxIter; i++) {
                if (dot(z, z) > 4.0) break;
                z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + u_c;
                iter++;
            }

            float color = float(iter) / float(maxIter);
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

function drawJulia() {
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

    const cLocation = gl.getUniformLocation(program, "u_c");
    gl.uniform2f(cLocation, cRe, cIm);

    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
}

function updateC(real, imag) {
    cRe = real;
    cIm = imag;
    drawJulia();
}

function changeStepSize(newSize) {
    stepSize = newSize;
}

window.onload = initWebGL;
