# @transmute/did-jwk-pqc

[![CI](https://github.com/transmute-industries/did-jwk-pqc/actions/workflows/ci.yml/badge.svg)](https://github.com/transmute-industries/did-jwk-pqc/actions/workflows/ci.yml)
![Branches](./badges/coverage-branches.svg)
![Functions](./badges/coverage-functions.svg)
![Lines](./badges/coverage-lines.svg)
![Statements](./badges/coverage-statements.svg)
![Jest coverage](./badges/coverage-jest%20coverage.svg)
[![NPM](https://nodei.co/npm/@transmute/did-jwk-pqc.png?mini=true)](https://npmjs.org/package/@transmute/did-jwk-pqc)

<img src="./transmute-banner.png" />

#### [Questions? Contact Transmute](https://transmute.typeform.com/to/RshfIw?typeform-source=did-eqt)

#### 🚧 Warning Experimental 🔥

## Development

```bash
npm i
npm t

# to test the cli.
npm i -g .
```

### CLI

### Generate Key

Create a private key

```
npm run did-jwk-pqc generate-key CRYDI5 --silent > ./cli-examples/CRYDI5.jwk.json
```

### Create DID

Create a DID.

```
npm run did-jwk-pqc create ./cli-examples/CRYDI5.jwk.json --silent > ./cli-examples/CRYDI5.id.json
```

### Resolve DID

Resolve a DID

```
npm run did-jwk-pqc resolve `cat  ./cli-examples/CRYDI5.id.json | jq '.id'` --silent > ./cli-examples/CRYDI5.resolution.json
```

### Dereference DID

Dereference a DID.

```
npm run did-jwk-pqc dereference `cat  ./cli-examples/CRYDI5.id.json | jq '.id'`#0 --silent > ./cli-examples/CRYDI5.dereference.json
```

### Sign

Sign as a DID

```
npm run did-jwk-pqc sign ./cli-examples/CRYDI5.jwk.json ./cli-examples/message.json --silent > ./cli-examples/CRYDI5.message.signed.json
```

### Verify

Verify with a DID

```
npm run did-jwk-pqc verify ./cli-examples/CRYDI5.message.signed.json --silent > ./cli-examples/CRYDI5.message.verified.json
```

Verify and decode

```
npm run did-jwk-pqc verify ./cli-examples/CRYDI5.message.signed.json  -- --decode
```

<!--








### Encrypt to a DID

Encrypt to a DID

```
npm run did-jwk encrypt `cat  ./src/cli-examples/id.encrypt.json | jq '.id'` ./src/cli-examples/message.json --silent > ./src/cli-examples/message.encrypted.json
```

### Encrypt with a Private Key

Decrypt with a private key

```
npm run did-jwk decrypt ./src/cli-examples/key.privacy.json ./src/cli-examples/message.encrypted.json --silent > ./src/cli-examples/message.decrypted.json
```

Decrypt and decode as text

```
npm run did-jwk decrypt ./src/cli-examples/key.privacy.json ./src/cli-examples/message.encrypted.json -- --decode
```

```bash
npm i @or13/did-jwk --save

# install cli globally
npm i -g @or13/did-jwk
```

## Use

### CLI

### Generate Key

```
did-jwk generate-key EdDSA
```

### Generate For Purpose

```
did-jwk generate-for authenticity
did-jwk generate-for privacy
```

### Sign & Verify

```
did-jwk generate-for authenticity > k0.json
echo '{"message": "hello"}' > m0.json
did-jwk sign ./k0.json ./m0.json > m0.signed.json
did-jwk verify ./m0.signed.json --decode
```

### Encrypt & Decrypt

```
did-jwk generate-for privacy > k1.json
echo '{"message": "hello"}' > m0.json
did-jwk create ./k1.json > recipient_id.json
did-jwk encrypt `cat  ./recipient_id.json | jq '.id'` ./m0.json > m0.encrypted.json
did-jwk decrypt ./k1.json ./m0.encrypted.json  --decode
```

-->
