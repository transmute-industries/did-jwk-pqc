const jose = require('jose');
const demojid = require('@or13/demojid');
const JWK = require('../JWK');
const JWS = require('../JWS');

const methodPrefix = 'did:jwk';

const signatureAlgorithms = [JWK.dilithium_alg];
const encryptionAlgorithms = [];

// const algorithms = [...signatureAlgorithms, ...encryptionAlgorithms];

const toDid = (jwk) => {
  // eslint-disable-next-line no-unused-vars
  const {d, p, q, dp, dq, qi, ...publicKeyJwk} = jwk;
  const id = jose.base64url.encode(JSON.stringify(publicKeyJwk));
  const did = `${methodPrefix}:${id}`;
  return did;
};

const resolve = (did) => {
  const methodSpecificId = did.split(':').pop().split('#')[0];
  const decoded = jose.base64url.decode(methodSpecificId);
  const message = new TextDecoder().decode(decoded);
  const jwk = JSON.parse(message);
  return toDidDocument(jwk);
};

const dereference = (didUrl) => {
  const [did, fragment] = didUrl.split('#');
  const didDocument = resolve(did);
  const [vm] = didDocument.verificationMethod;
  if (vm.id === `#${fragment}`) {
    return vm;
  }
  return null;
};

const signatureVerificationRelationships = [
  'authentication',
  'assertionMethod',
  'capabilityInvocation',
  'capabilityDelegation',
];
const encryptionVerificationRelationships = ['keyAgreement'];

const getPublicOperationsFromPrivate = (key_ops) => {
  if (key_ops.includes('sign')) {
    return ['verify'];
  }
  if (key_ops.includes('verify')) {
    return ['encrypt'];
  }
  return key_ops;
};

const toDidDocument = (jwk) => {
  const {
    // eslint-disable-next-line no-unused-vars
    d,
    p,
    q,
    dp,
    dq,
    qi,

    key_ops,

    ...publicKeyJwk
  } = jwk;

  if (d && key_ops) {
    publicKeyJwk.key_ops = getPublicOperationsFromPrivate(key_ops);
  }
  const did = toDid(publicKeyJwk);
  const vm = {
    id: '#0',
    type: 'JsonWebKey2020',
    controller: did,
    publicKeyJwk,
  };
  const didDocument = {
    '@context': [
      'https://www.w3.org/ns/did/v1',
      {'@vocab': 'https://www.iana.org/assignments/jose#'},
    ],
    'id': did,
    'verificationMethod': [vm],
  };
  if (signatureAlgorithms.includes(publicKeyJwk.alg)) {
    signatureVerificationRelationships.forEach((vr) => {
      didDocument[vr] = [vm.id];
    });
  }

  if (encryptionAlgorithms.includes(publicKeyJwk.alg)) {
    encryptionVerificationRelationships.forEach((vr) => {
      didDocument[vr] = [vm.id];
    });
  }

  return didDocument;
};

const signAsDid = (payload, privateKeyJwk, header = {}) => {
  const did = toDid(privateKeyJwk);
  return JWS.sign({
    header: {iss: did, kid: '#0', ...header},
    payload,
    privateKeyJwk,
  });
};

const verifyFromDid = async (jws) => {
  const {iss, kid} = jose.decodeProtectedHeader(jws);
  const {publicKeyJwk} = dereference(iss + kid);
  const {payload, protectedHeader} = await JWS.verify({jws, publicKeyJwk});
  return {payload, protectedHeader};
};

const operations = {
  create: (jwk) => {
    return toDid(jwk);
  },
  resolve,
  dereference,
};

const getEmojid = async (jwk) => {
  // because non of the PQC alg's are accepted yet....
  const hackedPublicKeyJwk = {
    ...jwk,
    crv: 'Ed25519',
    kty: 'OKP',
  };
  const kid = await jose.calculateJwkThumbprintUri(hackedPublicKeyJwk);
  const encoded = demojid.encode(kid, {
    contentType: 'application/did+json',
  });
  return encoded.split(':').pop().substring(0, 6);
};

module.exports = {
  operations,
  getEmojid,
  toDid,
  signAsDid,
  signAsDid,
  verifyFromDid,
};
