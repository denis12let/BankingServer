import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import ApiError from '../../error/ApiError.js';
import { User } from '../../models/models.js';
import { checkUserExists, validateRequiredFields } from '../../utils/validationUtills.js';
import accountServices from '../accountServices/accountServices.js';
import cardServices from '../accountServices/cardServices.js';

const generateJwt = (id, email, role) => {
  const token = jwt.sign({ id, email, role }, process.env.SECRET_KEY, { expiresIn: '2400h' });

  return token;
};

class UserServices {
  getUserWithoutPassword(user) {
    const { password, ...userWithoutPassword } = user.dataValues;

    return userWithoutPassword;
  }

  async registration(data) {
    const { email, password } = data;
    console.log(data);
    const requiredFields = ['email', 'password'];
    validateRequiredFields(data, requiredFields);

    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      throw ApiError.badRequest('Пользователь с таким email существует');
    }

    const hashPassword = await bcrypt.hash(password, 5);
    const user = await User.create({
      email,
      password: hashPassword,
    });
    await accountServices.create(user.id);

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
      throw ApiError.badRequest('Неверный пароль');
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

  async getById(id) {
    const user = await this.findById(id);

    return this.getUserWithoutPassword(user);
  }

  async getUserEmailByCardNumber(number) {
    const card = await cardServices.findByNumber(number);
    const account = await accountServices.findByAccountId(card.accountId);
    const user = await this.getById(account.userId);

    return user.email;
  }

  async getUserEmailById(id) {
    const user = await this.getById(id);

    return user.email;
  }

  async findByEmail(email) {
    const user = await User.findOne({ where: { email } });

    checkUserExists(user);

    return this.getUserWithoutPassword(user);
  }

  async findAll(query) {
    const { email } = query;

    const users = await User.findAll({
      where: email ? { email: { [Op.like]: `%${email}%` } } : undefined,
    });

    const usersWithoutPassword = users.map((user) => this.getUserWithoutPassword(user));

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

    await accountServices.create(user.id);

    return this.getUserWithoutPassword(user);
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

    let deletedUser = this.getUserWithoutPassword(user);

    await user.destroy();

    return deletedUser;
  }
}

export default new UserServices();
