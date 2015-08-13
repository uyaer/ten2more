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
     * 原始颜色
     * @type cc.Color
     */
    baseColor: null,
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

        this.baseColor = cc.color.WHITE;

        this.calBasePos();

        this.bg = new cc.Sprite("#game/cir.png");
        this.addChild(this.bg);

        this.numTF = new cc.TextFieldTTF("1", cc.size(100, 50), cc.TEXT_ALIGNMENT_CENTER, "Arial", 32);
        this.numTF.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.addChild(this.numTF, 1);

    },

    /**
     * 重置Box
     */
    resetBox: function () {
        this.updateNum(randomInt(1, 5));
        this.x = this.baseX;
        this.y = this.baseY;
        this.scale = 1;
        this.baseColor = cc.color.WHITE;
        this.bg.color = cc.color.WHITE;
        this.opacity = 255;
        this.scale = 1;
        this.rotation = 0;
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
            this.bg.color = this.baseColor;
            this.y = this.baseY;
        }
    },

    /**
     * 播放移除动画
     *
     */
    playRemoveAnimation: function () {
        this.runAction(cc.sequence(
            cc.scaleTo(0.5, 0.01),
            cc.removeSelf(false)
        ));
    },
    /**
     * 播放移动到爆炸点的移除动画
     *
     */
    playRemoveToExplodePotAnimation: function (x,y) {
        this.runAction(cc.sequence(
            cc.moveTo(0.5, x,y),
            cc.removeSelf(false)
        ));
    },

    /**
     * 播放爆炸动画
     */
    playExplodeAnimation: function () {
        this.bg.runAction(cc.sequence(
            cc.tintTo(0.12, 0, 0, 0),
            cc.tintTo(0.12, 255, 255, 255),
            cc.tintTo(0.12, 0, 0, 0),
            cc.tintTo(0.12, 255, 255, 255)
        ));
    },

    /**
     * 播放消除围墙动画
     */
    playSurroundAnimation: function () {
        this.bg.runAction(cc.spawn(
            cc.sequence(
                cc.scaleTo(0.25, 1.15),
                cc.scaleTo(0.25, 1)
            ),
            cc.tintTo(0.5, 255, 255, 0)
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
     * 动画着色
     */
    tintColor: function () {
        //计算颜色
        var color = 0xffffff;
        if (this.num < 10) {
            color = 0xffffff;
        } else if (this.num <= 100) {
            color = int((10 - int(this.num / 10)) * (0xffffff - 0xffff00) / 10) + 0xffff00;
        } else if (this.num <= 1000) {
            color = int((10 - int(this.num / 100)) * (0xffffff - 0xff00ff) / 10) + 0xff00ff;
        } else if (this.num <= 10000) {
            color = int((10 - int(this.num / 1000)) * (0xffffff - 0xff0000) / 10) + 0xff0000;
        } else {
            color = 0xff0000;
        }
        this.baseColor = hex2Color(color);
        this.bg.runAction(cc.tintTo(0.5, this.baseColor.r, this.baseColor.g, this.baseColor.b));
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