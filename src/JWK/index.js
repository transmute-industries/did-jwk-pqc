const jose = require('jose');

const base64url = require('base64url');
const dilithium = require('dilithium-crystals');

const dilithium_kty = 'LWE';
const dilithium_alg = 'CRYDI5';

const formatJwk = (jwk) => {
  const {kid, x5u, x5c, x5t, kty, crv, alg, key_ops, x, y, d, ...rest} = jwk;
  return JSON.parse(
      JSON.stringify({
        kid,
        x5u,
        x5c,
        x5t,
        kty,
        crv,
        alg,
        key_ops,
        x,
        y,
        d,
        ...rest,
      }),
  );
};

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

const getKtyFromAlg = (alg) => {
  const keyMapper = {
    [dilithium_alg]: dilithium_kty,
  };
  return keyMapper[alg];
};

const generateKeyPair = async (alg = dilithium_alg) => {
  const kty = getKtyFromAlg(alg);
  const rawKeys = await generate({kty, alg});
  return exportKeyPairJwk(rawKeys);
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

const exportKeyPairJwk = async ({publicKey, privateKey}) => {
  const publicKeyJwk = exportPublicKeyJwk({publicKey});
  const privateKeyJwk = exportPrivateKeyJwk({publicKey, privateKey});
  // kid not supported error
  // const kid = await jose.calculateJwkThumbprintUri(publicKeyJwk);
  const kid = '#0';
  return {
    publicKeyJwk: formatJwk({...publicKeyJwk, kid}),
    privateKeyJwk: formatJwk({...privateKeyJwk, kid}),
  };
};

module.exports = {
  dilithium_kty,
  dilithium_alg,
  generateKeyPair,
  getSuite,
  generate,
  importJwk,
  exportPublicKeyJwk,
  exportPrivateKeyJwk,
  exportKeyPairJwk,
};
