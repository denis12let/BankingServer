import { ACTION_TYPE, SERVICE_TYPES, TRANSFER_TYPE, TYPES } from '../../constants/paymentConstants.js';
import { BasketService } from '../../models/models.js';
import { checkBalance, checkServiceExist, validateRequiredFields } from '../../utils/validationUtills.js';
import accountServices from '../accountServices/accountServices.js';
import serviceServices from '../bankServices/serviceServices.js';
import basketServices from './basketServices.js';

class BasketServiceServices {
  async getByBasketServiceIdAndBasketId(serviceId, basketId) {
    const basketService = await this.findById(serviceId, basketId);

    return basketService;
  }

  async findById(serviceId, basketId) {
    const basketService = await BasketService.findOne({ where: { basketId, id: serviceId } });
    checkServiceExist(basketService);

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
      type: service.type,
      basketId,
      serviceId,
    });

    return baskerService;
  }

  async delete(userId, id) {
    const basketId = await basketService.getBasketIdByUserId(userId);
    const basketService = await this.findById(id, basketId);

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
