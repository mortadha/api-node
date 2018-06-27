var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//user shema
eventSchema = require('../schemas/event.js')

var Events = module.exports = mongoose.model('Event',eventSchema)

//Add user 
module.exports.addEvent = function(event,callback){
    Events.create(event,callback);
}
