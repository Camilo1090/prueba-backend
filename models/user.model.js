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
    index: true,
    uppercase: true,
    required: true
  },
  sex: {
    type: String,
    index: true,
    lowercase: true,
    required: true
  },
  date_of_birth: {
    type: Date,
    index: true,
    get: date => moment(date).format('YYYY-MM-DD'),
    set: date => moment(date, 'YYYY-MM-DD').toDate(),
    required: true
  }
}, {
  timestamps: true,
  toObject: {
    getters: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.createdAt;
      delete ret.updatedAt;
      delete ret.__v;
    }
  },
  toJSON: {
    getters: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.createdAt;
      delete ret.updatedAt;
      delete ret.__v;
    }
  }
});

module.exports = mongoose.model('User', UserSchema);