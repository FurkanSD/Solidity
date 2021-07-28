pragma solidity 0.8.0;

import "./ILendingPool.sol";

contract Flashloan {
    ILendingPool lendingPool;
    uint public fee;

    constructor(address _Addr){
        lendingPool = ILendingPool(_Addr);
    }

    
    function flashLoan(
        address[] calldata assets,
        uint256[] calldata amounts) external {

            uint[] memory modes = new uint[](1);
            modes[0] = 0;

            lendingPool.flashLoan(
            address(this), 
            assets, 
            amounts, 
            modes,
            address(this), 
            bytes(""), 
            0);
        }

    function executeOperation(
    address[] calldata assets,
    uint[] calldata amounts,
    uint[] calldata premiums,
    address initiator,
    bytes calldata params
  ) external returns (bool) {
    //do whatever you want with your flashloan tokens

    for (uint i = 0; i < assets.length; i++) {
      fee = premiums[i];
      uint amountOwing = amounts[i]+(premiums[i]);
      IERC20(assets[i]).approve(address(lendingPool), amountOwing);
    }
    
    return true;
  }
    
}
