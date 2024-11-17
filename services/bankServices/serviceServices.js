import { Service } from '../../models/models.js';
import { updateEntity } from '../../utils/updateUtils.js';
import { checkServiceExist } from '../../utils/validationUtills.js';
import bankServices from './bankServices.js';

class ServiceServices {
  async findById(id) {
    const service = await Service.findByPk(id);
    checkServiceExist(service);

    return service;
  }

  async findAll() {
    const services = await Service.findAll();

    return services;
  }

  async getAll(query) {
    const { type } = query;
    const services = await this.findAll();

    const filteredServices = services.filter((service) => {
      let isValid = true;

      if (type) {
        isValid = isValid && service.type === type;
      }

      return isValid;
    });

    return filteredServices;
  }

  async create(data) {
    const bank = await bankServices.findById(1);
    const { name, interest, duration, minSum, type } = data;
    const requiredFields = ['name', 'interest', 'duration', 'minSum', 'type'];
    validateRequiredFields(data, requiredFields);

    const service = await Service.create({
      name,
      interest,
      duration,
      minSum,
      type,
      bankId: bank.id,
    });

    return service;
  }

  async update(id, data) {
    const service = await this.findById(id);

    updateEntity(data, service);

    await service.save();

    return service;
  }

  async delete(id) {
    const service = await this.findById(id);
    const deletedservice = service;

    await service.destroy();

    return deletedservice;
  }
}

export default new ServiceServices();
