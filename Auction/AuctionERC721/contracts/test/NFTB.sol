//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NftB is ERC721,ERC721URIStorage {
    uint public id;

    constructor() ERC721("NftB Token","NFT"){}

    function safeMint(address to) public  {
        _safeMint(to, id);
        id++;
    }
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://www.auctionExample.com/token"; //saves gas
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
}
