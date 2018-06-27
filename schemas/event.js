var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//user shema
module.exports = eventSchema = new Schema({
    name: String,
    description:String,
    h_debut: String,
    h_fin: String,
    uploaded_by: {type: Schema.Types.ObjectId, ref: 'User'},
    cours:{          
        id :{type: mongoose.Schema.Types.ObjectId, ref: 'Cours'},
        date: {type: Date, default: Date.now}
        },
    date:{
        type: Date,
        default: Date.now
    },
    create_date:{
        type: Date,
        default: Date.now
    }
});
