var mongoose = require('mongoose');
var Schema = mongoose.Schema;


//user shema
module.exports = annonceSchema = new Schema({
    TYPE_BIEN: String,
    ETAT:String,
    NO_ASP:String,
    NO_DOSSIER:String,
    NO_MANDAT:String,
    ADR:String,
    SUITE_ADR:String,
    CP:String,
    VILLE:String,
    REF_ADB:String,
    LOYER_HC:String,
    INDICE_NATURE_CHARGE:String,
    COMPLEMENT_LOYER:String,
    HONO_ETAT_LIEU_LOC:String,
    LOYER_CC:String,
    TRAVAUX:String,
    TAXE_HAB:String,
    DEP_G:String,
    SURF_HAB:String,
    SURF_JAR:String,
    TYPE_BIEN:String,
    ETAT_AVANC:String,
    NB_PCE:String,
    NB_CHB:String,
    ETAGE:String,
    NB_ETAGE:String,
    NB_WC:String,
    NB_SDB:String,
    NB_SE:String,
    NB_PARK_INT:String,
    NB_PARK_EXT:String,
    NB_BOX:String,
    ANNEE_CONS:String,
    NB_CAVE:String,
    NB_BALCON:String,
    ASCE:String,
    HAND:String,
    INTERPHONE:String,
    DIGICODE:String,
    CAUTION:String,
    OCC_PROP:String,
    CC:String,
    PISCINE:String,
    MEUBLE:String,
    DATE_CREATION:String,
    DATE_MODIF:String,
    DATE_MAND:String,
    DATE_LIBER:String,
    DATE_DISP:String,
    DATE_FIN_BAIL:String,
    TXT_INTERNET:String,
    NB_TERR:String,
    NB_NIV:String,
    DUREE_BAIL:String,
    SURF_SEJ:String,
    HONO_LOC:String,
    MANDAT_ALG:String,
    DATE_INIT_PH:String,
    TOTAL_HONO_TTC:String,
    VAL_DPE:String,
    VAL_GES:String,
    ALI:String,
    NON_DPE:String,
    PRIX_CONF:String,
    CANAUX:String,
    FILTRES:String,
    PHOTOS:String,
    PIECES:String,
    CONTACTS:String,
    LANGUES:[{          
        CODE:String
        }],
   create_date:{
        type: Date,
        default: Date.now
    }
});