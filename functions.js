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

// 各マスについて、ノードかエッジかを判定
function judgeNodeEdge(mazeArray) {
  let judgedArray = Array(mazeHeight).fill(null).map(() => new Array(mazeWidth).fill(-1));
  let nodeArray = [];
  let nodeId = 0;

  for (let y = 0; y < mazeHeight; y++) {
    for (let x = 0; x < mazeWidth; x++) {
      if(mazeArray[y][x]) continue; // 壁なら飛ばす

      var upperCell = mazeArray[y-1][x];
      var lowerCell = mazeArray[y+1][x];
      var leftCell = mazeArray[y][x-1];
      var rightCell = mazeArray[y][x+1];

      if(upperCell && lowerCell && !leftCell && !rightCell) {
        judgedArray[y][x] = [1, -1]; // 横方向エッジ
      } else if(!upperCell && !lowerCell && leftCell && rightCell) {
        judgedArray[y][x] = [2, -1]; // 縦方向エッジ
      } else {
        judgedArray[y][x] = [0, nodeId]; // ノード
        nodeArray.push(new Node(nodeId));
        nodeId++;
      }
    }
  }

  return [judgedArray, nodeArray];
}

// sourceからの最短距離を幅優先探索で算出
function nodeBFS(nodeArray) {
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
