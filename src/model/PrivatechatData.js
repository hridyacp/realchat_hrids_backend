const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/chatapp');
const Schema = mongoose.Schema;
var newPrivatehatSchema = new Schema({
    user:String,
    message:String,
    room:String,
    date:String,
    time:String,
    month:String,
    imgfile:String
});

var PrivatechatData = mongoose.model('privatechat',  newPrivatehatSchema);
module.exports = PrivatechatData;