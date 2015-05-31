/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 15-5-28
 * Time: 下午1:33
 * To change this template use File | Settings | File Templates.
 */

var mongoose = require('../db').mongoose;
var Schema = mongoose.Schema;
var Message = new Schema({
    name: String,
    phone: String,
    email: String,
    title: String,
    date: Date,
    contents: String,
    isReply: Boolean,
    reply: Schema.Types.Mixed,
    site: String,
    siteId: Schema.ObjectId
});

Message.methods.doReply = function () {
    return this.model('message').update({_id: this._id}, {$set: {isReply: true, reply: this.reply}})
        .exec().then(function (raw) {
            return raw;
        }, function (err) {throw err});
};

module.exports = mongoose.model('message', Message);

