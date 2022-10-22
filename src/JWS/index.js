const jose = require('jose');

const jwk = require('../JWK');

const signRaw = async (msg, privateKey, kty, alg) => {
  const suite = jwk.getSuite({kty, alg});
  const signature = await suite.sign(msg, privateKey);
  return signature;
};

const verifyRaw = async (sig, publicKey, kty, alg) => {
  const suite = jwk.getSuite({kty, alg});
  const verification = await suite.open(sig, publicKey);
  return verification;
};

const sign = async ({header, payload, privateKeyJwk}) => {
  const privateKey = jwk.importJwk(privateKeyJwk);
  const tbs1 = typeof payload === 'string' ? payload : JSON.stringify(payload);
  const tbs = `${jose.base64url.encode(
      JSON.stringify({alg: privateKeyJwk.alg, ...header}),
  )}.${jose.base64url.encode(tbs1)}`;
  const msg = new TextEncoder().encode(tbs);
  const {kty, alg} = privateKeyJwk;
  const sig = await signRaw(msg, privateKey, kty, alg);
  return `${tbs}.${jose.base64url.encode(sig)}`;
};

const verify = async ({jws, publicKeyJwk}) => {
  const publicKey = jwk.importJwk(publicKeyJwk);
  const [_1, _2, encodedSignature] = jws.split('.');
  const sig = jose.base64url.decode(encodedSignature);
  const {kty, alg} = publicKeyJwk;
  const verification = await verifyRaw(sig, publicKey, kty, alg);
  const decoded = new TextDecoder().decode(verification);
  const [encodedHeader, encodedPayload] = decoded.split('.');
  const decodedHeader = jose.base64url.decode(encodedHeader);
  return {
    protectedHeader: JSON.parse(new TextDecoder().decode(decodedHeader)),
    payload: jose.base64url.decode(encodedPayload),
  };
};

module.exports = {sign, verify, signRaw, verifyRaw};
