import profileServices from '../../services/userServices/profileServices.js';

class ProfileController {
  async getOneById(req, res, next) {
    try {
      const { id: userId, role } = req.user;
      const id = req.params.id || id;

      const profile = await profileServices.getById(userId, id, role);

      return res.json({ user });
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
      const userId = req.user.id;
      const role = req.user.role;
      const id = req.params.id;
      const password = req.body.password;

      const token = await userServices.update(userId, id, password, role);

      return res.json({ token });
    } catch (error) {
      next(error);
    }
  }
}

export default new ProfileController();
