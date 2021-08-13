const { assert } = require("chai");
const {time} = require("@openzeppelin/test-helpers");
require("chai").use(require("chai-as-promised")).should();
const Auction = artifacts.require("Auction");

contract("Auction test",  (accounts) => {

    let auction;
    beforeEach(async () => {
        auction = await Auction.deployed();
    })

    it("deployed successfully", async () => {
        assert.notEqual(auction.address,0x00);
        assert.notEqual(auction.address,"");
        assert.notEqual(auction.address,null);
        assert.notEqual(auction.address,undefined);
    })

    it("should bid", async () => {
        const Event = await auction.bid({from:accounts[1],value:web3.utils.toWei("1","ether")});
        const event = Event.logs[0].args;

        const highestBid = await auction.highestBid();
        const highestBidder = await auction.highestBidder();

        assert.equal(event.bidder,accounts[1]);
        assert.equal(event.amount,web3.utils.toWei("1","ether"))
        assert.equal(highestBid,web3.utils.toWei("1","ether"));
        assert.equal(highestBidder,accounts[1]);
    })

    it("should not bid less than maximum bid", async () => {
        await auction.bid({from: accounts[2],value:web3.utils.toWei("1","gwei")}).should.rejected;
    })

    it("should bid higher", async () => {
        const Event = await auction.bid({from:accounts[3],value:web3.utils.toWei("2","ether")});
        const event = await Event.logs[0].args;
        const highestBid = await auction.highestBid();
        const highestBidder = await auction.highestBidder();

        assert.equal(event.bidder,accounts[3]);
        assert.equal(event.amount,web3.utils.toWei("2","ether"))
        assert.equal(highestBid,web3.utils.toWei("2","ether"));
        assert.equal(highestBidder,accounts[3]);
    })

    it("should withdraw ether from lower bidder account", async() => {
        const ethBalanceBeforeDeposit = await auction.depositers(accounts[1]);
        const balanceBefore = await web3.eth.getBalance(accounts[1]);
        await auction.withdraw({from: accounts[1]});
        const balanceAfter = await web3.eth.getBalance(accounts[1]);
        const ethBalanceAfterDeposit = await auction.depositers(accounts[1]);

        assert.equal(balanceAfter > balanceBefore,true);
        assert.equal(ethBalanceBeforeDeposit,web3.utils.toWei("1","ether"));
        assert.equal(ethBalanceAfterDeposit,0);
    })

    it("should not withdraw before endTime from highestBidder", async () => {
        const ethBalance = await auction.depositers(accounts[3]);
        const ethBalanceBeforeWithdraw = await web3.eth.getBalance(accounts[3]);
        await auction.withdraw({from: accounts[1]});
        const ethBalanceAfterWithdraw = await web3.eth.getBalance(accounts[3]);

        assert.equal(ethBalance,0)
        console.log(`eth balance before withdraw :${ethBalanceBeforeWithdraw}`);
        console.log(`eth balance after withdraw  :${ethBalanceAfterWithdraw}`);
    })

    it("should not bid after endTime", async () => {
        await time.increase(time.duration.days(1));
        await auction.bid({from:accounts[4],value: web3.utils.toWei("3","ether")}).should.rejected;
    })

    it("should withdraw reward", async () => {
        const rewardBefore = await auction.reward();
        const ethBalanceBeforeWithdraw = await web3.eth.getBalance(accounts[3]);
        await auction.withdraw({from: accounts[3]});
        const ethBalanceAfterWithdraw = await web3.eth.getBalance(accounts[3]);
        const rewardAfter = await auction.reward();
        
        assert.equal(rewardBefore,web3.utils.toWei("10","ether"));
        assert.equal(rewardAfter,0);
        
        console.log(`eth balance before withdraw :${ethBalanceBeforeWithdraw}`);
        console.log(`eth balance after withdraw  :${ethBalanceAfterWithdraw}`);
    })
})
