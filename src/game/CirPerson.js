var CirPerson = cc.Node.extend({
    /**
     * @type cc.Sprite
     */
    leye: null,
    /**
     * @type cc.Sprite
     */
    reye: null,
    /**
     * @type cc.Sprite
     */
    mouse: null,
    ctor: function () {
        this._super();

        var face = new cc.Sprite("#game/p_face.png");
        this.addChild(face);

        var leye = new cc.Sprite("#game/p_eye.png");
        var reye = new cc.Sprite("#game/p_eye.png");
        leye.x = -30;
        reye.x = 30;
        leye.y = reye.y = 25;
        this.addChild(leye);
        this.addChild(reye);
        this.leye = leye;
        this.reye = reye;

        var mouse = new cc.Sprite("#game/p_mouse.png");
        mouse.y = -30;
        this.addChild(mouse);
        this.mouse = mouse;
    },

    /**
     * 显示高兴
     */
    showHappy: function () {
        this.leye.runAction(cc.sequence(
            cc.moveBy(0.1, 10, 0),
            cc.moveBy(0.2, -20, 0),
            cc.moveBy(0.1, 10, 0),
            cc.delayTime(1)
        ).repeatForever());
        this.reye.runAction(cc.sequence(
            cc.moveBy(0.1, 10, 0),
            cc.moveBy(0.2, -20, 0),
            cc.moveBy(0.1, 10, 0),
            cc.delayTime(1)
        ).repeatForever());

        //this.mouse.runAction(cc.sequence(
        //    cc.scaleTo(0.15, 1, 0.1),
        //    cc.delayTime(0.1),
        //    cc.scaleTo(0.15, 1, 1),
        //    cc.delayTime(1)
        //).repeatForever());

        //跳跃
        this.runAction(cc.sequence(
            cc.delayTime(0.4),
            cc.jumpBy(0.4, 0, 0, 50, 1),
            cc.delayTime(0.6)
        ).repeatForever());
    }
});