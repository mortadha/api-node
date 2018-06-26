var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//user shema
module.exports = userSchema = new Schema({
    name: String,
    prenon:String,
    phone:String,
    adresse:String,
    email:String,
    pseudo:String,
    password:String,
    cours:[{          
        id :{type: mongoose.Schema.Types.ObjectId, ref: 'Cours'},
        date: {type: Date, default: Date.now}
    }],
    abonné:[{          
        id :{type: mongoose.Schema.Types.ObjectId, ref: 'Cours'},
        date: {type: Date, default: Date.now}
        }],
    role:String,   
    create_date:{
        type: Date,
        default: Date.now
    }
});
