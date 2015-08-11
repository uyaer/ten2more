var LightLine = cc.Layer.extend({
    /**
     * @type cc.DrawNode
     */
    drawNode: null,
    ctor: function () {
        this._super();

        this.drawNode = new cc.DrawNode();
        this.addChild(this.drawNode);
    },

    /**
     * 根据选中的box绘制线条
     * @param boxs
     */
    drawSelectingLine: function (boxs) {
        this.drawNode.clear();
        if (!boxs || boxs.length < 2)return;
        for (var i = 0; i < boxs.length - 1; i++) {
            /**@type Box*/
            var box = boxs[i];
            /**@type Box*/
            var boxNext = boxs[i + 1];
            this.drawNode.drawSegment(cc.p(box.baseX, box.baseY), cc.p(boxNext.baseX, boxNext.baseY), 5, cc.color(255, 255, 255, 128));
        }
    }
})