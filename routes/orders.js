const { Order } = require('../db').models;
const app = require('express').Router();

module.exports = app;
//need to add main get '/'

// app.get('/', (req, res, next) => {
//     Order.getCart()
//     .then((cart) => {
//       console.log(cart)
//       let block = {orders, products, lineitems}
//       res.render('index', {block})
//     })
//     .catch(next)
// })

app.put('/:id', (req, res, next)=> {
  Order.updateFromRequestBody(req.params.id, req.body)
    .then( () => res.redirect('/'))
    .catch(ex => {
      if (ex.message === 'address required'){
        return res.render('index', { error: ex });
      }
      next(ex);
    });
});

app.post('/:id/lineItems', (req, res, next)=> {
  Order.addProductToCart(req.body.productId*1)
    .then( ()=> res.redirect('/'))
    .catch(next);
});

app.delete('/:orderId/lineItems/:id', (req, res, next)=> {
  console.log(req.params.orderId, req.params.id)
  Order.destroyLineItem(req.params.orderId, req.params.id)
    .then( ()=> res.redirect('/'))
    .catch(next);
});
