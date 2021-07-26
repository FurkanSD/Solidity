pragma solidity 0.8.0;
// this token has received function propertie 
// like ether transfer if you use tokenReceive function in your 
// smart contract you can be able to see token sender
// and the amount of the token
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

interface IReceive {
    function tokenReceive(  //receive function interface
        address from,
        uint256 amount) external;
}

contract ReceiveToken is ERC20 {
    address admin;

    constructor() ERC20("Receive Token","RCT"){
        admin = msg.sender;
    }

    function mint(address to,uint amount) external onlyAdmin {
        _mint(to, amount);
    }

    // overrides _beforeTokenTransfer and checks the "to" address is contract or user
    // if it is contract calls tokenReceive function
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        uint size;

        assembly {
            size := extcodesize(to)
        }
        
        if(size>0){
            
             to.call(abi.encodeWithSignature("tokenReceive(address,uint256)",from,amount));
        }
        
    }

    modifier onlyAdmin(){
        require(msg.sender==admin,"only admin");
        _;
    }
}
