pragma solidity 0.8.0;

import "./Interfaces.sol";

contract Liquidity {
    IUniswapV2Router constant router = IUniswapV2Router(0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D);
    UniswapV2Factory constant factory = UniswapV2Factory(0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f);

    function addETHLiquidity(
        address token,
        uint amountTokenDesired,
        uint amountIn
    ) external {

        IERC20(token).approve(address(router), amountTokenDesired);

        router.addLiquidityETH{value:amountIn}(token, amountTokenDesired, 0, amountIn, address(this), block.timestamp);
    } 

    function removeETHLiquidity(
        address token,
        address weth
    ) external {

        address LP = getPair(token, weth);
        uint amount = IERC20(LP).balanceOf(address(this));
        
        IERC20(LP).approve(address(router), amount);

        router.removeLiquidityETH(token, amount, 0, 0, address(this), block.timestamp);
    }

    function addTokenLiquidity(
       address tokenA,
       address tokenB,
       uint amountADesired,
       uint amountBDesired,
       uint amountAMin,
       uint amountBMin
    ) external {

        IERC20(tokenA).approve(address(router), amountADesired);
        IERC20(tokenB).approve(address(router), amountBDesired);

        router.addLiquidity(
            tokenA,
            tokenB,
            amountADesired,
            amountBDesired,
            amountAMin,
            amountBMin,
            address(this),
            block.timestamp
        );
    }

    function removeTokenLiquidity(
        address tokenA,
        address tokenB,
        uint amountAMin,
        uint amountBMin
    ) external {

        address LP = getPair(tokenA, tokenB);

        //to see amount of LP token
        uint amount = IERC20(LP).balanceOf(address(this));
        
        IERC20(LP).approve(address(router), amount);

        router.removeLiquidity(tokenA, tokenB, amount, amountAMin, amountBMin, address(this), block.timestamp);
    }

    function getPair(address tokenA, address tokenB) public view returns (address pair) {
        return factory.getPair(tokenA, tokenB);
    }

    receive() external payable {}


}
