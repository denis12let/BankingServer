import sequelize from '../db.js';
import { DataTypes } from 'sequelize';

export const User = sequelize.define('user', {
  id: { type: DataTypes.NUMBER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
});

export const AccountStatement = sequelize.define('account_statement', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  transferAmount: { type: DataTypes.NUMBER, defaultValue: 0 },
  depositAmount: { type: DataTypes.NUMBER, defaultValue: 0 },
});

export const Profile = sequelize.define('profile', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  passportIdentifier: { type: DataTypes.STRING, unique: true, allowNull: false },
  telephoneNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
  userName: { type: DataTypes.STRING, allowNull: false },
  userSurname: { type: DataTypes.STRING, allowNull: false },
  profileImg: { type: DataTypes.STRING },
});

export const Calendar = sequelize.define('calendar', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
});

export const TransactionHistory = sequelize.define('transaction_history', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
});

export const Account = sequelize.define('account', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  accountBalance: { type: DataTypes.NUMBER, defaultValue: 0 },
});

export const Transaction = sequelize.define('transaction', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  amount: { type: DataTypes.NUMBER, allowNull: false },
  currency: { type: DataTypes.STRING, allowNull: false }, //валюта на русском
  date: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING },
});

export const Card = sequelize.define('card', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  cardNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
  cardDate: { type: DataTypes.DATE, allowNull: false },
  cardCVC: { type: DataTypes.STRING, allowNull: false },
  cardHolderName: { type: DataTypes.STRING, allowNull: false },
  cardCustomeName: { type: DataTypes.STRING, allowNull: false },
});

export const Bank = sequelize.define('bank', {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  bankName: { type: DataTypes.STRING, unique: true, allowNull: false, defaultValue: 'Bank' },
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

User.hasOne(AccountStatement);
AccountStatement.belongsTo(User);

User.hasOne(Profile);
Profile.belongsTo(User);

User.hasOne(Calendar);
Calendar.belongsTo(User);

User.hasOne(TransactionHistory);
Transaction.belongsTo(User);

User.hasOne(Account);
Account.belongsTo(User);

Calendar.hasMany(Transaction);
Transaction.belongsTo(Calendar);

TransactionHistory.hasMany(Transaction);
Transaction.belongsTo(TransactionHistory);

Account.hasMany(Card);
Card.belongsTo(Account);

Bank.hasMany(Partner);
Partner.belongsTo(Bank);

Bank.hasMany(BankNews);
BankNews.belongsTo(Bank);
