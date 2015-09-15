var Lang = {};
Lang._data = {};
Lang.init = function () {
    var data = cc.loader.getRes(res.data);
    var arr = data["i18n"];
    for (var i = 0; i < arr.length; i++) {
        var obj = arr[i];
        Lang._data[obj.id] = obj[Const.LANG];
    }
}

Lang.i18n = function (id) {
    var str = Lang._data[id];
    if (str) {
        return str.replace("\\n","\n");
    } else {
        trace("lang no id: " + id)
        return "";
    }
}