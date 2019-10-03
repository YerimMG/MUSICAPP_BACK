const express = require('express');
const router  = express.Router();

//MODELS
const Events         = require('../models/Events')


//Ruta de prueba
router.get('/', (req, res) => {
  res.json('tester')
})



router.get('/:token', (req, res) => {
  const {token} =req.params
  Events.find({access_token: token})
    .then( respuesta => {
      res.json(respuesta)
    })
    .catch(err => res.status(404).send('Model Not Found'))
  // res.json(token)

})
module.exports = router;

