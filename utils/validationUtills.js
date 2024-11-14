import ApiError from '../error/ApiError.js';

export const validateRequiredFields = (fields, requiredFields) => {
  for (const field of requiredFields) {
    if (!fields[field]) {
      throw ApiError.badRequest(`Поле ${field} обязательно для заполнения`);
    }
  }
};

export const checkUserExists = (user) => {
  if (!user) {
    throw ApiError.notFound('Пользователь не найден');
  }
};

export const checkProfileExists = (profile) => {
  if (!profile) {
    throw ApiError.notFound('Профиль пользователя не найден');
  }
};

export const checkAccountExists = (account) => {
  if (!account) {
    throw ApiError.notFound('Аккаунт пользователя не найден');
  }
};
