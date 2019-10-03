const mongoose = require('mongoose');
const Schema   = mongoose.Schema;


const FollowedArtists = new Schema({

  artists: {
    items: [
      {
        external_urls: {
          spotify: String
        },
        genres: [ String ],
        href: String,
        id: String,
        images: [
          {
            height: Number,
            url: String, 
            width: Number
          }
        ],
        name: String,
        uri:  String
      }
    ],
    total: Number,
    href: String,
    display_name: String,
    spotyId: String
  }
    
},{
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
});

module.exports = mongoose.model('FollowedArtists', FollowedArtists);


// {
//   "artists": {
//     "items": [
//       {
//         "external_urls": {
//           "spotify": "https://open.spotify.com/artist/12Chz98pHFMPJEknJQMWvI"
//         },
//         "followers": {
//           "href": null,
//           "total": 5194167
//         },
//         "genres": [
//           "modern rock",
//           "permanent wave",
//           "piano rock",
//           "post-grunge",
//           "rock"
//         ],
//         "href": "https://api.spotify.com/v1/artists/12Chz98pHFMPJEknJQMWvI",
//         "id": "12Chz98pHFMPJEknJQMWvI",
//         "images": [
//           {
//             "height": 640,
//             "url": "https://i.scdn.co/image/12450535621500d6e519275f2c52d49c00a0168f",
//             "width": 640
//           },
//           {
//             "height": 320,
//             "url": "https://i.scdn.co/image/17f00ec7613d733f2dd88de8f2c1628ea5f9adde",
//             "width": 320
//           },
//           {
//             "height": 160,
//             "url": "https://i.scdn.co/image/2da69b7920c065afc835124c4786025820adab8c",
//             "width": 160
//           }
//         ],
//         "name": "Muse",
//         "popularity": 81,
//         "type": "artist",
//         "uri": "spotify:artist:12Chz98pHFMPJEknJQMWvI"
//       }
//     ],
//     "next": "https://api.spotify.com/v1/me/following?type=artist&after=12Chz98pHFMPJEknJQMWvI&limit=1",
//     "total": 4,
//     "cursors": {
//       "after": "12Chz98pHFMPJEknJQMWvI"
//     },
//     "limit": 1,
//     "href": "https://api.spotify.com/v1/me/following?type=artist&limit=1"
//   }
// }