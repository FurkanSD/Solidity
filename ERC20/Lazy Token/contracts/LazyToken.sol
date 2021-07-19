/*In this ERC20 token i added a few properties
* to make my life easier. Idea is that, sometimes
* I become too lazy for transfer token to someone
* else, entering "address" or "amount" things are 
* necessery but boring. I decided to add a new function
* which called as "sendRequest", with this function 
* the person who you've added to whitelist with "addWhiteList"
* function can send you a request for withdraw money(only
* whitelisted persons can send requests), this requests
* come with "request id" and with this id you can check
* which address send you request,  description and of course
* what is the "amount". To approve this request use "toTransfer"
* function with only id. Add your family, friends or boy/girlfrined
* to whitelist and boom. I think It can be useful for monthly
* subscription too instead of giving high amount of "approve"
* they can send me request every mounth because sometimes monthly
* subscription prices can be wavy and i prefer to see the price
* before payment. So many properties can be added to this token*/
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LazyToken is ERC20 {

    uint256 private _maxSupply = 100000000000 * 10 ** 18; //100000000000 token

    uint256 id;

    address private admin;

    bool paused;

    mapping(address => mapping(uint256 => Request)) private request;
    
    mapping(address => mapping(address => bool)) private whiteList;

    mapping(address => uint256[]) private requestList;

    constructor() ERC20("LazyToken","LZY") {
        admin = msg.sender;
    }

    event _Request(address indexed from, address indexed to, uint256 value);

    struct Request {
        uint256 id;
        uint256 amount;
        address from;
        string describe;
    }

    //this function returns request details
    function showRequest(uint256 _id) external view returns(Request memory) {
        return request[msg.sender][_id];
    }

    //this function returns list of active request
    function showRequestList() external view returns(uint256[] memory) {
        uint len =  requestList[msg.sender].length;
        uint[] memory _requestList = new uint[](len);
        for(uint i = 0; i < len; i++) {
            _requestList[i] = requestList[msg.sender][i];
        }
        return _requestList;
    }

     function pause() external onlyLazy {
        paused = !paused;
    }

    //this function you can whitelist account
    function addWhiteList(address _who) external {
        require(!whiteList[msg.sender][_who],"already whitelisted");
        whiteList[msg.sender][_who] = true;
    } 

    //with this function you can delete whitelisted account
    function deleteWhiteList(address _who) external {
        require(whiteList[msg.sender][_who],"already deleted");
        whiteList[msg.sender][_who] = false;
    }

    //this function send a request to account which whitelisted you
    function sendRequest(address _to, uint256 _amount,string memory _describe) external returns(bool){
        _sendRequest(_to,_amount,_describe);
        return true;
    }

    //this function you can delete request
    function deleteRequest(uint256 _id) external {
        require(request[msg.sender][_id].amount != 0,"no request for this id");
        _deleteRequest(_id);
    }

    function mint(address _to, uint256 _amount) external onlyLazy {
        require(totalSupply() + _amount <=_maxSupply ,"maxSupply exceeded");
        _mint(_to,_amount);
    }

    //this function helps you to transfer tokens with request id
    function idTransfer(uint256 _id) external {
        address to = request[msg.sender][_id].from;
        require( to != address(0),"this id is not valid");
        
        uint256 amount = request[msg.sender][_id].amount;
        _transfer(msg.sender,to,amount);
        
        _deleteRequest(_id);
        deleteFromList(_id);
    }

     // deletes request 
    function _deleteRequest(uint256 _id) internal {
        delete request[msg.sender][_id];
        deleteFromList(_id);
    }
    // deletes request id from requestList
    function deleteFromList(uint256 _id) internal {
        uint256[] storage list = requestList[msg.sender];
        uint256 long = list.length;
        for(uint256 i = 0; i < long;i++) {
            if(list[i] == _id) {
                list[i] = list[long-1];
                list.pop();
                break;
            }
        }
    }

    // adds new request
    function _sendRequest(address _to, uint256 _amount,string memory _describe) internal {
        require(whiteList[_to][msg.sender],"you are not whitelisted");
        
        request[_to][id] = Request({
            id:id,
            from:msg.sender
            ,amount:_amount,
            describe: _describe});
            
        requestList[_to].push(id);
        
        id++;
        
        emit _Request(msg.sender,_to,_amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override whenNotPause { 
        super._beforeTokenTransfer(from,to,amount);
    } 

    modifier onlyLazy() {
        require(msg.sender == admin,"only lazy admin");
        _;
    }

    modifier whenNotPause() {
        require(!paused,"contract paused");
        _;
    }

}
