# esia-gosuslugi
Модуль идентификации и авторизации пользователей через ЕСИА для Node.js с поддержкой ГОСТ 34.10

Перед использованием ознакомтесь с [документацией](https://digital.gov.ru/ru/documents/6182/).

## использование

1. Установите
```js
npm i -s esia-gosuslugi
```

2. Создайте экземпляр подключения к ЕСИА

```js
const fs = require('fs');
const esia = require('esia');

// читается сертификат используемый в ЕСИА
const cert = fs.readFileSync('./cert.pem', 'utf8');
const key =  fs.readFileSync('./privkey.key', 'utf8');

const esiaConnection = esia({
    clientId: 'ISMNEMONIKA',
    redirectUri: 'https://my-site.com/esiacode/',
    scope: 'openid id_doc mobile fullname',
    certificate: cert,
    key: key
});
```

3. Направьте пользвателя в ЕСИА для получения подтверждения

```js
// сгенерируйте url для пользователя
await esiaConnection.getAuth()
```

4. После того как пользователь авторизуется и даст разрешение на доступ к своим данным, он будет перенаправлен по адресу, указанному в redirectUri. Вы получите параметр code, который нужно будет использовать для запроса данных
```js
await esiaConnection.getAccess(code)
```

Метод getAccess возвращает Promise, в который приходит объект результата. Этот объект содержит два поля:
- marker - маркер доступа. Объект, содержащий поля:
    - response - объект, ответ от ЕСИА при запросе маркера
    - decodedAccessToken - объект, jwt декодированное значение поля access_token, содержащееся в response.
- data - массив записей данных о пользователе.

В метод getAccess вторым параметром можно передать массив путей для получения записей данных о пользователе. Они будут содержаться в ответе, в поле data, описанном выше. Если параметр не передавать, по умолчанию будет использоваться ['/']. Если передать null, то данные о пользователе запрашиваться не будут.

```js
const { data } = await esiaConnection.getAccess(code, ['/', '/docs']) 

// не будет запрошена информация о пользователе
const { data } = await esiaConnection.getAccess(code, null)
```

Подробнее о получении информации о пользователе читайте в официальной документации ЕСИА.



