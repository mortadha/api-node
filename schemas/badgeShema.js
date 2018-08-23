var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//badge shema
module.exports = userSchema = new Schema({
    name:String,
    subtitle:String,
    create_date:{
        type: Date,
        default: Date.now
    }
});
