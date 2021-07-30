pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Ico {

    IERC20 dai;

    address admin;

    mapping(address => bool) whiteListed; 

    mapping (address => Tokens) public tokens; 

    mapping(address => mapping(address => uint)) public userTokenBalance;
    
    mapping(address => mapping(address => uint)) public daiBalance;
    
    struct Tokens {
        address tokenOwner;
        address tokenAddress;
        uint totalAmount;
        uint maxPurchase;
        uint minPurchase;
        uint price;
        uint startTime;
        uint endTime;
    }

    event tokenAdded(
        address tokenOwner,
        address tokenAddress,
        uint totalAmount,
        uint maxPurchase,
        uint minPurchase,
        uint price,
        uint startTime,
        uint endTime);

    constructor(address _dai) {
        dai = IERC20(_dai);
        admin = msg.sender;
    }

    function whiteListAddress(address _tokenOwner) external {
        require(msg.sender == admin);
        whiteListed[_tokenOwner] = true;
    }

    function addToken(
        address _tokenOwner,
        address _tokenAddress,
        uint _totalAmount,
        uint _maxPurchase,
        uint _minPurchase,
        uint _price,
        uint _startTime,
        uint _duration) external isWhiteListed{

        IERC20(_tokenAddress).transferFrom(msg.sender,address(this),_totalAmount);

        tokens[_tokenAddress] = Tokens({
            tokenOwner: _tokenOwner,
            tokenAddress: _tokenAddress,
            totalAmount: _totalAmount,
            maxPurchase: _maxPurchase,
            minPurchase: _minPurchase,
            price: _price,
            startTime: _startTime,
            endTime: _startTime + _duration
        });

        whiteListed[msg.sender] = false;

        emit tokenAdded(
            _tokenOwner,
            _tokenAddress,
            _maxPurchase,
            _minPurchase,
            _totalAmount,
            _price,
            _startTime,
            _startTime + _duration
        );
    }

    function buyToken(
        address token,
        uint amountDai
    ) external 
      isActive(token) {
        uint totalToken = (amountDai / tokens[token].price) * 10**18;

        require(totalToken >= tokens[token].minPurchase &&
                totalToken <= tokens[token].maxPurchase,
                "amount should be between max-minPurchase");

        require(totalToken <= tokens[token].totalAmount,"more than totalBalance");

        dai.transferFrom(msg.sender, address(this), amountDai);

        tokens[token].totalAmount -= totalToken;
        userTokenBalance[msg.sender][token] += totalToken;

        daiBalance[tokens[token].tokenOwner][token] += amountDai;
    }

    function withdrawToken(address token) external isEnded(token){

        IERC20(token).transfer(msg.sender, userTokenBalance[msg.sender][token]);

        delete userTokenBalance[msg.sender][token];
        
    }

    function withdrawDai(address token) external isEnded(token){

        require(tokens[token].tokenOwner == msg.sender,"only token owner");

        dai.transfer(msg.sender, daiBalance[msg.sender][token]);

        daiBalance[msg.sender][token] = 0;
    }
    
    modifier isEnded(address token){
        require(block.timestamp > tokens[token].endTime,"ico is ended");
        _;
    }

    modifier isWhiteListed(){
        require(whiteListed[msg.sender],"only whitelisted accounts");
        _;
    }

    modifier isActive(address token){
        require(block.timestamp >= tokens[token].startTime &&
         block.timestamp <= tokens[token].endTime,"ico is not active");
        _;
    }

}
