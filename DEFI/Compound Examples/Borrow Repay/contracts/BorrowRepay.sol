pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IcToken.sol";

contract BorrowRepay {
    IERC20 ierc20;
    IcToken cTOken;

    constructor(address _ierc,IcToken _cToken) {
        ierc20 = IERC20(_ierc);
        cTOken = IcToken(_cToken);
    }

    function mint(uint mintAmount)external returns (uint) { // you must be depositor to borrow asset
        ierc20.approve(address(cTOken), mintAmount);
        return cTOken.mint(mintAmount);
    }

    function borrow(uint borrowAmount) external returns (uint) { // you cannot borrow more than your deposited asset
        return cTOken.borrow(borrowAmount);
    }

    function repayBorrow(uint repayAmount) external returns (uint) {
        ierc20.approve(address(cTOken), type(uint).max); // use type(uint).max to pay off all debt
        return cTOken.repayBorrow(repayAmount); 
    }

}
