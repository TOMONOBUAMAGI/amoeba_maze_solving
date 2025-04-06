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

function judgeNodeEdge(mazeArray) {
  let returnArray = Array(mazeHeight).fill(null).map(() => new Array(mazeWidth).fill(-1));
  for (let y = 0; y < mazeHeight; y++) {
    for (let x = 0; x < mazeWidth; x++) {
      if(mazeArray[y][x]) continue; // 壁なら飛ばす

      upperCell = mazeArray[y-1][x];
      lowerCell = mazeArray[y+1][x];
      leftCell = mazeArray[y][x-1];
      rightCell = mazeArray[y][x+1];

      if(upperCell && lowerCell && !leftCell && !rightCell) {
        returnArray[y][x] = 1; // 横方向エッジ
      } else if(!upperCell && !lowerCell && leftCell && rightCell) {
        returnArray[y][x] = 2; // 縦方向エッジ
      } else {
        returnArray[y][x] = 0; // ノード
      }
    }
  }

  return returnArray;
}
