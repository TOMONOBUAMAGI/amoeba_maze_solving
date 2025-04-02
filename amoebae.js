const amoebaeCanvas = document.querySelector('#amoebae-canvas');
// キャンパスに描画するためのCanvasRenderingContext2Dオブジェクトを取得するメソッド
// 二次元グラフィックを描画するために2dの指定
const ctx = amoebaeCanvas.getContext('2d');
let x = amoebaeCanvas.width / 2;
let y = amoebaeCanvas.height - 30;
let dx = 5;
let dy = 2;
let radius = 20;
let af;

//----- ボールの描画 -----//
function drawWall() {
  // 新しいパスを作成する際の先頭を指定
  ctx.beginPath();

  for (let i = 0; i < mazeWidth; i++) {
    for (let j = 0; j < mazeHeight; j++) {
      if (mazeArray[i][j]) {
        ctx.rect(28+wallSize*i, 10+wallSize*j, wallSize, wallSize);
      }
    }
  }

  // 色の指定
  ctx.fillStyle = "#000000";
  // 図形の塗りつぶし
  ctx.fill();
}

drawWall();
