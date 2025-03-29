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

function generateSierpinski(level, p1, p2, p3) {
    if (level === 0) {
        vertices.push(...p1, ...p2, ...p3);
    } else {
        let mid1 = [(p1[0] + p2[0]) / 2, (p1[1] + p2[1]) / 2];
        let mid2 = [(p2[0] + p3[0]) / 2, (p2[1] + p3[1]) / 2];
        let mid3 = [(p1[0] + p3[0]) / 2, (p1[1] + p3[1]) / 2];
        
        generateSierpinski(level - 1, p1, mid1, mid3);
        generateSierpinski(level - 1, mid1, p2, mid2);
        generateSierpinski(level - 1, mid3, mid2, p3);
    }
}

function drawSierpinski(level) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    vertices = [];
    
    const p1 = [-0.6, -0.5];
    const p2 = [0.6, -0.5];
    const p3 = [0.0, 0.6];
    generateSierpinski(level, p1, p2, p3);
    
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
    if (level > 7) {
        alert("⚠ Đã đạt giới hạn level 7!");
        level = 7;
        document.getElementById("increaseLevel").disabled = true;
    } else {
        document.getElementById("increaseLevel").disabled = false;
    }
    document.getElementById("levelDisplay").innerText = level;
    drawSierpinski(level);
}

function main() {
    initWebGL();
    document.getElementById("decreaseLevel").onclick = () => changeLevel(-1);
    document.getElementById("increaseLevel").onclick = () => changeLevel(1);
    drawSierpinski(level);
}

window.onload = main;
