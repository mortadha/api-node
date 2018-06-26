var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//user shema
module.exports = eventSchema = new Schema({
    name: String,
    description:String,
    h_debut: String,
    fin: String,
    cours:[{          
        id :{type: mongoose.Schema.Types.ObjectId, ref: 'Cours'},
        date: {type: Date, default: Date.now}
        }],
    date:{
        type: Date,
        default: Date.now
    },
    create_date:{
        type: Date,
        default: Date.now
    }
});
