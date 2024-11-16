import { BasketService, Transaction } from '../../models/models.js';
import { checkTransactionExists, validateRequiredFields } from '../../utils/validationUtills.js';
import accountServices from '../accountServices/accountServices.js';
import serviceServices from '../bankServices/serviceServices.js';
import basketServices from './basketServices.js';

class BasketServiceServices {
  async findByBasketIdAndServiceId(basketId, id) {
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

    const basketId = await basketServices.getBasketIdByUserId(userId);

    const baskerService = await BasketService.create({
      amount,
      basketId,
      serviceId,
    });

    return baskerService;
  }

  //доделать
  async delete(userId, id) {
    const basketId = await basketServices.getBasketIdByUserId(userId);
    const basketService = await this.findById(basketId, id);

    let deletedBasketService = basketService;

    await basketService.destroy();

    return deletedBasketService;
  }
}

export default new BasketServiceServices();
