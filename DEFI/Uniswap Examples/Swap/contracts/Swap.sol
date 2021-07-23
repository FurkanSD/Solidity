pragma solidity 0.8.0;

import "./Interfaces.sol";

contract Swap {
    IUniswapV2Router immutable router = IUniswapV2Router(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);

    function swapTokenForToken(
     uint amountIn,
     uint amountOutMin,
     address[] calldata path
    ) external {
        IERC20(path[0]).approve(address(router),amountIn);

        router.swapExactTokensForTokens(amountIn, amountOutMin, path, address(this), block.timestamp);
    }

    function swapEthForToken(
        uint amountIn,
        uint amountOutMin, 
        address[] calldata path
    )external payable {
        router.swapExactETHForTokens{value:amountIn}(amountOutMin, path, address(this),block.timestamp);
    }

    function swapTokenForEth(uint amountIn, 
    uint amountOutMin, 
    address[] calldata path
    ) external {

        IERC20(path[0]).approve(address(router), type(uint).max);

        router.swapExactTokensForETH(amountIn, amountOutMin, path, address(this), block.timestamp);
    }


    receive() external payable {}
}
