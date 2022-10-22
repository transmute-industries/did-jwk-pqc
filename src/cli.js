#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const yargs = require('yargs');
const {hideBin} = require('yargs/helpers');
const {DID, JWK} = require('./index.js');

const readJsonFromPath = (argv, argName) => {
  let value;
  if (argv[argName]) {
    try {
      const file = fs
          .readFileSync(path.resolve(process.cwd(), argv[argName]))
          .toString();
      value = JSON.parse(file);
    } catch (e) {
      console.error('Cannot read from file: ' + argv[argName]);
      process.exit(1);
    }
  }
  return value;
};

yargs(hideBin(process.argv))
    .scriptName('did-jwk-pqc')
    .command(
        'generate-key <alg>',
        'generate a key pair',
        () => {},
        async (argv) => {
          const {alg} = argv;
          const key = await JWK.generateKeyPair(alg);
          console.log(JSON.stringify(key.privateKeyJwk, null, 2));
        },
    )
    .command(
        'create <jwk>',
        'create a decentralized identifier',
        () => {},
        async (argv) => {
          let jwk;
          if (argv.jwk) {
            try {
              const file = fs
                  .readFileSync(path.resolve(process.cwd(), argv.jwk))
                  .toString();

              jwk = JSON.parse(file);
            } catch (e) {
              console.error('Cannot base jwk from: ' + argv.jwk);
              process.exit(1);
            }
          }
          const id = DID.toDid(jwk);
          console.log(JSON.stringify({id}, null, 2));
        },
    )
    .command(
        'resolve <did>',
        'resolve a decentralized identifier',
        () => {},
        async (argv) => {
          const {did} = argv;
          const resolution = await DID.operations.resolve(did);
          console.log(JSON.stringify(resolution, null, 2));
        },
    )
    .command(
        'dereference <didUrl>',
        'dereference a decentralized identifier url',
        () => {},
        async (argv) => {
          const {didUrl} = argv;
          const resolution = await DID.operations.dereference(didUrl);
          console.log(JSON.stringify(resolution, null, 2));
        },
    )
    .command(
        'sign <jwk> <msg>',
        'sign a message as a decentralized identifier',
        () => {},
        async (argv) => {
          const jwk = readJsonFromPath(argv, 'jwk');
          const msg = readJsonFromPath(argv, 'msg');

          const jws = await DID.signAsDid(msg, jwk);
          console.log(JSON.stringify({jws}, null, 2));
        },
    )
    .command(
        'verify <msg>',
        'verify a message signed by a decentralized identifier',
        () => {},
        async (argv) => {
          const {jws} = readJsonFromPath(argv, 'msg');
          const verified = await DID.verifyFromDid(jws);
          if (argv.decode) {
            console.log(new TextDecoder().decode(verified.payload));
          } else {
            console.log(JSON.stringify({verified}, null, 2));
          }
        },
    )
    .demandCommand(1)
    .parse();
