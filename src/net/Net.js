/**
 * Bmob Object
 */

/**
 * 步数对象
 */
var GameStepVo = Bmob.Object.extend("GameStep", {
    /**
     * 远程绑定对象
     * @type Bmob.Object
     */
    remoteBindVo: null,
    /**
     * 数据库中的id
     */
    id: "",
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
        var that = this;
        this.save({
            "step": this.step,
            "maxStep": this.maxStep,
            "lastUpdateTime": this.lastUpdateTime
        }, {
            success: function (vo) {
                that.bindData(vo);
                GameManager.instance.saveUserId(that.id);
                trace("==========>>>create step data success");
                Net.subCount();
            },
            error: function (gameScore, error) {
                trace("!!!!!>>>create step data fail");
                Net.subCount();
            }
        });
    },
    /**
     * 远程保存数据
     */
    saveToRemote: function () {
        var vo = this.remoteBindVo;
        vo.set("step", this.step);
        vo.set("maxStep", this.maxStep);
        vo.set("lastUpdateTime", this.lastUpdateTime);
        vo.save();
    },
    /**
     * 将远程数据绑定到本地
     */
    bindData: function (obj) {
        this.remoteBindVo = obj;
        this.id = obj.id;
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

        Net.subCount();
    }
});

/**
 * @type GameStepVo
 */
var gameStepVo = new GameStepVo();


/**
 * =======================================
 * ==============  游戏数据  ==============
 * =======================================
 */
var GameDataVo = Bmob.Object.extend("GameData", {
    /**
     * 远程绑定对象
     * @type Bmob.Object
     */
    remoteBindVo: null,
    /**
     * 数据库中的id
     */
    id: "",
    /**
     * 当前步数
     * @type {string}
     */
    dataStr: "",

    /**
     * 创建数据
     */
    createToRemote: function () {
        var that = this;
        this.save({
            "dataStr": GameManager.instance.getSaveDataStr()
        }, {
            success: function (vo) {
                that.bindData(vo);
                GameManager.instance.saveGameDataId(that.id);
                trace("==========>>>create game data success");
                Net.subCount();
            },
            error: function (gameScore, error) {
                trace("!!!!!>>>create game data fail");
                Net.subCount();
            }
        });
    },
    /**
     * 远程保存数据
     */
    saveToRemote: function () {
        var vo = this.remoteBindVo;
        vo.set("dataStr", this.dataStr);
        vo.save();
    },
    /**
     * 将远程数据绑定到本地
     */
    bindData: function (obj) {
        this.remoteBindVo = obj;
        this.id = obj.id;
        this.dataStr = obj.get("dataStr");
        GameManager.instance.loadData(this.dataStr);

        Net.subCount();
    }
});
/**
 * @type GameDataVo
 */
var gameDataVo = new GameDataVo();

/**
 * =======================================
 * ==============Bmob Object==============
 * =======================================
 */
var Net = {
    /**
     * 同时请求的网络次数
     */
    count: 0,
    /**
     * 减少次数
     */
    subCount: function () {
        this.count--;
        if (this.count <= 0) {
            this.count = 0;
            LoadingGif.hide();
        }
    }
};

Net.loadGameStep = function () {
    this.count++;
    var query = new Bmob.Query(GameStepVo);
    if (gameStepVo.id) {
        query.get(gameStepVo.id, {
            success: function (object) {
                // 查询成功
                if (object) {
                    gameStepVo.bindData(object);
                } else {
                    gameStepVo.lastUpdateTime = Date.now();
                    gameStepVo.createToRemote();
                }
            },
            error: function () { //没有找到
                gameStepVo.lastUpdateTime = Date.now();
                gameStepVo.createToRemote();
            }
        });
    } else {
        gameStepVo.lastUpdateTime = Date.now();
        gameStepVo.createToRemote();
    }
}

Net.loadGameData = function () {
    this.count++;
    var query = new Bmob.Query(GameDataVo);
    if (gameDataVo.id) {
        query.get(gameDataVo.id, {
            success: function (object) {
                // 查询成功
                if (object) {
                    gameDataVo.bindData(object);
                } else {
                    gameDataVo.createToRemote();
                }
            },
            error: function () { //没有找到
                gameDataVo.createToRemote();
            }
        });
    } else {
        gameDataVo.createToRemote();
    }
}

Net.saveGameData = function (dataStr) {
    if (gameDataVo.id) {
        gameDataVo.dataStr = dataStr;
        gameDataVo.saveToRemote();
    }
}
