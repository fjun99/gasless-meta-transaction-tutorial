import { ethers } from "hardhat";
import {writeFileSync } from "fs"

async function deploy(name:string, ...params:any) {
  const Contract = await ethers.getContractFactory(name);
  return await Contract.deploy(...params).then(contract => contract.deployed());
}

async function main() {

  const forwarder = await deploy('MinimalForwarder');
  const token = await deploy("BadgeTokenERC2771", forwarder.address);

  writeFileSync('deploy_result.json', JSON.stringify({
    MinimalForwarder: forwarder.address,
    BadgeTokenERC2771: token.address,
  }, null, 2));

  console.log(`MinimalForwarder: ${forwarder.address}\nBadgeTokenERC2771: ${token.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
