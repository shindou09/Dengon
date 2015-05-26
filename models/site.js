/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 15-5-26
 * Time: 下午3:49
 * To change this template use File | Settings | File Templates.
 */

var Site = function () {};

Site.prototype.constructor = function (o) {
    this._site = o || {};
};

Object.defineProperties(Site.prototype, {
    "id": {
        writable: false,
        enumerable: true,
        get: function () {return this._site._id;}
    },
    "domain": {
        writable: true,
        enumerable: true,
        get: function () {return this._site.domain;},
        set: function (domain) {this._site.domain = domain;}
    }
});

Site.prototype.insert = function () {

};

module.exports = Site;
