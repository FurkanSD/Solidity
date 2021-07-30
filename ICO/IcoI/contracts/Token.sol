pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20("Token","TKN") {
    
    // for testing, do not use this function in normal contract 
    function approve(address spender, uint256 amount) public override returns (bool) {
        _mint(msg.sender, amount);
         return super.approve(spender,amount);
    }
    
}
