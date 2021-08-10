pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract TimeLock {
   
    uint public end;

    mapping(address => mapping(address => uint)) public balances;

    constructor(){
        end = block.timestamp + 365 days;
    }

    function depositToken(address token,uint amount) external {
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        balances[msg.sender][token] += amount;
    }

    function depositEther()external payable {
        balances[msg.sender][address(0)] += msg.value;
    }

    function withdraw(address token, uint amount) external {
        require(balances[msg.sender][token] >= amount,"not enough fund");
        require(block.timestamp >= end,"contract locked");
        if(token == address(0)){
            balances[msg.sender][token] -= amount;
            
            payable(msg.sender).transfer(amount);
        } else {
            balances[msg.sender][token] -= amount;

            IERC20(token).transfer(msg.sender, amount);
        }
    }

}
