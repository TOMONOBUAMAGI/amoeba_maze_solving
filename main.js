import { mazeArray } from './functions.js';
import { WIDTH, HEIGHT, wallSize, SPEED, mazeWidth, mazeHeight } from './global.js';

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
    // 壁を配置
    for (let y = 0; y < mazeWidth; y++) {
      for (let x = 0; x < mazeHeight; x++) {
        if (mazeArray[y][x]) {
          wallArray.push(Wall(28+wallSize*x, 20+wallSize*y).addChildTo(this));
        }
      }
    }

    // 当たり判定で使用
    const wallCount = wallArray.length;

    // フレーム毎の処理
    this.update = function(app) {
      var key = app.keyboard;

      var nextMyCircleX = myCircle.x;
      var nextMyCircleY = myCircle.y;

      if (key.getKey('left')) {
        nextMyCircleX -= SPEED;
      }

      if (key.getKey('right')) {
        nextMyCircleX += SPEED;
      }

      if (key.getKey('up')) {
        nextMyCircleY -= SPEED;
      }

      if (key.getKey('down')) {
        nextMyCircleY += SPEED;
      }

      // 当たり判定
      var nextMyCircle = MyCircle(nextMyCircleX, nextMyCircleY);

      for(let i = 0; i < wallCount; i++) {
        if (wallArray[i].hitTestElement(nextMyCircle)) {
          return null; // 移動先が壁だったらupdate終了 次のフレームへ（移動しない）
        }
        else {
          continue;
        }
      }

      // 座標更新
      myCircle.x = nextMyCircleX;
      myCircle.y = nextMyCircleY;
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
