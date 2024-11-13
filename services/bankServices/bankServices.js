import ApiError from '../../error/ApiError.js';
import { Bank } from '../../models/models.js';

class BankServices {
  async findById(id) {
    const bank = await Bank.findOne({ where: { id } });
    if (!bank) {
      throw ApiError.notFound('Банк не найден');
    }

    return bank;
  }

  async update(data) {
    const bank = await this.findById(1);

    const { name, telephoneNumber, img } = data;

    bank.name = name || bank.name;
    bank.telephoneNumber = telephoneNumber || bank.telephoneNumber;
    bank.img = img || bank.img;

    await bank.save();

    return bank;
  }
}

export default new BankServices();
