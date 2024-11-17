import bcrypt from 'bcrypt';
import { Bank, User } from '../models/models.js';

export const initBank = async () => {
  const bank = await Bank.findOne({ where: { id: 1 } });

  if (!bank) {
    await Bank.create();
  }
};

export const initAdmin = async () => {
  const admin = await User.findOne({ where: { role: 'ADMIN' } });
  const { email, password, role } = {
    email: 'admin@mail.ru',
    password: 'admin',
    role: 'ADMIN',
  };

  const hashPassword = await bcrypt.hash(password, 5);
  if (!admin) {
    await User.create({
      email,
      password: hashPassword,
      role,
    });
  }
};
