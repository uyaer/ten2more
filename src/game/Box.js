var Box = cc.Node.extend({
    /**
     * 行
     */
    row: 0,
    /**
     * 列
     */
    col: 0,
    /**
     * 原始位置x
     */
    baseX: 0,
    /**
     * 原始位置y
     */
    baseY: 0,
    /**
     * 原始碰撞区域
     * @type cc.Rect
     */
    baseBoundingBox: null,
    /**
     * @type cc.Sprite
     */
    bg: null,
    /**
     * @type cc.TextFieldTTF
     */
    numTF: null,
    /**
     * 代表数字
     * @type number
     */
    num: 1,
    /**
     * 是否检查过了
     */
    isChecked: false,
    ctor: function (row, col) {
        this._super();

        this.row = row;
        this.col = col;

        this.calBasePos();

        this.bg = new cc.Sprite("#cir.png");
        this.addChild(this.bg);

        this.numTF = new cc.TextFieldTTF("1", cc.size(100, 50), cc.TEXT_ALIGNMENT_CENTER, "Arial", 32);
        this.numTF.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.addChild(this.numTF, 1);
    },

    updateNum: function (num) {
        this.num = num;
        this.numTF.setString(num + "");
        this.numTF.runAction(cc.sequence(
            cc.blink(0.1, 1),
            cc.show()
        ));
    },
    /**
     * 重新设置其行列
     * @param row
     * @param col
     */
    updateRowCol: function (row, col) {
        this.row = row;
        this.col = col;

        this.calBasePos();
    },

    /**
     * 计算原始位置
     */
    calBasePos: function () {
        this.baseX = Const.LEFT + Const.BOX_HALF + this.col * Const.BOX_PADDING;
        this.baseY = Const.WIN_H - Const.TOP_HEIGHT - Const.BOX_HALF - this.row * Const.BOX_PADDING;
        this.baseBoundingBox = cc.rect(
            this.baseX - Const.BOX_HALF,
            this.baseY - Const.BOX_HALF,
            Const.BOX_SIZE,
            Const.BOX_SIZE
        );
    },

    /**
     * 设置被选中情况
     * @param val {boolean}
     */
    setSelected: function (val) {
        if (val) {
            this.bg.color = cc.color.RED;
            this.runAction(cc.moveBy(0.15, 0, 5));
        } else {
            this.bg.color = cc.color.WHITE;
            this.y = this.baseY;
        }
    },

    /**
     * 播放移除动画
     *
     */
    playRemoveAnimation: function () {
        var that = this;
        this.runAction(cc.sequence(
            cc.scaleTo(0.5, 0.01),
            cc.removeSelf(false)
        ));
    },

    /**
     * 移动到对应位置
     * @param row
     * @param col
     */
    moveToPot: function (row, col) {
        var time = limit((this.col - col) * 0.2, 0.2, 0.8);
        this.updateRowCol(row, col);
        this.runAction(cc.moveTo(time, this.baseX, this.baseY));
    },

    /**
     * 判断是否是边界
     * @returns {boolean}
     */
    boxIsBorder: function () {
        if (this.row == 0 || this.col == 0 || this.row == Const.ROW - 1 || this.col == Const.COL - 1) {
            return true;
        }
        return false;
    }
})