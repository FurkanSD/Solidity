pragma solidity 0.8.0;

interface IcToken {
    function mint(uint mintAmount)external returns (uint);
    function borrow(uint borrowAmount) external returns (uint);
    function repayBorrow(uint repayAmount) external returns (uint);

}
