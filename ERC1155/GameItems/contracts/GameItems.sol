pragma solidity 0.8.6;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract GameItems is ERC1155 {

    uint id;

    address public admin;

    event newItem(uint id,bytes name);

    mapping(uint => Items) public items;

    struct Items {
        uint id;
        bytes name;
    }

    constructor() ERC1155("https://www.ERC1155test.com/") {
        admin = msg.sender;
    }

    function setURI(string memory newuri) external onlyAdmin {
        _setURI(newuri);
    }

    function addNewItem(bytes memory name) external onlyAdmin {
        items[id] = Items(id,name);

        emit newItem(id,name);

        id++;
    }

    function mint(address account, uint256 _id, uint256 amount, bytes memory data)
        public
        onlyAdmin
        itemExist(_id)
    {
        _mint(account, _id, amount, data);
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyAdmin
        itemsExist(ids)
    {
        _mintBatch(to, ids, amounts, data);
    }

    modifier itemsExist(uint256[] memory _ids) {
        for(uint i = 0; i < _ids.length;i++){
            require(items[_ids[i]].id == _ids[i],"item is not exist");
        }
        _;
    }

    modifier itemExist(uint _id) {
        require(items[_id].id == _id,"item is not exist");
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin,"only admin");
        _;
    }

}
