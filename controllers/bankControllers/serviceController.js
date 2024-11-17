import serviceServices from '../../services/bankServices/serviceServices.js';

class ServiceController {
  async getAll(req, res, next) {
    try {
      const query = req.query;

      const services = await serviceServices.getAll(query);

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
      const data = req.body;

      const service = await serviceServices.create(data);

      return res.json({ service });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const serviceId = req.params.id;
      const data = req.body;

      const service = await serviceServices.update(serviceId, data);

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
