class ProfileServices {
  async findById(id) {
    const profile = await Profile.findOne({ where: { userId: id } });
    checkProfileExists(profile);

    return profile;
  }

  async getById(id) {
    const profile = await this.findById(id);

    return this.getProfileWhithoutIdentifier(profile);
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
    const profile = await this.findById(id);

    Object.keys(data).forEach((key) => {
      if (key === 'passportIdentifier' || key === 'telephoneNumber') {
        throw ApiError.badRequest(`Поле ${key} неизменяемое `);
      }
      if (key in profile && data[key]) {
        profile[key] = data[key];
      }
    });

    await profile.save();

    return this.getProfileWhithoutIdentifier(profile);
  }
}

export default new ProfileServices();
