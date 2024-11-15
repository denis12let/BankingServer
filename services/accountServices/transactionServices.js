import bcrypt from 'bcrypt';
import ApiError from '../../error/ApiError.js';
import { Card } from '../../models/models.js';
import { checkCardExists, validateRequiredFields } from '../../utils/validationUtills.js';
import accountServices from '../accountServices/accountServices.js';
import { userCardAccessCheck } from '../../utils/accesCheck.js';
import { TRANSFER_TYPE, TYPES } from '../../constants/paymentConstants.js';

class CardServices {
  async findById(userId, id) {
    const account = await accountServices.findById(userId);
    const card = await Card.findOne({ where: { id, accountId: account.id } });
    checkCardExists(card);

    return card;
  }

  async getById(userId, id) {
    const card = await this.findById(userId, id);

    return this.getCardWithoutCVC(card);
  }

  async findAll(userId) {
    const account = await accountServices.findById(userId);
    const cards = await Card.findAll({ where: { accountId: account.id } });

    const cardsWithoutCVC = cards.map((card) => this.getCardWithoutCVC(card));

    return cardsWithoutCVC;
  }

  async create(data) {
    const { amount, status, type, userEmail } = data;
    const requiredFields = ['amount', 'status', 'type', 'userEmail'];
    validateRequiredFields(data, requiredFields);

    const account = await accountServices.findById(data.userId);

    const card = await Card.create({
      number,
      CVC: hashCVC,
      holderName,
      customName,
      accountId: account.id,
    });

    return this.getCardWithoutCVC(card);
  }
}

export default new CardServices();
