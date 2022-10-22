const base64url = require('base64url');
const dilithium = require('dilithium-crystals');

const dilithium_kty = 'LWE';
const dilithium_alg = 'CRYDI5';

const getSuite = ({kty, alg}) => {
  const keyMapper = {
    [`${dilithium_kty} ${dilithium_alg}`]: dilithium,
  };
  return keyMapper[`${kty} ${alg}`];
};

const generate = async ({kty, alg}) => {
  const suite = getSuite({kty, alg});
  const {publicKey, privateKey} = await suite.keyPair();
  return {publicKey, privateKey};
};

const importJwk = (jwk) => {
  if (jwk.d) {
    return Uint8Array.from(Buffer.from(jwk.d, 'base64'));
  } else {
    return Uint8Array.from(Buffer.from(jwk.x, 'base64'));
  }
};

const exportPublicKeyJwk = ({publicKey}) => {
  const publicKeyJwk = {
    kty: dilithium_kty,
    alg: dilithium_alg,
    x: base64url.encode(publicKey),
  };
  return publicKeyJwk;
};

const exportPrivateKeyJwk = ({publicKey, privateKey}) => {
  const publicKeyJwk = exportPublicKeyJwk({publicKey});
  const privateKeyJwk = {
    ...publicKeyJwk,
    d: base64url.encode(privateKey),
  };
  return privateKeyJwk;
};

const exportKeyPairJwk = ({publicKey, privateKey}) => {
  const publicKeyJwk = exportPublicKeyJwk({publicKey});
  const privateKeyJwk = exportPrivateKeyJwk({publicKey, privateKey});
  return {
    publicKeyJwk,
    privateKeyJwk,
  };
};

module.exports = {
  dilithium_kty,
  dilithium_alg,
  getSuite,
  generate,
  importJwk,
  exportPublicKeyJwk,
  exportPrivateKeyJwk,
  exportKeyPairJwk,
};
