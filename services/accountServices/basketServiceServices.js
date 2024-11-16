import { ACTION_TYPE, SERVICE_TYPES, TRANSFER_TYPE } from '../../constants/paymentConstants.js';
import ApiError from '../../error/ApiError.js';
import { BasketService, Transaction } from '../../models/models.js';
import { checkBalance, checkTransactionExists, validateRequiredFields } from '../../utils/validationUtills.js';
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

  async findById(id) {
    const basketService = await BasketService.findByPk(id);

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

  async create(userId, serviceId, data) {
    const { amount } = data;
    const requiredFields = ['amount'];
    validateRequiredFields(data, requiredFields);

    const service = await serviceServices.findById(serviceId);

    checkBalance(amount, service.minSum);

    const transactionDetails = {
      ...data,
      type: service.type,
      transferType: TRANSFER_TYPE.ACCOUNT_SERVICE,
      actionType: ACTION_TYPE.ADD,
    };

    await accountServices.updateBalance(userId, transactionDetails);

    const basketId = await basketServices.getBasketIdByUserId(userId);

    const maturityDate = new Date();
    maturityDate.setDate(maturityDate.getDate() + +service.duration);

    const baskerService = await BasketService.create({
      amount: amount * (1 + +service.interest / 100),
      serviceDate: new Date(),
      maturityDate: maturityDate,
      basketId,
      serviceId,
    });

    return baskerService;
  }

  async delete(userId, id) {
    const basketService = await this.findById(id);

    const service = await serviceServices.findById(basketService.serviceId);

    const typeForDelete = service.type === SERVICE_TYPES.DEPOSIT ? SERVICE_TYPES.LOAN : SERVICE_TYPES.DEPOSIT;

    const transactionDetails = {
      amount: basketService.amount,
      type: typeForDelete,
      transferType: TRANSFER_TYPE.ACCOUNT_SERVICE,
      actionType: ACTION_TYPE.DELETE,
    };

    await accountServices.updateBalance(userId, transactionDetails);

    let deletedBasketService = basketService;

    await basketService.destroy();

    return deletedBasketService;
  }
}

export default new BasketServiceServices();
