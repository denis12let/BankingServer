import ApiError from '../error/ApiError.js';
import jwt from 'jsonwebtoken';

export default function (req, res, next) {
  if (req.method === 'OPTIONS') return next();

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(ApiError.unauthorized('Пользователь не авторизован'));
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decode;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return next(ApiError.unauthorized('Токен истек'));
    } else if (error.name === 'JsonWebTokenError') {
      return next(ApiError.unauthorized('Недействительный токен'));
    }
    next(error);
  }
}
