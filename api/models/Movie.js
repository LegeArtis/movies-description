const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Movie = new Schema({
  title: {
      type: String
  },
  year: {
      type: Number
  },
  format: {
      type: String
  },
  stars: {
      type: []
  }
}, {
  collections: 'movies'
});

module.exports = mongoose.model('Movie', Movie);
