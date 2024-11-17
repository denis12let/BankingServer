import { Basket } from '../../models/models.js';
import { checkServiceExist } from '../../utils/validationUtills.js';
import accountServices from '../accountServices/accountServices.js';
import basketServiceServices from './basketServiceServices.js';

class BasketServices {
  async findBasketByUserId(userId) {
    const account = await accountServices.findById(userId);
    const basket = await Basket.findOne({ where: { accountId: account.id } });

    return basket;
  }

  async getBasketIdByUserId(userId) {
    const basket = await this.findBasketByUserId(userId);

    return basket.id;
  }

  async getBasketSize(userId) {
    const basket = await this.findBasketByUserId(userId);

    return basket.servicesCount;
  }

  async getOneService(userId, serviceId) {
    const basketId = await this.getBasketIdByUserId(userId);
    const service = await basketServiceServices.getByBasketServiceIdAndBasketId(serviceId, serviceId);
    checkServiceExist(service);

    return service;
  }

  async findAllServices(userId) {
    const basket = await this.findBasketByUserId(userId);
    const services = await basketServiceServices.getAll(basket.id);

    return services;
  }

  async getAllServices(userId, query) {
    const { type } = query;

    const services = this.findAllServices(userId);

    const filteredServices = services.filter((service) => {
      let isValid = true;

      if (type) {
        isValid = isValid && service.type === type;
      }

      return isValid;
    });

    return filteredServices;
  }

  async addService(userId, serviceId, data) {
    const service = await basketServiceServices.create(userId, serviceId, data);

    const basket = await this.findBasketByUserId(userId);

    basket.servicesCount = +basket.servicesCount + 1;
    await basket.save();

    return service;
  }

  async deleteService(userId, serviceId) {
    const basket = await this.findBasketByUserId(userId);

    const deletedService = await basketServiceServices.delete(userId, serviceId);

    basket.servicesCount -= 1;
    await basket.save();

    return deletedService;
  }

  async create(accountId) {
    const basket = await Basket.create({ accountId });

    return basket;
  }
}

export default new BasketServices();
