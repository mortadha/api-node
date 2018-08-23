var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//user shema
module.exports = userSchema = new Schema({
    phone:{ type: String,  required:true, index: { unique: true }},
    name: String,
    prenon:{ text: String, visible: Boolean },
    code: String,
    active:{type: Boolean, default: false},
    path_img: { type: String, default: "" },
    path_video: { type: String,  default: "" },
    adresse:[{ text: String, visible: Boolean }],
    age :[{ text: String, visible: Boolean }],
    email:[{ text: String, visible: Boolean }],
    ville: String,
    démocrate : { type: Number, min: 0, max: 100 , default: 100  },
    number_fflok : { type: Number , default: 0  },
    statu: {type: Boolean, default: true},
    latitude: String,
    longitude: String,
    fflok   :[{          
        id :{type: mongoose.Schema.Types.ObjectId, ref: 'Fflok'},
        acepte: {type: Boolean, default: false},
        vote: {type: Boolean, default: false},
        date: {type: Date, default: Date.now},
        create_by_me : Boolean
        }],
    geo: {
        type: [Number],
        index: '2d'
      },
    profil_mode:String,
    registrationToken:String,
    lang:{type: String, default: 'FR'},
    likers:[{          
        id :{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        like: {type: Boolean, default: true},
        score: {type: Number, default: 0},
        date: {type: Date, default: Date.now}
        }],
    favorite_place :[{          
        id :{type: mongoose.Schema.Types.ObjectId, ref: 'Place'},
        like: {type: Boolean, default: true},
        date: {type: Date, default: Date.now}
        }],
    badge :[{
        name:String,
        subtitle:String,
        date: {type: Date, default: Date.now}
    }],    
    create_date:{
        type: Date,
        default: Date.now
    }
});
