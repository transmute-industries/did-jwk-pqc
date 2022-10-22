const lib = require('./index');
const message = 'It’s a dangerous business, Frodo, going out your door. 🧠💎';
lib.JWK.algs.forEach((alg) => {
  describe(alg, () => {
    it('sanity', async () => {
      const {publicKeyJwk, privateKeyJwk} = await lib.JWK.generateKeyPair(alg);
      const jws = await lib.JWS.sign({
        header: {kid: '123'},
        payload: {
          message,
        },
        privateKeyJwk,
      });
      const {protectedHeader, payload} = await lib.JWS.verify({
        jws,
        publicKeyJwk,
      });
      expect(protectedHeader.alg).toBe(publicKeyJwk.alg);
      expect(payload.toString()).toBe(JSON.stringify({message}));
    });
  });
});
