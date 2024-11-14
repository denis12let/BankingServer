import ApiError from '../error/ApiError.js';

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
