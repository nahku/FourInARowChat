const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'jade');

app.use(bodyParser.urlencoded({ extended: false }));

// Connect to MongoDB
mongoose
  .connect(
    'mongodb://mongo:27017/docker-node-mongo',
    { useNewUrlParser: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const User = require('./models/User');

app.get('/', (req, res) => {
  User.find()
    .then(items => res.render('index', { items }))
    .catch(err => res.status(404).json({ msg: 'No items found' }));
});

/*app.post('/user/add', (req, res) => {
  const newUser = new User({
    name: req.body.name
  });

  newUser.save().then(user => res.redirect('/'));
});*/

app.post('/user/register', function (req, res) {
   
    const newUser = new User({
        name: req.body.username,
        password: req.body.password
    });

    newUser.save().then(user => res.redirect('/'));
});

const port = 3000;

app.listen(port, () => console.log('Server running...'));
