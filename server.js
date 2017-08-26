//requires
const express = require('express');
const nunjucks = require('nunjucks');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const path = require('path');
const Models = require('./db');
const {Order, Product, LineItem } = Models;

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

//Main get route
app.get('/', (req, res, next) => {
  Promise.all([
    Order.findAll(),
    Product.findAll(),
    LineItem.findAll()
    ]) //most of this is for testing to show the data
    .then(([orders,products,lineitems]) => {
      let block = {orders, products, lineitems}
      res.render('index', {block})
    })
    .catch(next)
})

//error handling
app.get('/', (err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).send(err.message);
})

let newOrder;
//temp
Models.sync()
  .then(() => {
    return Models.seed();
  })// ****** testing association
  .then(() => {
    return Promise.all([
          Order.create({address:'world'}),
          LineItem.create({quantity:1}),
          Product.findOne({where: {name: 'iPod Mini'}})
        ])
  })
  .then(([_order, _lineitem, _prod]) => {
     _lineitem.setProduct(_prod);
     _lineitem.setOrder(_order);
     _order.addLineItem(_lineitem)
     return _order
  })
  // ****** end testing
  .then((res) => {
    console.log(res)
    app.listen(3001, () => {
      console.log('listening on port 3001');
    })
  })
  .catch((err) => {
    console.log(err.message)
  })
