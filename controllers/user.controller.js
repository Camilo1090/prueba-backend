const moment = require('moment');
const countries = require('i18n-iso-countries');

const User = require('../models/user.model');

exports.count = (req, res) => {
  const filters = getFilters(req.query);
  User.aggregate([
    {
      $match: filters
    },
    {
      $group: {
        _id: '$nationality',
        count: { $sum: 1 }
      }
    }
  ])
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send({
        message: error.message || 'Some error occurred while counting users'
      });
    });
};

exports.findAll = (req, res) => {
  const filters = getFilters(req.query);
  User.find(filters)
    .then(users => {
      // users = users.map(user => serializeUser(user));
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
      return res.status(201).send(user);
    })
    .catch(error => {
      return res.status(500).send({
        message: error.message || 'Some error occurred while creating the User'
      });
    });
};

exports.findOne = (req, res) => {
  User.findOne({ id: req.params.id })
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: 'User not found with id ' + req.params.id
        });
      }
      return res.status(200).send(user);
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
    return res.status(200).send(user);
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
function getFilters(params) {
  let filters = {};

  if (params['nationality']) {
    const nationality = params['nationality'];
    if (countries.isValid(nationality))
      filters.nationality = nationality;
    else
      return res.status(400).send({ message: 'Error in parameter nationality' });
  }

  if (params['age.gte']) {
    const ageGte = parseInt(params['age.gte']);
    if (!ageGte || ageGte < 0)
      return res.status(400).send({ message: 'Error in parameter age.gte' });
    filters.date_of_birth = { $lte: moment().subtract(ageGte, 'years').toDate() };
    // console.log(moment().subtract(ageGte, 'years').format('YYYY-MM-DD'));
  }

  if (params['age.lte']) {
    const ageLte = parseInt(params['age.lte']);
    if (!ageLte || ageLte > 100)
      return res.status(400).send({ message: 'Error in parameter age.lte' });
    if (filters.date_of_birth)
      filters.date_of_birth.$gte = moment().subtract(ageLte + 1, 'years').add(1, 'days').toDate();
    else
      filters.date_of_birth = { $gte: moment().subtract(ageLte + 1, 'years').add(1, 'days').toDate() };
    // console.log(moment().subtract(ageLte + 1, 'years').add(1, 'days').format('YYYY-MM-DD'));
  }

  if (params['sex']) {
    const sex = params['sex'];
    if (sex === 'female' || sex === 'male')
      filters.sex = sex;
    else
      return res.status(400).send({ message: 'Error in parameter sex' });
  }

  return filters;
}
