const amoebaeCanvas = document.querySelector('#amoebae-canvas');
// キャンパスに描画するためのCanvasRenderingContext2Dオブジェクトを取得するメソッド
// 二次元グラフィックを描画するために2dの指定
const ctx = amoebaeCanvas.getContext('2d');
let nodeArray = judgeNodeEdge(mazeArray);
console.log(nodeArray);

function drawWall() {
  // 新しいパスを作成する際の先頭を指定
  ctx.beginPath();

  for (let y = 0; y < mazeWidth; y++) {
    for (let x = 0; x < mazeHeight; x++) {
      if (mazeArray[y][x]) {
        ctx.rect(28+wallSize*x, 10+wallSize*y, wallSize, wallSize);
      }
    }
  }

  // 色の指定
  ctx.fillStyle = "#000000";
  // 図形の塗りつぶし
  ctx.fill();
}

drawWall();

ctx.beginPath();

for (let y = 0; y < mazeHeight; y++) {
  for (let x = 0; x < mazeWidth; x++) {
    if(nodeArray[y][x] == 0) {
      ctx.rect(28+wallSize*x+6, 10+wallSize*y+6, 4, 4);
    }
  }
}

ctx.fillStyle = "#FF0000";
ctx.fill();
