var AudioManager = {};
AudioManager.instance = {
    selectEffectIndex: 0,
    _isAudio: true,
    _bgsoundName: "res/audio/bgsound.mp3",
    getIsAudio: function () {
        return this._isAudio;
    },
    setIsAudio: function (val) {
        if (this._isAudio == val)return;
        this._isAudio = val;
        GameManager.instance.saveCfg();
        if (val) {
            this.playBgSound();
        } else {
            this.stopBgSound();
        }
    }
};
AudioManager.instance.playBgSound = function (name) {
    if (!this.getIsAudio()) {
        if (name)this._bgsoundName = name;
        return;
    }
    if (cc.audioEngine.isMusicPlaying() && name && this._bgsoundName == name) return;
    if (!name) {
        name = this._bgsoundName;
    } else {
        this._bgsoundName = name;
    }
    cc.audioEngine.playMusic(name, true);
    cc.audioEngine.setMusicVolume(0.5);
}
AudioManager.instance.stopBgSound = function () {
    cc.audioEngine.stopMusic();
}
AudioManager.instance.playEffect = function (name) {
    if (!this.getIsAudio())return;
    cc.audioEngine.playEffect(name, false);
}
/**
 * 队列播放音效
 */
AudioManager.instance.playEffectOneByOne = function () {
    if (!this.getIsAudio())return;
    this.selectEffectIndex++;
    var name = "res/audio/m" + this.selectEffectIndex + ".mp3";
    cc.audioEngine.playEffect(name, false);
}

this["AudioManager"] = AudioManager;

