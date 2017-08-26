const db = require('./conn');
const Sequelize = db.Sequelize


const LineItem = db.define('lineItem', {
  quantity: {
    type: Sequelize.INTEGER
  }
})


module.exports = LineItem;
