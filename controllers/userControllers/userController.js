import userServices from '../../services/userServices/userServices.js';

class UserController {
  async registration(req, res, next) {
    try {
      const data = req.body;

      const token = await userServices.registration(data);

      return res.json({ token });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const data = req.body;

      const token = await userServices.login(data);

      return res.json({ token });
    } catch (error) {
      next(error);
    }
  }

  async check(req, res, next) {
    try {
      const user = req.user;

      const token = await userServices.check(user);

      return res.json({ token });
    } catch (error) {
      next(error);
    }
  }

  async getOneById(req, res, next) {
    try {
      const id = req.params.id || req.user.id;

      const user = await userServices.getById(id);

      return res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  async getOneByEmail(req, res, next) {
    try {
      const email = req.params.email;

      const user = await userServices.findByEmail(email);

      return res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req, res, next) {
    try {
      const query = req.query;

      const users = await userServices.findAll(query);

      return res.json({ users });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const data = req.body;

      const user = await userServices.create(data);

      return res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const id = req.user.id;
      const password = req.body.password;

      const token = await userServices.update(id, password);

      return res.json({ token });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const id = req.params.id;

      const user = await userServices.delete(id, req.user.id);

      return res.json({ user });
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
