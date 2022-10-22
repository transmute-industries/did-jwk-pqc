const jose = require('jose');

const methodPrefix = 'did:jwk';

const toDid = (jwk) => {
  // eslint-disable-next-line no-unused-vars
  const {d, p, q, dp, dq, qi, ...publicKeyJwk} = jwk;
  const id = jose.base64url.encode(JSON.stringify(publicKeyJwk));
  const did = `${methodPrefix}:${id}`;
  return did;
};

module.exports = {toDid};
