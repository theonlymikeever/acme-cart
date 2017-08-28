const db = require('./conn');
const Sequelize = db.Sequelize
const LineItem = require('./LineItem');
const Product = require('./Product');

const Order = db.define('order', {
  isCart: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  address: {
    type: Sequelize.STRING,
    AllowNull: false,
    validate: {
      notEmpty: true
    }
  }
})

//class methods
Order.updateFromRequestBody = function(id, body) {
  //completing an order
  return Order.getCart()
      .then((cart) => {
        return cart.update({
          isCart: body.isCart,
          address: body.address
        })
      })
      .catch((err) => {
        if (err.message === 'Validation error: Validation notEmpty on address failed'){
         throw new Error("address required")
        }
      })
}

Order.addProductToCart = function(productId) {
  return Order.addLineItem(productId)
          .then((lineItem) => {
            //if addLineItem returns a brand new lineItem
            //or a brand new instance of a cart
            //otherwise it will inrcrement and we skip this if
            if (lineItem.quantity === 1 || !lineItem){
              let cart = Order.getCart()
              let addedProduct =  Product.findOne({
                where: { id: productId }
               })

              return Promise.all([
                      cart,
                      addedProduct
                    ])
                    .then(([_cart, _prod]) => {
                      console.log('grabbing cart and adding product')
                      return Promise.all([
                        lineItem.setProduct(_prod),
                        lineItem.setOrder(_cart)
                      ])
                    })
            }
          })
}

Order.destroyLineItem = function(orderId, id) {
  return LineItem.findOne({
    where: {
      orderId: orderId,
      id: id
    }
  })
  .then((foundItem) => {
    console.log('deleting line item... ')
    return foundItem.destroy()
  })
}

Order.getCart = function() {
  //this funciton looks for an open cart or creates it
  //returns a promise
  return Order.findOne({
      where: { isCart: true },
      include: [
        { model: LineItem, include: [
          {model: Product }]
        }]
    })
    .then((cart) => {
      if (cart){
        // console.log(cart)
        //found open cart, return
        return cart
      } else {
        //no open cart exists, return new instance
        console.log('no cart have to create... ')
        return Order.create({ isCart: true })
      }
    })
}

Order.addLineItem = function(prodId) {
  //this function grabs an open cart and
  //then looks for the lineitem in existence (or creates)
  //returns a promise
  return Order.getCart()
        .then((cart) => {
          //getCart returns new cart which has no items
          if (!cart.lineItems) return

          //getCart returns current cart, now looking
          //through line items
          return cart.lineItems.filter(function(item) {
            if (item.productId === prodId) {
              return item
            }
          })[0]
        })
        .then((results) => {
          if (!results) {
            //line item doesn't exist, must create
            console.log('line item doesnt exist, creating')
            return LineItem.create({ quantity: 1 })
          } else {
            //line item exists, increment
          }
          console.log('line item exists, incrementing')
          return results.increment('quantity', {by: 1})
        })
}

Order.getPastOrders = function() {
  //this funciton looks for all previous carts
  //and includes the order details
  //returns a promise
  return Order.findAll({
      where: { isCart: false },
      include: [
        { model: LineItem,
          include: [
            { model: Product }],
          order: [ 'id', 'DESC']
        }]
    })
}

Order.getViewModel = function() {
  //produces a view model will all pieces
  //returns a promise
  return Promise.all([
       Order.getCart(),
       Product.findAll(),
       Order.getPastOrders()
    ])
  .then(([cart, products, pastOrders]) => {
    let viewModel = {cart, lineItems: cart.lineItems, products, pastOrders}
    return viewModel
  })
}

module.exports = Order;
