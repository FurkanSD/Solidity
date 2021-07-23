pragma solidity 0.8.0;

interface IUniswapV2Router {
  function swapExactTokensForTokens(
     uint amountIn,
     uint amountOutMin,
     address[] calldata path,
     address to,
     uint deadline)
  external returns (uint[] memory amounts);

function swapExactETHForTokens(
    uint amountOutMin,
     address[] calldata path,
     address to,
     uint deadline)
  external
  payable
  returns (uint[] memory amounts);

  function swapExactTokensForETH(
      uint amountIn,
      uint amountOutMin,
      address[] calldata path,
      address to,
      uint deadline)
  external
  returns (uint[] memory amounts);

}

interface IERC20 {    
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
}
