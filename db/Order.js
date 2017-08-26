const db = require('./conn');
const Sequelize = db.Sequelize


const Order = db.define('order', {
  isCart: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

//hooks
Order.hook('afterCreate', function(order) {
  order.setDataValue({isCart: true});
})

//class methods
Order.updateFromRequestBody = function(id, body) {
  return Order.findOne({
    where: {
      id: id
    }
  })
  .then((foundOrder) => {
    return foundOrder.update
  })
}


//instance methods
Order.prototype.addProductToCart = function() {

}

Order.prototype.destroyLineItem = function() {

}

module.exports = Order;
