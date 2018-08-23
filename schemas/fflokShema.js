var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//admin shema
module.exports = fflokSchema = new Schema({
    titre:String,
    date: Date,
    create_by: { type: Schema.Types.ObjectId, ref: 'User' },
    statu:{type: String, default: "closed"},
    images:[{
        uploaded_by: {type: Schema.Types.ObjectId, ref: 'User'},
        date: {type: Date, default: Date.now},
        path_image :{type: String}
    }],
    messages:[{
        send_by_user: {type: Schema.Types.ObjectId, ref: 'User'},
        send_by_place: {type: Schema.Types.ObjectId, ref: 'Place'},
        date: {type: Date, default: Date.now},
        text :{type: String}
    }],
    friends:[{          
        id :{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
        acepte: {type: Boolean, default: true},
        vote: {type: Boolean, default: false},
        place:{type: mongoose.Schema.Types.ObjectId, ref: 'Place'},
        date: {type: Date, default: Date.now}
        }],
    places:[{          
        id :{type: mongoose.Schema.Types.ObjectId, ref: 'Place'},
        date: {type: Date, default: Date.now}
        }],
    final_Place:{ type: Schema.Types.ObjectId, ref: 'Place' },   
    create_date:{
        type: Date,
        default: Date.now
    }
});
