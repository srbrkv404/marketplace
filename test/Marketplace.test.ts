import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { ethers } from "hardhat";
import { expect } from "chai";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import "@nomicfoundation/hardhat-chai-matchers";
import { extendEnvironment } from "hardhat/config";

describe("Marketplace", function() {

    const NFTcontract = "0x7236E78Cc1F6B9b0739a7094f133e08c702b6BA3";

    async function deploy() {
        const [acc1, acc2] = await ethers.getSigners();

        const NFT = await ethers.getContractFactory("NFT");
        const nft = await NFT.deploy();
        await nft.waitForDeployment();

        const NFTAddress = await nft.getAddress();

        const Factory = await ethers.getContractFactory("Marketplace");
        const marketplace = await Factory.deploy(NFTAddress);
        await marketplace.waitForDeployment();
        
        const MPAddress = await marketplace.getAddress();

        return { acc1, acc2, marketplace, nft }
    }

    describe("Deployment", function() {
        it("Should be deployed", async function() {
            const { marketplace } = await loadFixture(deploy);
    
            expect(marketplace.target).to.be.properAddress;
        });
    });

    describe("Requirements", function() {
        describe("Simple sale", function() {
            it("Should allow to list item only to owner", async function() {
                const { acc2, marketplace } = await loadFixture(deploy);
        
                await marketplace.createItem();
    
    
                await expect(marketplace.connect(acc2).listItem(1, ethers.parseEther("1")))
                    .to.be.revertedWith("You are not the owner");
            });
    
            it("Should not allow to list sold item", async function() {
                const { acc2, marketplace } = await loadFixture(deploy);
        
                await marketplace.createItem();
                await marketplace.listItem(1, ethers.parseEther("1"));
                await marketplace.connect(acc2).buyItem(1, { value: ethers.parseEther("1")});
    
                await expect(marketplace.listItem(1, ethers.parseEther("1"))).to.be.revertedWith("This item already sold");
            });
    
            it("Should not allow to buy sold item", async function() {
                const { acc2, marketplace } = await loadFixture(deploy);
        
                await marketplace.createItem();
                await marketplace.listItem(1, ethers.parseEther("1"));
                await marketplace.connect(acc2).buyItem(1, { value: ethers.parseEther("1")});
    
                await expect(marketplace.connect(acc2).buyItem(1, { value: ethers.parseEther("1")}))
                    .to.be.revertedWith("This item already sold");
            });
    
            it("Should not allow to buy an item that is not for sale", async function() {
                const { acc2, marketplace } = await loadFixture(deploy);
        
                await marketplace.createItem();
    
                await expect(marketplace.connect(acc2).buyItem(1, { value: ethers.parseEther("1")}))
                    .to.be.revertedWith("This item not for sale");
            });
    
            it("Should revert if there are insufficient funds", async function() {
                const { acc2, marketplace } = await loadFixture(deploy);
        
                await marketplace.createItem();
                await marketplace.listItem(1, ethers.parseEther("2"));
    
                await expect(marketplace.connect(acc2).buyItem(1, { value: ethers.parseEther("1")}))
                    .to.be.revertedWith("Insuficient funds");
            });
    
            it("Should not allow to cancel not for sale item", async function() {
                const { acc2, marketplace } = await loadFixture(deploy);
        
                await marketplace.createItem();
    
                await expect(marketplace.cancel(1)).to.be.revertedWith("This item is not for sale");
            });
            
            it("Should allow to cancel only to owner", async function() {
                const { acc2, marketplace } = await loadFixture(deploy);
        
                await marketplace.createItem();
                await marketplace.listItem(1, ethers.parseEther("2"));
    
                await expect(marketplace.connect(acc2).cancel(1)).to.be.revertedWith("You are not the owner");
            });
        });
        
        describe("Auction", function() {
            it("Should not allow to list on auction item that is for sale", async function() {
                const { acc2, marketplace } = await loadFixture(deploy);
        
                await marketplace.createItem();
                await marketplace.listItem(1, ethers.parseEther("2"));
    
                await expect(marketplace.listItemOnAuction(1, ethers.parseEther("1")))
                    .to.be.revertedWith("This item for sale");
            });

            it("Should allow to list on auction only to owner", async function() {
                const { acc2, marketplace } = await loadFixture(deploy);
        
                await marketplace.createItem();

                await expect(marketplace.connect(acc2).listItemOnAuction(1, ethers.parseEther("1")))
                    .to.be.revertedWith("You are not the owner");
            });

            it("Should not allow to make bid that is lower than highest", async function() {
                const { acc2, marketplace } = await loadFixture(deploy);
        
                await marketplace.createItem();
                await marketplace.listItemOnAuction(1, ethers.parseEther("2"))

                await expect(marketplace.connect(acc2).makeBid(1, { value: ethers.parseEther("1")}))
                    .to.be.revertedWith("Your bid is lower than highest");
            });

            it("Should allow to cancel the auction only to owner", async function() {
                const { acc2, marketplace } = await loadFixture(deploy);
        
                await marketplace.createItem();
                await marketplace.listItemOnAuction(1, ethers.parseEther("2"))

                await expect(marketplace.connect(acc2).cancelAuction(1)).to.be.revertedWith("You are not the owner");
            });

            it("Should allow to finish auction only to owner", async function () {
                const { acc2, marketplace } = await loadFixture(deploy);
        
                await marketplace.createItem();
                await marketplace.listItemOnAuction(1, ethers.parseEther("2"))

                const timestamp = await time.latest();
                const fourDays = 4 * 24 * 60 * 60;

                await time.increaseTo(timestamp + fourDays);

                await expect(marketplace.connect(acc2).finishAuction(1)).to.be.revertedWith("You are not the owner");
            });
        });
    });
});