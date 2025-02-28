phina.define("MyCircle", {
  // CircleShapeクラス(円を描画するクラス)を継承
  superClass: "CircleShape",

  init: function(init_x, init_y) {
    this.superInit();
    this.x = init_x;
    this.y = init_y;
    this.fill = "red";
    this.radius = 4; // 半径
  }
});
