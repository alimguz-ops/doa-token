// SPDX-License-Identifier: MIT
pragma solidity 0.8.29;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFT_DOA is ERC721URIStorage, Ownable {
    uint256 private _tokenIds;

    event NFTMinted(address indexed recipient, uint256 indexed tokenId, string tokenURI);

    constructor() ERC721("DOA NFT Collection", "DOA") Ownable(msg.sender) {}

    function mintNFT(address recipient, string memory tokenURI)
        public
        onlyOwner
        returns (uint256)
    {
        _tokenIds++;
        uint256 newItemId = _tokenIds;
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        emit NFTMinted(recipient, newItemId, tokenURI);
        return newItemId;
    }

    function burn(uint256 tokenId) public onlyOwner {
        _burn(tokenId);
    }
}