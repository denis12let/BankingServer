import ApiError from '../error/ApiError.js';

export const checkUserExists = (user) => {
  if (!user) {
    throw ApiError.notFound('Пользователь не найден');
  }
};

export const validateRequiredFields = (fields, requiredFields) => {
  for (const field of requiredFields) {
    if (!fields[field]) {
      throw ApiError.badRequest(`Поле ${field} обязательно для заполнения`);
    }
  }
};
