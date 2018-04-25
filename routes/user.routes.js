const users = require('../controllers/user.controller');

module.exports = (router) => {
  // GET /users
  router.get('/users', users.findAll);

  // POST /users
  router.post('/users', users.create);

  // GET /users/:id
  router.get('/users/:id', users.findOne);

  // PUT /users/:id
  router.put('/users/:id', users.update);

  // DELETE /users/:id
  router.delete('/users/:id', users.delete);
};