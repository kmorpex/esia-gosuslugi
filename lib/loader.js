'use strict'

const axios = require('axios');

/**
 * Загружает данные по урлу с использованием токена доступа.
 *
 * @function
 * @param {Object} config Объект с параметрами загрузки данных пользователя.
 * @prop {String} uri Адрес данных
 * @prop {String} accessToken Токен доступа
 *
 * @return {Promise<Object>} Данные
 */
module.exports = async ({accessToken, uri}) => {
  if (!accessToken) {
    return Promise.reject(
      new Error('\'accessToken\' is required to get data.')
    );
  }

  const { data } = await axios.get(uri, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    }})

  return data
};
