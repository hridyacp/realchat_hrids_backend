const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/chatapp');
const Schema = mongoose.Schema;
var NewChatroomSchema = new Schema({
    name: String,
room: String,
message: String,
date:String,
month:String,
time: String
});

var ChatroomData = mongoose.model('chatroom',  NewChatroomSchema);
module.exports = ChatroomData;