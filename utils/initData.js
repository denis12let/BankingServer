import { Bank, User } from '../models/models.js';

export const initBank = async () => {
  const bank = await Bank.findOne({ where: { id: 1 } });

  if (!bank) {
    await Bank.create();
  }
};

export const initAdmin = async () => {
  const admin = await User.findOne({ where: { role: 'ADMIN' } });

  if (!admin) {
    await User.create({
      email: 'amdin@mail.ru',
      password: 'admin',
      role: 'ADMIN',
    });
  }
};
