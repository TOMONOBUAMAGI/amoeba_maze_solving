import { judgeNodeEdge, nodeBFS, getBetweenness } from './functions.js';
import { wallSize, mazeWidth, mazeHeight } from './global.js';

const amoebaeCanvas = document.querySelector('#amoebae-canvas');

const ctx = amoebaeCanvas.getContext('2d');

const mazeArray = window.mazeArray;
let judgedNodeEdge = judgeNodeEdge(mazeArray);
let judgedArray = judgedNodeEdge[0];
let nodeArray = judgedNodeEdge[1];
let edgeArray = [];
let mazeGraph = judgedNodeEdge[2];
let edgeId = 0;
let edgeLengthArray = [];

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
        edgeLength++; // 右に進む
        if(judgedArray[y][x+edgeLength][0] == 1) { // 右もエッジだった場合
          judgedArray[y][x+edgeLength][0] = -2 // 左のエッジと合わせて一つのエッジと見なすため、横エッジ探索の対象外とする
        } else {
          break;
        }
      }

      let rightNodeId = judgedArray[y][x+edgeLength][1];

      nodeArray[leftNodeId].linkedNodeIds.push(rightNodeId);
      nodeArray[rightNodeId].linkedNodeIds.push(leftNodeId);
      mazeGraph.addEdge(String(rightNodeId), String(leftNodeId));
      edgeArray[edgeId] = new Edge(edgeId, leftNodeId, rightNodeId, edgeLength);
      edgeId++;
    }

    else if(judgedArray[y][x][0] == 2) { // 縦エッジの場合
      let upperNodeId = judgedArray[y-1][x][1];
      let edgeLength = 0;
      while(true) {
        edgeLength++; // 下に進む
        if(judgedArray[y+edgeLength][x][0] == 2) { // 下もエッジだった場合
          judgedArray[y+edgeLength][x][0] = -2 // 上のエッジと合わせて一つのエッジと見なすため、上エッジ探索の対象外とする
        } else {
          break;
        }
      }

      let lowerNodeId = judgedArray[y+edgeLength][x][1];

      nodeArray[upperNodeId].linkedNodeIds.push(lowerNodeId);
      nodeArray[lowerNodeId].linkedNodeIds.push(upperNodeId);
      mazeGraph.addEdge(String(lowerNodeId), String(upperNodeId));
      edgeArray[edgeId] = new Edge(edgeId, upperNodeId, lowerNodeId, edgeLength);
      edgeId++;
    }
  }
}
nodeArray = nodeBFS(nodeArray); // 各ノードの媒介中心性を計算

const nodeBetweennessArray = getBetweenness(mazeGraph);

// 隣接行列のためにエッジのfromノード, toノードを判定, エッジの長さを配列に入れる
edgeArray.forEach(edge => {
  edgeLengthArray[edge.id] = edge.length;
  let beforeFromNodeId = edge.fromNodeId;
  let beforeToNodeId = edge.toNodeId;
  if (nodeArray[beforeFromNodeId].distanceFromSource > nodeArray[beforeToNodeId].distanceFromSource) {
    edge.fromNodeId = beforeToNodeId;
    edge.toNodeId = beforeFromNodeId;
  } else if (nodeArray[beforeFromNodeId].distanceFromSource == nodeArray[beforeToNodeId].distanceFromSource) {
    if (nodeBetweennessArray[beforeFromNodeId] < nodeBetweennessArray[beforeToNodeId]) {
      edge.fromNodeId = beforeToNodeId;
      edge.toNodeId = beforeFromNodeId;
    }
  }
});

// 隣接行列作成
const incidenceArray =Array(edgeArray.length).fill(null).map(() => new Array(nodeArray.length).fill(0));
incidenceArray.forEach( (row, edgeIndex) => {
  let edge = edgeArray[edgeIndex];
  row[edge.fromNodeId] = 1;
  row[edge.toNodeId] = -1;
});

const incidenceMatrix = math.matrix(incidenceArray);

ctx.fillStyle = "#FF0000";
ctx.fill();
