var GameScene = cc.Scene.extend({
    /**
     * @type Array
     */
    boxArr: null,
    /**
     * 选中的box
     * @type Array
     */
    selectBoxArr: null,
    /**
     * 上一个选中的box
     * @type Box
     */
    lastSelectBox: null,
    /**
     * @type LightLine
     */
    lightLine: null,
    ctor: function () {
        this._super();

        this.makeBackground();
        this.makeBox();
    },

    onEnter: function () {
        this._super();

        //event
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.onTouchBeganHandler.bind(this),
            onTouchMoved: this.onTouchMovedHandler.bind(this),
            onTouchEnded: this.onTouchEndedHandler.bind(this)
        }, this);
    },

    /**
     *创建背景
     */
    makeBackground: function () {
        var colorBg = new cc.LayerColor(hex2Color(0xb8af9e), Const.WIN_W, Const.WIN_H);
        this.addChild(colorBg);
        this.lightLine = new LightLine();
        this.addChild(this.lightLine, 1);
    },

    makeBox: function () {
        this.boxArr = [];
        var box;
        var root = new cc.Layer();
        this.addChild(root, 2);
        for (var i = 0; i < Const.ROW; i++) {
            var line = [];
            this.boxArr.push(line);
            for (var j = 0; j < Const.ROW; j++) {
                box = new Box(i, j);
                line.push(box);
                box.updateNum(randomInt(1, 5));
                box.x = box.baseX;
                box.y = box.baseY;
                root.addChild(box);
            }
        }
    },

    /**
     * 触摸事件
     * @param touch {cc.Touch}
     * @param event {cc.Event}
     */
    onTouchBeganHandler: function (touch, event) {
        var box = this.getBoxByPos(touch.getLocation());
        if (box) {
            box.setSelected(true);
            this.selectBoxArr = [box];
            this.lastSelectBox = box;
            return true;
        }
        return false;
    },
    /**
     * 触摸事件
     * @param touch {cc.Touch}
     * @param event {cc.Event}
     */
    onTouchMovedHandler: function (touch, event) {
        var box = this.getBoxByPos(touch.getLocation());
        if (box && !isElinArray(box, this.selectBoxArr) && this.checkBoxCanBeSelected(box)) {
            box.setSelected(true);
            this.selectBoxArr.push(box);
            this.lastSelectBox = box;
            this.lightLine.drawSelectingLine(this.selectBoxArr);
        }
    },
    /**
     * 触摸事件
     * @param touch {cc.Touch}
     * @param event {cc.Event}
     */
    onTouchEndedHandler: function (touch, event) {
        this.matchFailUnSelected();
        //this.lightLine.drawSelectingLine(null);
        //for (var i = 0; i < this.selectBoxArr.length; i++) {
        //    /**@type Box*/
        //    var box = this.selectBoxArr[i];
        //    box.setSelected(false);
        //}
    },

    /**
     * 根据位置查找box
     * @param pos
     * @returns {Box|null}
     */
    getBoxByPos: function (pos) {
        //先判断y的范围
        var top = Const.WIN_H - Const.TOP_HEIGHT;
        if (pos.y > top) {
            return null;
        } else if (pos.y < top - Const.ROW * Const.BOX_PADDING) {
            return null;
        }
        var col = int((pos.x - Const.LEFT) / Const.BOX_PADDING);
        var row = int((top - pos.y) / Const.BOX_PADDING);
        if (row >= 0 && row < Const.ROW && col >= 0 && col < Const.COL) {
            /**@type Box*/
            var box = this.boxArr[row][col];
            //更加精确碰撞
            if (cc.rectContainsPoint(box.baseBoundingBox, pos)) {
                return box;
            }
        }
        return null;
    },

    /**
     * 判断box是否能够被选中,四方向邻居才可以被选中
     * @param box {Box}
     */
    checkBoxCanBeSelected: function (box) {
        var row = box.row - this.lastSelectBox.row;
        var col = box.col - this.lastSelectBox.col;
        var addVal = row + col;
        var mulVal = row * col;
        if (mulVal == 0 && (addVal == 1 || addVal == -1)) {
            return true;
        }
        return false;
    },

    /**
     * 匹配失败，不选中
     */
    matchFailUnSelected: function () {
        if (this.selectBoxArr.length > 0) {
            this.__removeEndSelectBox();
        }
    },

    /**
     * 移除最后一个
     * @private
     */
    __removeEndSelectBox: function () {
        /**@type Box*/
        var box = this.selectBoxArr.pop();
        box.setSelected(false);
        this.lightLine.drawSelectingLine(this.selectBoxArr);
        if (this.selectBoxArr.length > 0) {
            setTimeout(this.__removeEndSelectBox.bind(this), 50);
        } else {
            //TODO remove end
            trace("remove end!!")
        }
    }
})