pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20("Test","TST") {
    
     // for testing, do not use this function in normal contract  
    function approve(address spender,uint amount) public override returns(bool) {
        _mint(msg.sender,amount);
        super.approve(spender,amount);
    }
}
