import { ethers } from "hardhat";
import { readFileSync } from "fs"

async function main() {
  const name = "BadgeTokenERC2771"
  const file = readFileSync('deploy_result.json')
  const address = JSON.parse(file.toString())[name];
  if (!address) throw new Error(`Contract ${name} not found in deploy.json`);

  const token = await ethers.getContractAt(name,address)

  const filterTransferMint = token.filters.Transfer(ethers.constants.AddressZero);
  const events = await token.queryFilter(filterTransferMint);
  console.log('MintTo : transfer from address(0)')
  console.log('=============')
  console.log(events.map(e => `[${e.blockNumber}] ${e.args.to} => ${e.args.tokenId}`).join('\n'));
  console.log();
}

if (require.main === module) {
  main().then(() => process.exit(0))
    .catch(error => { console.error(error); process.exit(1); });
}