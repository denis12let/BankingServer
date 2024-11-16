import { Transaction } from '../../models/models.js';
import { checkTransactionExists, validateRequiredFields } from '../../utils/validationUtills.js';
import accountServices from '../accountServices/accountServices.js';

class TransactionServices {
  async findById(userId, id) {
    const account = await accountServices.findById(userId);
    const transaction = await Transaction.findOne({ where: { id, accountId: account.id } });
    checkTransactionExists(transaction);

    return transaction;
  }

  async getById(userId, id) {
    const transaction = await this.findById(userId, id);

    return transaction;
  }

  async findAll(userId) {
    const account = await accountServices.findById(userId);
    const transactions = await Transaction.findAll({ where: { accountId: account.id } });

    return transactions;
  }

  async getAll(userId, query) {
    const transactions = this.findAll(userId);

    return transactions;
  }

  async getCalendar(userId, query) {
    const transactions = this.findAll(userId);

    return transactions;
  }

  async create(data) {
    const { amount, type, source, destination, cardFrom, cardTo, accountId } = data;
    const requiredFields = ['amount', 'type', 'source', 'destination'];
    validateRequiredFields(data, requiredFields);

    const trancsaction = await Transaction.create({
      amount,
      date: new Date(),
      type,
      source,
      destination,
      cardFrom,
      cardTo,
      accountId,
    });

    return trancsaction;
  }

  async delete(userId, id) {
    const transaction = await this.findById(userId, id);

    let deletedTransaction = transaction;

    await transaction.destroy();

    return deletedTransaction;
  }
}

export default new TransactionServices();
