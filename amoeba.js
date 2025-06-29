import { judgeNodeEdge, nodeBFS, getBetweenness, sigmoidFunc, setThickness, sumEdgeLength } from './functions.js';
import { wallSize, mazeWidth, mazeHeight, initConductanceValue, edgeDrawRatio, dt, gamma, maxFrameCount } from './global.js';

const amoebaCanvas = document.getElementById('amoeba-canvas');
const simulationStartBtn = document.getElementById('simulation-start-button');
const amoebaCanvasWidth = amoebaCanvas.width;
const amoebaCanvasHeight = amoebaCanvas.height;

const amoebaLengthText = document.getElementById('amoeba-route-length');

const ctx = amoebaCanvas.getContext('2d');

const mazeArray = window.mazeArray;
let judgedNodeEdge = judgeNodeEdge(mazeArray);
let judgedArray = judgedNodeEdge[0];
let nodeArray = judgedNodeEdge[1];
let edgeArray = [];
let mazeGraph = judgedNodeEdge[2];
let edgeId = 0;
let edgeLengthArray = [];

let animationFrame;

let conductanceArray; // コンダクタンスを扱う配列 edge太さ更新用&対角行列作成用
let conductanceMatrix; // コンダクタンス対角行列を扱う変数 流量計算用
let conductanceVector; // コンダクタンスベクトルを扱う変数
let beforePinv; // 疑似逆行列を求める行列を扱う変数
let flowVector; // edgeの原形質流量ベクトル

let growVector; // エッジ成長項行列
let shrinkVector; // エッジ減衰項行列
let growAndShrinkVector; // 成長項と減衰項の和を入れる行列

let frameCount;

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

function drawEdge(edgeArray) {
  ctx.strokeStyle = 'orange'; // 色をオレンジに指定
  edgeArray.forEach(edge => {
    let fromNode = nodeArray[edge.fromNodeId];
    let toNode = nodeArray[edge.toNodeId];

    ctx.beginPath();
    ctx.moveTo(fromNode.x, fromNode.y);
    ctx.lineTo(toNode.x, toNode.y);
    ctx.lineWidth = edge.thickness * edgeDrawRatio;
    ctx.stroke();
  });
}

function nextFrame() {
  if(frameCount >= maxFrameCount) {
    simulationStartBtn.textContent = 'finished';
    var sumLength = sumEdgeLength(edgeArray);
    amoebaLengthText.textContent = sumLength;
    return;
  }

  frameCount++;
  conductanceMatrix = math.matrix(math.diag(conductanceArray)); // コンダクタンス行列D edge数行 対角 流量計算用

  // 流量計算
  beforePinv = math.multiply(math.transpose(incidenceMatrix), conductanceMatrix, math.inv(edgeLengthMatrix), incidenceMatrix);
  flowVector = math.multiply(-1, conductanceMatrix, math.inv(edgeLengthMatrix), incidenceMatrix, math.pinv(beforePinv), sMatrix); // 流量ベクトル
  flowVector = math.transpose(flowVector);
  // 成長項、減衰項計算
  growVector = math.map(flowVector, (flow) => sigmoidFunc(flow)); // 成長項
  shrinkVector = math.multiply(conductanceVector, gamma); // 減衰項
  growAndShrinkVector = math.subtract(growVector, shrinkVector);
  conductanceVector = math.add(conductanceVector, math.multiply(growAndShrinkVector, dt));

  // コンダクタンスが 1.0e-06の場合は1.0e-07に置き換える
  conductanceVector = math.map(conductanceVector, (conductance) => conductance < 1.0e-06 ? 1.0e-07 : conductance);

  // 対角行列用配列を作成
  conductanceArray = conductanceVector.toArray()[0];

  setThickness(edgeArray, conductanceArray);

  ctx.clearRect(0, 0, amoebaCanvasWidth, amoebaCanvasHeight);
  drawWall();
  drawEdge(edgeArray);

  animationFrame = requestAnimationFrame(nextFrame);
}

drawWall();

for (let y = 0; y < mazeHeight; y++) {
  for (let x = 0; x < mazeWidth; x++) {
    // 各ノードのソースからの距離を算出する幅優先探索のために、ノード同士の繋がりを調べる
    if(judgedArray[y][x][0] == 1) { // 横エッジの場合
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
      edgeArray[edgeId] = new Edge(edgeId, leftNodeId, rightNodeId, edgeLength+1); //
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
      edgeArray[edgeId] = new Edge(edgeId, upperNodeId, lowerNodeId, edgeLength+1);
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

// 隣接行列の基になる配列作成
const incidenceArray =Array(edgeArray.length).fill(null).map(() => new Array(nodeArray.length).fill(0));
incidenceArray.forEach( (row, edgeIndex) => {
  let edge = edgeArray[edgeIndex];
  row[edge.fromNodeId] = 1;
  row[edge.toNodeId] = -1;
});

// ノードのsource/sink行列のための配列
const sArray = Array(nodeArray.length).fill(0);
sArray[0] = 1; // 迷路スタートノードはsource
sArray[sArray.length - 1] = -1; // 迷路ゴールノードはsink

conductanceArray = Array(edgeArray.length).fill(initConductanceValue);

const incidenceMatrix = math.matrix(incidenceArray); // 隣接行列A edge数行node数列
const sMatrix = math.matrix(sArray.map(x => [x])); // ノードのsource/sink行列s node数行1列
const edgeLengthMatrix = math.matrix(math.diag(edgeLengthArray)); // エッジの長さ行列L edge数行 対角
conductanceVector = math.matrix([conductanceArray]);

// エッジ太さ更新
setThickness(edgeArray, conductanceArray);

// エッジ描画
drawEdge(edgeArray);

frameCount = 0;

// ボタンクリックでシミュレーション開始
simulationStartBtn.addEventListener('click', function () {
  simulationStartBtn.disabled = true;
  simulationStartBtn.textContent = 'simulating...';
  // 繰り返し処理開始
  animationFrame = requestAnimationFrame(nextFrame);
});
