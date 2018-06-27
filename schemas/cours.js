var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//user shema
module.exports = coursSchema = new Schema({
    name: String,
    description:String,
    objectifs:String,
    mots_clé:String,
    uploaded_by: {type: Schema.Types.ObjectId, ref: 'User'},
    messages:[{
        uploaded_by_user: {type: Schema.Types.ObjectId, ref: 'User'},
        date: {type: Date, default: Date.now},
        text :{type: String}
    }],
    plan:String,
    create_date:{
        type: Date,
        default: Date.now
    }
});
