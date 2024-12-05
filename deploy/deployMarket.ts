const hre = require("hardhat");

async function main_() {

    const Marketplace = await hre.ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy();
    await marketplace.waitForDeployment();

    console.log("Marketplace contract deployed.");
}

main_().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 