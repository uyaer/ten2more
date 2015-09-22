var GameManager = {};
GameManager.instance = {

    state: GameState.UN_START,
    /**
     * 当前进行的关卡的分数
     */
    score: 0,
    /**
     * 历史最高分数
     */
    maxScore: 0,
    /**
     * 历史玩耍次数
     */
    playCount: 0,
    /**
     * 地图数据
     * @typ Array
     */
    map: null,
    /**
     * 是否进行过引导
     */
    isGuided: false,

    /**
     * init data
     */
    init: function () {
        this.loadCfg();
        this.loadData();
    },

    loadCfg: function () {
        var str = cc.sys.localStorage.getItem(Const.STORE_CFG_KEY);
        if (str) {
            var json = JSON.parse(str);
            AudioManager.instance.setIsAudio(json["isAudio"]);
        }
    },
    saveCfg: function () {
        var data = {
            "isAudio": AudioManager.instance.getIsAudio()
        }
        cc.sys.localStorage.setItem(Const.STORE_CFG_KEY, JSON.stringify(data));
    },


    loadData: function (str) {
        if (str) {
            var data = JSON.parse(str);
            this.score = data["score"] || 0;
            this.maxScore = data["maxScore"] || 0;
            this.playCount = data["playCount"] || 0;
            this.map = data["map"] || null;
            this.isGuided = data["isGuided"] || false;
        } else {
            this.useInitFullData();
        }
    },

    /**
     * delay save id
     */
    _saveCfgDelayId: 0,
    /**
     *delay save count
     */
    _saveCfgDelayCount: 0,

    saveData: function () {
        this._saveCfgDelayCount++;
        clearTimeout(this._saveCfgDelayId);
        this._saveCfgDelayId = setTimeout(this._saveDataDelay.bind(this), 1000);
        //当大于10的时候才会保存
        if (this._saveCfgDelayCount > 10) {
            this._saveDataDelay();
        }
    },

    _saveDataDelay: function () {
        this._saveCfgDelayCount = 0;
        var dataStr = this.getSaveDataStr();
        Net.saveGameData(dataStr);
    },

    getSaveDataStr: function () {
        var data = {
            "score": this.score,
            "maxScore": this.maxScore,
            "playCount": this.playCount,
            "isGuided": this.isGuided,
            "map": this.map
        };
        var dataStr = JSON.stringify(data);
        return dataStr;
    },

    /**
     * 默认值
     */
    useInitFullData: function () {
        this.score = 0;
        this.maxScore = 0;
        this.playCount = 0;
        this.map = null;
        this.isGuided = false;
    },

    /**
     * 获取用户id
     * @returns {String}
     */
    getUserId: function () {
        var id = cc.sys.localStorage.getItem(Const.STORE_USER_KEY);
        return id;
    },
    saveUserId: function (id) {
        cc.sys.localStorage.setItem(Const.STORE_USER_KEY, id);
    },
    /**
     * 获取用户数据id
     * @returns {String}
     */
    getGameDataId: function () {
        var id = cc.sys.localStorage.getItem(Const.STORE_GAME_DATA_ID_KEY);
        return id;
    },
    saveGameDataId: function (id) {
        cc.sys.localStorage.setItem(Const.STORE_GAME_DATA_ID_KEY, id);
    }

};

this["GameManager"] = GameManager;