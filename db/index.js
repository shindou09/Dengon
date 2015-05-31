/**
 * Created by Administrator on 15-5-26.
 */

var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/dengon_db");
exports.mongoose = mongoose;
