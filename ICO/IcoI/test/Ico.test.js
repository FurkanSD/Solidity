const { assert } = require("chai");
const {time} = require("@openzeppelin/test-helpers")
const ICO = artifacts.require("ICO");
const Token = artifacts.require("Token");
const Dai = artifacts.require("Dai");
require("chai").use(require("chai-as-promised")).should();

contract("ICO test",  (accounts) => {
    let ico,token,dai;
    beforeEach(async () => {
        ico = await ICO.deployed();
        token = await Token.deployed();
        dai = await Dai.deployed();
    })

    it("should not buy before ico start", async () => {
        await dai.approve(ico.address,web3.utils.toWei("2","ether"),{from: accounts[3]});

        await ico.buyToken(2,{from:accounts[3]}).should.rejected;
    })

    it("should buy token", async () => {

        const amount = web3.utils.toWei("5","ether")

        await ico.startIco({from:accounts[0]});

        await dai.approve(ico.address,amount,{from: accounts[2]});

        await ico.buyToken(amount,{from:accounts[2]});

        const balance = await token.balanceOf(accounts[2]);

        assert.equal(balance,amount);

        const totalBalance = await ico.totalToken();

        assert.equal(totalBalance,web3.utils.toWei("5","ether"));
    })

    it("should not buy more than total token", async () => {

        const amount = web3.utils.toWei("3","ether")

        await dai.approve(ico.address,amount,{from: accounts[1]});

        await ico.buyToken(amount,{from:accounts[1]});

        await dai.approve(ico.address,amount,{from: accounts[1]});

        await ico.buyToken(amount,{from:accounts[1]}).should.rejected;
    })

    it("should not buy more than max purchase", async () => {

        const amount = web3.utils.toWei("6","ether")

        await dai.approve(ico.address,amount,{from: accounts[2]});

        await ico.buyToken(amount,{from:accounts[2]}).should.rejected;
    })

    it("should not buy less than min purchase", async () => {

        const amount = web3.utils.toWei("1","ether")

        await dai.approve(ico.address,amount,{from: accounts[2]});

        await ico.buyToken(amount,{from:accounts[2]}).should.rejected;
    })

    it("should not start ico if ico already started", async () => {
        await ico.startIco({from:accounts[2]}).should.rejected;
    })
      
    it("should not buy token if ico ended", async () => {
        await time.increase(time.duration.years(2));

        const amount = web3.utils.toWei("2","ether")

        await dai.approve(ico.address,amount,{from: accounts[2]});

        await ico.buyToken(amount,{from:accounts[2]}).should.rejected;
    })
    it("should not withdraw dai from non-owner accouts", async () => {
        await ico.withdrawToken({from:accounts[1]}).should.rejected;
    })
    it("should  withdraw dai", async () => {
        await ico.withdrawToken({from:accounts[0]});
        const balance = await dai.balanceOf(accounts[0]);

        assert.equal(balance,web3.utils.toWei("8","ether"));
    })
    
})
