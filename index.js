import express from 'express';
import cors from 'cors';
import sequelize from './db.js';
import './models/models.js';

const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());
app.get('/api', (req, res) => {
  res.send('123');
});

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    app.listen(PORT, console.log(123));
  } catch (error) {
    console.log(error);
  }
};

start();
