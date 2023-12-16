import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-gas-reporter";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.23",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  gasReporter: {
    currency: "USD",
    token: "MATIC",
    enabled: true,
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.POLYGONSCAN_API_KEY!,
    },
  },
  networks: {
    hardhat: {},
    Mumbai: {
      url: "https://rpc.ankr.com/polygon_mumbai",
      accounts: [process.env.PRIVATE_KEY_DEPLOYER!],
    },
    Polygon: {
      url: "https://rpc.ankr.com/polygon",
      accounts: [process.env.PRIVATE_KEY_DEPLOYER!],
      gasPrice: 100000000000,
    },
  },
};

export default config;
