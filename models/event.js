var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//user shema
eventSchema = require('../schemas/event.js')

var Events = module.exports = mongoose.model('Event',eventSchema)

//Add event 
module.exports.addEvent = function(event,callback){
    Events.create(event,callback);
}

//Get events 
module.exports.getEvents = function(callback,limit){
    Events.find(callback).limit(limit);
}

//Get My events 
module.exports.getMyEvents = function(id,callback,limit){
    Events.find({uploaded_by: id},callback).limit(limit);
}

//delete Events 
module.exports.deleteEvents = function(id,callback,limit){
    Events.delete({_id: id},callback);
}