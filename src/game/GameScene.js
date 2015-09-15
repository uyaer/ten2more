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
     * @type InfoLayer
     */
    infoLayer: null,
    /**
     * 选择的会消除分数
     */
    selectWillAddScore: 0,
    /**
     * 选中合格的个数
     */
    selectLen: 0,

    /**
     * 如果长时间不进行操作，可以提醒操作
     * @type Array
     */
    tipOpenBoxList: null,
    /**
     * 帮助玩家延迟操作
     */
    helpPlayerTimeId: 0,
    /**
     * @type GuideLayer
     */
    guideLayer: null,
    /**
     * @type MenuLayer
     */
    menuLayer: null,
    /**
     * 是否在引导中
     */
    isGuiding: false,

    ctor: function () {
        this._super();

        if (!GameManager.instance.map) { //不存在代表玩耍新的一次
            GameManager.instance.playCount++;
        }

        this.makeBackground();

        if (GameManager.instance.isGuided) {
            this.makeBox();
        } else {
            this.makeBoxWithGuide();
            this.guideLayer = new GuideLayer();
            this.addChild(this.guideLayer, 11);
            this.guideLayer.nextStep();
            this.isGuiding = true;
            GameManager.instance.score = 0;
            GameManager.instance.saveData();
        }
        this.makeTopLayer();
        this.makeInfoLayer();

        this.checkGameCanMove();
        this.helpPlayerTimeId = setTimeout(this.helpPlayerShowHint.bind(this), Const.HINT_TIME);

        GameManager.instance.state = GameState.PLAYING;
    },

    onEnter: function () {
        this._super();

        cc.eventManager.addCustomListener(GameEvent.SHOW_MENU, this.onShowMenuEvent.bind(this));
        cc.eventManager.addCustomListener(GameEvent.HIDE_MENU, this.onHideMenuEvent.bind(this));

        //event
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.onTouchBeganHandler.bind(this),
            onTouchMoved: this.onTouchMovedHandler.bind(this),
            onTouchEnded: this.onTouchEndedHandler.bind(this)
        }, this);
        //event
        if (cc.sys.isNative) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyReleased: this.onKeyClicked.bind(this)
            }, this);
        }
    },

    onExit: function () {
        this._super();

        cc.eventManager.removeCustomListeners(GameEvent.SHOW_MENU);
        cc.eventManager.removeCustomListeners(GameEvent.HIDE_MENU);
    },

    onShowMenuEvent: function () {
        this.menuLayer = new MenuLayer();
        this.addChild(this.menuLayer, 20);
        this.boxRoot.runAction(cc.moveTo(0.35, -Const.WIN_W * 0.34, 0));
        this.infoLayer.runAction(cc.moveBy(0.35, -Const.WIN_W * 0.34, 0));
    },

    onHideMenuEvent: function () {
        this.menuLayer = null;
        this.boxRoot.runAction(cc.moveTo(0.35, 0, 0));
        this.infoLayer.runAction(cc.moveBy(0.35, Const.WIN_W * 0.34, 0));
    },

    onKeyClicked: function (code) {
        if (code == cc.KEY.back) {
            if (PopUpManager.popLength() > 0) {
                PopUpManager.pop();
            }else if(this.menuLayer){
                this.menuLayer.onBackBtnClick();
            } else {
                cc.director.runScene(new cc.TransitionFade(0.5, new IndexScene(), hex2Color(0xa1edf8)));
            }
        }
    },

    /**
     *创建背景
     */
    makeBackground: function () {
        var bg = new cc.LayerColor(hex2Color(0xb8af9e), Const.WIN_W, Const.WIN_H);
        this.addChild(bg);

        this.lightLine = new LightLine();
        this.addChild(this.lightLine, 1);
    },

    /**
     * 创建guide模式下的地图
     */
    makeBoxWithGuide: function () {
        var map = [
            1, 2, 3, 4, 2, 2,
            10, 10, 2, 3, 2, 1,
            10, 50, 40, 4, 1, 1,
            1, 1, 1, 1, 2, 1,
            1, 2, 2, 1, 1, 2,
            1, 1, 1, 1, 3, 2
        ];
        this.removeBoxArr = [];
        this.boxArr = [];
        var box;
        var root = new cc.Layer();
        this.boxRoot = root;
        this.addChild(root, 2);
        for (var i = 0; i < Const.ROW; i++) {
            var line = [];
            this.boxArr.push(line);
            for (var j = 0; j < Const.COL; j++) {
                box = new Box(i, j);
                line.push(box);
                if (map) {
                    box.updateNum(map[i * Const.COL + j]);
                    box.tintColor(true);
                }
                box.x = box.baseX;
                box.y = box.baseY;
                root.addChild(box);
            }
        }
    },
    makeBox: function () {
        /** @Type Array*/
        var map = GameManager.instance.map;
        this.removeBoxArr = [];
        this.boxArr = [];
        var box;
        var root = new cc.Layer();
        this.boxRoot = root;
        this.addChild(root, 2);
        for (var i = 0; i < Const.ROW; i++) {
            var line = [];
            this.boxArr.push(line);
            for (var j = 0; j < Const.COL; j++) {
                box = new Box(i, j);
                line.push(box);
                if (map) {
                    box.updateNum(map[i * Const.COL + j]);
                    box.tintColor(true);
                } else {
                    box.updateNum(randomInt(1, 4));
                }
                box.x = box.baseX;
                box.y = box.baseY;
                root.addChild(box);
            }
        }

        if (!map) { //如果不存在地图，代表新生成的地图，保存数据
            this.saveMapData();
        }
    },

    makeTopLayer: function () {
        this.topLayer = new TopLayer();
        this.addChild(this.topLayer, 10);
    },

    makeInfoLayer: function () {
        this.infoLayer = new InfoLayer();
        this.addChild(this.infoLayer, 10);
    },

    /**
     * 是否在touch中，防止2个以上的起点
     */
    isTouching: false,

    /**
     * 触摸事件
     * @param touch {cc.Touch}
     * @param event {cc.Event}
     */
    onTouchBeganHandler: function (touch, event) {
        if (GameManager.instance.state != GameState.PLAYING) {
            return false;
        }
        if (this.isTouching)return false;
        this.stopPlayerHint();
        var box = this.getBoxByPos(touch.getLocation());
        if (box) {
            //guiding
            if (this.isGuiding && !this.guideLayer.checkBoxCanSelect(box)) {
                return false;
            }
            box.setSelected(true);
            this.selectBoxArr = [box];
            this.lastSelectBox = box;
            this.infoLayer.showAddTip(box.num, true);
            this.isTouching = true;
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
            //guiding
            if (this.isGuiding && !this.guideLayer.checkBoxCanSelect(box)) {
                return false;
            }
            if (!isElinArray(box, this.selectBoxArr)) { //没有添加过
                box.setSelected(true);
                this.selectBoxArr.push(box);
                this.lastSelectBox = box;
                this.lightLine.drawSelectingLine(this.selectBoxArr);

                var num = this.calBoxAddResult(this.selectBoxArr);
                var code = this.checkBoxAddIsMatchRule();
                this.infoLayer.showAddTip(num, code > 0);
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
                    var code = this.checkBoxAddIsMatchRule();
                    this.infoLayer.showAddTip(num, code > 0);
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
        if(gameStepVo.step>0){
            if (this.selectBoxArr.length > 1 ) { //2个以上才进行检查
                this.checkNumIsMatchTen();
            } else {
                this.matchFailUnSelected();
            }
        }else{
            showTip(Lang.i18n(31));//步数不足，无法操作，请等待恢复
            this.matchFailUnSelected();
        }

        this.infoLayer.hideAddTip();
        this.isTouching = false;
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
     * 检查box相加是否满足简单规则，用于选择的时候的提示使用
     * @returns {number}
     */
    checkBoxAddIsMatchRule: function () {
        var result = 1;
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
                //showTip("~位数不匹配~");
                result = Const.ERR_LEN;
                break;
            }
        }

        if (isSameLen) {
            if (firstBox.num.toString().length == 1) {
                if (num % 10 == 0) {
                    result = 1;
                } else {
                    //showTip("~数字和为10的倍数~");
                    result = Const.ERR_MOD10;
                }
            } else if (this._isSameNumber() || this._isAddMatchLen()) { //如果是相同的数字，或者相加刚刚能进位，则表示匹配成功
                result = 1;
            } else {
                //showTip("~不能相加啦~");
                result = Const.ERR_CARRY;
            }
        }
        return result;
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
     * 是否是相同的数字
     * @returns {boolean}
     * @private
     */
    _isSameNumber: function () {
        /**@type Box*/
        var firstBox = this.selectBoxArr[0];
        var num = firstBox.num;
        var isSame = true;
        for (var i = 1; i < this.selectBoxArr.length; i++) {
            /**@type Box*/
            var box = this.selectBoxArr[i];
            num += box.num;
            //数字长度不统一，不能进行合并
            if (firstBox.num != box.num) {
                isSame = false;
                break;
            }
        }
        return isSame;
    },
    /**
     * 相加是否可以进位
     * @private
     */
    _isAddMatchLen: function () {
        /**@type Box*/
        var firstBox = this.selectBoxArr[0];
        var numLen = firstBox.num.toString().length;
        var matchNum = Math.pow(10, numLen);
        var num = 0;
        for (var i = 0; i < this.selectBoxArr.length; i++) {
            /**@type Box*/
            var box = this.selectBoxArr[i];
            num += box.num;
        }
        if (num == matchNum) {
            return true;
        }
        return false;
    },

    checkNumIsMatchTen: function () {
        var code = this.checkBoxAddIsMatchRule();
        var isMatch = code > 0;
        if (code == Const.ERR_LEN) {
            showTip(Lang.i18n(4));//"~位数不匹配~"
        } else if (code == Const.ERR_MOD10) {
            showTip(Lang.i18n(5));//~数字和为10的倍数~
        } else if (code == Const.ERR_CARRY) {
            showTip(Lang.i18n(6));//不符合规则
        }

        if (isMatch) { //匹配成功
            gameStepVo.step--;
            gameStepVo.saveToRemote();

            var num = this.calBoxAddResult(this.selectBoxArr);
            this.selectLen = this.selectBoxArr.length;
            this.selectWillAddScore = num * this.selectLen;
            var surroundBoxArr = this.checkNumIsSurround();
            if (surroundBoxArr.length > 0) { //围墙炸弹隔离消除
                // 隔离消除
                this.playSurroundAnimation(surroundBoxArr);
            } else { //普通消除
                this.matchSuccessUnSelected();
            }
            //guiding
            if (this.isGuiding) {
                this.guideLayer.stepEnd();
                if (this.guideLayer.isGuideOver) {
                    this.isGuiding = false;
                    this.guideLayer = null;
                }
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
            setTimeout(this.__removeStartSelectBoxEndHandler.bind(this), 200);
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

            this.helpPlayerTimeId = setTimeout(this.helpPlayerShowHint.bind(this), Const.HINT_TIME);
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
        var that = this;
        setTimeout(function () {
            //判断目标是否达成
            if (that.checkScoreIs10000()) {
                //目标达成
                GameManager.instance.state = GameState.OVER;
                that.addChild(new SuccessPanel(), 100);
            } else {
                //判断游戏是否结束
                if (that.checkGameCanMove()) {
                    //仍然有可以移动的目标
                    GameManager.instance.state = GameState.PLAYING;
                    that.saveMapData();
                    //10s没有操作，进行提示操作
                    that.helpPlayerTimeId = setTimeout(that.helpPlayerShowHint.bind(that), Const.HINT_TIME);

                    //guiding
                    if (that.isGuiding) {
                        that.guideLayer.nextStep();
                    }
                } else {
                    // game over
                    GameManager.instance.state = GameState.OVER;
                    that.addChild(new FailPanel(), 100);
                }
            }
        }, 1000);
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
            box.release();
            box.moveToPot(row, col);
            that.boxArr[row][col] = box;
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
            box.retain();
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
        var tf = new cc.LabelTTF(txt + "", "Arial", 32, cc.size(Const.BOX_SIZE, 70), cc.TEXT_ALIGNMENT_CENTER);
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
                this.infoLayer.updateScoreShow();
            }, this)
        ));
    },

    /**
     * 保存map的数据
     */
    saveMapData: function () {
        if (!GameManager.instance.map) {
            GameManager.instance.map = [];
        }
        /**@type Box*/
        var box;
        for (var i = 0; i < Const.ROW; i++) {
            for (var j = 0; j < Const.COL; j++) {
                box = this.boxArr[i][j];
                GameManager.instance.map[i * Const.COL + j] = box.num;
            }
        }
        GameManager.instance.saveData();
    },

    /**
     * 检测游戏是否还有可以移动的块
     * @returns {boolean}
     */
    checkGameCanMove: function () {

        var isMatch = false;

        /**
         * 分成次判断，由于判断累加的函数比较耗时，所有将相同数字的判断提前，以便节省性能
         *
         * 判断相近2数是否相等
         */
        for (var i = 0; i < Const.ROW; i++) {
            for (var j = 0; j < Const.COL; j++) {
                if (isMatch)break;
                var box = this.boxArr[i][j];
                if (box.num >= 10) {
                    isMatch = this.checkMoreThanTenEq(box);
                    if (isMatch)break;
                }
            }
            if (isMatch)break;
        }
        /**
         *判断累加
         */
        for (var i = 0; i < Const.ROW; i++) {
            for (var j = 0; j < Const.COL; j++) {
                var box = this.boxArr[i][j];
                if (box.num < 10) {
                    isMatch = this.checkLessThanTen(box);
                } else {
                    isMatch = this.checkMoreThanTen(box);
                }
                if (isMatch)break;
            }
            if (isMatch)break;
        }

        return isMatch;
    },

    /**
     * 如果 数字大于10，使用这个检测
     * 检测规则：周围数字有>=10的，周围是否有相同的
     * @param box {Box}
     */
    checkMoreThanTenEq: function (box) {
        var dir = [cc.p(-1, 0),
            cc.p(1, 0),
            cc.p(0, -1),
            cc.p(0, 1)
        ];

        var isMatch = false;
        for (var i = 0; i < dir.length; i++) {
            var row = box.row + dir[i].x;
            var col = box.col + dir[i].y;
            if (row < 0 || row >= Const.ROW || col < 0 || col >= Const.COL) {
                continue;
            } else { //边界ok
                var tempBox = this.boxArr[row][col];
                if (tempBox.num == box.num) {
                    isMatch = true;

                    //记录可以点击的策略
                    this.tipOpenBoxList = [box, tempBox];
                    break;
                }
            }
        }

        return isMatch;
    },
    /**
     * 如果 数字大于10，使用这个检测
     * 检测规则：周围数字有>=10的，累加是否可以进位
     * @param box {Box}
     */
    checkMoreThanTen: function (box) {
        var dir = [cc.p(-1, 0),
            cc.p(1, 0),
            cc.p(0, -1),
            cc.p(0, 1)
        ];

        var isMatch = false;
        var num = 0;
        var closeArr = [];
        var openArr = [];
        var numLen = box.num.toString().length;
        var targetNum = Math.pow(10, numLen);

        var that = this;

        check(box);

        /**
         * 检测
         * @param box {Box}
         */
        function check(box) {
            num += box.num;
            openArr.push(cc.p(box.row, box.col));
            closeArr.push(box);
            if (num == targetNum) {
                isMatch = true;
                return;
            }
            if (num > targetNum) {
                num -= box.num;
                openArr.pop();
                return;
            }
            for (var i = 0; i < dir.length; i++) {
                var row = box.row + dir[i].x;
                var col = box.col + dir[i].y;
                if (row < 0 || row >= Const.ROW || col < 0 || col >= Const.COL) {
                    continue;
                } else { //边界ok
                    var tempBox = that.boxArr[row][col];
                    if (tempBox.num.toString().length == numLen && !isElinArray(tempBox, closeArr)) {
                        check(tempBox);
                        if (isMatch)return;
                    }
                }
            }
            num -= box.num;
            openArr.pop();
        }

        //记录可以点击的策略
        if (isMatch) {
            this.tipOpenBoxList = openArr;
        }

        return isMatch;
    },
    /**
     * 如果 数字小于10，使用这个检测
     * 检测规则：周围数字有<10的，并且连线可以组成10的整数，但是<100
     * (需要使用深度优先算法)
     * @param box {Box}
     */
    checkLessThanTen: function (box) {
        var dir = [cc.p(-1, 0),
            cc.p(1, 0),
            cc.p(0, -1),
            cc.p(0, 1)
        ];

        var isMatch = false;
        var num = 0;
        var closeArr = [];
        var openArr = [];

        var that = this;

        check(box);

        /**
         * 检测
         * @param box {Box}
         */
        function check(box) {
            num += box.num;
            openArr.push(cc.p(box.row, box.col));
            closeArr.push(box);
            if (num <= 100 && num % 10 == 0) {
                isMatch = true;
                return;
            }
            if (num > 100) {
                num -= box.num;
                openArr.pop();
                return;
            }
            for (var i = 0; i < dir.length; i++) {
                var row = box.row + dir[i].x;
                var col = box.col + dir[i].y;
                if (row < 0 || row >= Const.ROW || col < 0 || col >= Const.COL) {
                    continue;
                } else { //边界ok
                    var tempBox = that.boxArr[row][col];
                    if (tempBox.num < 10 && !isElinArray(tempBox, closeArr)) {
                        check(tempBox);
                        if (isMatch)return;
                    }
                }
            }
            num -= box.num;
            openArr.pop();
        }

        //记录可以点击的策略
        if (isMatch) {
            this.tipOpenBoxList = openArr;
        }

        return isMatch;
    },

    /**
     * 检查分数是否达到10000分
     */
    checkScoreIs10000: function () {
        for (var i = 0; i < Const.ROW; i++) {
            for (var j = 0; j < Const.COL; j++) {
                /**@type Box*/
                var box = this.boxArr[i][j];
                if (box.num == 10000) {
                    return true;
                }
            }
        }
        return false;
    },

    /**
     * 帮助玩家进行提示
     */
    helpPlayerShowHint: function () {
        if (!this.tipOpenBoxList)return;
        if (this.isGuiding) return;

        var arr = [];
        var len = this.tipOpenBoxList.length;
        for (var i = 0; i < len; i++) {
            var pot = this.tipOpenBoxList[i];
            /**@type Box*/
            var box = this.boxArr[pot.x][pot.y];
            arr.push(box);
        }

        this.lightLine.drawSelectingLine(arr, 0.2);
        this.lightLine.runAction(cc.blink(1, 1).repeatForever());
    },
    /**
     * 停止进行对玩家的提示
     */
    stopPlayerHint: function () {
        clearTimeout(this.helpPlayerTimeId);
        this.lightLine.stopAllActions();
        this.lightLine.visible = true;
        this.lightLine.drawSelectingLine(null);
    }
})