import { wallSize } from '../global.js';

phina.define("Trail", {
  superClass: "DisplayElement",

  init: function(init_x, init_y) {
    this.superInit();
    this.x = init_x;
    this.y = init_y;

    // 外枠の長方形
    this.outerRect = RectangleShape({
      width: wallSize,
      height: wallSize,
      fill: "rgba(255, 0, 0, 0.25)", //軌跡の色
      stroke: null,
    }).addChildTo(this);

    // 内枠の長方形（外枠の内部に配置）
    this.innerRect = RectangleShape({
      width: wallSize * 0.9,
      height: wallSize * 0.9,
      fill: "rgba(255, 255, 255, 0)",
      stroke: "grey",  // 外枠の色
      strokeWidth: wallSize * 0.1,
    }).addChildTo(this);
  }
});
