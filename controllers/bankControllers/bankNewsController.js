import bankNewsServices from '../../services/bankServices/bankNewsServices.js';

class BankNewsController {
  async getAll(req, res, next) {
    try {
      const bankNews = await bankNewsServices.findAll();

      return res.json({ bankNews });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const bankNewsId = req.params.id;

      const bankNews = await bankNewsServices.findById(bankNewsId);

      return res.json({ bankNews });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = req.body;

      const bankNews = await bankNewsServices.create(data);

      return res.json({ bankNews });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const bankNewsId = req.params.id;
      const data = req.body;

      const bankNews = await bankNewsServices.update(bankNewsId, data);

      return res.json({ bankNews });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const bankNewsId = req.params.id;

      const bankNews = await bankNewsServices.delete(bankNewsId);

      return res.json({ bankNews });
    } catch (error) {
      next(error);
    }
  }
}

export default new BankNewsController();
