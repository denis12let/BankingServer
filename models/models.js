import sequelize from '../db.js';
import { DataTypes } from 'sequelize';

export const User = sequelize.define('user', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
});

export const Profile = sequelize.define('profile', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  passportIdentifier: { type: DataTypes.STRING, unique: true, allowNull: false },
  telephoneNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
  userName: { type: DataTypes.STRING, allowNull: false },
  userSurname: { type: DataTypes.STRING, allowNull: false },
  profileImg: { type: DataTypes.STRING },
});

export const Account = sequelize.define('account', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  balance: { type: DataTypes.DECIMAL, defaultValue: 0 },
});

export const Transaction = sequelize.define('transaction', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  amount: { type: DataTypes.DECIMAL, allowNull: false },
  currency: { type: DataTypes.STRING, allowNull: false }, //валюта на русском
  date: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Одобрено' },
  description: { type: DataTypes.STRING },
  type: { type: DataTypes.ENUM('PAYMENT', 'DEPOSIT'), allowNull: false },
});

export const Card = sequelize.define('card', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  number: { type: DataTypes.STRING, unique: true, allowNull: false },
  date: { type: DataTypes.DATE, allowNull: false },
  CVC: { type: DataTypes.STRING, allowNull: false },
  holderName: { type: DataTypes.STRING, allowNull: false },
  customName: { type: DataTypes.STRING, allowNull: false },
  balance: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 1000 },
});

export const Basket = sequelize.define('basket', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
});

export const BasketService = sequelize.define('basket_service', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
});

export const Service = sequelize.define('service', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  amount: { type: DataTypes.DECIMAL },
  interest: { type: DataTypes.DECIMAL, allowNull: false },
  serviceDate: { type: DataTypes.DATE },
  maturityDate: { type: DataTypes.DATE },
  duration: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 10 },
  minSum: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 100 },
  type: {
    type: DataTypes.ENUM('LOAN', 'DEPOSIT'),
    allowNull: false,
    defaultValue: 'DEPOSIT',
  },
});

export const Bank = sequelize.define('bank', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false, defaultValue: 'Bank' },
  telehoneNumber: { type: DataTypes.STRING, unique: true, allowNull: false, defaultValue: '+375 (29) 000 00 00' },
  img: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'https://cdn3.iconfinder.com/data/icons/business-1086/48/Business-10-512.png',
  },
});

export const Partner = sequelize.define('partner', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  titleDescription: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  telephoneNumber: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING },
});

export const BankNews = sequelize.define('bank_news', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
  backgroundColor: { type: DataTypes.STRING, defaultValue: 'black' },
  textColor: { type: DataTypes.STRING, defaultValue: 'white' },
  img: { type: DataTypes.STRING },
});

User.hasOne(Profile);
Profile.belongsTo(User);

User.hasOne(Account);
Account.belongsTo(User);

Account.hasMany(Transaction);
Transaction.belongsTo(Account);

Account.hasMany(Card);
Card.belongsTo(Account);

Account.hasOne(Basket);
Basket.belongsTo(Account);

Basket.hasMany(BasketService);
BasketService.belongsTo(Basket);

Service.hasMany(BasketService);
BasketService.belongsTo(Service);

Bank.hasMany(Service);
Service.belongsTo(Bank);

Bank.hasMany(BankNews);
BankNews.belongsTo(Bank);

Bank.hasMany(Partner);
Partner.belongsTo(Bank);
