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

  async getUserAll(req, res, next) {
    try {
      const userId = req.user.id;
      const queryData = req.query;

      const transactions = await transactionServices.getAll(userId, queryData);

      return res.json({ transactions });
    } catch (error) {
      next(error);
    }
  }

  async getUsersAll(req, res, next) {
    try {
      const queryData = req.query;
      const userId = null;

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
