const hre1 = require("hardhat");

async function NFTdeploy() {

    const NFT = await hre1.ethers.getContractFactory("NFT");
    const nft = await NFT.deploy();
    await nft.waitForDeployment();

    console.log("NFT contract deployed.");
}

NFTdeploy().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 