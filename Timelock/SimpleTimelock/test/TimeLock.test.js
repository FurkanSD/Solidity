const { assert } = require("chai");
const {time} = require("@openzeppelin/test-helpers");
const TimeLock = artifacts.require("TimeLock");
const TestToken = artifacts.require("TestToken");
const AddressZero = "0x0000000000000000000000000000000000000000"

require("chai").use(require("chai-as-promised")).should();

contract("TimeLock",(accounts) => {
    let timeLock,testToken;
    beforeEach(async () => {
        timeLock = await TimeLock.deployed();
        testToken = await TestToken.deployed();
    })
    it("should be possible deposit token", async () => {
        await testToken.approve(timeLock.address,10,{from:accounts[0]});
        await timeLock.depositToken(testToken.address,10,{from:accounts[0]});

        await testToken.approve(timeLock.address,53,{from:accounts[1]});
        await timeLock.depositToken(testToken.address,53,{from:accounts[1]});

        const balance1 = await timeLock.balances(accounts[0],testToken.address);
        const balance2 = await timeLock.balances(accounts[1],testToken.address);

        assert.equal(balance1,10);
        assert.equal(balance2,53)
    })
    it("should be possible deposit ether", async () => {
        await timeLock.depositEther({from:accounts[0],value:web3.utils.toWei("1","ether")});
        await timeLock.depositEther({from:accounts[1],value:web3.utils.toWei("1","ether")});
        
        const balance1 = await timeLock.balances(accounts[0],AddressZero);
        const balance2 = await timeLock.balances(accounts[1],AddressZero);

        assert.equal(balance1,web3.utils.toWei("1","ether"))
        assert.equal(balance2,web3.utils.toWei("1","ether"))
    })

    it("should not withdraw if contract locked", async () => {
        await timeLock.withdraw(AddressZero,10,{from:accounts[0]}).should.rejected;
    })
    
    it("should not withdraw if caller is not depositor", async () => {
        await time.increase(time.duration.years(1));

        await timeLock.withdraw(AddressZero,10,{from:accounts[3]}).should.rejected;
    })
    it("should not withdraw more than balance", async () => {
        await time.increase(time.duration.years(1));

        await timeLock.withdraw(testToken.address,10,{from:accounts[1]});

        await timeLock.withdraw(testToken.address,50,{from:accounts[1]}).should.rejected;
    })
    it("should  withdraw token", async () => {
        await time.increase(time.duration.years(1));

        await timeLock.withdraw(testToken.address,10,{from:accounts[0]});

        const balance = await testToken.balanceOf(accounts[0]);
        
        const contractBalance = await timeLock.balances(accounts[0],testToken.address);

        assert.equal(balance,10);

        assert.equal(contractBalance,0);
    })

    it("should  withdraw ether", async () => {
        await time.increase(time.duration.years(1));

        const balanceBefore = await web3.eth.getBalance(accounts[1]);

        await timeLock.withdraw(AddressZero,web3.utils.toWei("1","ether"),{from:accounts[1]});

        const balanceAfter = await web3.eth.getBalance(accounts[1]);

        assert.equal(balanceAfter > balanceBefore,true);
        
        const contractBalance = await timeLock.balances(accounts[1],AddressZero);

        assert.equal(contractBalance,0);

    })
})
