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