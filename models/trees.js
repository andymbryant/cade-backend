const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TreeSchema = new Schema({
  id: {
    type: String,
    required: false,
  },
  space: {
    type: String,
    required: false
  },
  scenario: {
    type: String,
    required: false
  },
  nodes: {
    type: Array,
    required: false
  }
}, { strict: false });

module.exports = mongoose.model('Tree', TreeSchema);