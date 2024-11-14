import profileServices from '../../services/userServices/profileServices.js';

class ProfileController {
  async getOneById(req, res, next) {
    try {
      const id = req.params.id || req.user.id;

      const profile = await profileServices.getById(id);

      return res.json({ profile });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const profiles = await profileServices.findAll();

      return res.json({ profiles });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const id = req.user.id;

      const profile = await profileServices.update(id);

      return res.json({ profile });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const id = req.user.id;
      const data = req.body;

      const profile = await profileServices.create(data, id);

      return res.json({ profile });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProfileController();
