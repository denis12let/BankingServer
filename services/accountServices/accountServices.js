import { SERVICE_TYPES, TRANSFER_TYPE, TYPES } from '../../constants/paymentConstants.js';
import ApiError from '../../error/ApiError.js';
import { Account } from '../../models/models.js';
import { checkAccountExists, checkBalance, validateRequiredFields } from '../../utils/validationUtills.js';
import userServices from '../userServices/userServices.js';
import basketServices from './basketServices.js';
import cardServices from './cardServices.js';
import transactionServices from './transactionServices.js';

class AccountServices {
  async updateBalanceAccountCard(id, data, account) {
    const { type, amount, number } = data;
    const requiredFields = ['type', 'amount', 'number'];
    validateRequiredFields(data, requiredFields);

    const transactionDetails = {
      type: type === TYPES.DEPOSIT ? TYPES.PAYMENT : TYPES.DEPOSIT,
      amount,
      number,
      transferType: TRANSFER_TYPE.ACCOUNT_CARD,
      description: data.description,
      accountId: account.id,
    };

    if (type === TYPES.DEPOSIT) {
      await cardServices.updateBalance(id, transactionDetails);

      account.balance = +account.balance + +amount;
    } else if (type === TYPES.PAYMENT) {
      checkBalance(account.balance, amount);

      await cardServices.updateBalance(id, transactionDetails);

      //Создание транзакции для аккаунт -> карта, если перевод на карту другого юзера
      if (account.id != (await cardServices.getAccountIdByCardNumber(number))) {
        await transactionServices.create({
          ...transactionDetails,
          type: TYPES.PAYMENT,
          source: await userServices.getById(id),
          destination: await userServices.getUserEmailByCardNumber(number),
          cardTo: number,
        });
      }

      account.balance -= amount;
    }
  }

  async updateBalanceAccountService(id, data, account) {
    const { type, amount } = data;
    const requiredFields = ['amount'];
    validateRequiredFields(data, requiredFields);

    //  const transactionDetails = {
    //    type: type === TYPES.DEPOSIT ? TYPES.PAYMENT : TYPES.DEPOSIT,
    //    amount,
    //    number,
    //    transferType: TRANSFER_TYPE.ACCOUNT_CARD,
    //    description: data.description,
    //    accountId: account.id,
    //  };

    if (type === SERVICE_TYPES.DEPOSIT) {
      checkBalance(account.balance, amount);

      await transactionServices.create({
        type: type === TYPES.DEPOSIT ? TYPES.PAYMENT : TYPES.DEPOSIT,
        amount,
        number,
        transferType: TRANSFER_TYPE.ACCOUNT_CARD,
        description: data.description,
        accountId: account.id,
      });

      account.balance -= amount;
    } else if (type === SERVICE_TYPES.LOAN) {
      account.balance = +account.balance + +amount;
    }
  }

  async findById(id) {
    const account = await Account.findOne({ where: { userId: id } });
    checkAccountExists(account);

    return account;
  }

  async findByAccountId(id) {
    const account = await Account.findOne({ where: { id } });

    return account;
  }

  async getById(id) {
    const account = await this.findById(id);

    return account;
  }

  async create(userId) {
    const account = await Account.create({ userId });
    await basketServices.create(account.id);

    return account;
  }

  async update(id, data) {
    const account = await this.findById(id);

    account.balance = data.balance;

    await account.save();

    return account;
  }

  async updateBalance(id, data) {
    const account = await this.findById(id);

    switch (data.transferType) {
      case TRANSFER_TYPE.ACCOUNT_CARD:
        await this.updateBalanceAccountCard(id, data, account);
        break;

      case TRANSFER_TYPE.ACCOUNT_SERVICE:
        break;
    }

    await account.save();

    return { message: 'Операция проведена успешно' };
  }
}
export default new AccountServices();
