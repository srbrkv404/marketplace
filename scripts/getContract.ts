import { ethers } from 'hardhat';
const hre = require("hardhat");

async function getContract() {
    const address = "0x9990199F2203a8d305294DC2C66E99048545B95a";
    return await ethers.getContractAt("Marketplace", address);
}

module.exports = getContract;