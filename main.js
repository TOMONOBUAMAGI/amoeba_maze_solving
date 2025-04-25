// ゲームウィンドウのサイズ
const WIDTH = 375;
const HEIGHT = 350;

// 壁のサイズ
const wallSize = 16;

// プレイヤー速さ
const SPEED = 16;
const myCircle_radius = 6;

// 移動間隔（ミリ秒）
const MOVE_INTERVAL = 200;

// 迷路サイズ
const mazeWidth = 21;
const mazeHeight = 21;

let mazeArray = ConstructMaze();
let wallArray = [];

phina.define('MainScene', {
  superClass: 'DisplayScene',
  init: function() {
    this.superInit({
      width: WIDTH,
      height: HEIGHT,
    });

    // 背景色
    this.backgroundColor = '#EEEEEE';
    
    // プレイヤー初期位置
    const START_X = 28 + wallSize;
    const START_Y = 20 + wallSize;
    const GOAL_X = START_X + 18 * wallSize;
    const GOAL_Y = START_Y + 18 * wallSize;

    // プレイヤー
    var myCircle = MyCircle(START_X, START_Y).addChildTo(this);
    this.trails = [];

    // 壁配置
    for (let i = 0; i < mazeWidth; i++) {
      for (let j = 0; j < mazeHeight; j++) {
        if (mazeArray[i][j]) {
          wallArray.push(Wall(28 + wallSize * i, 20 + wallSize * j).addChildTo(this));
        }
      }
    }

    const wallCount = wallArray.length;
    var lastPosition = { x: myCircle.x, y: myCircle.y };
    var lastMoveTime = 0;

    // 入力状態管理
    this.inputState = {
      left: false,
      right: false,
      up: false,
      down: false
    };

    // ボタンイベント設定
    const setButtonState = (direction, state) => {
      this.inputState[direction] = state;
    };

    document.getElementById('move-left').addEventListener('mousedown', () => setButtonState('left', true));
    document.getElementById('move-left').addEventListener('mouseup', () => setButtonState('left', false));
    document.getElementById('move-left').addEventListener('mouseleave', () => setButtonState('left', false));

    document.getElementById('move-right').addEventListener('mousedown', () => setButtonState('right', true));
    document.getElementById('move-right').addEventListener('mouseup', () => setButtonState('right', false));
    document.getElementById('move-right').addEventListener('mouseleave', () => setButtonState('right', false));

    document.getElementById('move-up').addEventListener('mousedown', () => setButtonState('up', true));
    document.getElementById('move-up').addEventListener('mouseup', () => setButtonState('up', false));
    document.getElementById('move-up').addEventListener('mouseleave', () => setButtonState('up', false));

    document.getElementById('move-down').addEventListener('mousedown', () => setButtonState('down', true));
    document.getElementById('move-down').addEventListener('mouseup', () => setButtonState('down', false));
    document.getElementById('move-down').addEventListener('mouseleave', () => setButtonState('down', false));

    this.update = function(app) {
      var key = app.keyboard;
      var currentTime = (new Date()).getTime();

      // 入力方向計算
      var moveDirection = {
        x: (this.inputState.left ? -1 : 0) + (this.inputState.right ? 1 : 0),
        y: (this.inputState.up ? -1 : 0) + (this.inputState.down ? 1 : 0)
      };

      // キーボード入力との統合
      if (key.getKey('left')) moveDirection.x = -1;
      if (key.getKey('right')) moveDirection.x = 1;
      if (key.getKey('up')) moveDirection.y = -1;
      if (key.getKey('down')) moveDirection.y = 1;

      // 移動処理
      if ((moveDirection.x !== 0 || moveDirection.y !== 0) &&
          (currentTime - lastMoveTime) >= MOVE_INTERVAL) {
        
        var nextMyCircleX = myCircle.x + moveDirection.x * SPEED;
        var nextMyCircleY = myCircle.y + moveDirection.y * SPEED;
        var nextMyCircle = MyCircle(nextMyCircleX, nextMyCircleY);

        var canMove = true;
        for (let i = 0; i < wallCount; i++) {
          if (checkCollision(nextMyCircle, wallArray[i])) {
            canMove = false;
            break;
          }
        }

        if (canMove) {
          var isNewArea = true;

          if (this.trails.length > 0) {
            let lastTrail = this.trails[this.trails.length - 1];
            if (lastTrail.x === nextMyCircleX && lastTrail.y === nextMyCircleY) {
              lastTrail.remove();
              this.trails.pop();
              isNewArea = false;
            }
          }

          if (isNewArea) {
            var newTrail = Trail(lastPosition.x, lastPosition.y).addChildTo(this);
            this.trails.push(newTrail);
          }

          myCircle.x = nextMyCircleX;
          myCircle.y = nextMyCircleY;
          lastPosition = { x: myCircle.x, y: myCircle.y };
          lastMoveTime = currentTime;

          if (myCircle.x == GOAL_X && myCircle.y == GOAL_Y) {
            console.log(this.trails.length);
          }
        }
      }
    };
  }
});


phina.main(function() {
  var app = GameApp({
    width: WIDTH,
    height: HEIGHT,
    query: "#game-canvas",
    startLabel: 'main',
    fit: false,
  });
  app.run();
});
