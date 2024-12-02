import bcrypt from 'bcrypt';
import ApiError from '../../error/ApiError.js';
import { Card } from '../../models/models.js';
import { checkBalance, checkCardExists, validateRequiredFields } from '../../utils/validationUtills.js';
import accountServices from '../accountServices/accountServices.js';
import { userCardAccessCheck } from '../../utils/accesCheck.js';
import { TRANSFER_TYPE, TYPES } from '../../constants/paymentConstants.js';
import userServices from '../userServices/userServices.js';
import transactionServices from './transactionServices.js';
import { updateEntity } from '../../utils/updateUtils.js';

class CardServices {
  getCardWithoutCVC(card) {
    const { CVC, ...cardWithoutCVC } = card.dataValues;

    return cardWithoutCVC;
  }

  async isTransferBetweenUserCards(number, secondNumber) {
    console.log(100);

    const isTransferBetweenUserCards =
      secondNumber && (await userServices.getUserEmailByCardNumber(number)) === (await userServices.getUserEmailByCardNumber(secondNumber));
    console.log(101);

    return isTransferBetweenUserCards;
  }

  async findById(userId, id) {
    const account = await accountServices.findById(userId);
    const card = await Card.findOne({ where: { id, accountId: account.id } });
    checkCardExists(card);

    return card;
  }

  async findByNumber(number) {
    const card = await Card.findOne({ where: { number } });
    checkCardExists(card);

    return card;
  }

  async getAccountIdByCardNumber(number) {
    const card = await this.findByNumber(number);

    return card.accountId;
  }

  async getById(userId, id) {
    const card = await this.findById(userId, id);

    return this.getCardWithoutCVC(card);
  }

  async findAll(userId) {
    const account = await accountServices.findById(userId);
    const cards = await Card.findAll({ where: { accountId: account.id }, order: [['createdAt', 'ASC']] });

    const cardsWithoutCVC = cards.map((card) => this.getCardWithoutCVC(card));

    return cardsWithoutCVC;
  }

  async create(userId, data) {
    const { number, date, CVC, holderName, customName } = data;
    const requiredFields = ['number', 'date', 'CVC', 'holderName', 'customName'];
    validateRequiredFields(data, requiredFields);

    const candidateCard = await Card.findOne({ where: { number } });
    if (candidateCard) {
      throw ApiError.badRequest('Такая карта уже зарегистрирована');
    }

    const [year, month] = date.split('-');
    const dateObject = new Date(year, month - 1, 1);

    const account = await accountServices.findById(userId);

    const hashCVC = await bcrypt.hash(CVC, 5);

    const card = await Card.create({
      number,
      date: dateObject,
      CVC: hashCVC,
      holderName,
      customName,
      accountId: account.id,
    });

    return this.getCardWithoutCVC(card);
  }

  async update(userId, id, data) {
    const requiredFields = ['customName'];
    validateRequiredFields(data, requiredFields);

    const card = await this.findById(userId, id);
    updateEntity(card, data);

    await card.save();

    return this.getCardWithoutCVC(card);
  }

  async updateBalance(userId, data) {
    const { type, amount, number, secondNumber } = data;
    console.log(1);
    // prettier-ignore
    const requiredFields =(
      data.transferType === TRANSFER_TYPE.CARD_TO_CARD 
      ? ['type', 'amount', 'number', 'secondNumber'] 
      : ['type', 'amount', 'number']);

    validateRequiredFields(data, requiredFields);
    console.log(2);

    const isTransferBetweenUserCards = await this.isTransferBetweenUserCards(data.number, data.secondNumber);
    console.log(3);

    const card = await this.findByNumber(number);

    //Проверка, что карта, с которой переводят, принадлежит юзеру. Условие не работает только тогда, когда происходит обновление второй карты при переводе с карты на карту, так как transferType не передается при повторном вызове
    if (data.transferType) {
      await userCardAccessCheck(userId, card.accountId);
    }
    console.log(4);

    switch (type) {
      //Получение средств
      case TYPES.DEPOSIT:
        //Проверяем на наличие второй карты, так как если обновляем 2-ую карту, то transferType не передается
        if (data.transferType === TRANSFER_TYPE.CARD_TO_CARD) {
          await this.updateBalance(userId, {
            type: TYPES.PAYMENT,
            amount,
            number: data.secondNumber,
            prevNumber: number,
            isTransferBetweenUserCards,
          });
        }

        card.balance = +card.balance + +amount;

        break;

      //Перевод средств
      case TYPES.PAYMENT:
        console.log(5);

        checkBalance(card.balance, amount);

        if (data.transferType === TRANSFER_TYPE.CARD_TO_CARD) {
          await this.updateBalance(userId, {
            type: TYPES.DEPOSIT,
            amount,
            number: data.secondNumber,
            prevNumber: number,
            isTransferBetweenUserCards,
          });
        }
        console.log(6);

        card.balance -= amount;

        break;
    }
    console.log(7);

    //Создание транзакции для аккаунт -> карта, карта -> аккаунт, если перевод на карту другого юзера
    if (data.transferType === TRANSFER_TYPE.ACCOUNT_CARD) {
      await transactionServices.create({
        amount,
        type: data.type,
        source: (await userServices.getById(userId)).email,
        destination: await userServices.getUserEmailByCardNumber(number),
        cardTo: data.type === TYPES.DEPOSIT ? number : undefined,
        cardFrom: data.type === TYPES.PAYMENT ? number : undefined,
        description: data.description,
        accountId: await this.getAccountIdByCardNumber(number),
      });
    }

    //Создание транзакций для карта -> карта для первой карты
    else if (data.transferType === TRANSFER_TYPE.CARD_TO_CARD) {
      console.log(8);

      await transactionServices.create({
        amount,
        type: isTransferBetweenUserCards ? TYPES.TRANSFER : data.type,
        source: await userServices.getUserEmailByCardNumber(number),
        destination: await userServices.getUserEmailByCardNumber(secondNumber),
        cardTo: secondNumber,
        cardFrom: number,
        description: data.description,
        accountId: await this.getAccountIdByCardNumber(number),
      });
      console.log(9);
    } else {
      console.log(10);

      //создание транзакции карта -> карта для второй карты, если это не перевод между своими картами
      if (!data.isTransferBetweenUserCards) {
        await transactionServices.create({
          amount,
          type: data.type,
          source: await userServices.getUserEmailByCardNumber(data.prevNumber),
          destination: await userServices.getUserEmailByCardNumber(number),
          cardTo: number,
          cardFrom: data.prevNumber,
          description: data.description,
          accountId: await this.getAccountIdByCardNumber(number),
        });
        console.log(11);
      }
    }
    console.log(12);

    await card.save();
    console.log(13);

    return card;
  }

  async delete(userId, id) {
    const card = await this.findById(userId, id);

    let deletedCard = this.getCardWithoutCVC(card);

    await card.destroy();

    return deletedCard;
  }
}

export default new CardServices();
