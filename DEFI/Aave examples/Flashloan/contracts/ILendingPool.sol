pragma solidity 0.8.0;


interface ILendingPool {
    function flashLoan(address receiverAddress, 
    address[] calldata assets, 
    uint256[] calldata amounts, 
    uint256[] calldata modes, 
    address onBehalfOf, 
    bytes calldata params, 
    uint16 referralCode) external;
}

interface IERC20 {
    function approve(address spender, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}
