phina.define("Trail", {
  superClass: "DisplayElement",  // DisplayElement を継承

  // 初期化
  init: function(x, y, color) {
    this.superInit();

    this.x = x;
    this.y = y;
    this.color = color || 'rgba(255, 0, 0, 0.5)'; // デフォルトは赤色で半透明
    this.radius = 1;  // 軌跡のサイズ

    // 軌跡を描画するための円形シェイプを作成
    this.shape = CircleShape(this.radius).addChildTo(this);
    this.shape.fill = this.color;
    this.shape.stroke = null;
  },

  // 更新
  update: function() {
    this.shape.x = this.x;
    this.shape.y = this.y;
  },
  
  // 軌跡の位置を更新
  setPosition: function(x, y) {
    this.x = x;
    this.y = y;
  }
});