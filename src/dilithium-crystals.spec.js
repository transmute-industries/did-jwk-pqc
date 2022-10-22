const jwk = require('./JWK');
const jws = require('./JWS');
const message = `It’s a dangerous business, Frodo, going out your door.`;

it('dilithium-crystals', async () => {
  const {publicKey, privateKey} = await jwk.generate({
    kty: jwk.dilithium_kty,
    alg: jwk.dilithium_alg,
  });
  const {publicKeyJwk, privateKeyJwk} = await jwk.exportKeyPairJwk({
    publicKey,
    privateKey,
  });
  const jws1 = await jws.sign({
    header: {kid: '123'},
    payload: {
      message,
    },
    privateKeyJwk,
  });
  const {protectedHeader, payload} = await jws.verify({
    jws: jws1,
    publicKeyJwk,
  });
  expect(protectedHeader.alg).toBe(publicKeyJwk.alg);
  expect(payload.toString()).toBe(JSON.stringify({message}));
});
