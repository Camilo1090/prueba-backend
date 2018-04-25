const mongoose = require('mongoose');
const moment = require('moment');

const UserSchema = mongoose.Schema({
  id: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  nationality: {
    type: String,
    uppercase: true,
    required: true
  },
  sex: {
    type: String,
    lowercase: true,
    required: true
  },
  date_of_birth: {
    type: Date,
    get: date => moment(date).format('YYYY-MM-DD'),
    set: date => moment(date, 'YYYY-MM-DD').toDate(),
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);