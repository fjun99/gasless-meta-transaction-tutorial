import { ethers } from "hardhat";
import {readFileSync } from "fs"

function getInstance(name:string) {
  const file =readFileSync('deploy_result.json')
  const address = JSON.parse(file.toString())[name];
  if (!address) throw new Error(`Contract ${name} not found in deploy.json`);
  return ethers.getContractFactory(name).then(f => f.attach(address));
}

async function main() {
  const forwarder = await getInstance('MinimalForwarder');
  console.log(`Testing request tmp/request.json on forwarder at ${forwarder.address}...`);
  const file = readFileSync('tmp/request.json')
  const { request, signature } = JSON.parse(file.toString());

  try {
    const valid = await forwarder.verify(request, signature);
    console.log(`Signature ${signature} for request is${!valid ? ' not ' : ' '}valid`);
  } catch (err:any) {
    console.log(`Could not validate signature for request: ${err.message}`);
  }
}

if (require.main === module) {
  main().then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}