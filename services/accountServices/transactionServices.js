import { Transaction } from '../../models/models.js';
import { checkTransactionExists, validateRequiredFields } from '../../utils/validationUtills.js';
import accountServices from '../accountServices/accountServices.js';

class TransactionServices {
  getTransactionWithLocaleTime(transactions) {
    const filteredTransactions = transactions.map((transaction) => {
      const transactionDate = new Date(transaction.date);
      transactionDate.setHours(transactionDate.getHours() + 3);

      transaction.date = transactionDate;

      return transaction;
    });

    return filteredTransactions;
  }

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

  async findUserAll(userId) {
    const account = await accountServices.findById(userId);
    const transactions = await Transaction.findAll({ where: { accountId: account.id } });

    return transactions;
  }

  async findUsersAll() {
    const transactions = await Transaction.findAll();

    return transactions;
  }

  async getAll(userId, query) {
    const transactions = userId ? await this.findUserAll(userId) : await this.findUsersAll();

    const { minSum, maxSum, type, dateFrom, dateTo, sortBy = 'date', sortOrder = 'desc' } = query;

    const filteredTransactions = transactions.filter((transaction) => {
      let isValid = true;

      if (minSum) {
        isValid = isValid && transaction.amount >= minSum;
      }

      if (maxSum) {
        isValid = isValid && transaction.amount <= maxSum;
      }

      if (type) {
        isValid = isValid && transaction.type === type;
      }

      if (dateFrom) {
        const transactionDate = new Date(transaction.date);
        transactionDate.setHours(transactionDate.getHours() + 3);
        isValid = isValid && transactionDate >= new Date(dateFrom);
      }

      if (dateTo) {
        const transactionDate = new Date(transaction.date);
        transactionDate.setHours(transactionDate.getHours() + 3);
        isValid = isValid && transactionDate <= new Date(dateTo);
      }

      return isValid;
    });

    filteredTransactions.sort((a, b) => {
      let comparison = 0;

      if (a[sortBy] < b[sortBy]) {
        comparison = -1;
      } else if (a[sortBy] > b[sortBy]) {
        comparison = 1;
      }

      return sortOrder === 'desc' ? comparison * -1 : comparison;
    });

    return this.getTransactionWithLocaleTime(filteredTransactions);
  }

  async getCalendar(userId, query) {
    const transactions = await this.findUserAll(userId);
    const { month, year } = query;

    const monthNumber = parseInt(month, 10);
    const yearNumber = parseInt(year, 10);

    const daysInMonth = new Date(yearNumber, monthNumber, 0).getDate();
    const calendar = Array.from({ length: daysInMonth }, (_, index) => {
      const date = new Date(yearNumber, monthNumber - 1, index + 2);
      return {
        date: date.toISOString().split('T')[0],
        paymentCount: 0,
        paymentTotal: 0,
        depositCount: 0,
        depositTotal: 0,
      };
    });

    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      const transactionMonth = transactionDate.getMonth() + 1;
      const transactionYear = transactionDate.getFullYear();

      if (transactionMonth === monthNumber && transactionYear === yearNumber) {
        const day = transactionDate.getDate() - 1;

        if (transaction.type === 'PAYMENT') {
          calendar[day].paymentCount += 1;
          calendar[day].paymentTotal += +transaction.amount;
        } else if (transaction.type === 'DEPOSIT') {
          calendar[day].depositCount += 1;
          calendar[day].depositTotal += +transaction.amount;
        }

        if (!calendar[day].date) {
          calendar[day].date = transactionDate.toISOString().split('T')[0];
        }
      }
    });

    return calendar;
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
