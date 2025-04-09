// ゲームウィンドウのサイズ
const WIDTH = 375;
const HEIGHT = 350;

// 壁のサイズ
const wallSize = 16;

// プレイヤー速さ,wallSizeとおなじ
const SPEED = 16;

// 迷路サイズ
const mazeWidth = 21;
const mazeHeight = 21;

let mazeArray = ConstructMaze();
let wallArray = []; // 当たり判定用

phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit({
      width: WIDTH,
      height: HEIGHT,
    });

    // 背景色を指定
    this.backgroundColor = '#EEEEEE';
    // 操作する円を配置
    var myCircle = MyCircle(43, 35).addChildTo(this);
    // 軌跡を描画するためのTrailインスタンスを作成
    var trail = Trail(myCircle.x, myCircle.y).addChildTo(this);

    // 青い壁を配置
    for (let i = 0; i < mazeWidth; i++) {
      for (let j = 0; j < mazeHeight; j++) {
        if (mazeArray[i][j]) {
          wallArray.push(Wall(28+wallSize*i, 20+wallSize*j).addChildTo(this));
        }
      }
    }

    // 当たり判定で使用
    const wallCount = wallArray.length;

    // キーの状態を保持する変数
    var moveDirection = { x: 0, y: 0 };

    // setInterval で移動処理を呼び出す
    var moveInterval = setInterval(() => {
      if (moveDirection.x !== 0 || moveDirection.y !== 0) {
        // 移動先の座標を計算
        var nextMyCircleX = myCircle.x + moveDirection.x * SPEED;
        var nextMyCircleY = myCircle.y + moveDirection.y * SPEED;

        // 当たり判定
        var nextMyCircle = MyCircle(nextMyCircleX, nextMyCircleY);

        var canMove = true;
        for (let i = 0; i < wallCount; i++) {
          if (wallArray[i].hitTestElement(nextMyCircle)) {
            canMove = false; // 壁に当たる場合は移動できない
            break;
          }
        }

        // 移動可能な場合のみ座標を更新
        if (canMove) {
          myCircle.x = nextMyCircleX;
          myCircle.y = nextMyCircleY;
        }

        // 軌跡を描画
        trail.x = myCircle.x;
        trail.y = myCircle.y;
      }
    }, 150); // 150ms ごとに移動更新

    // フレーム毎の処理 (キー入力の監視)
    this.update = function(app) {
      var key = app.keyboard;

      // 移動方向を更新
      if (key.getKey('left')) {
        moveDirection = { x: -1, y: 0 }; // 左方向
      } else if (key.getKey('right')) {
        moveDirection = { x: 1, y: 0 }; // 右方向
      } else if (key.getKey('up')) {
        moveDirection = { x: 0, y: -1 }; // 上方向
      } else if (key.getKey('down')) {
        moveDirection = { x: 0, y: 1 }; // 下方向
      } else {
        moveDirection = { x: 0, y: 0 };
      }
    }
  }
});

// メイン処理
phina.main(function() {
  // アプリケーション生成
  var app = GameApp({
    width: WIDTH,
    height: HEIGHT,
    query: "#game-canvas", // id属性に 'game-canvas'を持つcanvasタグに描画する
    startLabel: 'main', // メインシーンから開始する
    fit: false, // HTML内に固定する
  });
  // アプリケーション実行
  app.run();
});
