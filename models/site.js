/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 15-5-26
 * Time: 下午3:49
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('../db').mongoose;
var Schema = mongoose.Schema;

var Site = new Schema({
    domain: String
});

Site.methods.updateSite = function () {
    return mongoose.model('site').update({_id: this._id}, {$set: {domain: this.domain}}).then(function (raw) {
        return raw;
    }, function (err) {throw err;});
};

module.exports = mongoose.model('site', Site);
