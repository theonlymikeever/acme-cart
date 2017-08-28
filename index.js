const app = require('./app');
const models = require('./db');

const port = process.env.PORT || 3001;

models.sync()
  .then( () => {
    return models.seed();
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });

