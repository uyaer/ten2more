var TimerTicker = {};
/**
 * 已经经过的时间
 */
TimerTicker.__hasUseTime = 0;
TimerTicker.__tickerLocalTime = 0;

TimerTicker.stepTimeRun = function () {
    TimerTicker.__hasUseTime = 0;
    TimerTicker.__tickerLocalTime = Date.now();

    setInterval(TimerTicker._update, 100);
}

TimerTicker._update = function () {
    var now = Date.now();
    var dt = now - TimerTicker.__tickerLocalTime;
    TimerTicker.__tickerLocalTime = now;

    TimerTicker.__hasUseTime += dt;
    if (TimerTicker.__hasUseTime >= gameStepVo.perUpdate) {
        TimerTicker.__hasUseTime -= gameStepVo.perUpdate;
        gameStepVo.step++;
        gameStepVo.step = limit(gameStepVo.step, 0, gameStepVo.maxStep);
    }
}

/**
 * 获取剩余时间
 * @returns {number} 毫秒
 */
TimerTicker.getNeedTime = function () {
    return gameStepVo.perUpdate - TimerTicker.__hasUseTime;
}


