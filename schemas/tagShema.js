var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//admin shema
module.exports = tagSchema = new Schema({
    text:String,
    type:String,
    create_date:{
        type: Date,
        default: Date.now
    }
});
