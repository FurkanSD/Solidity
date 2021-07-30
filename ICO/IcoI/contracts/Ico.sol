pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ICO {

    address public owner;
    IERC20 public token;
    IERC20 dai; // dai to payment
    uint public price;
    uint public totalToken; // total token in this contract
    uint public minPurchase;  
    uint public maxPurchase; 
    uint public end;  // endtime
    bool started;

    constructor(
        address _dai,
        address _token,
        uint _price,
        uint _totalToken,
        uint _minPurchase,
        uint _maxPurchase,
        uint _end
    ) {
        require(_token != address(0),"dead address");
        require(_price > 0,"price can not be 0");
        require(_minPurchase < _maxPurchase,"max purchase must be bigger than min purchase");
        token = IERC20(_token);
        dai = IERC20(_dai);
        owner = msg.sender;
        price = _price;
        totalToken = _totalToken;
        minPurchase = _minPurchase;
        maxPurchase = _maxPurchase;
        end = _end;
    }

   
    function buyToken(uint amountDai) external icoStarted icoEnd { 
        
        uint amountToken = (amountDai / price) * 10**18;

        require(amountToken >= minPurchase 
        && amountToken <= maxPurchase,
        "amount must be between minPurchase - maxPurchase");

        require(amountToken < totalToken,"not enough token left");


        dai.transferFrom(msg.sender, address(this), amountDai);

        totalToken -= amountDai;

        token.transfer(msg.sender, amountDai);
    }

    //starts ico
    function startIco() external onlyOwner {
        require(!started,"already started");
        require(token.transferFrom(msg.sender, address(this), totalToken));

        end = block.timestamp + end;

        started = true;
    }

    function withdrawToken() external onlyOwner {
        uint balance = dai.balanceOf(address(this));
        dai.transfer(owner,balance);
    }

    modifier icoEnd() {
        require(block.timestamp <= end,"Ico ended");
        _;
    }
    modifier icoStarted() {
        require(started,"not started");
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner,"only owner");
        _;
    }

}
