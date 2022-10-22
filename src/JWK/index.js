const jose = require('jose');

const base64url = require('base64url');
const dilithium = require('dilithium-crystals');
const falcon = require('falcon-crypto');
const sphincs = require('sphincs');

const dilithium_kty = 'LWE';
const dilithium_alg = 'CRYDI5';

const falcon_kty = 'NTRU';
const falcon_alg = 'FALCON512';

const sphincs_kty = `HASH`;
const sphincs_alg = `SPHINCS+-SHAKE-256s-robust`;

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
    [`${falcon_kty} ${falcon_alg}`]: falcon,
    [`${sphincs_kty} ${sphincs_alg}`]: sphincs,
  };
  const suite = keyMapper[`${kty} ${alg}`];

  return suite;
};

const generate = async ({kty, alg}) => {
  const suite = getSuite({kty, alg});
  const {publicKey, privateKey} = await suite.keyPair();
  return {publicKey, privateKey};
};

const getKtyFromAlg = (alg) => {
  const keyMapper = {
    [dilithium_alg]: dilithium_kty,
    [falcon_alg]: falcon_kty,
    [sphincs_alg]: sphincs_kty,
  };
  return keyMapper[alg];
};

const generateKeyPair = async (alg = dilithium_alg) => {
  const kty = getKtyFromAlg(alg);
  const {publicKey, privateKey} = await generate({kty, alg});
  return exportKeyPairJwk({publicKey, privateKey, alg});
};

const importJwk = (jwk) => {
  if (jwk.d) {
    return Uint8Array.from(Buffer.from(jwk.d, 'base64'));
  } else {
    return Uint8Array.from(Buffer.from(jwk.x, 'base64'));
  }
};

const exportPublicKeyJwk = ({publicKey, alg}) => {
  const kty = getKtyFromAlg(alg);
  const publicKeyJwk = {
    kty,
    alg,
    x: base64url.encode(publicKey),
  };
  return publicKeyJwk;
};

const exportPrivateKeyJwk = ({publicKey, privateKey, alg}) => {
  const publicKeyJwk = exportPublicKeyJwk({publicKey, alg});
  const privateKeyJwk = {
    ...publicKeyJwk,
    d: base64url.encode(privateKey),
  };
  return privateKeyJwk;
};

const exportKeyPairJwk = async ({publicKey, privateKey, alg}) => {
  const publicKeyJwk = exportPublicKeyJwk({publicKey, alg});
  const privateKeyJwk = exportPrivateKeyJwk({publicKey, privateKey, alg});
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
