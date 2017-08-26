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

app.get('/', (req, res, next) => {
  res.send('hello world')
})

let order;
//temp
Models.sync()
  .then(() => {
    return Models.seed();
  })// testing association
  .then(() => {
    return Order.create({isCart: true, address: 'here'})
  })
  .then((createdOrder) => {
    order = createdOrder;
    return Product.findOne({
      where: {
        name: "iPod"
      }
    })
  })
  .then((found) => {
    return order.addItem(found)
  })
  .then(() => {
    return Order.findAll({indclude:[{model:LineItem, as: 'items'}]})
  })
  .then((found) => {
    console.log(found)
  })
  .then(() => {
    app.listen(3001, () => {
      console.log('listening on port 3001');
    })
  })
