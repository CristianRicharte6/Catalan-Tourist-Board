import { ethers } from "hardhat";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const rewardToken = await ethers.deployContract("RewardToken", [
    "RewardToken",
    "RT",
  ]);

  await rewardToken.waitForDeployment();

  console.log(`RewardToken has been deployed to ${rewardToken.target}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
