import ApiError from '../error/ApiError.js';
import accountServices from '../services/accountServices/accountServices.js';

// export const userAndAdminAccessCheck = (userId, id, role) => {
//   if (userId !== id && role !== 'ADMIN') {
//     console.log(userId !== id, role !== 'ADMIN');
//     throw ApiError.forbidden('Нет доступа');
//   }
// };

export const userAccessCheck = (userId, id, role) => {
  if (userId != id && role === 'USER') {
    throw ApiError.forbidden('Нет доступа');
  }
};

export const accessCheck = (userId, id) => {
  if (userId !== id) {
    throw ApiError.forbidden('Нет доступа');
  }
};

export const userCardAccessCheck = async (userId, accountId) => {
  const account = await accountServices.findById(userId);
  if (account.id !== accountId) {
    throw ApiError.forbidden('Нет доступа');
  }
  return true;
};
