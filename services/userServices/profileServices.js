import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import ApiError from '../../error/ApiError.js';
import { Profile, User } from '../../models/models.js';
import { userAccessCheck } from '../../utils/accesCheck.js';
import { checkProfileExists, checkUserExists, validateRequiredFields } from '../../utils/validationUtills.js';

class ProfileServices {
  async findById(userId, id, role) {
    userAccessCheck(userId, id, role);

    const profile = await Profile.findOne({ where: { userId: id } });
    checkProfileExists(profile);

    return profile;
  }

  async getById(userId, id, role) {
    const profile = await this.findById(userId, id, role);

    const { passportIdentifier, ...profileData } = profile;

    return profileData;
  }

  async findAll() {
    const profiles = await Profile.findAll();

    const profilesWithoutIdentifier = profiles.map((profile) => {
      const { passportIdentifier, ...profileWithoutIdentifier } = profile;
      return profileWithoutIdentifier;
    });

    return profilesWithoutIdentifier;
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

  async update(userId, id, password, role) {
    if (role === 'ADMIN') {
      throw ApiError.forbidden('Нет доступа');
    }
    console.log(124);
    const requiredFields = ['password'];
    validateRequiredFields({ password }, requiredFields);

    userAccessCheck(userId, id, role);
    const user = await this.findById(userId, id, role);
    checkUserExists(user);

    if (password === undefined) {
      throw ApiError.badRequest('Пожалуйста, введите пароль');
    }

    let newPassword = password;
    const comparePassword = bcrypt.compareSync(password, user.password);

    if (comparePassword) {
      throw ApiError.badRequest('Такой пароль уже используется');
    }

    newPassword = await bcrypt.hash(newPassword, 5);
    user.password = newPassword;

    await user.save();

    const token = generateJwt(user.id, user.email, user.role);
    return token;
  }
}

export default new ProfileServices();
