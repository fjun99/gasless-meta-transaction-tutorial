import { ethers } from "hardhat";

async function main() {

  const BadgeToken = await ethers.getContractFactory("BadgeToken");
  const token = await BadgeToken.deploy();

  await token.deployed();

  console.log("BadgeToken deployed to:", token.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
