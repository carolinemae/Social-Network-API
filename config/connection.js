const { connect, connection } = require('mongoose');

connect('mongodb://localhost/socialNetworkApi', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = connection;
