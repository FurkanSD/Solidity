//SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";

contract Auction {
    address public admin;

    uint256 public auctionId;

    uint256 public fee;

    bool locked;

    mapping(uint256 => tokens) public auctions;

    mapping(address => uint256) public withdrawableBalance;

    mapping(address => accounts) public whiteListedAccounts;

    event newAccount(address account);

    event newAuction(
        address indexed tokenAddress,
        address indexed tokenOwner,
        uint256 indexed tokenId,
        uint256 auctionId,
        uint256 startTime,
        uint256 endTime
    );

    event deletedAccount(address account, uint256[] deletedAuctions);

    event newBid(
        address indexed token,
        address indexed bidder,
        uint256 indexed tokenId,
        uint256 bid
    );

    event sold(
        address indexed token,
        address indexed buyer,
        uint256 highestBid,
        uint256 indexed tokenId
    );

    struct tokens {
        address tokenAddress;
        address tokenOwner;
        address highestBidder;
        uint256 tokenId;
        uint256 highestBid;
        uint256 startTime;
        uint256 endTime;
    }

    struct accounts {
        uint256[] enableAuctions;
        uint256 totalSaledAuctions;
        uint256 totalEarn;
        bool whiteListed;
    }

    constructor(uint256 _fee) {
        admin = msg.sender;
        fee = _fee;
    }

    function whitelistAccount(address accountAddress) external onlyAdmin {
        whiteListedAccounts[accountAddress].whiteListed = true;

        emit newAccount(accountAddress);
    }

    function deletewhitelistedAccount(address accountAddress)
        external
        onlyAdmin
    {
        deleteAuction(whiteListedAccounts[accountAddress].enableAuctions, true);

        emit deletedAccount(
            accountAddress,
            whiteListedAccounts[accountAddress].enableAuctions
        );

        delete whiteListedAccounts[accountAddress];
    }

    function addNewAuction(
        address tokenAddress,
        uint256 tokenId,
        uint256 startTime,
        uint256 duration
    ) external onlyWhitelisted {
        IERC721Metadata(tokenAddress).transferFrom(
            msg.sender,
            address(this),
            tokenId
        );

        auctions[auctionId] = tokens({
            tokenAddress: tokenAddress,
            tokenOwner: msg.sender,
            highestBidder: address(0),
            tokenId: tokenId,
            highestBid: 0,
            startTime: startTime,
            endTime: startTime + duration
        });

        whiteListedAccounts[msg.sender].enableAuctions.push(auctionId);

        emit newAuction(
            tokenAddress,
            msg.sender,
            tokenId,
            auctionId,
            startTime,
            startTime + duration
        );

        auctionId++;
    }

    function bid(uint256 _auctionId, uint256 _addFromWithdrawbleBalance)
        external
        payable
    {
        require(
            auctions[_auctionId].endTime >= block.timestamp &&
                auctions[_auctionId].startTime <= block.timestamp,
            "auction is not active"
        );

        require(
            _addFromWithdrawbleBalance <= withdrawableBalance[msg.sender],
            "more than withdrawable balance"
        );

        require(
            msg.value + _addFromWithdrawbleBalance >
                auctions[_auctionId].highestBid,
            "should be more than highest bid"
        );

        withdrawableBalance[auctions[_auctionId].highestBidder] = auctions[
            _auctionId
        ].highestBid;

        auctions[_auctionId].highestBidder = msg.sender;

        auctions[_auctionId].highestBid = msg.value;

        emit newBid(
            auctions[_auctionId].tokenAddress,
            msg.sender,
            auctions[_auctionId].tokenId,
            msg.value
        );
    }

    function endAuction(uint256 _auctionId) external {
        tokens memory token = auctions[_auctionId];

        require(
            msg.sender == token.highestBidder || msg.sender == token.tokenOwner,
            "only highestBidder or tokenOwner"
        );

        require(block.timestamp > token.endTime, "auction is not finished");

        uint256[] memory auction = new uint256[](1);

        auction[0] = _auctionId;

        if (token.highestBid > 0) {
            deleteAuction(auction, false);
        } else {
            deleteAuction(auction, true);
        }
    }

    function deleteAuction(uint256[] memory _auctionIds, bool _deletedAccount)
        private
    {
        for (uint256 i = 0; i < _auctionIds.length; i++) {
            tokens memory token = auctions[_auctionIds[i]];

            if (!_deletedAccount) {
                IERC721Metadata(token.tokenAddress).approve(
                    token.highestBidder,
                    token.tokenId
                );

                uint256 feePrice = (token.highestBid / 10000) * fee;

                withdrawableBalance[token.tokenOwner] +=
                    token.highestBid -
                    feePrice;

                withdrawableBalance[admin] += feePrice;

                uint256 count = 0;
                accounts storage account = whiteListedAccounts[
                    token.tokenOwner
                ];

                uint256 auctionsLength = account.enableAuctions.length;

                while (count < auctionsLength) {
                    if (account.enableAuctions[count] == _auctionIds[i]) {
                        account.enableAuctions[count] = account.enableAuctions[
                            auctionsLength - 1
                        ];

                        account.enableAuctions.pop();

                        break;
                    }
                    count++;
                }

                emit sold(
                    token.tokenAddress,
                    token.highestBidder,
                    token.highestBid,
                    token.tokenId
                );
            } else {
                IERC721Metadata(token.tokenAddress).approve(
                    token.tokenOwner,
                    token.tokenId
                );
            }

            delete auctions[_auctionIds[i]];
        }
    }

    function withdraw(uint256 amount) external lock {
        require(
            amount <= withdrawableBalance[msg.sender],
            "more than current balance"
        );

        withdrawableBalance[msg.sender] -= amount;

        (bool success, ) = msg.sender.call{value: amount}("");

        require(success, "transfer failed");
    }

    function changeAdmin(address newAdmin) external onlyAdmin {
        admin = newAdmin;
    }

    function changeFee(uint256 newFee) external onlyAdmin {
        require(newFee <= 500, "high fee rate");

        fee = newFee;
    }

    function URI(uint256 _auctionId) external view returns (string memory) {
        tokens memory token = auctions[_auctionId];

        return IERC721Metadata(token.tokenAddress).tokenURI(token.tokenId);
    }

    modifier lock() {
        require(!locked, "reentry");
        locked = true;
        _;
        locked = false;
    }
    modifier onlyWhitelisted() {
        require(
            whiteListedAccounts[msg.sender].whiteListed,
            "only whitelisted accounts"
        );
        _;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "only Admin");
        _;
    }
}
