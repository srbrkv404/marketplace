import { ethers } from 'hardhat';
import { config } from 'dotenv';
const getContract_market = require('./getContract.ts');

config();

async function makeBid() {
    const contract = await getContract_market();

    try {
        const [acc1, acc2] = await ethers.getSigners();

        console.log(`${acc2.address} making bid for item 2 on auction...`);

        const tx = await contract.connect(acc2).makeBid(2, { value: ethers.parseEther("0.006")});

        await tx.wait();
        console.log(`Transaction finished: ${tx.hash}`);
    } catch (error) {
        console.error(`Error sending transaction: ${error}`);
    }

}

makeBid()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 