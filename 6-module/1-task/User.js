const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/hw6', {
  useCreateIndex: true,
  useNewUrlParser: true,
});

const schema = new mongoose.Schema({
  email: {
    index: true,
    lowercase: true,
    required: true,
    trim: true,
    type: String,
    unique: true,
    validate: [
      {
        validator: (v) => /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/.test(v),
      },
    ],
  },
  displayName: {
    index: true,
    required: true,
    trim: true,
    type: String,
  },
}, {
  timestamps: true,
});


module.exports = mongoose.model('User', schema);
