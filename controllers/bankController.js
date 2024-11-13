import ApiError from '../error/ApiError.js';
import { Bank } from '../models/models.js';
import bankServices from '../services/BankServices.js';

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
      const bankData = req.body;
      const bank = await bankServices.update(bankData);

      return res.json(bank);
    } catch (error) {
      next(error);
    }
  }
}

export default new BankController();
