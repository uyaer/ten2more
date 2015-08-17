/**
 * @module anysdk
 */
var anysdk = anysdk || {};

/**
 * @class PluginProtocol
 */
anysdk.PluginProtocol = {

    /**
     * @brief get plugin name
     * @method getPluginName
     * @return {string}
     */
    getPluginName: function () {
        return 0;
    },

    /**
     * @brief get the version of plugin
     * @method getPluginVersion
     * @return {string}
     */
    getPluginVersion: function () {
        return;
    },

    /**brief set plugin name
     * @method setPluginName
     * @param {string} name
     */
    setPluginName: function (pluginName) {
    },

    /**
     * @brief get the version of sdk
     * @method getSDKVersion
     * @return {string}
     */
    getSDKVersion: function () {
        return;
    },


    /**
     * @brief methods for reflections
     * @method callFuncWithParam
     * @param {String} functionName
     * @param {PluginParam} param1, ..
     */
    callFuncWithParam: function () {
        return;
    },

    /**
     * @brief methods for reflections
     * @method callStringFuncWithParam
     * @param {String} functionName
     * @param {PluginParam} param1, ..
     */
    callStringFuncWithParam: function () {
        return;
    },

    /**
     * @brief methods for reflections
     * @method callBoolFuncWithParam
     * @param {String} functionName
     * @param {PluginParam} param1, ..
     */
    callBoolFuncWithParam: function () {
        return;
    },

    /**
     * @brief methods for reflections
     * @method callIntFuncWithParam
     * @param {String} functionName
     * @param {PluginParam} param1, ..
     */
    callIntFuncWithParam: function () {
        return;
    },

    /**
     * @brief methods for reflections
     * @method callFloatFuncWithParam
     * @param {String} functionName
     * @param {PluginParam} param1, ..
     */
    callFloatFuncWithParam: function () {
        return;
    },

};

/**
 * @class PluginFactory
 */
anysdk.PluginFactory = {

    /**
     * @brief Destory the instance of PluginFactory
     * @method purgeFactory
     */
    purgeFactory: function () {
    },

    /**
     * @brief Get singleton of PluginFactory
     * @method getInstance
     * @return {anysdk.PluginFactory}
     */
    getInstance: function () {
        return anysdk.PluginFactory;
    },

};

/**
 * @class PluginManager
 */
anysdk.PluginManager = {

    /**
     * @brief unload the plugin by name and type
     * @method unloadPlugin
     * @param {string} name
     * @param {number} pluginType
     */
    unloadPlugin: function (pluginName,
                            pluginType) {
    },

    /**
     * @brief load the plugin by name and type
     * @method loadPlugin
     * @param {string} pluginName
     * @param {number} pluginType
     * @return {anysdk.PluginProtocol}
     */
    loadPlugin: function (pluginName,
                          pluginType) {
        return anysdk.PluginProtocol;
    },

    /**
     * @brief Destory the instance of PluginManager
     * @method end
     */
    end: function () {
    },

    /**
     * @brief Get singleton of PluginManager
     * @method getInstance
     * @return {anysdk.PluginManager}
     */
    getInstance: function () {
        return anysdk.PluginManager;
    },

};

/**
 * @class ProtocolIAP
 */
anysdk.ProtocolIAP = {

    /**
     * @brief get plugin id
     * @method getPluginId
     * @return {string}
     */
    getPluginId: function () {
        return;
    },

    /**
     * @brief get order id
     * @method getOrderId
     * @return {string}
     */
    getOrderId: function () {
        return;
    },

    /**
     * @brief change the state of paying
     * @method resetPayState
     */
    resetPayState: function () {
        return;
    },

    /**
     * @breif set the result listener
     * @method setResultListener
     * @param {function} onResultListener
     * @param {object} target
     */
    setResultListener: function () {
    },

    /**
     * @rief pay for product
     * @method payForProduct
     * @param {object} productInfo
     * like: {key1:"value1", key2:"value2"}
     */
    payForProduct: function () {
    },

};

/**
 * @class ProtocolAnalytics
 */
