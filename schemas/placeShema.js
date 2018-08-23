var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//Place shema
module.exports = placeSchema = new Schema({
    name:String,
    vote:String,
    login:String,
    password:String,
    adresse: String,
    latitude: String,
    longtitude: String,
    phone: String,
    id_google: String,
    path_img : String,
    premium : {type: Boolean, default: false},
    statut : {type: Boolean, default: true},
    wins:{type:Number, default:0},
    total_fflok:{type:Number, default:0},
    registrationToken:[{
        token: String
    }],
    fflok   :[{          
        id: {type: mongoose.Schema.Types.ObjectId, ref: 'Fflok'},
        status: {type: Boolean, default: false},
        win: {type: Boolean, default: false},
        date: {type: Date, default: Date.now},
        }],
    geo: {
        type: [Number],
        index: '2d'
      },
    type:{type: String, default: 'Restaurant'},
    tags:[{
        text :{type: String}
    }],
    messages:[{
        text :{type: String},
        visible :{type: Boolean,default:true},
        score :{type:Number, default:0}
    }],
    images:[{
        position :{type: String},
        path :{type: String}
     }],
    create_date:{
        type: Date,
        default: Date.now
    }
});
