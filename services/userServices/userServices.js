import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ApiError from '../../error/ApiError.js';
import { User } from '../../models/models.js';
import { checkUserExists, validateRequiredFields } from '../../utils/validationUtills.js';

const generateJwt = (id, email, role) => {
  const token = jwt.sign({ id, email, role }, process.env.SECRET_KEY, { expiresIn: '24h' });

  return token;
};

class UserServices {
  async registration(data) {
    const { email, password } = data;
    const requiredFields = ['email', 'password'];
    validateRequiredFields(data, requiredFields);

    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest('Пользователь с таким email существует'));
    }

    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      email,
      password: hashPassword,
    });

    const token = generateJwt(user.id, user.email, user.role);

    return token;
  }

  async login(data) {
    const { email, password } = data;
    const requiredFields = ['email', 'password'];
    validateRequiredFields(data, requiredFields);

    const user = await User.findOne({ where: { email } });
    checkUserExists(user);

    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.badRequest('Неверный пароль'));
    }

    const token = generateJwt(user.id, user.email, user.role);

    return token;
  }

  async check(user) {
    const token = generateJwt(user.id, user.email, user.password);
    return token;
  }

  async findById(id) {
    const user = await User.findOne({ where: { id } });
    checkUserExists(user);

    return user;
  }

  async getById(id, role) {
    const user = await this.findById(id);

    if (role === 'USER') {
      return { email: user.email };
    } else if (role === 'ADMIN') {
      return {
        id: user.id,
        email: user.email,
        role: user.role,
      };
    } else {
      throw ApiError.forbidden('Нет доступа');
    }
  }

  async findByEmail(email) {
    const user = await User.findOne({ where: { email } });

    checkUserExists(user);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async findAll() {
    const users = await User.findAll();

    const usersWithoutPassword = users.map((user) => {
      const userWithoutPassword = {
        id: user.id,
        email: user.email,
        role: user.role,
      };
      return userWithoutPassword;
    });

    return usersWithoutPassword;
  }

  async create(data) {
    const { email, password, role } = data;
    const requiredFields = ['email', 'password', 'role'];
    validateRequiredFields(data, requiredFields);

    const hashPassword = await bcrypt.hash(password, 5);

    const user = await User.create({
      email,
      password: hashPassword,
      role,
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async update(id, password) {
    const requiredFields = ['password'];
    validateRequiredFields({ password }, requiredFields);

    const user = await this.findById(id);

    const comparePassword = bcrypt.compareSync(password, user.password);
    if (comparePassword) {
      throw ApiError.badRequest('Такой пароль уже используется');
    }

    const hashPassword = await bcrypt.hash(password, 5);
    user.password = hashPassword;

    await user.save();

    const token = generateJwt(user.id, user.email, user.role);
    return token;
  }

  async delete(id, userId) {
    if (id === userId) {
      throw ApiError.badRequest('Нельзя удалить свой аккаунт');
    }

    const user = await this.findById(id);

    let deletedUser = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    await user.destroy();

    return deletedUser;
  }
}

export default new UserServices();
