import partnerServices from '../../services/bankServices/partnerServices.js';

class PartnerController {
  async getAll(req, res, next) {
    try {
      const partners = await partnerServices.findAll();

      return res.json({ partners });
    } catch (error) {
      next(error);
    }
  }

  async getOne(req, res, next) {
    try {
      const partnerId = req.params.id;

      const partner = await partnerServices.findById(partnerId);

      return res.json({ partner });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const partnerData = req.body;

      const partner = await partnerServices.create(partnerData);

      return res.json({ partner });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const partnerId = req.params.id;
      const partnerData = req.body;

      const partner = await partnerServices.update(partnerId, partnerData);

      return res.json({ partner });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const partnerId = req.params.id;
      const partner = await partnerServices.delete(partnerId);

      return res.json({ partner });
    } catch (error) {
      next(error);
    }
  }
}

export default new PartnerController();
