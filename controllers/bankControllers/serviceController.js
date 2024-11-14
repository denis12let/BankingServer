import serviceServices from '../../services/bankServices/serviceServices.js';

class ServiceController {
  async getAll(req, res, next) {
    try {
      const type = req.query.type;
      const services = await serviceServices.findAll(type);

      return res.json({ services });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const serviceId = req.params.id;

      const service = await serviceServices.findById(serviceId);

      return res.json({ service });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const serviceData = req.body;

      const service = await serviceServices.create(serviceData);

      return res.json({ service });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const serviceId = req.params.id;
      const serviceData = req.body;

      const service = await serviceServices.update(serviceId, serviceData);

      return res.json({ service });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const serviceId = req.params.id;
      const service = await serviceServices.delete(serviceId);

      return res.json({ service });
    } catch (error) {
      next(error);
    }
  }
}

export default new ServiceController();
