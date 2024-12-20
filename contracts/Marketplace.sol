// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "./interfaces/INFT.sol";

contract Marketplace is IERC721Receiver {
    INFT public nftContract;
    uint256 public curItemTokenId;
    uint256 public curAuctionId;
    address public owner;

    struct Item {
        address owner;
        uint96 price;
        bool forSale;
        bool sold;
    }

    struct Auction {
        address owner;
        uint96 tokenId;
        uint96 highestBid;
        address highestBidder;
        uint128 bidsNumber;
        uint128 endTime;
        bool finished;
    }

    mapping (uint256 => Item) items;
    mapping (uint256 => Auction) auctions;

    event Created(address creator, uint256 itemId);
    event Bought(address buyer, uint256 itemId, uint256 price);
    event Finished(address winner, uint256 itemId, uint256 price);

    constructor () {
        owner = msg.sender;
    }

    function setNFTcontractAddress(address address_) external {
        require(owner == msg.sender, "You are not the owner");
        nftContract = INFT(address_);
    }

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override pure returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function createItem() external returns(uint256) {
        curItemTokenId++;

        items[curItemTokenId] = Item({
            owner: msg.sender,
            price: 0,
            forSale: false,
            sold: false
        });
        
        nftContract.mint(address(this), curItemTokenId);

        emit Created(msg.sender, curItemTokenId);

        return curItemTokenId;
    }

    function listItem(uint256 itemId, uint96 price_) external notSold(itemId) {
        require(items[itemId].owner == msg.sender, "You are not the owner");

        items[itemId].price = price_;
        items[itemId].forSale = true;
    }

    function buyItem(uint256 itemId) external payable notSold(itemId) {
        require(items[itemId].forSale == true, "This item not for sale");
        require(msg.value >= items[itemId].price, "Insuficient funds");

        if (msg.value > items[itemId].price) {
            _refund(msg.sender, msg.value - items[itemId].price);
        }

        nftContract._safeTransferFrom(address(this), msg.sender, itemId);

        (bool success2, ) = payable(items[itemId].owner).call{ value: msg.value}("");
        require(success2, "Failed transfer funds to seller");

        items[itemId].sold = true;

        emit Bought(msg.sender, itemId, items[itemId].price);
    }

    function cancel(uint256 itemId) external notSold(itemId) {
        require(items[itemId].forSale == true, "This item is not for sale");
        require(items[itemId].owner == msg.sender, "You are not the owner");

        items[itemId].forSale = false;
    }

    function listItemOnAuction(uint96 itemId, uint96 startPrice) external notSold(itemId) returns(uint256) {
        require(items[itemId].forSale == false, "This item for sale");
        require(items[itemId].owner == msg.sender, "You are not the owner");

        curAuctionId++;
        auctions[curAuctionId] = Auction({
            owner: msg.sender,
            tokenId: itemId,
            highestBid: startPrice,
            highestBidder: msg.sender,
            bidsNumber: 0,
            endTime: uint128(block.timestamp + 3 days),
            finished: false
        });
        return curAuctionId;
    }

    function makeBid(uint256 auctionId) external payable {
        require(auctions[auctionId].finished == false, "This auction is finished");
        require(auctions[auctionId].highestBid < msg.value, "Your bid is lower than highest");

        (bool success, ) = payable(auctions[auctionId].highestBidder).call{ value: auctions[auctionId].highestBid }("");
        require(success, "Failed transfer funds to bidder");

        auctions[auctionId].highestBidder = msg.sender;
        auctions[auctionId].highestBid = uint96(msg.value);
        auctions[auctionId].bidsNumber++;
    }

    function finishAuction(uint256 auctionId) external payable {
        require(auctions[auctionId].endTime < block.timestamp, "You can not finish the auction yet");
        require(auctions[auctionId].owner == msg.sender, "You are not the owner");
        
        if (auctions[auctionId].bidsNumber > 2) {
            address tokenOwner = items[auctions[auctionId].tokenId].owner;
            address winner = auctions[auctionId].highestBidder;

            nftContract._safeTransferFrom(address(this), winner, auctions[auctionId].tokenId);

            (bool success1, ) = payable(tokenOwner).call{ value: auctions[auctionId].highestBid }("");
            require(success1, "Failed transfer funds to owner");

            auctions[auctionId].finished = true;
            emit Finished(winner, auctions[auctionId].tokenId, auctions[auctionId].highestBid);
        } else {
            address lastBidder = auctions[auctionId].highestBidder;
            (bool success2, ) = payable(lastBidder).call{ value: auctions[auctionId].highestBid }("");
            require(success2, "Failed transfer funds to owner");

            auctions[auctionId].finished = true;
            emit Finished(address(0), auctions[auctionId].tokenId, 0);
        }
    }

    function cancelAuction(uint256 auctionId) external {
        require(auctions[auctionId].owner == msg.sender, "You are not the owner");
        require(auctions[auctionId].finished == false, "This auction is finished");

        address lastBidder = auctions[auctionId].highestBidder;
        (bool success, ) = payable(lastBidder).call{ value: auctions[auctionId].highestBid }("");
        require(success, "Failed transfer funds to owner");

        auctions[auctionId].finished = true;
        emit Finished(address(0), auctions[auctionId].tokenId, 0);
    }

    function _refund(address to, uint256 value_) internal {
        (bool success, ) = payable(to).call{ value: value_ }("");
        require(success, "Failed transfer funds to owner");
    }

    modifier notSold(uint256 itemId) {
        require(items[itemId].sold == false, "This item already sold");
        _;
    }
}