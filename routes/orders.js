const { Order } = require('../db').models;
const app = require('express').Router();

module.exports = app;

app.put('/:id', (req, res, next)=> {
  Order.updateFromRequestBody(req.params.id, req.body)
    .then( () => res.redirect('/'))
    .catch(ex => {
      if(ex.message === 'address required'){
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
  Order.destroyLineItem(req.params.orderId, req.params.id)
    .then( ()=> res.redirect('/'))
    .catch(next);
});
