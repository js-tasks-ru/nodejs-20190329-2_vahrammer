const mongoose = require('mongoose');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const config = require('config');

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('debug', config.get('mongodb.debug'));

mongoose.plugin(beautifyUnique);

module.exports = mongoose.createConnection(config.get('mongodb.uri'));
