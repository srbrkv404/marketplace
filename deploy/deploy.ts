const hre = require("hardhat");

async function main_() {
    const NFTcontract = "0x5467e3895Ab358C254129d91812Bb6E0E7a6BFF8";

    const Marketplace = await hre.ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(NFTcontract);
    await marketplace.waitForDeployment();

    console.log("Marketplace contract:", marketplace.address);
}

main_().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});