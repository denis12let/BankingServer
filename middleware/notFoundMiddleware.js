import ApiError from '../error/ApiError.js';

export default function notFoundMiddleware(req, res, next) {
  next(ApiError.notFound('Маршрут не найден'));
}
