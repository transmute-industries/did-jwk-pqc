const base64url = require('base64url');

const dilithium = require('dilithium-crystals');

const jwk = require('../JWK');

const signRaw = async (msg, privateKey) => {
  const signature = await dilithium.sign(msg, privateKey);
  return signature;
};

const verifyRaw = async (sig, publicKey) => {
  const verification = await dilithium.open(sig, publicKey);
  return verification;
};

const sign = async ({header, payload, privateKeyJwk}) => {
  const privateKey = jwk.importJwk(privateKeyJwk);
  const tbs1 = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const tbs = `${base64url.encode(
      JSON.stringify({alg: privateKeyJwk.alg, ...header}),
  )}.${base64url.encode(tbs1)}`;
  const msg = new TextEncoder().encode(tbs);
  const sig = await signRaw(msg, privateKey);
  return `${tbs}.${base64url.encode(Buffer.from(sig))}`;
};

const verify = async ({jws, publicKeyJwk}) => {
  const publicKey = jwk.importJwk(publicKeyJwk);
  const [_1, _2, encodedSignature] = jws.split('.');
  const sig = Buffer.from(encodedSignature, 'base64');
  const verification = await verifyRaw(sig, publicKey);
  const decoded = new TextDecoder().decode(verification);
  const [encodedHeader, encodedPayload] = decoded.split('.');
  return {
    protectedHeader: JSON.parse(base64url.decode(encodedHeader)),
    payload: Buffer.from(base64url.decode(encodedPayload)),
  };
};

module.exports = {sign, verify, signRaw, verifyRaw};
