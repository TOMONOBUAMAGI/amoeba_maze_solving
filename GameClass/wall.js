import { wallSize } from '../global.js';

phina.define("Wall", {
  // RectangleShapeクラス(長方形を描画するクラス)を継承
  superClass: "RectangleShape",

  init: function(init_x, init_y) {
    this.superInit();
    this.x = init_x;
    this.y = init_y;
    this.fill = "black";
    this.width = wallSize;
    this.height = wallSize;
  }
});
