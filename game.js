import { checkCollision, externalMoveDirection, setMoveDirection } from './functions.js';
import { WIDTH, HEIGHT, wallSize, SPEED, mazeWidth, mazeHeight } from './global.js';

const gameLengthText = window.parent.document.getElementById('game-route-length');
const mazeArray = window.mazeArray;
const startColor = "#ffd700";
const goalColor = "#87cefa";

const startX = 28+wallSize;
const startY = 20+wallSize;
const goalX = 28+(mazeWidth-2)*wallSize;
const goalY = 20+(mazeHeight-2)*wallSize;
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
    // スタート地点を表す正方形
    var start = phina.display.RectangleShape({
      width: wallSize,
      height: wallSize,
      fill: startColor,
      strokeWidth: 0,
    }).addChildTo(this);

    // ゴール地点を表す正方形
    var goal = phina.display.RectangleShape({
      width: wallSize,
      height: wallSize,
      fill: goalColor,
      strokeWidth: 0,
    }).addChildTo(this);

    start.setPosition(startX, startY);
    goal.setPosition(goalX, goalY);

    // 操作する円を配置
    var myCircle = MyCircle(startX, startY).addChildTo(this);

    // 軌跡を描画するためのTrailインスタンスを格納する配列
    this.trails = [];

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

    // キーの状態を保持する変数
    var moveDirection = { x: 0, y: 0 };

    // プレイヤーの前回の位置
    var lastPosition = { x: myCircle.x, y: myCircle.y };

    // フレーム毎の処理 (キー入力の監視)
    this.update = function(app) {
      // 移動方向を更新
      if (externalMoveDirection.x !== 0 || externalMoveDirection.y !== 0) {
        // 外部ボタン指示
        moveDirection = { x: externalMoveDirection.x, y: externalMoveDirection.y };
        setMoveDirection(0, 0); // 一度使ったらリセット
      } else {
        moveDirection = { x: 0, y: 0 };
      }

      if (moveDirection.x !== 0 || moveDirection.y !== 0) {
        // 移動先の座標を計算
        var nextMyCircleX = myCircle.x + moveDirection.x * SPEED;
        var nextMyCircleY = myCircle.y + moveDirection.y * SPEED;

        // 当たり判定
        var nextMyCircle = MyCircle(nextMyCircleX, nextMyCircleY);

        var canMove = true;
        for (let i = 0; i < wallCount; i++) {
          if (checkCollision(nextMyCircle, wallArray[i])) {
            canMove = false; // 壁に当たる場合は移動できない
            break;
          }
        }

        // 移動可能な場合のみ座標を更新
        if (canMove) {
          var isNewArea = true;

          // 移動先が直前にいた場所の場合
          if (this.trails.length > 0) {
            let lastTrail = this.trails[this.trails.length - 1];
            if (lastTrail.x === nextMyCircleX && lastTrail.y === nextMyCircleY) {
              lastTrail.remove(); // 移動先(直前)のtrailを画面から削除
              this.trails.pop(); // 移動先(直前)のtrailを配列から削除
              isNewArea = false;
            }
          }

          // 移動先が直前にいた場所でない場合
          if (isNewArea) {
            // 前回の位置に新しいTrailを描画
            var newTrail = Trail(lastPosition.x, lastPosition.y).addChildTo(this);
            this.trails.push(newTrail);
          }

          myCircle.x = nextMyCircleX;
          myCircle.y = nextMyCircleY;
          // プレイヤーの新しい位置を記録
          lastPosition = { x: myCircle.x, y: myCircle.y };

          //プレーヤーがゴールした時の移動距離の取得
          if(myCircle.x == goalX && myCircle.y == goalY){
            gameLengthText.textContent = this.trails.length;
          }
        }
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
