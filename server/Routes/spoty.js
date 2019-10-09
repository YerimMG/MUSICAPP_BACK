//SpotifyStrategy
//Esta esla configuracion inicial de spoty, tambein genera las BBD.
//Espero hacerlo bien, saludos.

const express = require('express');
const router  = express.Router();
const querystring = require('querystring');
const request     = require('request')
const SpotyControl = require ('./SpotyControl/spotyFunctions');
const stateKey     = 'spotify_auth_state';
const redirect_uri = process.env.redirect_uri
const axios   = require('axios')

//BBD 
const UserSpoty   = require('../models/UserSpoty')
const userTracks  = require('../models/userTracks')
const userArtists = require('../models/userArtists')
const Events      = require('../models/Events')

//Solicitud de permisos y generacion del token.
  router.get('/login', SpotyControl.scope);

//Spoty URL redirec
  router.get('/callback/', function(req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  



    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(process.env.Client_ID+ ':' + process.env.Client_Secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      
      if (!error && response.statusCode === 200) {
       
        const access_token = body.access_token,
            refresh_token = body.refresh_token;
        
        //GET CURRENT USER'S PROFILE
        const userInfo = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true,

        };
        request.get(userInfo,function(error, response, body) {
          const userName = body.display_name
          const userId = body.id
          let nombresArtistas = {}
         
          const newUser = new UserSpoty(body)
          newUser.spotyId = body.id    
            UserSpoty.findOne({display_name : userName})
            .then(user => { 
                //Si la respuesta es diferente a nulll, solo actualiza el token, y los items de los demas modelos
                if( user !== null){
                  UserSpoty.findOneAndUpdate({ display_name: userName }, { access_token  : access_token, refresh_token : refresh_token })
                    .then(user => { 
                      res.status(400).json(user)
                    })
                    .catch(error => { throw error})

                    //UPDATE A USER'S TOP ARTISTS 
                      var userTopArtists = {
                        url: 'https://api.spotify.com/v1/me/top/artists?limit=50&offset=0',
                        headers: { 'Authorization': 'Bearer ' + access_token },
                        json: true,
                      };
                      request.get(userTopArtists, function(error, response, body) {
                        const {items} = body
                        userArtists.findOneAndUpdate( { display_name: userName }, {items: items})
                          .then( user => {
                            res.status(400).json(user)
                          })
                          .catch(error => { throw error})
                      })
                    //UPDATE A USER'S TOP TRACKS 
                      var userTopTracks = {
                        url: 'https://api.spotify.com/v1/me/top/tracks?limit=50&offset=0',
                        headers: { 'Authorization': 'Bearer ' + access_token },
                        json: true,
                      };
                      request.get(userTopTracks, function(error, response, body) {
                        const {items} = body
                        userTracks.findOneAndUpdate({ display_name: userName }, {items: items})
                          .then (user => {
                            res.status(400).json(user)
                          })
                          .catch(error => { throw error})
                      })

                      //UPDATE TOKEN EVENTS USER
                        Events.findOneAndUpdate({ display_name: userName }, {access_token: access_token})
                        .then (user => {
                          res.status(400).json(user)
                        })
                        .catch(error => { throw error})
                } else {
                      //Genera el modelo con la informacion del usuario
                      newUser.access_token  = access_token,
                      newUser.refresh_token = refresh_token
                      newUser.save()
                      .then(resp => { 
                        res.json(resp)
                        
                      })
                      .catch(error => { throw error})

                     //GET A USER'S TOP ARTISTS AND CONCERTS FROM TM
                      var userTopArtists = {
                        url: 'https://api.spotify.com/v1/me/top/artists?limit=50&offset=0',
                        headers: { 'Authorization': 'Bearer ' + access_token },
                        json: true,
                      };

                      request.get(userTopArtists, function(error, response, body) {
                        const newUserArtists = new userArtists
                          newUserArtists.display_name = userName
                          newUserArtists.spotyId      = userId
                          newUserArtists.items        = body.items
                          newUserArtists.total        = body.total
                          newUserArtists.href         = body.href
                          newUserArtists.limit        = body.limit

                          const newEvents = new Events
                          newEvents.display_name = userName
                          newEvents.spotyId      = userId
                          newEvents.spotyId      = userId
                          newEvents.access_token = access_token
                          newEvents.save()
                          .then(userSaved => {
                            res.json(userSaved)
                          })
                          .catch(error => { throw error})

                          nombresArtistas  = body.items
                          const names = []

                          nombresArtistas.forEach(respuesta => {
                            names.push(respuesta.name)
                          })

                         names.map(  (response, index) => {
                          let wordNormalize = response.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                          let nameWhitNoSpaces =  wordNormalize.split(' ').join('+')
                        
                           setTimeout( async () => {
                            const url =  `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.Client_IDTM}&keyword=${nameWhitNoSpaces}&locale=*&countryCode=MX`
                            let res = await axios.get(url)
                            
                            const info = res.data
                                                  
                            Events.find({display_name: userName})
                            .then(user => {
                              if (user === null){
                                return 
                              } else {
                                if (info._embedded !== undefined){
                                  let artista = {
                                    name: response, 
                                    info: info._embedded.events[0].info,
                                    events: '',  
                                  }
                                  const presentacion = Object.values(info._embedded.events)
                                  const events = presentacion.map(response  => {
                                  return {name: response.name, 
                                          images: response.images, 
                                          date: { day: response.dates.start.localDate,
                                                  hour: response.dates.start.localTime}, 
                                          precios: { min: response.priceRanges[0].min,
                                                     max: response.priceRanges[0].max },
                                          lugar: { rescinto: response._embedded.venues[0].name,
                                                  city:  response._embedded.venues[0].city.name,
                                                  state: response._embedded.venues[0].state.name  },
                                          url: response.url
                                  }
                                })
                                
                                 artista.events = events
                                    Events.update({display_name: userName}, 
                                    {$push: {events: {artista}} })
                                      .then(respuesta => 
                                        res.status(200).send('okay')
                                        )
                                        .catch(error => { throw error})
                                }else {
                                  return
                                }
                              return
                              }
                            })
                          }, 0750 * index)
                        })
                        newUserArtists.save()
                        .then(model => {
                          res.json(model)
                        })
                        .catch(error => { throw error})
                      })
                    
                     //GET A USER'S TOP TRACKS 
                      var userTopTracks = {
                        url: 'https://api.spotify.com/v1/me/top/tracks?limit=50&offset=0',
                        headers: { 'Authorization': 'Bearer ' + access_token },
                        json: true,
                      };
                      request.get(userTopTracks, function(error, response, body) {
                        const newUserTracks = new userTracks
                          newUserTracks.items   = body.items
                          newUserTracks.total   = body.total
                          newUserTracks.spotyId = userId
                          newUserTracks.href    = body.href
                          newUserTracks.display_name = userName

                          newUserTracks.save()
                          .then(model => {
                            res.json(model)
                          })
                          .catch(error => { throw error})
                      })  
                }
            }).catch(error => { throw error})
          res.redirect(`${process.env.redirect_info}/Home/?token=${access_token}`)
        });
       
    } else {
        res.redirect('http://localhost:3001?' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });

});

//Refres Token
  router.get('/refresh_token', SpotyControl.refresToken);

module.exports = router;







