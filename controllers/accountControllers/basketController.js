import basketServices from '../../services/accountServices/basketServices.js';

class BasketController {
  async getBasketSize(req, res, next) {
    try {
      const userId = req.user.id;
      const basketSize = await basketServices.getBasketSize(userId);

      return res.json({ basketSize });
    } catch (error) {
      next(error);
    }
  }

  async getServices(req, res, next) {
    try {
      const userId = req.user.id;
      const services = await basketServices.getAllServices(userId);

      return res.json({ services });
    } catch (error) {
      next(error);
    }
  }

  async getService(req, res, next) {
    try {
      const userId = req.user.id;
      const serviceId = req.params.id;

      const service = await basketServices.getOneService(userId, serviceId);

      return res.json({ service });
    } catch (error) {
      next(error);
    }
  }

  async addService(req, res, next) {
    try {
      const userId = req.user.id;
      const serviceId = req.params.id;
      const data = req.body;

      const service = await basketServices.addService(userId, serviceId, data);

      return res.json({ service });
    } catch (error) {
      next(error);
    }
  }

  async deleteService(req, res, next) {
    try {
      const userId = req.user.id;
      const serviceId = req.params.id;

      const service = await basketServices.deleteService(userId, serviceId);

      return res.json({ service });
    } catch (error) {
      next(error);
    }
  }
}

export default new BasketController();
