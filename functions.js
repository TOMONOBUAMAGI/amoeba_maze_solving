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

// 円と矩形の衝突判定
function checkCollision(circle, wall) {
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
let externalMoveDirection = { x: 0, y: 0 };

// ボタンで方向セット
function setMoveDirection(x, y) {
  externalMoveDirection = { x, y };
}
