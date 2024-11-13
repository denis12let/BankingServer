import ApiError from '../../error/ApiError.js';
import { Partner } from '../../models/models.js';
import bankServices from './bankServices.js';

class PartnerServices {
  async findById(id) {
    const partner = await Partner.findOne({ where: { id } });
    if (!partner) {
      throw ApiError.notFound('Реклама не найдена');
    }

    return partner;
  }

  async findAll() {
    const partners = await Partner.findAll();

    return partners;
  }

  async create(data) {
    const bank = await bankServices.findById(1);
    const { title, titleDescription, description, img, telephoneNumber } = data;

    if (!title || !titleDescription || !description || !img) {
      throw ApiError.badRequest('Не все обязательные поля заполнены');
    }

    const partner = await Partner.create({
      title,
      titleDescription,
      description,
      img,
      telephoneNumber,
      bankId: bank.id,
    });

    return partner;
  }

  async update(id, data) {
    const partner = await this.findById(id);

    Object.keys(data).forEach((key) => {
      if (key in partner && data[key]) {
        partner[key] = data[key];
      }
    });

    await partner.save();

    return partner;
  }

  async delete(id) {
    const partner = await this.findById(id);
    const deletedPartner = partner.toJSON();

    await partner.destroy();

    return deletedPartner;
  }
}

export default new PartnerServices();
