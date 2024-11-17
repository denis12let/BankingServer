import ApiError from '../error/ApiError.js';

export const updateEntity = (entity, data, immutableFields = {}) => {
  Object.keys(data).forEach((key) => {
    if (key in immutableFields) {
      throw ApiError.badRequest(`Поле ${key} неизменяемое`);
    }
    if (key in entity && data[key]) {
      entity[key] = data[key];
    }
  });

  return entity;
};
