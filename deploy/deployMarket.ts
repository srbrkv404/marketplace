const hre = require("hardhat");

async function main_() {
    const NFTaddress = "0x09D61F139b58C561632dFC7fc98e5a0c843C2466";

    const Marketplace = await hre.ethers.getContractFactory("Marketplace");
    const marketplace = await Marketplace.deploy(NFTaddress);
    const MPaddress = marketplace.address;
    await marketplace.waitForDeployment();

    console.log("Marketplace contract deployed");
}

main_().catch((error) => {
    console.error(error);
    process.exitCode = 1;
}); 