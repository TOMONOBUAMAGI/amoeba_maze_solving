import { myCircleRadius } from '../global.js';

phina.define("MyCircle", {
  superClass: "DisplayElement",

  init: function(init_x, init_y) {
    this.superInit();
    this.x = init_x;
    this.y = init_y;

    this.circleShape = CircleShape({
      radius: myCircleRadius,
      fill: "red",
    }).addChildTo(this);
  }
});