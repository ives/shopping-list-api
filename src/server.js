const express = require('express');
const chalk = require('chalk'); // pretty colours for console log / debug
const morgan = require('morgan'); // log out http req details
const debug = require('debug')('server'); // detailed logout
const bodyParser = require('body-parser');

const port = process.env.PORT || 3000;

const app = express();

app.use(morgan('tiny')); // combined - lots, tiny - min

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const shoppingListRouter = require('./routes/shoppingListRouter')();

app.use('/api', shoppingListRouter);

app.listen(port, () => {
  debug(`Listening on port ${chalk.green(port)}`);
});
