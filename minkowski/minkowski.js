let gl, program;
let vertices = [];
let level = 0;

function initWebGL() {
    const canvas = document.getElementById("glCanvas");
    gl = canvas.getContext("webgl");
    if (!gl) {
        alert("WebGL not supported");
        return;
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
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
            gl_FragColor = vec4(0.027, 0.616, 0.851, 1.0);
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
function generateMinkowskiCurve(level) {
    vertices = [];
    let points = [
        [-0.5, 0.5], [0.5, 0.5],
        [0.5, -0.5], [-0.5, -0.5]
    ];
    for (let i = 0; i < points.length; i++) {
        generateMinkowskiSegment(points[i], points[(i + 1) % points.length], level);
    }
}

function generateMinkowskiSegment(p1, p2, depth) {
    if (depth === 0) {
        vertices.push(...p1, ...p2);
        return;
    }
    let delta = Math.abs(p2[0] - p1[0]) || Math.abs(p2[1] - p1[1]);
    delta /= 4;

    let dx = p2[0] - p1[0], dy = p2[1] - p1[1];
    let dirX = Math.sign(dx), dirY = Math.sign(dy);

    let C = [p1[0] + dirX * delta, p1[1] + dirY * delta];
    let D = [C[0] + dirX * delta, C[1] + dirY * delta];
    let E = [D[0] + dirX * delta, D[1] + dirY * delta];
    let F = [C[0] - dirY * delta, C[1] + dirX * delta];
    let G = [D[0] - dirY * delta, D[1] + dirX * delta];
    let H = [D[0] + dirY * delta, D[1] - dirX * delta];
    let I = [E[0] + dirY * delta, E[1] - dirX * delta];

    let segments = [p1, C, F, G, D, H, I, E, p2];
    for (let i = 0; i < segments.length - 1; i++) {
        generateMinkowskiSegment(segments[i], segments[i + 1], depth - 1);
    }
}

function drawMinkowski(level) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    generateMinkowskiCurve( level);
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    const coord = gl.getAttribLocation(program, "coordinates");
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);
    
    gl.drawArrays(gl.LINE_STRIP, 0, vertices.length / 2);
}

function changeLevel(delta) {
    level = Math.max(0, level + delta);
    // Giới hạn chỉ vẽ đến level 10
    if (level > 5)  {
        alert("⚠ Bạn đã vẽ đến giới hạn nhóm hiển thị. Hãy giảm level để tiếp tục!");
        level = 5;
        document.getElementById("levelDisplay").disabled=true;
    }
    else {
        document.getElementById("levelDisplay").disabled=false;
    }
    document.getElementById("levelDisplay").innerText = level;
    drawMinkowski(level);
}

function main() {
    initWebGL();
    
    document.getElementById("decreaseLevel").onclick = () => changeLevel(-1);
    document.getElementById("increaseLevel").onclick = () => changeLevel(1);
    
    drawMinkowski(level);
}

// ✅ Gọi main() thay vì initWebGL để chạy toàn bộ chương trình
window.onload = main;
