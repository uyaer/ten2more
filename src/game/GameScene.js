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
    /**
     * 移除的box临时数组
     * @type Array
     */
    removeBoxArr: null,
    /**
     * box根目录
     * @type cc.Layer
     */
    boxRoot: null,
    /**
     * @type TopLayer
     */
    topLayer: null,
    /**
     * 选择的会消除分数
     */
    selectWillAddScore: 0,
    /**
     * 选中合格的个数
     */
    selectLen: 0,

    ctor: function () {
        this._super();

        this.makeBackground();
        this.makeBox();
        this.makeTopLayer();

        GameManager.instance.state = GameState.PLAYING;
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
        this.removeBoxArr = [];
        this.boxArr = [];
        var box;
        var root = new cc.Layer();
        this.boxRoot = root;
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

    makeTopLayer: function () {
        this.topLayer = new TopLayer();
        this.addChild(this.topLayer, 10);
    },

    /**
     * 触摸事件
     * @param touch {cc.Touch}
     * @param event {cc.Event}
     */
    onTouchBeganHandler: function (touch, event) {
        if (GameManager.instance.state != GameState.PLAYING) {
            return false;
        }
        var box = this.getBoxByPos(touch.getLocation());
        if (box) {
            box.setSelected(true);
            this.selectBoxArr = [box];
            this.lastSelectBox = box;
            this.topLayer.showAddTip(box.num);
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
        if (box && this.checkBoxCanBeSelected(box)) {
            if (!isElinArray(box, this.selectBoxArr)) { //没有添加过
                box.setSelected(true);
                this.selectBoxArr.push(box);
                this.lastSelectBox = box;
                this.lightLine.drawSelectingLine(this.selectBoxArr);

                var num = this.calBoxAddResult(this.selectBoxArr);
                this.topLayer.showAddTip(num);
            } else { //添加过
                var endBox = null;
                if (this.selectBoxArr.length > 1) {
                    endBox = this.selectBoxArr[this.selectBoxArr.length - 2];
                }
                if (box == endBox) {
                    box = this.selectBoxArr.pop();
                    box.setSelected(false);
                    this.lastSelectBox = endBox;
                    this.lightLine.drawSelectingLine(this.selectBoxArr);

                    var num = this.calBoxAddResult(this.selectBoxArr);
                    this.topLayer.showAddTip(num);
                }
            }
        }
    },
    /**
     * 触摸事件
     * @param touch {cc.Touch}
     * @param event {cc.Event}
     */
    onTouchEndedHandler: function (touch, event) {
        if (this.selectBoxArr.length > 1) { //2个以上才进行检查
            this.checkNumIsMatchTen();
        } else {
            this.matchFailUnSelected();
        }

        this.topLayer.hideAddTip();
    },

    /**
     * 计算box相加的数字和
     * @returns {number}
     */
    calBoxAddResult: function (boxArr) {
        var num = 0;
        for (var i = 0; i < boxArr.length; i++) {
            /**@type Box*/
            var box = boxArr[i];
            num += box.num;
        }
        return num;
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

    checkNumIsMatchTen: function () {
        /**@type Box*/
        var firstBox = this.selectBoxArr[0];
        var num = firstBox.num;
        var isSameLen = true;
        for (var i = 1; i < this.selectBoxArr.length; i++) {
            /**@type Box*/
            var box = this.selectBoxArr[i];
            num += box.num;
            //数字长度不统一，不能进行合并
            if (firstBox.num.toString().length != box.num.toString().length) {
                isSameLen = false;
                break;
            }
        }
        if (isSameLen && num % 10 == 0) { //匹配成功
            this.selectLen = this.selectBoxArr.length;
            this.selectWillAddScore = num * this.selectLen;
            var surroundBoxArr = this.checkNumIsSurround();
            if (surroundBoxArr.length > 0) { //围墙炸弹隔离消除
                // 隔离消除
                this.playSurroundAnimation(surroundBoxArr);
            } else { //普通消除
                this.matchSuccessUnSelected();
            }
        } else { //匹配失败
            this.matchFailUnSelected();
        }
    },

    /**
     * 被围绕的box数组
     * @type Array
     */
    beSurroundArr: null,

    /**
     * 播放围墙动画
     * @param beSurroundArr {Array} 被包围的box数组
     */
    playSurroundAnimation: function (beSurroundArr) {
        this.beSurroundArr = beSurroundArr;

        var num = 0;
        this.selectLen = this.selectBoxArr.length;
        for (var i = 0; i < this.selectBoxArr.length; i++) {
            /** @type Box*/
            var box = this.selectBoxArr[i];
            box.playSurroundAnimation();
            num += box.length;
        }

        setTimeout(this.__removeSurroundBoxArr.bind(this), 600);
    },

    /**
     * 移除外围的墙
     * @private
     */
    __removeSurroundBoxArr: function () {
        var indexArr = randomArrayIndex(this.selectBoxArr.length, this.selectWillAddScore / this.selectLen / 10);
        for (var i = 0; i < this.selectBoxArr.length; i++) {
            /** @type Box*/
            var box = this.selectBoxArr[i];
            if (!isElinArray(i, indexArr)) {
                this.cleanBoxPosition(box);
                var potBox = this.selectBoxArr[indexArr[randomInt(0, indexArr.length - 1)]];
                box.playRemoveToExplodePotAnimation(potBox.x, potBox.y);
            } else {
                box.updateNum(10);
                box.tintColor();
            }
        }
        //light
        this.lightLine.runAction(cc.sequence(
            cc.blink(0.5, 2),
            cc.show(),
            cc.callFunc(this.lightLine.drawSelectingLine, this.lightLine)
        ));

        for (var i = 0; i < this.beSurroundArr.length; i++) {
            /** @type Box*/
            var box = this.beSurroundArr[i];
            box.playExplodeAnimation();
            box.updateNum(box.num * 10);
            box.tintColor();
            this.showAddTip(this.selectWillAddScore + "\nx" + box.num, box.x, box.y, this.selectWillAddScore * box.num);
        }
        setTimeout(this.boxDown.bind(this), 700);
    },

    /**
     * 判断数字是否形成了一个围墙
     * @returns {Array}
     */
    checkNumIsSurround: function () {
        //选中项形成的包围圈，圈中的box无论怎么走周围都是选中项的墙，就代表围墙成功,如果检查到边界，代表判断失败
        var surroundArr = [];
        for (var i = 1; i < Const.ROW - 1; i++) {
            for (var j = 1; j < Const.COL - 1; j++) {
                /**@type Box */
                var box = this.boxArr[i][j];
                if (!isElinArray(box, surroundArr)) { //box不在孤岛数据中
                    var result = this.checkBoxIsBeSurround(box);
                    if (result) {
                        surroundArr = surroundArr.concat(result);
                    }
                }
            }
        }
        return surroundArr;
    },

    /**
     * 广度优先查找某个box以及周围是否被围住了
     * @param oneBox
     * @returns {Array | null}
     */
    checkBoxIsBeSurround: function (oneBox) {
        var result = [oneBox];
        var needCheckArr = [oneBox];
        while (needCheckArr.length > 0) {
            /**@type Box */
            var box = needCheckArr.pop();
            //这里判断围墙数据是因为第一个数据没有判断是否是围墙数据
            if (!isElinArray(box, this.selectBoxArr) && !box.boxIsBorder()) {
                for (var i = -1; i <= 1; i++) {
                    for (var j = -1; j <= 1; j++) {
                        if (!(i == 0 && j == 0)) { //8方向
                            var row = box.row + i;
                            var col = box.col + j;
                            if (row >= 0 && row < Const.ROW && col >= 0 && col < Const.COL) {
                                var temp = this.boxArr[row][col];
                                //没有存入进过临时孤岛数据，也不是围墙数据
                                if (!isElinArray(temp, result) && !isElinArray(temp, this.selectBoxArr)) {
                                    needCheckArr.push(temp);
                                    result.push(temp);
                                }
                            }
                        }
                    }
                }
            } else {
                return null;
            }
        }

        return result;
    },

    /**
     * @type cc.ParticleSystem
     */
    removeEff: null,
    /**
     * 匹配成功，播放动画
     */
    matchSuccessUnSelected: function () {
        this.removeEff = new cc.ParticleSystem(res.eff_remove);
        this.addChild(this.removeEff, 3);
        this.__removeStartSelectBox();
    },

    /**
     * 移除第一个
     * @private
     */
    __removeStartSelectBox: function () {
        /**@type Box*/
        var box = this.selectBoxArr.shift();
        /**@type Box*/
        var nextBox = this.selectBoxArr[0];
        box.setSelected(false);
        this.cleanBoxPosition(box);
        box.playRemoveAnimation();
        nextBox.updateNum(nextBox.num + box.num);
        this.removeEff.runAction(cc.moveTo(0.05, box.x, box.y));
        this.lightLine.drawSelectingLine(this.selectBoxArr);
        if (this.selectBoxArr.length > 1) {
            setTimeout(this.__removeStartSelectBox.bind(this), 150);
        } else {
            // remove start ^_^ end
            nextBox.y = nextBox.baseY;
            nextBox.tintColor();
            this.showAddTip(nextBox.num + "x" + this.selectLen, nextBox.x, nextBox.y, this.selectWillAddScore);
            setTimeout(this.__removeStartSelectBoxEndHandler.bind(this, 500));
        }
    },

    /**
     * 从开头移除动画完成后的回调
     * @private
     */
    __removeStartSelectBoxEndHandler: function () {
        this.removeEff.removeFromParent();
        this.boxDown();
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
            // remove end
            GameManager.instance.state = GameState.PLAYING;
        }
    },

    /**
     * 旧box下落
     */
    boxDown: function () {
        for (var i = Const.ROW - 1; i >= 0; i--) {
            for (var j = 0; j < Const.COL; j++) {
                var box = this.boxArr[i][j];
                if (!box) {
                    /**@type Box*/
                    var upBox = this.getUpNotNullBox(i, j);
                    if (upBox) {
                        this.cleanBoxPosition(upBox, i, j);
                        upBox.moveToPot(i, j);
                    } else {
                        //上面没有了box，0.5s后产生新的并且下落
                        this.newBoxDown(i, j);
                    }
                }
            }
        }
    },

    /**
     * 新box出现在上面并且掉落
     */
    newBoxDown: function (row, col) {
        var that = this;
        setTimeout(function () {
            /**@type Box*/
            var box = that.removeBoxArr.pop();
            box.updateRowCol(-1, col);
            box.resetBox();
            that.boxRoot.addChild(box);
            box.moveToPot(row, col);
            that.boxArr[row][col] = box;
            setTimeout(function () {
                GameManager.instance.state = GameState.PLAYING;
            }, 1000);
        }, 700);
    },

    /**
     * 获取行列位置上部没有空的box
     * @param row
     * @param col
     * @returns {Box}
     */
    getUpNotNullBox: function (row, col) {
        var box = null;
        row--;
        while (row >= 0) {
            box = this.boxArr[row][col];
            if (box) {
                break;
            }
            row--;
        }
        return box;
    },

    /**
     * 清除box的位置信息
     * @param box {Box}
     * @param newRow
     * @param newCol
     */
    cleanBoxPosition: function (box, newRow, newCol) {
        this.boxArr[box.row][box.col] = null;
        if (arguments.length == 3) { //如果有新的位置，就重设位置
            this.boxArr[newRow][newCol] = box;
        } else {//否则就将其放入临时移除数组
            this.removeBoxArr.push(box);

        }
    },

    /**
     * 显示增加的提示信息
     * @param txt 显示文字
     * @param x 现在位置
     * @param y 现在位置
     * @param num 增加数量
     */
    showAddTip: function (txt, x, y, num) {
        var tf = new cc.TextFieldTTF(txt + "", cc.size(Const.BOX_SIZE, 70), cc.TEXT_ALIGNMENT_CENTER, "Arial", 32);
        tf.color = hex2Color(0xc07115);
        this.addChild(tf, 1000);
        tf.x = x;
        tf.y = y;
        tf.runAction(cc.sequence(
            cc.delayTime(0.25),
            cc.moveBy(0.25, 0, 35).easing(cc.easeSineOut()),
            cc.fadeOut(0.15),
            cc.removeSelf(),
            cc.callFunc(function () {
                GameManager.instance.score += num;
                this.topLayer.updateScoreShow();
            }, this)
        ));
    }
})