import { BasketService, Transaction } from '../../models/models.js';
import { checkTransactionExists, validateRequiredFields } from '../../utils/validationUtills.js';
import accountServices from '../accountServices/accountServices.js';

class BasketServiceServices {
  async findById(basketId, id) {
    const basketService = await BasketService.findOne({ where: { id, basketId } });

    return basketService;
  }

  async getByBasketIdAndServiceId(basketId, id) {
    const basketService = await this.findById(basketId, id);

    return basketService;
  }

  async findAll(basketId) {
    const basketServices = await BasketService.findAll({ where: { basketId } });

    return basketServices;
  }

  async getAll(basketId) {
    const basketServices = this.findAll(basketId);

    return basketServices;
  }
  //доделать
  async create(userId, serviceId, data) {
    const { amount } = data;
    const requiredFields = ['amount'];
    validateRequiredFields(data, requiredFields);

    const trancsaction = await Transaction.create({
      amount,
      date: new Date(),
      type,
      source,
      destination,
      cardFrom,
      cardTo,
      accountId,
    });

    return trancsaction;
  }
  //доделать
  async delete(basketId, id) {
    const basketService = await this.findById(basketId, id);

    let deletedBasketService = basketService;

    await basketService.destroy();

    return deletedBasketService;
  }
}

export default new BasketServiceServices();
