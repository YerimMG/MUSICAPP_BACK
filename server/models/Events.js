const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const Events = new Schema({
  events: [{
    events: [],
    name: String
  }],
  spotyId: String,
  display_name: String,
  access_token:   String,
  refresh_token:  String, 
  access_token:   String,
  refresh_token:  String, 

},{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

module.exports = mongoose.model('Events', Events);
