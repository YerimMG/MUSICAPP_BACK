const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const userTracks = new Schema({
    
         items: [
           {
            album: {
              album_type: String,
            //  artists: [
            //     {
            //       external_urls: {
            //         spotify: String
            //       },
            //       href: String,
            //       id:   String,
            //       name: String,
            //       uri:  String
            //     }
            //   ],
            //   available_markets: [ String ],
              external_urls: {
                spotify: String
              },
              href: String,
              id:   String,
              images: [
                {
                  height: Number,
                  url:    String,
                  width:  Number
                }
              ],
              name: String,
              release_date: String,
              release_date_precision: String,
              total_tracks: Number,
              uri: String
            },
            artists: [
              {
                external_urls: {
                  spotify: String
                },
                href: String,
                id:   String,
                name: String,
                uri:  String
               }
           ],
            // available_markets: [ String ],
            disc_number: Number,
            // duration_ms: Number,
            // explicit:    Boolean,
            external_ids: {
              isrc: String
            },
            external_urls: {
              spotify: String
            },
            // href: String,
            id:   String,
            // is_local: Boolean,
            name: String,
            // popularity: Number,
            // preview_url:  String,
            track_number: Number,
            // uri:  String
           }
        ],
        total: Number,
        spotyId : String,
        // limit: Number,
        // offset: Number,
        href: String, 
        display_name: String
        // previous: Boolean,
        // next: String
      
},{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

module.exports = mongoose.model('userTracks', userTracks);

