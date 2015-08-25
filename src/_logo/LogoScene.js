var LogoScene = cc.Scene.extend({
    /**
     * @type cc.Sprite
     */
    logo: null,
    /**
     * @type cc.Sprite
     */
    line: null,
    /**
     * @type cc.Sprite
     */
    url: null,
    /**
     * @type cc.Sprite
     */
    leaf: null,
    /**
     * @type cc.LabelBMFont
     */
    tipTF: null,
    logoIsShowOver: false,

    TXT: "快乐用心一点",
    ctor: function () {
        this._super();

        this.createView();
    },

    createView: function () {
        var bg = new cc.Sprite(res.logo_bg);
        bg.name = "logo_bg";
        bg.anchorX = bg.anchorY = 0;
        bg.scaleX = Const.WIN_W / bg.width;
        bg.scaleY = Const.WIN_H / bg.height;
        this.addChild(bg);
        //logo
        this.logo = new cc.Sprite(res.logo);
        this.logo.name = "logo";
        this.logo.anchorX = 96 / 149;
        this.logo.anchorY = 0;
        this.logo.x = Const.WIN_W / 2 + 10;
        this.logo.y = Const.WIN_H / 2 - 51;
        this.addChild(this.logo);
        //line
        this.line = new cc.Sprite(res.logo_line);
        this.line.name = "line";
        this.line.x = Const.WIN_W / 5;
        this.line.y = Const.WIN_H / 2 - 50;
        this.line.scaleX = 0;
        this.addChild(this.line);
        //leaf
        this.leaf = new cc.Sprite(res.logo_leaf);
        this.leaf.name = "leaf";
        this.leaf.rotation = -12.5;
        this.leaf.anchorX = 1;
        this.leaf.anchorY = 1;
        this.leaf.x = 0;
        this.leaf.y = 550;
        this.leaf.visible = false;
        this.addChild(this.leaf);
        //tip
        this.tipTF = new cc.LabelBMFont(this.TXT, res.logo_font_fnt);
        this.tipTF.rotation = -9.5;
        this.tipTF.visible = false;
        this.tipTF.x = 256;
        this.tipTF.y = 370;
        this.addChild(this.tipTF);
        //url
        this.url = new cc.Sprite(res.logo_url);
        this.url.anchorX = 0.5;
        this.url.x = Const.WIN_W / 2;
        this.url.y = Const.WIN_H * 0.2;
        this.url.alpha = 0;
        this.addChild(this.url);

        this.showStartAnim();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.onClick
        }, this);
    },

    onClick: function () {
        if (cc.sys.isNative) {
            //TODO show my home url
        } else {
            window.open("http://www.uyaer.com");
        }
    },

    showStartAnim: function () {
        this.logo.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.scaleTo(0.5, 0.25),
            cc.moveTo(0.5, Const.WIN_W * 0.2, this.logo.y).easing(cc.easeSineIn()),
            cc.callFunc(function () {
                //TODO over
            })
        ));
    },

    setProgress: function (current, total) {
        var percent = current / total;
        percent = limit(percent, 0, 1);
        this.line.width = percent * 0.6 * Const.WIN_W;
        this.logo.x = percent * 0.6 * Const.WIN_W + 0.2 * Const.WIN_W;
        this.logo.scale = 0.25 + 0.75 * percent;
    },

    loadOver: function () {
        this.line.runAction(cc.spawn(
            cc.scaleTo(0.5, 0, 1).easing(cc.easeSineIn()),
            cc.moveTo(0.5, 0, this.line.y).easing(cc.easeSineIn())
        ));
        this.logo.runAction(cc.sequence(
            cc.moveTo(0.5, 250, this.logo.y).easing(cc.easeSineIn()),
            cc.spawn(
                cc.moveTo(0.8, 217, 434).easing(cc.easeSineIn()),
                cc.rotateTo(0.8, -30).easing(cc.easeSineIn())
            )
        ));

        this.leaf.visible = true;
        this.leaf.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.moveTo(0.8, 600, 395).easing(cc.easeSineIn()),
            cc.callFunc(this.startPrinter, this)
        ));
    },

    printerIndex: 0,

    startPrinter: function () {
        this.url.runAction(cc.spawn(
            cc.fadeIn(0.5),
            cc.moveTo(0.5, this.url.x, 717)
        ));

        this.tipTF.visible = true;
        this.printer();
    },

    printer: function () {
        this.printerIndex++;
        if (this.printerIndex > this.TXT.length) {
            setTimeout(function () {
                this.logoIsShowOver = true;
            }, 1500);
            return;
        }

        this.tipTF.text = this.TXT.substr(0, this.printerIndex);
        setTimeout(this.printer, 200);
    }
});