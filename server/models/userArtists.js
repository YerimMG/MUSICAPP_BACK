const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userArtists = new Schema({

  items : [ {

     followers : {
       href  : Boolean,
       total : Number
     },
    genres : [String],
    href :   String,
    id :     String,

    images : [{
      height : Number,
      url  :   String,
      width :  Number
    }],
    name : String,
    popularity : Number,
    uri : String
  }],
  total : Number,
  limit : Number,
  href :  String,
  spotyId: String,
  display_name: String
  
  },{
      timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  });
  
  module.exports = mongoose.model('userArtists', userArtists);
  
