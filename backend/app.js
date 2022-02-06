// Imports
const express      = require('express');
const usersCtrl    = require('./routes/user');
// const postCtrl    = require('./routes/post');

// Router

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

  // Users routes
 app.use('/users', usersCtrl);
//  app.use('/post', postCtrl)


app.use(express.json());

module.exports = app;