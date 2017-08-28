//requires
const express = require('express');
const nunjucks = require('nunjucks');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const Models = require('./db');
const {Order, Product, LineItem } = Models.models;

//instance and config
const app = express();
nunjucks.configure('views', { noCache: true });
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

//middleware and static routes
app.use(morgan('dev'));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/vendor', express.static(path.join(__dirname, 'node_modules')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

//Main get route
app.get('/', (req, res, next) => {
    Promise.all([
       Order.getCart(),
       Product.findAll(),
       Order.getPastOrders()
    ])
    .then(([cart, products, pastOrders]) => {
      console.log(pastOrders)
      let viewModel = {cart, lineItems: cart.lineItems, products, pastOrders}
      res.render('index', {viewModel})
    })
    .catch(next)
})


//all other routes
app.use('/orders', require('./routes/orders'));

//error handling
app.get('/', (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send(err.message);
})

//app export
module.exports = app;
