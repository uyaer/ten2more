function HashMap(obj) {
    this._data = obj || {};
}

HashMap.prototype.get = function (key) {
    return this._data[key];
}
HashMap.prototype.set = function (key, val) {
    this._data[key] = val;
}
HashMap.prototype.has = function (key) {
    return this._data[key];
}
HashMap.prototype.toJSON = function () {
    return this._data;
}
