const hre1 = require("hardhat");

async function NFTdeploy() {
    const MarketplaceAddress = "0x59deF92D28eA017423feE5bA9f9977812B879597";

    const NFT = await hre1.ethers.getContractFactory("NFT");
    const nft = await NFT.deploy(MarketplaceAddress);
    await nft.waitForDeployment();

    console.log("NFT contract deployed.");
}

NFTdeploy().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 