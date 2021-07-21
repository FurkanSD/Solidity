pragma solidity 0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

enum SwapKind { GIVEN_IN, GIVEN_OUT }
struct SingleSwap {
        bytes32 poolId;
        SwapKind kind;
        IERC20 assetIn;
        IERC20 assetOut;
        uint256 amount;
        bytes userData;
    }
struct FundManagement {
        address sender;
        bool fromInternalBalance;
        address payable recipient;
        bool toInternalBalance;
    }

interface IVault {
    function swap(
        SingleSwap memory singleSwap,
        FundManagement memory funds,
        uint256 limit,
        uint256 deadline
    ) external payable returns (uint256);
}

contract Swap {

    IVault Vault;

    constructor(address valutAddr) {
        Vault = IVault(valutAddr);
    }

    function swap(
        bytes32 poolId, //pool id is different for each pair
        SwapKind kind, // swap kind
        IERC20 assetIn, // token which you sell
        IERC20 assetOut, // token which you buy
        uint256 amount,  //amount of tokens in
        uint limit
    ) external {

        SingleSwap memory singleSwap = SingleSwap(poolId,kind,assetIn,assetOut,amount,bytes(""));
                
        FundManagement memory funds = FundManagement(address(this),true,payable(address(this)),false);

        IERC20(assetIn).approve(address(Vault),type(uint).max);

        Vault.swap{value:0 ether}(singleSwap,funds,limit,block.timestamp); //you can send eth instead of using weth

    }
}
