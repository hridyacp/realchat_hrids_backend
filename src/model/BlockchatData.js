const mongoose=require('mongoose');
//Database connection
//mongoose.connect('mongodb+srv://userone:userone@ictakprojectfiles.z0atk.mongodb.net/LIBRARYAPP?retryWrites=true&w=majority');
mongoose.connect('mongodb://localhost:27017/chatapp');
//Schema creation
const Schema=mongoose.Schema;
const BlockchatSchema = new Schema({
   
    from:String,
    to:String,
    from1:String,
    to1:String,
    
    
});

//Model creation
var Blockchatdata=mongoose.model('Blockchatdata',BlockchatSchema);
module.exports=Blockchatdata;