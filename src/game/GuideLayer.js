var GuideLayer = cc.Layer.extend({
    /**
     * @type cc.LayerColor
     */
    mask1: null,
    /**
     * @type cc.LayerColor
     */
    mask2: null,
    /**
     * @type cc.LayerColor
     */
    mask3: null,
    /**
     * @type cc.LayerColor
     */
    mask4: null,
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
     * 锁定的格子
     * @type Array
     */
    currLock: null,
    ctor: function () {
        this._super();

        this.mask1 = new cc.LayerColor(cc.color(0, 0, 0, 128), Const.WIN_W, 10);
        this.mask2 = new cc.LayerColor(cc.color(0, 0, 0, 128), Const.WIN_W, 10);
        this.mask3 = new cc.LayerColor(cc.color(0, 0, 0, 128), Const.WIN_W, 10);
        this.mask4 = new cc.LayerColor(cc.color(0, 0, 0, 128), Const.WIN_W, 10);

        this.addChild(this.mask1);
        this.addChild(this.mask2);
        this.addChild(this.mask3);
        this.addChild(this.mask4);

        this.mask = new cc.Scale9Sprite("game/mask1.png", cc.rect(68, 68, 1, 1));
        this.mask.anchorX = this.mask.anchorY = 0;
        this.addChild(this.mask);

        this.tipTF = new cc.LabelTTF("", "Arial", 32, cc.size(Const.WIN_W, 100));
        this.addChild(this.tipTF, 1);

        this.initConfig();
    },

    /**
     * 初始化引导数据
     */
    initConfig: function () {
        this.guideCfg = {
            "1": {
                "pots": [cc.p(0, 0), cc.p(0, 1), cc.p(0, 2)],
                "rect": cc.rect(0, Const.BOX_SIZE, Const.BOX_SIZE * 3, Const.BOX_SIZE),
                "txt": "个位数相加组成10的倍数"
            },
            "2": {
                "pots": [cc.p(1, 0), cc.p(1, 1)],
                "rect": cc.rect(0, Const.BOX_SIZE * 2, Const.BOX_SIZE * 2, Const.BOX_SIZE),
                "txt": "相同的数字可以相加"
            },
            "3": {
                "pots": [cc.p(2, 0), cc.p(2, 1), cc.p(2, 2)],
                "rect": cc.rect(0, Const.BOX_SIZE * 3, Const.BOX_SIZE * 3, Const.BOX_SIZE),
                "txt": "不同数字相加可以进位"
            },
            "4": {
                "multi": true, //是否多行
                "pots": [cc.p(3, 0), cc.p(3, 1), cc.p(3, 2), cc.p(3, 3),
                    cc.p(4, 0), cc.p(4, 3),
                    cc.p(5, 0), cc.p(5, 1), cc.p(5, 2), cc.p(5, 3)
                ],
                "rect": cc.rect(0, Const.BOX_SIZE * 6, Const.BOX_SIZE * 4, Const.BOX_SIZE * 3),
                "txt": "数字围成圈可以有彩蛋哦"
            }
        }
    },

    /**
     * 开始向导
     */
    startGuide: function () {
        this.guideStep = 0;
    },

    /**
     * 结束向导
     */
    endGuide: function () {
        GameManager.instance.isGuided = true;
        GameManager.instance.saveData();
        this.removeFromParent();
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
            this.mask.setSpriteFrame("game/mask2.png");
            this.mask.setCapInsets(cc.rect(96, 93, 1, 1));
        }
        /**@type cc.Rect*/
        var rect = data["rect"];
        this.mask.x = rect.x;
        this.mask.y = rect.y;
        this.mask.width = rect.width;
        this.mask.height = rect.height;
        //this.mask1.height = Const.WIN_H-rect
    },

    /**
     * 步骤结束了
     */
    stepEnd: function () {
        this.visible = false;
    }
})