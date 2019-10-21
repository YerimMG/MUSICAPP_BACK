const querystring  = require('querystring');
const request      = require('request');

//Genera el Token
let generateRandomString = (length) => {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';
//SOLICITA LOS PERMISOS AL USUARIO
    exports.scope = (req, res, ) => {
      var state = generateRandomString(16);
      res.cookie(stateKey, state);

// your application requests authorization
      var scope = 'user-read-private user-read-email user-library-read user-top-read user-follow-read user-read-recently-played';
      res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
          response_type: 'code',
          client_id: process.env.Client_ID,
          scope: scope,
          redirect_uri: process.env.redirect_uri,
          state: state
        }))
    };

// requesting access token from refresh token
    exports.refresToken = (req, res) => {
      var refresh_token = req.query.refresh_token;
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer.alloc(client_id + ':' + client_secret).toString('base64')) },
        form: {
          grant_type: 'refresh_token',
          refresh_token: refresh_token
        },
        json: true
      };

      request.post(authOptions, function(error, response, body) { 
        if (!error && response.statusCode === 200) {
          var access_token = body.access_token;
          res.send({
            'access_token': access_token
          });
        }
      });
    };

