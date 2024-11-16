import { TRANSFER_TYPE } from '../../constants/paymentConstants.js';
import cardServices from '../../services/accountServices/cardServices.js';
import transactionServices from '../../services/accountServices/transactionServices.js';

class TransactionController {
  async getOneById(req, res, next) {
    try {
      const userId = req.user.id;
      const id = req.params.id;

      const transaction = await transactionServices.getById(userId, id);

      return res.json({ transaction });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const userId = req.user.id;
      const queryData = req.query;

      const transactions = await transactionServices.getAll(userId, queryData);

      return res.json({ transactions });
    } catch (error) {
      next(error);
    }
  }

  async getCalendar(req, res, next) {
    try {
      const userId = req.user.id;
      const queryData = req.query;

      const transactions = await transactionServices.getCalendar(userId, queryData);

      return res.json({ transactions });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const userId = req.user.id;
      const id = req.params.id;

      const transaction = await transactionServices.delete(userId, id);

      return res.json({ transaction });
    } catch (error) {
      next(error);
    }
  }
}

export default new TransactionController();
