pragma solidity 0.8.0;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./IcToken.sol";

contract mintReedem {
    IERC20 ierc20;
    IcToken cTOken;

    constructor(address _ierc,IcToken _cToken) {
        ierc20 = IERC20(_ierc);
        cTOken = IcToken(_cToken);
    }

    function mint(uint mintAmount) external returns (uint) {
        ierc20.approve(address(cTOken), mintAmount);
        return cTOken.mint(mintAmount);
    }
    
    function redeem(uint redeemTokens) external returns(uint) {
        return cTOken.redeem(redeemTokens);
    }

    function balance(address owner) external view returns(uint balance){
        return cTOken.balanceOf(owner);
    }

}
