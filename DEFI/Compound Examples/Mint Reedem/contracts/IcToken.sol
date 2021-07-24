pragma solidity 0.8.0;

interface IcToken {
    function mint(uint mintAmount)external returns (uint);
    function balanceOf(address owner) external view returns (uint256 balance);
    function mint() external payable;
    function redeem(uint redeemTokens) external returns (uint);
}
