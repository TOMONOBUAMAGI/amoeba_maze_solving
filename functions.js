import Graph from 'https://esm.sh/graphology';
import betweenness from 'https://esm.sh/graphology-metrics/centrality/betweenness';
import { mazeWidth, mazeHeight, wallSize, qH, mu, growedThicknessThreshold } from './global.js';

// 迷路ランダム生成
function ConstructMaze() {
  let returnArray = Array(mazeHeight).fill(null).map(() => new Array(mazeWidth).fill(false));
  for (let y = 0; y < mazeHeight; y++) {
    const directionNum = y==2 ? 4 : 3;
    for (let x = 0; x < mazeWidth; x++) {
      if(x==0 || x==mazeWidth-1 || y==0 || y==mazeHeight-1) { // 外壁
        returnArray[y][x] = true;
      } else if(x%2==0 && y%2==0 && x<mazeWidth-1 && y<mazeHeight) { // 内壁
        let neighborCellX;
        let neighborCellY;

        const randomN = Math.floor(Math.random() * directionNum);
        if (randomN==0) { // 右
          neighborCellX = x+1;
          neighborCellY = y;
        } else if(randomN==1) { // 下
          neighborCellX = x;
          neighborCellY = y+1;
        } else if(randomN==2) { // 左
          neighborCellX = x-1;
          neighborCellY = y;
        } else { // 上
          neighborCellX = x;
          neighborCellY = y-1;
        }

        returnArray[y][x] = true;
        returnArray[neighborCellY][neighborCellX] = true;
      }
    }
  }

  return returnArray;
}

export const mazeArray = ConstructMaze();

// 各マスについて、ノードかエッジかを判定
export function judgeNodeEdge(mazeArray) {
  let judgedArray = Array(mazeHeight).fill(null).map(() => new Array(mazeWidth).fill(-1));
  let nodeArray = [];
  let nodeId = 0;
  let graph = new Graph(); // betweennessで媒介中心性を求めるためにgraphologyのオブジェクトを生成

  for (let y = 0; y < mazeHeight; y++) {
    for (let x = 0; x < mazeWidth; x++) {
      if(mazeArray[y][x]) continue; // 壁なら飛ばす

      var upperCell = mazeArray[y-1][x];
      var lowerCell = mazeArray[y+1][x];
      var leftCell = mazeArray[y][x-1];
      var rightCell = mazeArray[y][x+1];

      if(upperCell && lowerCell && !leftCell && !rightCell) {
        judgedArray[y][x] = [1, -1]; // 横方向エッジ 配列2番目の値はエッジid初期値
      } else if(!upperCell && !lowerCell && leftCell && rightCell) {
        judgedArray[y][x] = [2, -1]; // 縦方向エッジ 配列2番目の値はエッジid初期値
      } else {
        judgedArray[y][x] = [0, nodeId]; // ノード
        nodeArray.push(new Node(nodeId, 28+wallSize*(x+0.5), 10+wallSize*(y+0.5)));
        graph.addNode(String(nodeId));
        nodeId++;
      }
    }
  }

  return [judgedArray, nodeArray, graph];
}

// 当たり判定
export function checkCollision(circle, wall) {
  var circleX = circle.x;
  var circleY = circle.y;
  var radius = circle.circleShape.radius;

  var rectX = wall.x - wall.outerRect.width / 2;
  var rectY = wall.y - wall.outerRect.height / 2;
  var rectWidth = wall.outerRect.width;
  var rectHeight = wall.outerRect.height;

  // 最も近い矩形の端を求める
  var closestX = Math.max(rectX, Math.min(circleX, rectX + rectWidth));
  var closestY = Math.max(rectY, Math.min(circleY, rectY + rectHeight));

  // その点と円の中心との距離を計算
  var dx = circleX - closestX;
  var dy = circleY - closestY;
  var distance = Math.sqrt(dx * dx + dy * dy);

  // 円の半径と距離が一致したら衝突
  return distance < radius;
}

// プレイヤー移動方向を外部ボタンで制御するためのグローバル変数
export let externalMoveDirection = { x: 0, y: 0 };

// ボタンで円形を操作するための変数
export function setMoveDirection(x, y) {
  externalMoveDirection = { x, y };
}

// sourceからの最短距離を幅優先探索で算出
export function nodeBFS(nodeArray) {
  let visitingNodes = new Set([nodeArray[0]]); // ループで訪れるノードの候補を入れる配列
  let visited = new Set(); // 既に訪れたノードを入れる配列
  let distanceFromSource = 0;

  while(visited.size < nodeArray.length) { // 全てのノードを探索するまで繰り返し
    let nextVisitingNodes = new Set();

    visitingNodes.forEach(node => {

      if(!visited.has(node.id)) {
        node.distanceFromSource = distanceFromSource; // sourceからの最短距離を記録
        visited.add(node.id);

        for (const linkedNodeId of node.linkedNodeIds) {
          nextVisitingNodes.add(nodeArray[linkedNodeId]);
        }
      }
    });

    visitingNodes = nextVisitingNodes;
    distanceFromSource++;
  }

  return nodeArray;
}

export function getBetweenness(mazeGraph) {
  return betweenness(mazeGraph);
}

export function sigmoidFunc(flow) {
  let abs_flow = Math.abs(flow)
  let powed_flow = (abs_flow / qH) ** mu;
  return powed_flow / (1 + powed_flow);
}

export function setThickness(edgeArray, conductanceArray) {
  edgeArray.forEach( (edge, i) => {
    edge.thickness = conductanceArray[i] ** 0.25;
  });
}

export function sumEdgeLength(edgeArray) {
  var sumLength = 0;
  edgeArray.forEach( edge => {
    if (edge.thickness > growedThicknessThreshold) {
      sumLength += edge.length;
    }
  });

  return sumLength;
}
