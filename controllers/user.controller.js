const User = require('../models/user.model');

exports.findAll = (req, res) => {
  User.find({}, 'id name nationality sex date_of_birth')
    .then(users => {
      users = users.map(user => serializeUser(user));
      return res.status(200).send(users);
    })
    .catch(error => {
      return res.status(500).send({
        message: error.message || 'Some error occurred while retrieving users'
      });
    });
};

exports.create = (req, res) => {
  // TODO: custom validation

  // create a User
  const user = new User({
    id: req.body.id,
    name: req.body.name,
    nationality: req.body.nationality,
    sex: req.body.sex,
    date_of_birth: req.body.date_of_birth
  });

  // save User in the database
  user.save()
    .then(user => {
      return res.status(201).send(serializeUser(user));
    })
    .catch(error => {
      return res.status(500).send({
        message: error.message || 'Some error occurred while creating the User'
      });
    });
};

exports.findOne = (req, res) => {
  User.findOne({ id: req.params.id }, 'id name nationality sex date_of_birth')
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: 'User not found with id ' + req.params.id
        });
      }
      return res.status(200).send(serializeUser(user));
    })
    .catch(error => {
      if(error.name === 'NotFound') {
        return res.status(404).send({
          message: "User not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: error.message || 'Error retrieving user with id ' + req.params.id
      });
    });
};

exports.update = (req, res) => {
  // TODO: validation

  // Find user and update it with the request body
  User.findOneAndUpdate({
    id: req.params.id
  }, {
    id: req.body.id,
    name: req.body.name,
    nationality: req.body.nationality,
    sex: req.body.sex,
    date_of_birth: req.body.date_of_birth
  }, {
    new: true
  }).then(user => {
    if (!user) {
      return res.status(404).send({
        message: 'User not found with id ' + req.params.id
      });
    }
    return res.status(200).send(serializeUser(user));
  }).catch(error => {
    if(error.name === 'NotFound') {
      return res.status(404).send({
        message: "User not found with id " + req.params.id
      });
    }
    return res.status(500).send({
      message: error.message || 'Error updating user with id ' + req.params.id
    });
  });
};

exports.delete = (req, res) => {
  User.findOneAndRemove({ id: req.params.id })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: 'User not found with id ' + req.params.id
        });
      }
      return res.status(200).send({message: "User deleted successfully!"});
    })
    .catch(error => {
      if(error.name === 'NotFound') {
        return res.status(404).send({
          message: "User not found with id " + req.params.id
        });
      }
      return res.status(500).send({
        message: error.message || 'Error updating user with id ' + req.params.id
      });
    })
};

// helpers
function serializeUser(userDoc) {
  let user = {};
  user.id = userDoc.id;
  user.name = userDoc.name;
  user.nationality = userDoc.nationality;
  user.sex = userDoc.sex;
  user.date_of_birth = userDoc.date_of_birth;
  return user;
}
