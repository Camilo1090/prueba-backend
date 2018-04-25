const express = require('express');
const router = express.Router();

module.exports = (app) => {
  app.get('/', (req, res) => {
    // res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    return res.redirect('api');
  });

  router.get('/', (req, res) => {
    // res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    return res.status(200).send('Hello world');
  });

  app.use('/api', router);
};