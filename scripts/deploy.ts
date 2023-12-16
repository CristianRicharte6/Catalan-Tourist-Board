import { ethers } from "hardhat";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const tokenName = "ACT Coin";
  const tokenSymbol = "ACT";

  const rewardToken = await ethers.deployContract("RewardToken", [
    tokenName,
    tokenSymbol,
  ]);

  await rewardToken.waitForDeployment();

  console.log(
    `RewardToken has been deployed to ${rewardToken.target} under the name "${tokenName}" & symbol "${tokenSymbol}"`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
