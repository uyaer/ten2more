var GuideLayer = cc.Layer.extend({
    /**
     * @type cc.LayerColor
     */
    maskTop: null,
    /**
     * @type cc.LayerColor
     */
    maskLeft: null,
    /**
     * @type cc.LayerColor
     */
    maskRight: null,
    /**
     * @type cc.LayerColor
     */
    maskBottom: null,
    /**
     * @type cc.Scale9Sprite
     */
    mask: null,
    /**
     * @type cc.LabelTTF
     */
    tipTF: null,
    /**
     * 引导配置数据
     */
    guideCfg: null,
    /**
     * 向导步骤
     */
    guideStep: 0,
    /**
     * 最后一步id
     */
    overStep: 4,
    /**
     * 锁定的格子
     * @type Array
     */
    currLock: null,
    /**
     * 引导是否完成了
     */
    isGuideOver: false,
    ctor: function () {
        this._super();

        this.maskTop = new cc.LayerColor(cc.color(0, 0, 0, 139), Const.WIN_W, 10);
        this.maskLeft = new cc.LayerColor(cc.color(0, 0, 0, 139), Const.WIN_W, 10);
        this.maskRight = new cc.LayerColor(cc.color(0, 0, 0, 139), Const.WIN_W, 10);
        this.maskBottom = new cc.LayerColor(cc.color(0, 0, 0, 139), Const.WIN_W, 10);

        this.addChild(this.maskTop);
        this.addChild(this.maskLeft);
        this.addChild(this.maskRight);
        this.addChild(this.maskBottom);

        this.mask = new cc.Scale9Sprite("game/mask1.png", cc.rect(68, 68, 1, 1));
        this.mask.anchorX = this.mask.anchorY = 0;
        this.addChild(this.mask);

        this.tipTF = new cc.LabelTTF("", "Arial", 40, cc.size(Const.WIN_W, 100), cc.TEXT_ALIGNMENT_CENTER);
        this.addChild(this.tipTF, 1);
        this.tipTF.x = Const.WIN_W / 2;

        this.initConfig();

        this.beginGuide();
    },

    /**
     * 初始化引导数据
     */
    initConfig: function () {
        this.guideCfg = {
            "1": {
                "pots": [cc.p(0, 0), cc.p(0, 1), cc.p(0, 2), cc.p(0, 3)],
                "rect": cc.rect(0, Const.BOX_PADDING, Const.BOX_PADDING * 4, Const.BOX_PADDING),
                "txt": "个位数相加组成10的倍数"
            },
            "2": {
                "pots": [cc.p(1, 0), cc.p(1, 1)],
                "rect": cc.rect(0, Const.BOX_PADDING * 2, Const.BOX_PADDING * 2, Const.BOX_PADDING),
                "txt": "相同的数字可以相加"
            },
            "3": {
                "pots": [cc.p(2, 0), cc.p(2, 1), cc.p(2, 2)],
                "rect": cc.rect(0, Const.BOX_PADDING * 3, Const.BOX_PADDING * 3, Const.BOX_PADDING),
                "txt": "不同数字相加可以进位"
            },
            "4": {
                "multi": true, //是否多行
                "pots": [cc.p(3, 0), cc.p(3, 1), cc.p(3, 2), cc.p(3, 3),
                    cc.p(4, 0), cc.p(4, 3),
                    cc.p(5, 0), cc.p(5, 1), cc.p(5, 2), cc.p(5, 3)
                ],
                "rect": cc.rect(0, Const.BOX_PADDING * 6, Const.BOX_PADDING * 4, Const.BOX_PADDING * 3),
                "txt": "数字围成圈可以有彩蛋哦"
            }
        }
    },

    /**
     * 开始向导
     */
    beginGuide: function () {
        this.guideStep = 0;
        this.isGuideOver = false;
    },

    /**
     * 结束向导
     */
    endGuide: function () {
        GameManager.instance.isGuided = true;
        GameManager.instance.saveData();
        this.isGuideOver = true;
        this.removeFromParent();
        showTip("引导结束，为了10000，继续努力吧!",2);
    },

    /**
     * 进行下一个步骤
     */
    nextStep: function () {
        this.visible = true;
        this.guideStep++;
        var data = this.guideCfg[this.guideStep];
        this.currLock = data["pots"];
        this.tipTF.setString(data["txt"]);
        if (data["multi"]) {
            this.mask.setSpriteFrame(cc.spriteFrameCache.getSpriteFrame("game/mask2.png"));
            this.mask.scale = 2;
            this.mask.setCapInsets(cc.rect(96, 93, 1, 1));
        }
        /**@type cc.Rect*/
        var rect = data["rect"];
        rect.width += 20;
        rect.height += 20;
        rect.x -= 10;
        rect.y += 0;
        rect.y = Const.WIN_H - Const.TOP_HEIGHT - rect.y;
        this.mask.x = rect.x;
        this.mask.y = rect.y;
        if (data["multi"]) {
            this.mask.width = rect.width / 2;
            this.mask.height = rect.height / 2;
        } else {
            this.mask.width = rect.width;
            this.mask.height = rect.height;
        }
        this.maskBottom.height = rect.y;
        this.maskLeft.y = this.maskRight.y = rect.y;
        this.maskLeft.height = this.maskRight.height = rect.height;
        this.maskLeft.width = rect.x;
        this.maskRight.width = Const.WIN_W - cc.rectGetMaxX(rect);
        this.maskRight.x = cc.rectGetMaxX(rect);
        this.maskTop.height = Const.WIN_H - cc.rectGetMaxY(rect);
        this.maskTop.y = cc.rectGetMaxY(rect);

        //文本位置
        this.tipTF.y = cc.rectGetMaxY(rect) + 50;

    },

    /**
     * 步骤结束了
     */
    stepEnd: function () {
        if (this.guideStep == this.overStep) {
            this.endGuide();
        } else {
            this.visible = false;
        }
    },

    /**
     * 检查在引导中，box是否可以被选择
     * @param box {Box}
     * @returns {boolean}
     */
    checkBoxCanSelect: function (box) {
        for (var i = 0; i < this.currLock.length; i++) {
            /**@type cc.Point*/
            var pot = this.currLock[i];
            if (pot.x == box.row && pot.y == box.col) {
                return true;
            }
        }
        return false;
    }
})