const amoebaeCanvas = document.querySelector('#amoebae-canvas');
// キャンパスに描画するためのCanvasRenderingContext2Dオブジェクトを取得するメソッド
// 二次元グラフィックを描画するために2dの指定
const ctx = amoebaeCanvas.getContext('2d');

let judgedNodeEdge = judgeNodeEdge(mazeArray);
let judgedArray = judgedNodeEdge[0];
let nodeArray = judgedNodeEdge[1];
let edgeArray = [];

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
    // ノード描画
    if(judgedArray[y][x][0] == 0) {
      ctx.rect(28+wallSize*x+6, 10+wallSize*y+6, 4, 4);
    }

    // 各ノードのソースからの距離を算出する幅優先探索のために、ノード同士の繋がりを調べる
    else if(judgedArray[y][x][0] == 1) { // 横エッジの場合
      let leftNodeId = judgedArray[y][x-1][1];
      let edgeLength = 0;
      while(true) {
        edgeLength++;
        if(judgedArray[y][x+edgeLength][0] == 1) {
          judgedArray[y][x+edgeLength][0] = -2 // 左のエッジと合わせて一つのエッジと見なすため、横エッジ探索の対象外とする
        } else {
          break;
        }
      }

      let rightNodeId = judgedArray[y][x+edgeLength][1];

      nodeArray[leftNodeId].linkedNodeIds.push(rightNodeId);
      nodeArray[rightNodeId].linkedNodeIds.push(leftNodeId);
    }

    else if(judgedArray[y][x][0] == 2) { // 縦エッジの場合
      let upperNodeId = judgedArray[y-1][x][1];
      let edgeLength = 0;
      while(true) {
        edgeLength++;
        if(judgedArray[y+edgeLength][x][0] == 2) {
          judgedArray[y+edgeLength][x][0] = -2 // 上のエッジと合わせて一つのエッジと見なすため、上エッジ探索の対象外とする
        } else {
          break;
        }
      }

      let lowerNodeId = judgedArray[y+edgeLength][x][1];

      nodeArray[upperNodeId].linkedNodeIds.push(lowerNodeId);
      nodeArray[lowerNodeId].linkedNodeIds.push(upperNodeId);
    }
  }
}

console.log(nodeArray);

ctx.fillStyle = "#FF0000";
ctx.fill();
