import { ethers } from 'hardhat';
const hre = require("hardhat");

async function getContract() {
    const address = "0x8727ca783fb525b318a49D92A447bBc7bc417eB4";
    return await ethers.getContractAt("Marketplace", address);
}

module.exports = getContract;