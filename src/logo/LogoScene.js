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
    /**
     * @type Function
     */
    callback: null,
    ctor: function (cb) {
        this._super();

        this.callback = cb;

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
        this.logo.x = Const.WIN_W / 2 - 10;
        this.logo.y = Const.WIN_H / 2 + 102;
        this.addChild(this.logo);
        //line
        this.line = new cc.Sprite(res.logo_line);
        this.line.name = "line";
        this.line.x = Const.WIN_W / 5;
        this.line.y = Const.WIN_H / 2 + 100;
        this.line.scaleX = 0;
        this.addChild(this.line);
        //leaf
        this.leaf = new cc.Sprite(res.logo_leaf);
        this.leaf.name = "leaf";
        this.leaf.scale = 2;
        this.leaf.rotation = -12.5;
        this.leaf.anchorX = 1;
        this.leaf.anchorY = 1;
        this.leaf.x = 0;
        this.leaf.y = 600;
        this.leaf.visible = false;
        this.addChild(this.leaf);
        //tip
        this.tipTF = new cc.LabelBMFont(this.TXT, res.logo_font_fnt);
        this.tipTF.rotation = -8.5;
        this.tipTF.visible = false;
        this.tipTF.x = Const.WIN_W / 2 + 20;
        this.tipTF.y = this.logo.y + 40;
        this.addChild(this.tipTF);
        //url
        this.url = new cc.Sprite(res.logo_url);
        this.url.anchorX = 0.5;
        this.url.x = Const.WIN_W / 2;
        this.url.y = Const.WIN_H * 0.2;
        this.url.opacity = 0;
        this.addChild(this.url);

        this.showStartAnim();

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.onClick.bind(this)
        }, this);
    },
    /**
     * 注册点击事件
     * @param touch {cc.Touch}
     * @param event {cc.Event}
     */
    onClick: function (touch, event) {
        var pos = touch.getLocation();
        var rect = cc.rect(this.url.x - this.url.width / 2, this.url.y - this.url.height, this.url.width, this.url.height * 2);
        if (!cc.rectContainsPoint(rect, pos)) {
            this.showClickAnim(pos);
        } else {
            if (cc.sys.isNative) {
                //TODO show my home url
            } else {
                window.open("http://www.uyaer.com");
            }
        }
    },

    /**
     * 开始加载前的动画
     */
    showStartAnim: function () {
        this.logo.runAction(cc.sequence(
            cc.delayTime(0.1),
            cc.scaleTo(0.35, 0.25),
            cc.moveTo(0.45, Const.WIN_W * 0.2, this.logo.y).easing(cc.easeSineIn()),
            cc.callFunc(this.startLoading, this)
        ));
    },

    /**
     * 开始加载资源
     */
    startLoading: function () {
        cc.loader.load(g_resources,
            this.setProgress.bind(this)
            , this.loadOver.bind(this));
    },

    /**
     * 加载进度
     * @param result
     * @param current
     * @param total
     */
    setProgress: function (result, current, total) {
        var percent = current / total;
        percent = limit(percent, 0, 1);
        this.line.scaleX = percent * 0.6 * Const.WIN_W;
        this.logo.x = percent * 0.6 * Const.WIN_W + 0.2 * Const.WIN_W;
        this.logo.scale = 0.25 + 0.75 * percent;
    },

    /**
     * 加载完成动画
     */
    loadOver: function () {
        this.line.runAction(cc.spawn(
            cc.scaleTo(0.35, 0, 1).easing(cc.easeSineIn()),
            cc.moveTo(0.35, 0, this.line.y).easing(cc.easeSineIn())
        ));
        this.logo.runAction(cc.sequence(
            cc.moveTo(0.35, Const.WIN_W * 0.3, this.logo.y).easing(cc.easeSineIn()),
            cc.spawn(
                cc.moveBy(0.4, -10, -35).easing(cc.easeSineIn()),
                cc.rotateTo(0.4, -30).easing(cc.easeSineIn())
            )
        ));

        this.leaf.visible = true;
        this.leaf.runAction(cc.sequence(
            cc.delayTime(0.5),
            cc.moveTo(0.4, Const.WIN_W * 0.8, this.logo.y + 50).easing(cc.easeSineIn()),
            cc.callFunc(this.startPrinter, this)
        ));
    },

    /**
     * 显示网站
     */
    startPrinter: function () {
        this.url.runAction(cc.spawn(
            cc.fadeIn(0.5),
            cc.moveTo(0.5, this.url.x, Const.WIN_H * 0.25)
        ));

        this.tipTF.visible = true;
        this.printer();
    },

    /**
     * 文字一个一个的出现
     */
    printer: function () {
        this.tipTF.visible = true;
        var len = this.TXT.length;
        for (var i = 0; i < len; i++) {
            var c = this.tipTF.getChildByTag(i);
            c.x -= Const.WIN_W * 0.75;
            c.y -= 10;
            var animArr = [cc.delayTime(i * 0.12),
                cc.moveBy(0.2, Const.WIN_W * 0.75, 10)];
            if (i == len - 1) {
                animArr.push(cc.delayTime(0.15));
                animArr.push(cc.scaleTo(0.1, 1.45));
                animArr.push(cc.callFunc(this.showClickAnim, this, cc.p(490, 782)));
                animArr.push(cc.scaleTo(0.1, 1));
                animArr.push(cc.delayTime(2));
                animArr.push(cc.callFunc(this.callback));
            }
            c.runAction(cc.sequence(animArr));
        }
    },

    /**
     * 显示圈圈效果
     */
    showClickAnim: function (target, pos) {
        pos = pos || target;
        for (var i = 0; i < 3; i++) {
            var cir = new cc.Sprite(res.logo_cir);
            cir.setPosition(pos);
            this.addChild(cir);
            cir.opacity = 200;
            cir.scale = 0;
            cir.runAction(cc.sequence(
                cc.delayTime(0.2 * i),
                cc.spawn(
                    cc.scaleTo(0.1, 3.5),
                    cc.fadeOut(0.1)
                ),
                cc.removeSelf()
            ));
        }
    }
});