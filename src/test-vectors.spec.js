const fs = require('fs');
const path = require('path');

const lib = require('./index');
const message = 'It’s a dangerous business, Frodo, going out your door. 🧠💎';

const fixture = {};

lib.JWK.algs.forEach((alg) => {
  describe(alg, () => {
    it('sanity', async () => {
      const {privateKeyJwk, publicKeyJwk} = await lib.JWK.generateKeyPair(alg);
      const jws = await lib.DID.signAsDid(
          {
            message,
          },
          privateKeyJwk,
      );
      const did = lib.DID.toDid(privateKeyJwk);
      const {protectedHeader} = await lib.DID.verifyFromDid(jws);
      expect(protectedHeader.alg).toBe(publicKeyJwk.alg);

      fixture[alg] = {
        privateKeyJwk,
        did,
        jws,
      };
    });
  });
});

it('can write fixtures to source', () => {
  fs.writeFileSync(
      path.resolve(__dirname, './test-vectors.json'),
      JSON.stringify(fixture, null, 2),
  );
});
