import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: "0.8.27",
  networks: {
    sepolia : {
      url: process.env.INFURA_URL,
      accounts: [
        process.env.PRIVATE_KEY_1 ? process.env.PRIVATE_KEY_1 : "",
        process.env.PRIVATE_KEY_2 ? process.env.PRIVATE_KEY_2 : ""
      ].filter(Boolean)
    }
   }
};

export default config;