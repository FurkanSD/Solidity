pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ILendingPool.sol";

contract BorrowRepay {
    ILendingPool lending;

    constructor(ILendingPool _poolAddr){
        lending = ILendingPool(_poolAddr);
    }

    function deposit(address asset, uint256 amount) external { 

        IERC20(asset).approve(address(lending), amount);

        lending.deposit(asset, amount, address(this),0);
    }

    function borrow( //you must be depositor to use borrow function 
     address asset, 
     uint256 amount, // amount cannot be much than deposited amount
     uint256 interestRateMode, 
     uint16 referralCode) external {

        IERC20(asset).approve(address(lending), type(uint).max);

        lending.borrow(asset, 
        amount, 
        interestRateMode, 
        referralCode, 
        address(this));
    }

    function repay(
     address asset, 
     uint256 amount, 
     uint256 rateMode) external {
        lending.repay(asset, amount, rateMode, address(this));
    }

}
