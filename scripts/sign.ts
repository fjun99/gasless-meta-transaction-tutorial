import { ethers } from "hardhat";
import { readFileSync, writeFileSync } from "fs"

const { signMetaTxRequest } = require('../src/signRequest');

// const DEFAULT_NAME = 'sign-test';

function getInstance(name:string) {
  const file = readFileSync('deploy_result.json')
  const address = JSON.parse(file.toString())[name];
  if (!address) throw new Error(`Contract ${name} not found in deploy.json`);
  return ethers.getContractFactory(name).then(f => f.attach(address));
}

async function main() {
  const forwarder = await getInstance('MinimalForwarder');
  const token = await getInstance("BadgeTokenERC2771");

  const privateKey = process.env.PRIVATE_KEY_66
  if (privateKey == undefined  ) return

  const { ID: tokenId } = process.env;
  if ( tokenId == undefined ){
    console.log(`please input ID like "ID=123 yarn sign"`)
    return
  } 

  const wallet = new ethers.Wallet(privateKey)
  const from = wallet.address;

  console.log(`mintTo with tokenID ${tokenId} as ${from}...`);

  const data = token.interface.encodeFunctionData('mintTo', [tokenId]);
  const result = await signMetaTxRequest(wallet, forwarder, {
    to: token.address, from, data
  });

  writeFileSync('tmp/request.json', JSON.stringify(result, null, 2));
  console.log(`Signature: `, result.signature);
  console.log(`Request: `, result.request);
}

if (require.main === module) {
  main().then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}