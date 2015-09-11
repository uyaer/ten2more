/**
 * Bmob Object
 */

/**
 * 步数对象
 */
var GameStepVo = Bmob.Object.extend("GameStep", {
    /**
     * 用户id
     * @type {string}
     */
    userId: "",
    /**
     * 当前步数
     * @type {number}
     */
    step: 50,
    /**
     * 最大步数
     * @type {number}
     */
    maxStep: 50,
    /**
     * 上一次恢复时间
     * @type {number}
     */
    lastUpdateTime: 0,
    /**
     * 多少毫秒回复一步
     * @type {number}
     */
    perUpdate: 6000,
    /**
     * 远程保存数据
     */
    saveToRemote: function () {
        this.save({
            "userId": this.userId,
            "step": this.step,
            "maxStep": this.maxStep,
            "lastUpdateTime": this.lastUpdateTime
        });
    },
    /**
     * 将远程数据绑定到本地
     */
    bindData: function (obj) {
        this.userId = obj.get("userId");
        this.step = obj.get("step");
        this.maxStep = obj.get("maxStep");
        this.lastUpdateTime = obj.get("lastUpdateTime");
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
            gameStepVo.bindData(object);
        },
        error: function (error) {
            gameStepVo.lastUpdateTime = Date.now();
            gameStepVo.saveToRemote();
        }
    });
}

