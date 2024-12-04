// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NFT is ERC721{

    constructor() ERC721("Marketplace_nft", "MPT") {}

    function mint(address to, uint256 tokenId) external {
        _safeMint(to, tokenId);
    }

    function _baseURI() override internal pure returns (string memory) {
        return "https://gateway.pinata.cloud/ipfs/QmTMo6DFrfzKGGbkYsyMZRe16jBJcCcV72ZJHcM3a3Z2w7/";
    }
}