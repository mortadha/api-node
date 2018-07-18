var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//user shema
annonceSchema = require('../schemas/annonce.js')

var Annonce = module.exports = mongoose.model('Annonce',annonceSchema)

//Add user 
module.exports.addAnnonce = function(annonce,callback){
    Annonce.create(annonce,callback);
}


//Add user 
module.exports.FormatAnnonce = function(annonce){
    let ann = {};
    ann.TYPE_BIEN = annonce.attributes.TYPE_BIEN;
    ann.ETAT = annonce.attributes.ETAT;
    ann.LANGUES = [];
    for (var i = 0 ; i < annonce.children.length ; i++){
        if ( annonce.children[i].name === "LANGUES" ){
            for (var j = 0 ; j < annonce.children[i].children.length ; j++){
                ann.LANGUES.push({CODE :annonce.children[i].children[j].attributes.CODE});
            }
         }
        else {
            ann[annonce.children[i].name] = annonce.children[i].content;
        }
        
    }
 return ann;
}

