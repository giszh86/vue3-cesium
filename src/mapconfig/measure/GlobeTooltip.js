let GlobeTooltip = function(frameDiv) {
  this.init.apply(this, arguments);
};

GlobeTooltip.prototype = {
  _frameDiv: null,
  _div: null,
  _title: null,
  init: function(frameDiv) {
    let _this = this;

    let div = document.createElement("div");
    div.className = "twipsy-right";
    div.style.position = "absolute";

    let arrow = document.createElement("div");
    arrow.className = "twipsy-arrow";
    div.appendChild(arrow);

    let title = document.createElement("div");
    title.className = "twipsy-inner";
    div.appendChild(title);

    frameDiv.appendChild(div);

    _this._div = div;
    _this._title = title;
    _this._frameDiv = frameDiv;
  },
  setVisible: function(visible) {
    this._div.style.display = visible ? "block" : "none";
  },
  showAt: function(position, message) {
    if (position && message) {
      this.setVisible(true);
      this._title.innerHTML = message;
      this._div.style.left = position.x + 10 + "px";
      this._div.style.top = position.y - this._div.clientHeight / 2 + "px";
    }
  }
};

export { GlobeTooltip };
