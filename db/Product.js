const db = require('./conn');
const Sequelize = db.Sequelize


const Product = db.define('product', {
  name: {
    type: Sequelize.STRING
  }
})


module.exports = Product;
