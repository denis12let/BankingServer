import { TRANSFER_TYPE } from '../../constants/paymentConstants.js';
import accountServices from '../../services/accountServices/accountServices.js';

class AccountController {
  async getOneById(req, res, next) {
    try {
      const id = req.user.id;

      const account = await accountServices.getById(id);

      return res.json({ account });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const id = req.user.id;
      const data = req.body;

      const account = await accountServices.update(id, data);

      return res.json({ account });
    } catch (error) {
      next(error);
    }
  }

  async updateBalance(req, res, next) {
    try {
      const id = req.user.id;
      const data = req.body;

      const message = await accountServices.updateBalance(id, { ...data, transferType: TRANSFER_TYPE.ACCOUNT_CARD });

      return res.json({ message });
    } catch (error) {
      next(error);
    }
  }
}

export default new AccountController();
