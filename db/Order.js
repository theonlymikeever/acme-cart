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
    // allowNull: false
  }
})

//class methods
Order.updateFromRequestBody = function(id, body) {
  return Order.findOrCreate({
    where: {isCart: true},
    defaults: { isCart: true, address: body.address }
  })
  .spread((user, created) => {
    console.log(user.get())
    console.log(created)
  })
  // .then((order) => {
    // return order.update
  // })
  .catch(console.log)
}

Order.addProductToCart = function(productId) {
  // let currentOrder = Order.findOrCreate({
  //     where: { isCart: true },
  //     defaults: { isCart: true }
  //   })
  //   .spread((order, created) => {
  //     // console.log(order.get())
  //     // console.log('***')
  //     console.log(created)
  //     return order
  //   })

  let currentOrder = Order.findAll({
      where: {isCart: true },
      include: [{ model: LineItem }]
      })

  let currentLineItem = LineItem.findOrCreate({
      where: { productId: productId },
      defaults: { quantity: 1 }
      })
      .spread((line, created) => {
        // console.log(line.get());
        console.log(created)
        return line
      })

  let addedProduct =  Product.findOne({
      where: { id: productId }
     })

  return Promise.all([
      currentOrder,
      currentLineItem,
      addedProduct
    ])
  .then(([_order, _lineitem, _product]) => {
    console.log(_order)
    //instance of a cart
    return Promise.all([
      _lineitem.setProduct(_product),
      _order.addLineItem(_lineitem)
    ])
  })
  .catch((err) => {
    console.log('there was...and error')
    console.log(err)
  })
}

Order.destroyLineItem = function(orderId, itemId) {
  return Order.findOne({
    where: {
      id: orderId
    }
  })
  .then((foundOrder) => {
    return foundOrder.getLineItem({
      where: {
        id: itemId
      }
    })
  })
  .then((foundItem) => {
    return LineItem.destroy(foundItem)
  })
  .catch(console.log)
}

module.exports = Order;
