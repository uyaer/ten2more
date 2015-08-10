var GameManager = {};
GameManager.instance = {

    state: GameState.UN_START,
    /**
     * 当前关卡获得的金币，最后按照比例汇总
     */
    currLvGetGold: 0,
    /**
     * 总金币
     */
    gold: 0,
    /**
     * 当前进行的关卡
     */
    level:1,

    /**
     * 各个关卡的星级数
     * @type HashMap
     */
    levelStarMap:null,

    /**
     * 增加或者减少金币
     * @param val {number}
     */
    changeGold: function (val) {
        this.gold += val;
        cc.eventManager.dispatchCustomEvent(GameEvent.EVENT_GOLD_CHANG);

        this.saveData();
    },

    /**
     * 已经开放的关卡Id
     * @type Array
     */
    hasOpenLevelId: null,
    /**
     * 道具信息 (key ITEM ,id = GoodsVo:id)
     * @type HashMap
     */
    itemMap: null,
    /**
     * 使用的人物皮肤 GoodVo:Id
     */
    useRoleSkinId: 1,
    /**
     * 使用的宠物皮肤 GoodVo:Id
     */
    usePetSkinId: -1,

    /**
     * init data
     */
    init: function () {
        this.loadCfg();
        this.loadData();
    },

    loadCfg: function () {
        var str = cc.sys.localStorage.getItem("game04cityrunner-game-cfg");
        if (str) {
            var json = JSON.parse(str);
            AudioManager.instance.setIsAudio(json["isAudio"]);
        }
    },
    saveCfg: function () {
        var data = {
            "isAudio": AudioManager.instance.getIsAudio()
        }
        cc.sys.localStorage.setItem("game04cityrunner-game-cfg", JSON.stringify(data));
    },


    loadData: function () {
        var str = cc.sys.localStorage.getItem("game04cityrunner-game-data");
        if (str) {
            var json = JSON.parse(str);
            var vertify1 = json["vertify"];
            var data = json["data"];
            str = JSON.stringify(data);
            var vertify2 = md5(str, Const.VERTIFY_KEY);
            if (vertify1 == vertify2) {
                this.gold = data["gold"] || 100000;
                this.hasOpenLevelId = data["hasOpenLevelId"] || [1];
                this.itemMap = new HashMap(data["itemMap"]);
                this.levelStarMap = new HashMap(data["levelStarMap"]);
                this.useRoleSkinId = data["useRoleSkinId"] || 1;
                this.usePetSkinId = data["usePetSkinId"] || -1;
            } else {
                this.useInitFullData();
            }
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
        var data = {
            "gold": this.gold,
            "hasOpenLevelId": this.hasOpenLevelId,
            "itemMap": this.itemMap.toJSON(),
            "levelStarMap": this.levelStarMap.toJSON(),
            "useRoleSkinId": this.useRoleSkinId,
            "usePetSkinId": this.usePetSkinId
        };
        var dataStr = JSON.stringify(data);
        var vertify = md5(dataStr, Const.VERTIFY_KEY);
        var game_data = {
            "vertify": vertify,
            "data": data
        }
        cc.sys.localStorage.setItem("game04cityrunner-game-data", JSON.stringify(game_data));
    },

    /**
     * 默认值
     */
    useInitFullData: function () {
        this.gold = 100000;
        this.hasOpenLevelId = [1];
        this.itemMap = new HashMap();
        this.levelStarMap = new HashMap();
        this.useRoleSkinId = 1;
        this.usePetSkinId = -1;
    }

};

this["GameManager"] = GameManager;