var PopUpManager = {
    _list: []
}

PopUpManager.reset = function () {
    PopUpManager._list = [];
}

/**
 * 添加
 * @param node {cc.Node}
 */
PopUpManager.add = function (node) {
    var scene = cc.director.getRunningScene();
    if (scene && node) {
        scene.addChild(node, 1000);
        PopUpManager._list.push(node);
    }
}
/**
 * 删除
 * @param node {cc.Node}
 */
PopUpManager.remove = function (node) {
    if (node) {
        node.removeFromParent();
        for (var i = 0; i < PopUpManager._list.length; i++) {
            if (PopUpManager._list[i] == node) {
                PopUpManager._list.splice(i, 1);
            }
        }
    }
}

PopUpManager.pop = function () {
    /**@type cc.Node*/
    var node = PopUpManager._list.pop();
    node.removeFromParent();
}

PopUpManager.popLength = function () {
    return PopUpManager._list.length;
}