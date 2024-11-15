import bcrypt from 'bcrypt';
import ApiError from '../../error/ApiError.js';
import { Card } from '../../models/models.js';
import { checkCardExists, validateRequiredFields } from '../../utils/validationUtills.js';
import accountServices from '../accountServices/accountServices.js';
import { userCardAccessCheck } from '../../utils/accesCheck.js';
import { TRANSFER_TYPE, TYPES } from '../../constants/paymentConstants.js';

class CardServices {
  getCardWithoutCVC(card) {
    const { CVC, ...cardWithoutCVC } = card.dataValues;

    return cardWithoutCVC;
  }

  async findById(userId, id) {
    const account = await accountServices.findById(userId);
    const card = await Card.findOne({ where: { id, accountId: account.id } });
    checkCardExists(card);

    return card;
  }

  async findByNumber(number) {
    console.log(number);
    const card = await Card.findOne({ where: { number } });
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

  async create(userId, data) {
    const { number, date, CVC, holderName, customName } = data;
    const requiredFields = ['number', 'date', 'CVC', 'holderName', 'customName'];
    validateRequiredFields(data, requiredFields);

    const candidateCard = await Card.findOne({ where: { number } });
    if (candidateCard) {
      throw ApiError.badRequest('Такая карта уже зарегистрирована существует');
    }

    const account = await accountServices.findById(userId);

    const hashCVC = await bcrypt.hash(CVC, 5);

    const card = await Card.create({
      number,
      date,
      CVC: hashCVC,
      holderName,
      customName,
      accountId: account.id,
    });

    return this.getCardWithoutCVC(card);
  }

  async update(userId, id, data) {
    const { customName } = data;
    const requiredFields = ['customName'];
    validateRequiredFields(data, requiredFields);

    const card = await this.findById(userId, id);
    card.customName = customName;

    await card.save();

    return this.getCardWithoutCVC(card);
  }

  async updateBalance(userId, data) {
    const { type, money, number } = data;

    // prettier-ignore
    const requiredFields =(
      data.transferType === TRANSFER_TYPE.CARD_TO_CARD 
      ? ['type', 'money', 'number', 'secondNumber'] 
      : ['type', 'money', 'number']);

    validateRequiredFields(data, requiredFields);

    const card = await this.findByNumber(number);

    //Проверка, что карта, с которой переводят, принадлежит юзеру. Условие не работает только тогда, когда происходит обновление второй карты при переводе с карты на карту, так как transferType не передается при повторном вызове
    if (data.transferType) {
      await userCardAccessCheck(userId, card.accountId);
    }

    switch (type) {
      //Получение средств
      case TYPES.DEPOSIT:
        //Проверяем на наличие второй карты, так как если обновляем 2-ую карту, то transferType не передается
        if (data.transferType === TRANSFER_TYPE.CARD_TO_CARD) {
          await this.updateBalance(userId, { type: TYPES.PAYMENT, money, number: data.secondNumber });
        }

        card.balance = +card.balance + +money;

        break;

      //Перевод средств
      case TYPES.PAYMENT:
        if (+card.balance < +money) {
          throw ApiError.badRequest('Недостаточно средств');
        }

        if (data.transferType === TRANSFER_TYPE.CARD_TO_CARD) {
          await this.updateBalance(userId, { type: TYPES.DEPOSIT, money, number: data.secondNumber });
        }

        card.balance -= money;

        break;
    }

    await card.save();

    return { message: 'Операция проведена успешно' };
  }

  async delete(userId, id) {
    const card = await this.findById(userId, id);

    let deletedCard = this.getCardWithoutCVC(card);

    await card.destroy();

    return deletedCard;
  }
}

export default new CardServices();
