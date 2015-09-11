var Lang = {};
Lang._data = {};
Lang.init = function () {
    var data = cc.loader.getRes(res.data);
    var arr = data["i18n"];
    for(var i = 0 ; i < arr.length;i ++){
        var obj = arr[i];
        if (cc.sys.language == cc.sys.LANGUAGE_CHINESE) {
            Lang._data[obj.id]=obj["zh"];
        } else {
            Lang._data[obj.id]=obj["en"];
        }
    }
}

Lang.i18n = function (id) {
    var str = Lang._data[id];
    if (str) {
        return str;
    } else {
        trace("lang no id: " + id)
        return "";
    }
}