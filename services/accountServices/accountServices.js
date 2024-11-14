import { Account } from '../../models/models.js';
import { checkAccountExists } from '../../utils/validationUtills.js';

class AccountServices {
  async findById(id) {
    const account = await Account.findOne({ where: { userId: id } });
    checkAccountExists(account);

    return account;
  }

  async getById(id) {
    const account = await this.findById(id);

    return account;
  }

  async create(userId) {
    const account = await Account.create({ userId });

    return account;
  }

  async update(id, data) {
    const account = await this.findById(id);

    account.balance = data.balance;

    await account.save();

    return account;
  }
}

export default new AccountServices();
