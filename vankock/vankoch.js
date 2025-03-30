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

function generateKochSnowflake(level) {
    vertices = [];
    const p1 = [-0.6, -0.4];
    const p2 = [0.6, -0.4];
    const p3 = [0.0, 0.6];
    generateKochSegment(p1, p2, level);
    generateKochSegment(p2, p3, level);
    generateKochSegment(p3, p1, level);
}

function generateKochSegment(p1, p2, level) {
    if (level === 0) {
        vertices.push(...p1, ...p2);
    } else {
        let ax = (2 * p1[0] + p2[0]) / 3;
        let ay = (2 * p1[1] + p2[1]) / 3;
        let bx = (p1[0] + 2 * p2[0]) / 3;
        let by = (p1[1] + 2 * p2[1]) / 3;
        let angle = -Math.PI / 3;
        let cx = (bx - ax) * Math.cos(angle) - (by - ay) * Math.sin(angle) + ax;
        let cy = (bx - ax) * Math.sin(angle) + (by - ay) * Math.cos(angle) + ay;
        
        generateKochSegment(p1, [ax, ay], level - 1);
        generateKochSegment([ax, ay], [cx, cy], level - 1);
        generateKochSegment([cx, cy], [bx, by], level - 1);
        generateKochSegment([bx, by], p2, level - 1);
    }
}

function drawKochSnowflake(level) {
    gl.clear(gl.COLOR_BUFFER_BIT);
    generateKochSnowflake(level);
    
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    
    const coord = gl.getAttribLocation(program, "coordinates");
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);
    
    gl.drawArrays(gl.LINES, 0, vertices.length / 2);
}

function changeLevel(delta) {
    level = Math.max(0, level + delta);
    // Giới hạn chỉ vẽ đến level 10
    if (level > 10)  {
        alert("⚠ Bạn đã vẽ đến giới hạn nhóm hiển thị. Hãy giảm level để tiếp tục!");
        level = 10;
        // Tôi muốn vô hiệu hóa nút tăng level khi đã vẽ đến level 10
        document.getElementById("increaseLevel").disabled = true;
    }
    else {
        document.getElementById("increaseLevel").disabled = false;
    }
    document.getElementById("levelDisplay").innerText = level;
    drawKochSnowflake(level);
}

function main() {
    initWebGL();

    document.getElementById("decreaseLevel").onclick = () => changeLevel(-1);
    document.getElementById("increaseLevel").onclick = () => changeLevel(1);
    drawKochSnowflake(level);
}

window.onload = main;
