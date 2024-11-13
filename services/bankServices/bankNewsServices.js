import ApiError from '../../error/ApiError.js';
import { BankNews } from '../../models/models.js';
import bankServices from './bankServices.js';

class BankNewsServices {
  async findById(id) {
    const bankNews = await BankNews.findOne({ where: { id } });
    if (!bankNews) {
      throw ApiError.notFound('Новость не найдена');
    }

    return bankNews;
  }

  async findAll() {
    const bankNews = await BankNews.findAll();

    return bankNews;
  }

  async create(data) {
    const bank = await bankServices.findById(1);
    const { title, description, img, backgroundColor, textColor } = data;

    if (!title || !description || !img) {
      throw ApiError.badRequest('Не все обязательные поля заполнены');
    }

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

    Object.keys(data).forEach((key) => {
      if (key in bankNews && data[key]) {
        bankNews[key] = data[key];
      }
    });

    await bankNews.save();

    return bankNews;
  }

  async delete(id) {
    const bankNews = await this.findById(id);
    const deletedBankNews = bankNews.toJSON();

    await bankNews.destroy();

    return deletedBankNews;
  }
}

export default new BankNewsServices();
