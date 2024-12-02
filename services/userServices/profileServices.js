import bcrypt from 'bcrypt';
import ApiError from '../../error/ApiError.js';
import { Profile } from '../../models/models.js';
import { checkProfileExists, validateRequiredFields } from '../../utils/validationUtills.js';
import { updateEntity } from '../../utils/updateUtils.js';

class ProfileServices {
  getProfileWhithoutIdentifier(profile) {
    const { passportIdentifier, ...profileWithoutIdentifier } = profile.dataValues;

    return profileWithoutIdentifier;
  }

  async findByUserId(id) {
    const profile = await Profile.findOne({ where: { userId: id } });
    checkProfileExists(profile);

    return profile;
  }

  async getById(id) {
    const profile = await this.findByUserId(id);

    return this.getProfileWhithoutIdentifier(profile);
  }

  async findAll() {
    const profiles = await Profile.findAll();

    const profilesWithoutIdentifier = profiles.map((profile) => this.getProfileWhithoutIdentifier(profile));

    return profilesWithoutIdentifier;
  }

  async create(data, userId) {
    const { passportIdentifier, telephoneNumber, userName, userSurname, profileImg } = data;
    const requiredFields = ['passportIdentifier', 'telephoneNumber', 'userName', 'userSurname'];
    validateRequiredFields(data, requiredFields);

    const candidateProfile = await Profile.findOne({ where: { userId } });
    if (candidateProfile) {
      throw ApiError.badRequest('Профиль пользователя уже существует');
    }

    const exictingProfileTelephone = await Profile.findOne({ where: { telephoneNumber } });
    if (exictingProfileTelephone) {
      throw ApiError.badRequest('Профиль пользователя с таким телефоном уже существует');
    }

    const hashIdentifier = await bcrypt.hash(passportIdentifier, 5);

    const profile = await Profile.create({
      passportIdentifier: hashIdentifier,
      telephoneNumber,
      userName,
      userSurname,
      profileImg: profileImg || 'https://cdn-icons-png.flaticon.com/512/266/266033.png',
      userId,
    });

    return this.getProfileWhithoutIdentifier(profile);
  }

  async update(id, data) {
    const profile = await this.findByUserId(id);

    updateEntity(profile, data, { passportIdentifier, telephoneNumber });

    await profile.save();

    return this.getProfileWhithoutIdentifier(profile);
  }
}

export default new ProfileServices();
