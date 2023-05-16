const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./src/models');
const bodyParser = require('body-parser');
const userRouter = require('./src/routes/user.routes');
const nameBusinessRouter = require('./src/routes/nameBusiness.routes');
const typeBusinessRouter = require('./src/routes/typeBusiness.routes');
const typeOfSaleRouter = require('./src/routes/typeOfSale.routes');
const whereSaleRouter = require('./src/routes/whereSale.routes');

const reset = require('./src/setup');
const { handleError } = require('./src/middleware/customError');
const { CustomError, TypeError } = require('./src/models/customError.model');
const fileUpload = require('express-fileupload');
require('dotenv').config();

var corsOptions = {
  origin: '*',
};
app.use(
  fileUpload({
    createParentPath: true,
  }),
);

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('./public/files'));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

db.sequelize.sync({ alter: true }).then((se) => {
  reset(db);
});

app.use('/api/user', userRouter);
app.use('/api', nameBusinessRouter);
app.use('/api', typeBusinessRouter);
app.use('/api', typeOfSaleRouter);
app.use('/api', whereSaleRouter);

app.use(function (req, res, next) {
  throw new CustomError(404, TypeError.PATH_NOT_FOUND);
});
app.use(handleError);

const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
