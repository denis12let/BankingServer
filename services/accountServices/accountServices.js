import { TRANSFER_TYPE, TYPES } from '../../constants/paymentConstants.js';
import ApiError from '../../error/ApiError.js';
import { Account } from '../../models/models.js';
import { checkAccountExists, validateRequiredFields } from '../../utils/validationUtills.js';
import userServices from '../userServices/userServices.js';
import cardServices from './cardServices.js';
import transactionServices from './transactionServices.js';

class AccountServices {
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
    console.log(123);

    return account;
  }

  async update(id, data) {
    const account = await this.findById(id);

    account.balance = data.balance;

    await account.save();

    return account;
  }

  async updateBalance(id, data) {
    const { type, amount, number } = data;
    const requiredFields = ['type', 'amount', 'number'];
    validateRequiredFields(data, requiredFields);

    const account = await this.findById(id);

    if (type === TYPES.DEPOSIT) {
      await cardServices.updateBalance(id, {
        type: TYPES.PAYMENT,
        amount,
        number,
        transferType: TRANSFER_TYPE.ACCOUNT_CARD,
        description: data.description,
        accountId: account.id,
      });

      account.balance = +account.balance + +amount;
    } else if (type === TYPES.PAYMENT) {
      if (+account.balance < +amount) {
        throw ApiError.badRequest('Недостаточно средств');
      }

      await cardServices.updateBalance(id, {
        type: TYPES.DEPOSIT,
        amount,
        number,
        transferType: TRANSFER_TYPE.ACCOUNT_CARD,
        description: data.description,
        accountId: account.id,
      });

      //Создание транзакции для аккаунт -> карта, если перевод на карту другого юзера
      if (account.id != (await cardServices.getAccountIdByCardNumber(number))) {
        await transactionServices.create({
          amount,
          type: TYPES.PAYMENT,
          source: await userServices.getById(id),
          destination: await userServices.getUserEmailByCardNumber(number),
          cardTo: number,
          description: data.description,
          accountId: account.id,
        });
      }

      account.balance -= amount;
    }

    await account.save();

    return { message: 'Операция проведена успешно' };
  }
}
export default new AccountServices();
