//requires
const db = require('./conn');
const Order = require('./Order');
const Product = require('./Product');
const LineItem = require('./LineItem');

//associations

LineItem.belongsTo(Order);
LineItem.belongsTo(Product);
Order.hasMany(LineItem, {as: 'item'})

//sync and seed functions
const sync = () => {
  return db.sync({ force: true });
}

const seed = () => {
  return require('./seed')(Product)
}

//exports
module.exports = {
  Order,
  Product,
  LineItem,
  sync,
  seed
}
