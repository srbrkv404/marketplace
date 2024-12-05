import { ethers } from 'hardhat';
const hre = require("hardhat");

async function getContract() {
    const address = "0x59deF92D28eA017423feE5bA9f9977812B879597";
    return await ethers.getContractAt("Marketplace", address);
}

module.exports = getContract;