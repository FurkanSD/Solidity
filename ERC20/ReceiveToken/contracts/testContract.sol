pragma solidity 0.8.0;

contract testContract {

    mapping(address => uint) public receivedToken;


    //stores who sent how many tokens
    function tokenReceive(
        address from,
        uint256 amount) external {
        
        receivedToken[from] += amount;
    }
}
