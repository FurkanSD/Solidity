pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ILendingPool.sol";

contract DepositBorrow {
    ILendingPool lending;
    IERC20 token;

    constructor(ILendingPool _poolAddr,IERC20 _tokenAddr){
        lending = ILendingPool(_poolAddr);
        token = IERC20(_tokenAddr);
    }

    function deposit(address asset, uint256 amount) external {

        token.approve(address(lending), amount); //approve token transfer before deposit function

        lending.deposit(asset, amount, address(this),0);
    }

    function withdraw(address asset) external {
        lending.withdraw(asset,type(uint256).max, address(this)); // use type(uint256).max if you want to withdraw entire balance
    }

}
