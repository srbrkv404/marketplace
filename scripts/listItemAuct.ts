import { ethers } from 'hardhat';
import { config } from 'dotenv';
const getContract_market = require('./getContract.ts');

config();

async function listItemAuct() {
    const contract = await getContract_market();

    try {
        const [acc1] = await ethers.getSigners();

        console.log(`${acc1.address} listing item 2 on auction...`);

        const tx = await contract.listItemOnAuction(2, ethers.parseEther("0.005"));

        await tx.wait();
        console.log(`Transaction finished: ${tx.hash}`);
    } catch (error) {
        console.error(`Error sending transaction: ${error}`);
    }

}

listItemAuct()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 