import express from 'express';
import cors from 'cors';
import sequelize from './db.js';
import './models/models.js';
import router from './routes/index.js';
import { initAdmin, initBank } from './utils/initData.js';
import errorHandlingMiddleware from './middleware/errorHandlingMiddleware.js';
import notFoundMiddleware from './middleware/notFoundMiddleware.js';

const PORT = process.env.PORT;
const app = express();
app.use(cors());
app.options('*', cors());
app.use(express.json());
app.use('/api', router);
app.use(notFoundMiddleware);
app.use(errorHandlingMiddleware);

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    initBank();
    initAdmin();

    app.listen(PORT, console.log(`Проект запущен на порте ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
