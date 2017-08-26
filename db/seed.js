module.exports = (Product) => {
  let iPhone, iPad, iPod, iMac;
  return Promise.all([
    Product.create({name: 'iPhone' }),
    Product.create({name: 'iPad Pro' }),
    Product.create({name: 'iPod Mini' }),
    Product.create({name: '27" iMac' })
   ])
    .then(([_p1, _p2, _p3, _p4]) => {
      iPhone = _p1;
      iPad = _p2;
      iPod = _p3;
      iMac = _p4;
      return {iPhone, iPad, iPod, iMac }
    })
}
