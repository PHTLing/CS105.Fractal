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
            gl_FragColor = vec4(0, 0, 1.0, 1.0);
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
    p1 = [-0.5, 0.5];
    p2 = [0.5, 0.5];
    p3 = [0.5, -0.5];
    p4 = [-0.5, -0.5];
    generateMinkowskiSegment(p1, p2, level);
    generateMinkowskiSegment(p2, p3, level);
    generateMinkowskiSegment(p3, p4, level);
    generateMinkowskiSegment(p4, p1, level);
    // vertices.push(0.8, 0.0);  // Đảm bảo thêm điểm cuối
}
function generateMinkowskiSegment(p1, p2, depth) {
    if (depth === 0) {
        vertices.push(...p1, ...p2);
        return;
    }
    let denlta = ((Math.abs(p2[0] - p1[0]))!==0) ? Math.abs(p2[0] - p1[0]): Math.abs(p2[1] - p1[1]);
    denlta = denlta / 4;
    console.log("delta", denlta);
    let A, B, C, D, E, F, G, H, I;
    // Ngang trái -> phải: x1<x2, y1=y2
    if (p1[0] < p2[0] && p1[1] === p2[1]) {
        console.log("Ngang trái -> phải: x1<x2, y1=y2");
        A = p1;
        B = p2;
        C = [A[0] + denlta, A[1]];
        D = [C[0] + denlta, C[1]];
        E = [D[0] + denlta, D[1]];
        F = [C[0], C[1] + denlta];
        G = [D[0], D[1] + denlta];
        H = [D[0], D[1] - denlta];
        I = [E[0], E[1] - denlta];  
    } // Ngang phải -> trái: x1>x2, y1=y2
    else if (p1[0] > p2[0] && p1[1] === p2[1]) {
        console.log("Ngang phải -> trái: x1>x2, y1=y2");
        A = p1;
        B = p2;
        C = [A[0] - denlta, A[1]];
        D = [C[0] - denlta, C[1]];
        E = [D[0] - denlta, D[1]];
        F = [C[0], C[1] - denlta];
        G = [D[0], D[1] - denlta];
        H = [D[0], D[1] + denlta];
        I = [E[0], E[1] + denlta];  
    }
    // Dọc trên -> dưới: x1=x2, y1>y2
    else if (p1[0] === p2[0] && p1[1] > p2[1]) {
        console.log("Dọc trên -> dưới: x1=x2, y1>y2");
        A = p1;
        B = p2;
        C = [A[0], A[1] - denlta];
        D = [C[0], C[1] - denlta];
        E = [D[0], D[1] - denlta];
        F = [C[0] + denlta, C[1]];
        G = [D[0] + denlta, D[1]];
        H = [D[0] - denlta, D[1]];
        I = [E[0] - denlta, E[1]];  
    }    
    // Dọc dưới -> trên: x1=x2, y1<y2
    else if (p1[0] === p2[0] && p1[1] < p2[1]) {
        console.log("Dọc dưới -> trên: x1=x2, y1<y2");
        A = p1;
        B = p2;
        C = [A[0], A[1] + denlta];
        D = [C[0], C[1] + denlta];
        E = [D[0], D[1] + denlta];
        F = [C[0] - denlta, C[1]];
        G = [D[0] - denlta, D[1]];
        H = [D[0] + denlta, D[1]];
        I = [E[0] + denlta, E[1]];
    }
    generateMinkowskiSegment(A, C, depth - 1);
    generateMinkowskiSegment(C, F, depth - 1);
    generateMinkowskiSegment(F, G, depth - 1);
    generateMinkowskiSegment(G, D, depth - 1);
    generateMinkowskiSegment(D, H, depth - 1);
    generateMinkowskiSegment(H, I, depth - 1);
    generateMinkowskiSegment(I, E, depth - 1);
    generateMinkowskiSegment(E, B, depth - 1);
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
