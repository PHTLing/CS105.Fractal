let gl, program;
let level = 0;
let vertices = [];

function initWebGL() {
    const canvas = document.getElementById("glCanvas");
    gl = canvas.getContext("webgl");
    if (!gl) {
        alert("WebGL not supported");
        return;
    }
    gl.clearColor(1, 1, 1, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
    
    initShaders();
}

function initShaders() {
    const vsSource = `
        attribute vec2 coordinates;
        void main() {
            gl_Position = vec4(coordinates, 0.0, 1.0);
        }
    `;
    const fsSource = `
        void main() {
            gl_FragColor = vec4(0.635, 0.863, 0.933, 1.0);
        }
    `;
    
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsSource);
    gl.compileShader(vertexShader);
    
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fsSource);
    gl.compileShader(fragmentShader);
    
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);
}

function generateSierpinskiCarpet(x, y, size, level) {
    if (level === 0) {
        vertices.push(x, y, x + size, y, x, y - size);
        vertices.push(x + size, y, x + size, y - size, x, y - size);
    } else {
        let newSize = size / 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (i === 1 && j === 1) continue;
                generateSierpinskiCarpet(x + i * newSize, y - j * newSize, newSize, level - 1);
            }
        }
    }
}

function drawSierpinskiCarpet(level) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    vertices = [];
    generateSierpinskiCarpet(-0.6, 0.6, 1.2, level);
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    const coord = gl.getAttribLocation(program, "coordinates");
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);
    
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2);
}

function changeLevel(delta) {
    level = Math.max(0, level + delta);
    if (level > 6) {
        alert("⚠ Giới hạn level là 6!");
        level = 6;
        document.getElementById("increaseLevel").disabled = true;
    } else {
        document.getElementById("increaseLevel").disabled = false;
    }
    document.getElementById("levelDisplay").innerText = level;
    drawSierpinskiCarpet(level);
}

function main() {
    initWebGL();

    document.getElementById("decreaseLevel").onclick = () => changeLevel(-1);
    document.getElementById("increaseLevel").onclick = () => changeLevel(1);
    drawSierpinskiCarpet(level);
}

window.onload = main;
