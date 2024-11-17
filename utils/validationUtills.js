import ApiError from '../error/ApiError.js';

export const validateRequiredFields = (fields, requiredFields) => {
  for (const field of requiredFields) {
    if (!fields[field]) {
      throw ApiError.badRequest(`Поле ${field} обязательно для заполнения`);
    }
  }
};

export const checkBalance = (num1, num2) => {
  if (+num1 < +num2) {
    throw ApiError.notFound('Недостаточно средств');
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

export const checkCardExists = (card) => {
  if (!card) {
    throw ApiError.notFound('Данной карты не существует');
  }
};

export const checkTransactionExists = (transaction) => {
  if (!transaction) {
    throw ApiError.notFound('Данной транзакции не существует');
  }
};

export const checkBasketServiceExists = (basketService) => {
  if (!basketService) {
    throw ApiError.notFound('Данной услуги не существует');
  }
};

export const checkServiceExist = (service) => {
  if (!service) {
    throw ApiError.notFound('Данной услуги не существует');
  }
};

export const checkBankExist = (bank) => {
  if (!bank) {
    throw ApiError.notFound('Данного банка не существует');
  }
};

export const checkPartnerExist = (partner) => {
  if (!partner) {
    throw ApiError.notFound('Данной рекламы не существует');
  }
};

export const checkBankNewsExist = (bankNews) => {
  if (!bankNews) {
    throw ApiError.notFound('Данной новости не существует');
  }
};
