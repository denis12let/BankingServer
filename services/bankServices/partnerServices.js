import { Partner } from '../../models/models.js';
import { updateEntity } from '../../utils/updateUtils.js';
import { checkPartnerExist } from '../../utils/validationUtills.js';
import bankServices from './bankServices.js';

class PartnerServices {
  async findById(id) {
    const partner = await Partner.findByPk(id);
    checkPartnerExist(partner);

    return partner;
  }

  async findAll() {
    const partners = await Partner.findAll();

    return partners;
  }

  async create(data) {
    const bank = await bankServices.findById(1);
    const { title, titleDescription, description, img, telephoneNumber } = data;
    const requiredFields = ['title', 'telephoneNumber'];
    validateRequiredFields(data, requiredFields);

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

    updateEntity(data, partner);

    await partner.save();

    return partner;
  }

  async delete(id) {
    const partner = await this.findById(id);
    const deletedPartner = partner;

    await partner.destroy();

    return deletedPartner;
  }
}

export default new PartnerServices();
