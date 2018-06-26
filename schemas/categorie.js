var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//user shema
module.exports = categorieSchema = new Schema({
    name: String,
    description:String,
    create_date:{
        type: Date,
        default: Date.now
    }
});
