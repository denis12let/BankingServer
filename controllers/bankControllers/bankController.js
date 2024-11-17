import bankServices from '../../services/bankServices/bankServices.js';

class BankController {
  async get(req, res, next) {
    try {
      const bank = await bankServices.findById(1);

      return res.json({ bank });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const data = req.body;
      const bank = await bankServices.update(data);

      return res.json({ bank });
    } catch (error) {
      next(error);
    }
  }
}

export default new BankController();
