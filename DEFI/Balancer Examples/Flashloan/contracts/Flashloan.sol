pragma solidity 0.8.0;

import "./IVault.sol";

contract Flashloan {

    event flashloanBalance(uint amount);
    
    IVault ivault;

    constructor(IVault _ivault) {
        ivault = IVault(_ivault);
    }

    function flashLoan(
        IERC20[] memory tokens, //tokens which you call for flashloan
        uint256[] memory amounts 
    ) external {

        ivault.flashLoan(address(this), tokens, amounts, bytes(""));
    }

    function receiveFlashLoan( //vault contract calls this function for repayment
        IERC20[] memory tokens,
        uint256[] memory amounts,
        uint256[] memory feeAmounts,
        bytes memory userData
    ) external {
        require(msg.sender == address(ivault),"only vault contract"); 
        //do whatever you want with your flashloan tokens

        for(uint i = 0;i<tokens.length;i++){
            uint amount = IERC20(tokens[i]).balanceOf(address(this)); //token balance

            emit flashloanBalance(amount); 

            IERC20(tokens[i]).transfer(address(ivault), amounts[0]+feeAmounts[0]); // repayment
        }
    }

}
