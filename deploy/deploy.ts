const hre = require("hardhat");

async function main_() {

    const NFT = await hre.ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();
    await nft.deployed();

    console.log("NFT contract:", nft.address);

    const Marketplace = await hre.ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy();
    await marketplace.deployed();

    console.log("NFT contract:", marketplace.address);
}

main_().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 