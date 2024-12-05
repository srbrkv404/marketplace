// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./INFT.sol";

contract NFT is ERC721, INFT, AccessControl {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(address marketplace) ERC721("Marketplace_nft", "MPT") {
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, marketplace);
    }

    function mint(address to, uint256 tokenId) external onlyRole(MINTER_ROLE) {
        _safeMint(to, tokenId);
    }

    function _safeTransferFrom(address from, address to, uint256 tokenId) override public {
        super.safeTransferFrom(from, to, tokenId, "");
    }

    function _baseURI() override internal pure returns (string memory) {
        return "https://gateway.pinata.cloud/ipfs/QmTMo6DFrfzKGGbkYsyMZRe16jBJcCcV72ZJHcM3a3Z2w7/";
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}