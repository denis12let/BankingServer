import ApiError from '../../error/ApiError.js';
import { Service } from '../../models/models.js';
import bankServices from './bankServices.js';

class ServiceServices {
  async findById(id) {
    const service = await Service.findOne({ where: { id } });
    if (!service) {
      throw ApiError.notFound('Услуга не найдена');
    }

    return service;
  }

  async findByServiceId(id) {
    const service = await Service.findByPk(id);
    if (!service) {
      throw ApiError.notFound('Услуга не найдена');
    }

    return service;
  }

  async findAll(type) {
    let services;

    if (type) {
      services = await Service.findAll({ where: { type } });
    } else {
      services = await Service.findAll();
    }

    return services;
  }

  async create(data) {
    const bank = await bankServices.findById(1);
    const { name, amount, interest, serviceDate, maturityDate, duration, minSum, type } = data;

    if (!name || !amount || !interest || !serviceDate || !maturityDate || !duration || !minSum || !type) {
      throw ApiError.badRequest('Не все обязательные поля заполнены');
    }

    const service = await Service.create({
      name,
      amount,
      interest,
      serviceDate,
      maturityDate,
      duration,
      minSum,
      type,
      bankId: bank.id,
    });

    return service;
  }

  async update(id, data) {
    const service = await this.findById(id);

    Object.keys(data).forEach((key) => {
      if (key in service && data[key]) {
        service[key] = data[key];
      }
    });

    await service.save();

    return service;
  }

  async delete(id) {
    const service = await this.findById(id);
    const deletedservice = service.toJSON();

    await service.destroy();

    return deletedservice;
  }
}

export default new ServiceServices();
