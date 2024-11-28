import { BankNews } from '../../models/models.js';
import { updateEntity } from '../../utils/updateUtils.js';
import { checkBankNewsExist } from '../../utils/validationUtills.js';
import bankServices from './bankServices.js';

class BankNewsServices {
  async findById(id) {
    const bankNews = await BankNews.findByPk(id);
    checkBankNewsExist(bankNews);

    return bankNews;
  }

  async findAll() {
    const bankNews = await BankNews.findAll();

    return bankNews;
  }

  async create(data) {
    const bank = await bankServices.findById(1);
    const { title, description, img, backgroundColor, textColor } = data;
    const requiredFields = ['title'];
    validateRequiredFields(data, requiredFields);

    const bankNews = await BankNews.create({
      title,
      description,
      img,
      backgroundColor,
      textColor,
      bankId: bank.id,
    });

    return bankNews;
  }

  async update(id, data) {
    const bankNews = await this.findById(id);

    updateEntity(bankNews, data);

    await bankNews.save();

    return bankNews;
  }

  async delete(id) {
    const bankNews = await this.findById(id);
    const deletedBankNews = bankNews;

    await bankNews.destroy();

    return deletedBankNews;
  }
}

export default new BankNewsServices();
