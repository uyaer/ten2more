/**
 * Bmob Object
 */

/**
 * 步数对象
 */
var GameStepVo = Bmob.Object.extend("GameStep", {
    /**
     * 数据库中的id
     */
    id: "",
    /**
     * 用户id
     * @type {string}
     */
    userId: "",
    /**
     * 当前步数
     * @type {number}
     */
    step: 100,
    /**
     * 最大步数
     * @type {number}
     */
    maxStep: 100,
    /**
     * 上一次恢复时间
     * @type {number}
     */
    lastUpdateTime: 0,
    /**
     * 多少毫秒回复一步
     * @type {number}
     */
    perUpdate: 60000,
    /**
     * 创建数据
     */
    createToRemote: function () {
        this.save({
            "userId": this.userId,
            "step": this.step,
            "maxStep": this.maxStep,
            "lastUpdateTime": this.lastUpdateTime
        }, {
            success: function (gameScore) {
                trace("==========>>>create data success")
            },
            error: function (gameScore, error) {
                trace("!!!!!>>>create data fail")
            }
        });
    },
    /**
     * 远程保存数据
     */
    saveToRemote: function () {
        var that = this;
        var query = new Bmob.Query(GameStepVo);
        query.get(this.id, {
            success: function (vo) {
                vo.set("step",that.step);
                vo.set("maxStep",that.maxStep);
                vo.set("lastUpdateTime",that.lastUpdateTime);
                vo.save();
                trace("save data....")
            },
            error: function (object, error) {
                trace("load fail...")
            }
        });
    },
    /**
     * 将远程数据绑定到本地
     */
    bindData: function (obj) {
        this.id = obj.id;
        this.userId = obj.get("userId");
        this.step = obj.get("step");
        this.maxStep = obj.get("maxStep");
        this.lastUpdateTime = obj.get("lastUpdateTime");

        //计算时间差
        var now = Date.now();
        var dt = now - this.lastUpdateTime;
        var count = int(dt / this.perUpdate);
        this.step += count;
        this.step = limit(this.step, 0, this.maxStep);
        this.lastUpdateTime = now;
        if (count >= 1) {
            this.saveToRemote();
        }
    }
});

/**
 * @type GameStepVo
 */
var gameStepVo = new GameStepVo();

/**
 * =======================================
 * ==============Bmob Object==============
 * =======================================
 */
var Net = {};

Net.loadGameStep = function () {
    var query = new Bmob.Query(GameStepVo);
    query.equalTo("userId", gameStepVo.userId);
    query.first({
        success: function (object) {
            // 查询成功
            if (object) {
                gameStepVo.bindData(object);
            } else {
                gameStepVo.lastUpdateTime = Date.now();
                gameStepVo.createToRemote();
            }
        },
        error: function (error) {
            gameStepVo.lastUpdateTime = Date.now();
            gameStepVo.createToRemote();
        }
    });
}

