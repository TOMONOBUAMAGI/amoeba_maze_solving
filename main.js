// ゲームウィンドウのサイズ
const WIDTH = 960;
const HEIGHT = 640;

// phina.js をグローバル領域に展開
phina.globalize();

const SPEED = 10;
const mazeWidth = 25;
const mazeHeight = 13;

let mazeArray = ConstructMaze();

console.log(mazeArray);

phina.define('MainScene', {
  superClass: 'DisplayScene',
  // 初期設定
  init: function() {
    this.superInit({
      width: WIDTH,
      height: HEIGHT,
    });

    // 背景色を指定
    this.backgroundColor = '#EEEEEE';
    // 操作する円を配置
    this.myCircle = MyCircle(10, 10).addChildTo(this);
    // 青い壁を配置
    this.wall = Wall(200, 200).addChildTo(this);
  },

  // フレーム毎の処理
  update: function(app) {
    var key = app.keyboard;
    var myCircle = this.myCircle;
    var wall = this.wall;

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

    var nextMyCircle = MyCircle(nextMyCircleX, nextMyCircleY);

    // 移動先が壁の内部だった場合移動させない
    if (wall.hitTestElement(nextMyCircle)) {
      return true;
    }
    else {
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
