import { TRANSFER_TYPE } from '../../constants/paymentConstants.js';
import cardServices from '../../services/accountServices/cardServices.js';

class CardController {
  async getOneById(req, res, next) {
    try {
      const userId = req.user.id;
      const id = req.params.id;

      const card = await cardServices.getById(userId, id);

      return res.json({ card });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const userId = req.user.id;
      const cards = await cardServices.findAll(userId);

      return res.json({ cards });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const userId = req.user.id;
      const data = req.body;

      const card = await cardServices.create(userId, data);

      return res.json({ card });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const userId = req.user.id;
      const id = req.params.id;
      const data = req.body;

      const card = await cardServices.update(userId, id, data);

      return res.json({ card });
    } catch (error) {
      next(error);
    }
  }

  async updateBalance(req, res, next) {
    try {
      const userId = req.user.id;
      const data = { ...req.body, transferType: TRANSFER_TYPE.CARD_TO_CARD };

      const card = await cardServices.updateBalance(userId, data);

      return res.json({ card });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const userId = req.user.id;
      const id = req.params.id;

      const card = await cardServices.delete(userId, id);

      return res.json({ card });
    } catch (error) {
      next(error);
    }
  }
}

export default new CardController();
