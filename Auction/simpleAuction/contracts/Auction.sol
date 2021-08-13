pragma solidity 0.8.6;

contract Auction {

    address public owner;
    uint32 public endTime;
    uint public highestBid;
    uint public reward;
    address public highestBidder;
    mapping(address => uint) public depositers;
    bool locked;

    event newBid(
        address bidder,
        uint amount
    );

    constructor(uint32 _duration) payable {
        owner = msg.sender;
        reward = msg.value;
        endTime = uint32(block.timestamp) + _duration;
    }

    function bid() external payable {
        require(msg.value > highestBid,"should be more than highestBid");
        require(block.timestamp <= endTime,"auction ended");

        depositers[highestBidder] += highestBid;

        highestBid = msg.value;

        highestBidder = msg.sender;

        emit newBid(msg.sender,msg.value);
    }

    function withdraw() external lock{
        if(msg.sender == highestBidder&&
         block.timestamp > endTime && reward > 0)
        {
            depositers[highestBidder] = highestBid + reward;
            reward = 0;
        }

        (bool success,)= msg.sender.call{value:depositers[msg.sender]}("");

        require(success,"deposit is not success");

        depositers[msg.sender] = 0;
    }

    modifier lock(){
        require(!locked,"locked");
        locked = true;
        _;
        locked = false;
    }

}