anysdk.ProtocolAnalytics = {

    /**
     * @brief Track an event begin.
     * @method logTimedEventBegin
     * @param {string} eventId, The identity of event
     */
    logTimedEventBegin: function (eventId) {
    },

    /**
     * @brief log an error
     * @method logError
     * @param {string} errorId, The identity of error
     * @param {string} message, Extern message for the error
     */
    logError: function (errorId,
                        message) {
    },

    /**
     * @method setCaptureUncaughtException
     * @param {bool} arg0
     */
    setCaptureUncaughtException: function (bIsCapture) {
    },

    /**
     * @brief Set the timeout for expiring a session.
     * @method setSessionContinueMillis
     * @param {number} millis In milliseconds as the unit of time.
     */
    setSessionContinueMillis: function (millis) {
    },

    /**
     * @brief Start a new session.
     * @method startSession
     */
    startSession: function () {
    },

    /**
     * @brief Stop a session.
     * @method stopSession
     */
    stopSession: function () {
    },

    /**
     * @brief Check function the plugin support or not
     * @method isFunctionSupported
     * @param functionName
     * @return {bool}
     */
    isFunctionSupported: function (functionName) {
    },

    /**
     * @brief Track an event begin.
     * @method logTimedEventEnd
     * @param {string} eventId, The identity of event
     */
    logTimedEventEnd: function (eventId) {
    },

    /**
     * @brief log an event.
     * @method logEvent
     * @param {string} eventId, The identity of event
     * @param {object} param, like:{key1:"value1", ley2:"value2"}
     */
    logEvent: function (eventId,
                        param) {
    },

    /**
     * @brief Whether to catch uncaught exceptions to server.
     * @method setCaptureUncaughtException
     * @param {bool} enabled
     */
    setCaptureUncaughtException: function (enabled) {
    },

};

/**
 * @class ProtocolAds
 */
anysdk.ProtocolAds = {

    /**
     * @method showAds
     * @param1 {number} AdsType.adType
     * @param2 {number} idx, index of AD
     */
    showAds: function (adstype,
                       idx) {
    },

    /**
     * @method hideAds
     * @param1 {number} AdsType.adType
     * @param2 {number} idx, index of AD
     */
    hideAds: function (adstype,
                       idx) {
    },

    /**
     * @method preloadAds
     * @param1 {number} AdsType.adType
     * @param2 {number} idx, index of AD
     */
    preloadAds: function (adstype,
                          idx) {
    },

    /**
     * @method queryPoints
     * @return {number}
     */
    queryPoints: function () {
        return 0;
    },

    /**
     * @method spendPoints
     * @param {number} points
     */
    spendPoints: function (points) {
    },

    /**
     * @method isAdTypeSupported
     * @param {number} AdsType.adType
     * @return {bool}
     */
    isAdTypeSupported: function (adType) {
        return false;
    },

    /**
     * @breif set the result listener
     * @method setAdsListener
     * @param {function} onAdsListener
     * @param {object} target
     */
    setAdsListener: function () {
    },

};

/**
 * @class ProtocolSocial
 */
anysdk.ProtocolSocial = {

    /**
     * @method showLeaderboard
     * @param {string} leaderboardID
     */
    showLeaderboard: function (leaderboardID) {
    },

    /**
     * @method signOut
     */
    signOut: function () {
    },

    /**
     * @method showAchievements
     */
    showAchievements: function () {
    },

    /**
     * @method signIn
     */
    signIn: function () {
    },

    /**
     * @method submitScore
     * @param {string} leadboardID
     * @param {number} score
     */
    submitScore: function (leadboardID,
                           score) {
    },

    /**
     * @breif set the result listener
     * @method setListener
     * @param {function} onSocialListener
     * @param {object} target
     */
    setListener: function () {
    },

    /**
     * @breif methods of achievement feature
     * @method unlockAchievement
     * @param the info of achievement, {object} info, {key1:value1,key2:value2,..}
     */
    unlockAchievement: function () {
    },

};

/**
 * @class ProtocolUser
 */
anysdk.ProtocolUser = {

    /**
     * @method isLogined
     * @return {bool}
     */
    isLogined: function () {
        return false;
    },

    /**
     * @method getUserID
     * @return {string}
     */
    getUserID: function () {
        return;
    },

    /**
     * @method isFunctionSupported
     * @param {string} funcName
     * @return {bool}
     */
    isFunctionSupported: function (funcName) {
        return false;
    },

    /**
     * @method login
     */
    login: function () {
    },

    /**
     * @method login
     * @param1 {String} server_id
     */
    login: function (server_id) {
    },

    /**
     * @method login
     * @param1 {String} server_id
     * @param2 {String} oauthLoginServer
     */
    login: function (server_id,
                     oauthLoginServer) {
    },

    /**
     * @method getPluginId
     * @return {string}
     */
    getPluginId: function () {
        return;
    },

    /**
     * @breif set the result listener
     * @method setActionListener
     * @param {function} onUserActionListener
     * @param {object} target
     */
    setActionListener: function () {
    },

};

