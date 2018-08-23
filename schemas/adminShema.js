var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//admin shema
module.exports = userSchema = new Schema({
    email:{ type: String,  required:true, index: { unique: true }},
    password:String,
    phone:String,
    name: String,
    prenon:String,
    code: String,
    active:{type: Boolean, default: true},
    create_date:{
        type: Date,
        default: Date.now
    }
});
