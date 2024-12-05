import { ethers } from 'hardhat';
import { config } from 'dotenv';
const getContract_market = require('./getContract.ts');

config();

async function setNFTAddress() {
    const contract = await getContract_market();
    const NFTaddress = "0xb4c6a987e37611c9066d536875276871e8cbbf36";

    try {
        const [acc1] = await ethers.getSigners();

        console.log(`Setting nft contract address...`);

        const tx = await contract.setNFTcontractAddress(NFTaddress);

        await tx.wait();
        console.log(`Transaction finished: ${tx.hash}`);
    } catch (error) {
        console.error(`Error sending transaction: ${error}`);
    }

}

setNFTAddress()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 