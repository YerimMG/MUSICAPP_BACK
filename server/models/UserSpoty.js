const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const SpotyInfoUser = new Schema({
    country:          String,
    display_name:     String,
    email:            String,
    explicit_content: { 
      filter_enabled: Boolean, 
      filter_locked:  Boolean 
    }, 
    external_urls:    {spotify: String},
    followers:        {
      href:           Boolean,
      total:          Number
    },
    href:             String,
    spotyId:          String,
    images:[{
      height:         Boolean,
      url:            String, 
      width:          Boolean
    }],
    product:          String,
    type: String,
    uri:  String,
    access_token:   String,
    refresh_token:  String, 
    
},{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

module.exports = mongoose.model('SpotyInfoUser', SpotyInfoUser);
