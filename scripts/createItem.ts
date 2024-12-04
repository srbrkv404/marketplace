import { ethers } from 'hardhat';
import { config } from 'dotenv';
const getContract_market = require('./getContract.ts');

config();

async function createItem() {
    const contract = await getContract_market();

    try {
        const [acc1] = await ethers.getSigners();

        console.log(`Creating item 1...`);

        const tx = await contract.createItem();

        await tx.wait();
        console.log(`Transaction finished: ${tx.hash}`);
    } catch (error) {
        console.error(`Error sending transaction: ${error}`);
    }

}

createItem()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 