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


module.exports = Order;
