import { useState, useEffect} from 'react'



import lib from '@transmute/did-jwk-pqc'


const message = '🙋‍♀️ hello world'

function App() {
  const [state, setState] = useState({})
  useEffect(()=>{
 
    (async ()=>{
      const {privateKeyJwk} = await lib.JWK.generateKeyPair('CRYDI5');
      const did  = lib.DID.toDid(privateKeyJwk)
      const jws = await lib.DID.signAsDid({message}, privateKeyJwk)
      const {protectedHeader} = await lib.DID.verifyFromDid(jws)
      setState({ message, did, jws, protectedHeader })

    })()
  },[])
  return (
    <pre>{JSON.stringify(state, null, 2)}</pre>
  );
}

export default App;
