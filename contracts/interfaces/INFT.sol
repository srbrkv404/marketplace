// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

interface INFT {
    function mint(address to, uint256 tokenId) external;
    function _safeTransferFrom(address from, address to, uint256 tokenId) external;
}