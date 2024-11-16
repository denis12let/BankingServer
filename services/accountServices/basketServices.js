import ApiError from '../../error/ApiError.js';
import { Basket, Transaction } from '../../models/models.js';
import { checkTransactionExists, validateRequiredFields } from '../../utils/validationUtills.js';
import accountServices from '../accountServices/accountServices.js';
import { TRANSFER_TYPE, TYPES } from '../../constants/paymentConstants.js';
import basketServiceServices from './basketServiceServices.js';

class BasketServices {
  async findBasketById(userId) {
    const account = await accountServices.findById(userId);
    const basket = await Basket.findOne({ where: { accountId: account.id } });

    return basket;
  }

  async getBasketSize(userId) {
    const basket = await this.findBasketById(userId);

    return basket.servicesCount;
  }

  async getOneService(userId, id) {
    const basket = await this.findBasketById(userId);
    const service = await basketServiceServices.getByBasketIdAndServiceId(basket.id, id);

    return service;
  }

  async findAllServices(userId) {
    const basket = await this.findBasketById(userId);
    const services = await basketServiceServices.getAll(basket.id);

    return services;
  }

  async getAllServices(userId, query) {
    const services = this.findAllServices(userId);
    // const {type, min, maxSum, timeFrom, timeTo, }

    return services;
  }

  async addService(userId, serviceId, data) {
    const service = await basketServiceServices.create(userId, serviceId, data);

    const basket = await this.findBasketById(userId);
    basket.servicesCount = +basket.servicesCount + 1;

    return service;
  }

  async deleteService(userId, serviceId) {
    const deletedService = await basketServiceServices.delete(userId, serviceId);

    const basket = await this.findBasketById(userId);
    basket.servicesCount = +basket.servicesCount - 1;

    return deletedService;
  }

  async create(accountId) {
    const basket = await Basket.create({ accountId });

    return basket;
  }
}

export default new BasketServices();
