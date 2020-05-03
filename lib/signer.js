const gostCrypto = require('node-crypto-gost');

/**
 * @param {Object} Объект с сертификатом и приватным ключом.
 * @prop {String} certificate Содержимое файла сертификата.
 * @prop {String} privateKey Содержимое файла ключа.
 *
 * @return {Function} Подписывает message в формат pkcs#7
 * и кодирует в base64 url safe.
 */
module.exports = ({certificate, privateKey}) => {
  if (!certificate || !privateKey) {
    throw new Error('Certificate and key are required to signing data.');
  }

  return async (message) => {
    if (message === undefined) {
      message = '';
    }

    if (typeof message !== 'string') {
      if (message.toString) {
        message = message.toString();
      } else {
        throw new Error('The message value can`t be converted to string');
      }
    }

    const key = new gostCrypto.asn1.PrivateKeyInfo(privateKey);
    const cert = new gostCrypto.cert.X509(certificate);
    const msg = new gostCrypto.cms.SignedDataContentInfo();

    msg.setEnclosed(message);
    msg.writeDetached(true);
    msg.content.certificates = [cert];

    await msg.addSignature(key, cert);

    return msg.encode('PEM')
        .replace('-----END CMS-----', '')
        .replace('-----BEGIN CMS-----', '')
        .replace(/(?:\r\n|\r|\n)/g, '')
  };
};
