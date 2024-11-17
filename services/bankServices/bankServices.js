import { Bank } from '../../models/models.js';
import { updateEntity } from '../../utils/updateUtils.js';
import { checkBankExist } from '../../utils/validationUtills.js';

class BankServices {
  async findById(id) {
    const bank = await Bank.findByPk(id);
    checkBankExist(bank);

    return bank;
  }

  async update(data) {
    const bank = await this.findById(1);

    updateEntity(bank, data);
    await bank.save();

    return bank;
  }
}

export default new BankServices();