/**
 * @class ProtocolPush
 */
anysdk.ProtocolPush = {

    /**
     * @method startPush
     */
    startPush: function () {
    },

    /**
     * @method closePush
     */
    closePush: function () {
    },

    /**
     * @method delAlias
     * @param {string} alias
     */
    delAlias: function (alias) {
    },

    /**
     * @method setAlias
     * @param {string} alias
     */
    setAlias: function (alias) {
    },

    /**
     * @method setTags
     * @param {Object} [tag1,tag2,..]
     */
    setTags: function (object) {
    },

    /**
     * @method delTags
     * @param {Object} [tag1,tag2,..]
     */
    delTags: function (object) {
    },

    /**
     * @breif set the result listener
     * @method setActionListener
     * @param {function} onPushrActionListener
     * @param {object} target
     */
    setActionListener: function () {
    },

};

/**
 * @method delTags
 * @param {Object} [tag1,tag2,..]
 */
delTags : function (object) {
}
,

/**
 * @breif set the result listener
 * @method setActionListener
 * @param {function} onPushrActionListener
 * @param {object} target
 */
setActionListener : function () {
}
,

}
;

/**
 * @class AgentManager
 */
anysdk.AgentManager = {

    /**
     * @method getSocialPlugin
     * @return {anysdk.ProtocolSocial}
     */
    getSocialPlugin: function () {
        return anysdk.ProtocolSocial;
    },

    /**
     * @method unloadAllPlugins
     */
    unloadAllPlugins: function () {
    },

    /**
     * @method loadAllPlugins
     */
    loadAllPlugins: function () {
    },

    /**
     * @method getUserPlugin
     * @return {anysdk.ProtocolUser}
     */
    getUserPlugin: function () {
        return anysdk.ProtocolUser;
    },

    /**
     * @method init
     * @param {string} appKey
     * @param {string} appSecret
     * @param {string} privateKey
     * @param {string} oauthLoginServer
     */
    init: function (appKey,
                    appSecret,
                    privateKey,
                    oauthLoginServer) {
    },

    /**
     * @method getAdsPlugin
     * @return {anysdk.ProtocolAds}
     */
    getAdsPlugin: function () {
        return anysdk.ProtocolAds;
    },

    /**
     * @method getPushPlugin
     * @return {anysdk.ProtocolPush}
     */
    getPushPlugin: function () {
        return anysdk.ProtocolPush;
    },

    /**
     * @method getSharePlugin
     * @return {anysdk.ProtocolShare}
     */
    getSharePlugin: function () {
        return anysdk.ProtocolShare;
    },

    /**
     * @method getAnalyticsPlugin
     * @return {anysdk.ProtocolAnalytics}
     */
    getAnalyticsPlugin: function () {
        return anysdk.ProtocolAnalytics;
    },

    /**
     * @brief Get all IAP plugin
     * @method getIAPPlugin
     * @return {key1:anysdk.ProtocolAnalytics, key2:anysdk.ProtocolAnalytics, ..}
     */
    getIAPPlugin: function () {
        return obj;
    },

    /**
     * @method getChannelId
     * @return {String}
     */
    getChannelId: function () {
        return;
    },

    /**
     * @method getCustomParam
     * @return {String}
     */
    getCustomParam: function () {
        return;
    },

    /**
     * @method getFrameworkVersion
     * @return {String}
     */
    getFrameworkVersion: function () {
        return;
    },

    /**
     * @method setIsAnaylticsEnabled
     * @param {bool} isEnable
     */
    setIsAnaylticsEnabled: function () {
        return;
    },

    /**
     * @method isAnaylticsEnabled
     * @return {bool}
     */
    isAnaylticsEnabled: function () {
        return;
    },

    /**
     * @method end
     */
    end: function () {
    },

    /**
     * @method getInstance
     * @return {anysdk.AgentManager}
     */
    getInstance: function () {
        return anysdk.AgentManager;
    },

};
