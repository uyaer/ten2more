var AudioManager = {};
AudioManager.instance = {
    _isAudio: true,
    _bgsoundName: "",
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
    if (!this.getIsAudio()){
        if(name)this._bgsoundName = name;
        return;
    }
    if (cc.audioEngine.isMusicPlaying() && name && this._bgsoundName == name) return;
    if (!name) {
        name = this._bgsoundName;
    } else {
        this._bgsoundName = name;
    }
    cc.audioEngine.playMusic(name, true);
}
AudioManager.instance.stopBgSound = function () {
    cc.audioEngine.stopMusic();
}
AudioManager.instance.playEffect = function (name) {
    if (!this.getIsAudio())return;
    cc.audioEngine.playEffect(name, false);
}

this["AudioManager"] = AudioManager;

